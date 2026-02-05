import { motion } from 'framer-motion';
import { content } from '../data/content';
import { MousePointer, ShoppingCart, TrendingUp } from 'lucide-react';

const stepIcons = [MousePointer, ShoppingCart, TrendingUp];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 px-6 bg-zinc-950 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                        Simple Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                        {content.howItWorks.title}
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Connection line (desktop) */}
                    <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {content.howItWorks.steps.map((step, index) => {
                            const Icon = stepIcons[index];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    className="relative text-center group"
                                >
                                    {/* Step number */}
                                    <div className="relative inline-block mb-6">
                                        <div className="w-20 h-20 mx-auto bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-zinc-800 transition-all duration-300 shadow-lg">
                                            <Icon className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
                                            {index + 1}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed max-w-xs mx-auto">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <a
                        href="https://polymarket.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105"
                    >
                        Start Trading Now
                    </a>
                </motion.div>
            </div>
        </section>
    );
}; 
