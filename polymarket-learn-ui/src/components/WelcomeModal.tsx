import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, BookOpen, TrendingUp, Zap, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'polymarket-welcome-dismissed';

export const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has dismissed the modal before
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!dismissed) {
            // Show modal after a short delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem(STORAGE_KEY, 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header with gradient */}
                            <div className="relative p-8 pb-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                                    <span className="text-3xl font-bold text-white">P</span>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Welcome to Polymarket Learn! 👋
                                </h2>
                                <p className="text-zinc-400">
                                    Your complete guide to prediction markets and trading.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/50">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white mb-1">36 Comprehensive Lessons</h3>
                                        <p className="text-sm text-zinc-500">
                                            From basics to advanced trading strategies
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/50">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white mb-1">Learn at Your Own Pace</h3>
                                        <p className="text-sm text-zinc-500">
                                            Track your progress as you learn
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/50">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Zap className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white mb-1">Search Everything</h3>
                                        <p className="text-sm text-zinc-500">
                                            Press ⌘K to quickly find any topic
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="p-6 pt-0 flex gap-3">
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-medium"
                                >
                                    I'll explore on my own
                                </button>
                                <Link
                                    to="/learn/get-started/what-is-polymarket"
                                    onClick={handleDismiss}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                                >
                                    Start Learning
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
