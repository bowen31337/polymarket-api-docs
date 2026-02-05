import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules } from '../lib/modules';
import { BookOpen, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useDocumentTitle, useMetaDescription } from '../hooks/useDocumentTitle';

// Check for reduced motion preference
const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Category metadata
const categoryMeta: Record<string, { title: string; description: string; icon: string; color: string }> = {
    'get-started': {
        title: 'Get Started',
        description: 'New to Polymarket? Start here to learn the basics of prediction markets and how to make your first trade.',
        icon: '🚀',
        color: 'blue'
    },
    'markets': {
        title: 'Markets',
        description: 'Understand how prediction markets work, how they\'re created, resolved, and what makes them accurate.',
        icon: '📊',
        color: 'purple'
    },
    'trading': {
        title: 'Trading',
        description: 'Master advanced trading concepts including limit orders, market orders, fees, and reward programs.',
        icon: '💹',
        color: 'green'
    },
    'deposits': {
        title: 'Deposits & Withdrawals',
        description: 'Learn how to deposit funds, withdraw winnings, and manage your Polymarket wallet.',
        icon: '💰',
        color: 'yellow'
    },
    'FAQ': {
        title: 'Frequently Asked Questions',
        description: 'Common questions about Polymarket, prediction markets, and how to get support.',
        icon: '❓',
        color: 'orange'
    }
};

// Estimate reading time (rough: 200 words per minute)
const estimateReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
};

export const CategoryOverview = () => {
    const { category } = useParams();
    const { isCompleted } = useProgress();
    const categoryModules = modules.filter(m => m.category === category);
    const meta = categoryMeta[category || ''] || {
        title: category?.replace('-', ' ') || 'Category',
        description: 'Explore lessons in this category.',
        icon: '📚',
        color: 'blue'
    };

    const completedCount = categoryModules.filter(m => isCompleted(`${m.category}/${m.slug}`)).length;
    const categoryProgress = categoryModules.length > 0
        ? Math.round((completedCount / categoryModules.length) * 100)
        : 0;

    const colorClasses: Record<string, string> = {
        blue: 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400',
        purple: 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400',
        green: 'from-green-500/20 to-transparent border-green-500/30 text-green-400',
        yellow: 'from-yellow-500/20 to-transparent border-yellow-500/30 text-yellow-400',
        orange: 'from-orange-500/20 to-transparent border-orange-500/30 text-orange-400'
    };

    const gradientClass = colorClasses[meta.color] || colorClasses.blue;

    // Update document title and meta description
    useDocumentTitle(meta.title);
    useMetaDescription(meta.description);

    // Page transition variants
    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    const pageTransition = {
        duration: prefersReducedMotion() ? 0 : 0.25,
        ease: "easeOut" as const
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto px-6 py-12"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            key={category}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
            >
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{meta.icon}</span>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                            {meta.title}
                        </h1>
                    </div>
                </div>
                <p className="text-xl text-zinc-400 max-w-2xl">
                    {meta.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {categoryModules.length} lessons
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        ~{categoryModules.reduce((acc, m) => acc + estimateReadingTime(m.content), 0)} min total
                    </span>
                    {completedCount > 0 && (
                        <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            {completedCount}/{categoryModules.length} completed
                        </span>
                    )}
                </div>

                {/* Progress bar */}
                {categoryModules.length > 0 && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                            <span>Progress</span>
                            <span>{categoryProgress}%</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${categoryProgress}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Lesson Cards */}
            <div className="space-y-4">
                {categoryModules.map((lesson, index) => {
                    const readTime = estimateReadingTime(lesson.content);
                    const lessonCompleted = isCompleted(`${lesson.category}/${lesson.slug}`);
                    return (
                        <motion.div
                            key={lesson.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                        >
                            <Link
                                to={`/learn/${lesson.category}/${lesson.slug}`}
                                className={`block p-6 rounded-2xl bg-gradient-to-br ${gradientClass} border hover:scale-[1.02] transition-all duration-200 group ${
                                    lessonCompleted ? 'ring-1 ring-green-500/30' : ''
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            {lessonCompleted ? (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                                                    <CheckCircle2 className="w-3 h-3" /> Completed
                                                </span>
                                            ) : index === 0 && completedCount === 0 ? (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                                                    <Sparkles className="w-3 h-3" /> Start Here
                                                </span>
                                            ) : null}
                                        </div>
                                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                                            {lesson.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm line-clamp-2">
                                            {lesson.content.split('\n').find(line => line && !line.startsWith('#'))?.slice(0, 150) || 'Learn more about this topic...'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 ml-4">
                                        {lessonCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                        )}
                                        <span className="text-xs text-zinc-500">{readTime} min read</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Start CTA */}
            {categoryModules.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/20 text-center"
                >
                    <p className="text-zinc-400 mb-4">Ready to start learning?</p>
                    <Link
                        to={`/learn/${categoryModules[0].category}/${categoryModules[0].slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-colors"
                    >
                        Start with {categoryModules[0].title}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
};
