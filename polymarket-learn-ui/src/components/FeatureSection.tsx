import { motion } from 'framer-motion';
import { content } from '../data/content';
import { Scale, Users, CircleDollarSign, ArrowRight } from 'lucide-react';

const icons = {
    Scale: Scale,
    Users: Users,
    CircleDollarSign: CircleDollarSign
};

export const FeatureSection = () => {
    return (
        <section id="intro" className="py-24 px-6 bg-black text-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                        {content.intro.title}
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        {content.intro.description}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {content.intro.features.map((feature, index) => {
                        const Icon = icons[feature.icon as keyof typeof icons] || ArrowRight;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                    <Icon className="w-6 h-6 text-zinc-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
