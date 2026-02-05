import { useState, useRef, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { content } from '../data/content';
import { Plus, Minus } from 'lucide-react';

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const baseId = useId();

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Keyboard navigation handler following ARIA accordion pattern
    const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
        const faqCount = content.faq.length;
        let newIndex = index;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                newIndex = (index + 1) % faqCount;
                break;
            case 'ArrowUp':
                e.preventDefault();
                newIndex = (index - 1 + faqCount) % faqCount;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = faqCount - 1;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                toggleFAQ(index);
                return;
            default:
                return;
        }

        buttonsRef.current[newIndex]?.focus();
    }, [openIndex]);

    return (
        <section id="faq" className="py-24 px-6 bg-zinc-950 text-white border-t border-zinc-900">
            <div className="max-w-3xl mx-auto">
                <h2
                    id={`${baseId}-heading`}
                    className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500"
                >
                    Frequently Asked Questions
                </h2>

                <div
                    className="space-y-4"
                    role="region"
                    aria-labelledby={`${baseId}-heading`}
                >
                    {content.faq.map((item, index) => {
                        const headerId = `${baseId}-header-${index}`;
                        const panelId = `${baseId}-panel-${index}`;
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/30"
                            >
                                <h3>
                                    <button
                                        ref={el => { buttonsRef.current[index] = el; }}
                                        id={headerId}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => toggleFAQ(index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-t-2xl"
                                    >
                                        <span className="text-lg font-medium">{item.question}</span>
                                        {isOpen ? (
                                            <Minus className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
                                        ) : (
                                            <Plus className="w-5 h-5 text-zinc-500 flex-shrink-0" aria-hidden="true" />
                                        )}
                                    </button>
                                </h3>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div
                                                id={panelId}
                                                role="region"
                                                aria-labelledby={headerId}
                                                className="p-6 pt-0 text-zinc-400 leading-relaxed"
                                            >
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
