import { useEffect, useRef, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getModule, modules } from '../lib/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Clock, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Note, Tip, Warning, VideoPlayer, Steps, Step } from './MarkdownComponents';
import { TableOfContents } from './TableOfContents';
import { useProgress } from '../hooks/useProgress';
import { useDocumentTitle, useMetaDescription } from '../hooks/useDocumentTitle';
import { useAriaLive } from './AriaLive';

gsap.registerPlugin(ScrollTrigger);

// Estimate reading time
const estimateReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
};

// Check for reduced motion preference
const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const LessonView = () => {
    const { category, slug } = useParams();
    const module = getModule(category || '', slug || '');
    const containerRef = useRef<HTMLDivElement>(null);
    const { markAsCompleted, markAsVisited, isCompleted } = useProgress();
    const { announce } = useAriaLive();

    const currentIndex = modules.findIndex(m => m.category === category && m.slug === slug);
    const prevModule = modules[currentIndex - 1];
    const nextModule = modules[currentIndex + 1];

    const lessonPath = `${category}/${slug}`;
    const lessonIsCompleted = isCompleted(lessonPath);

    const readingTime = useMemo(() => module ? estimateReadingTime(module.content) : 0, [module]);

    // Update document title and meta description
    useDocumentTitle(module?.title);
    useMetaDescription(
        module
            ? `Learn about ${module.title.toLowerCase()} on Polymarket. ${module.content.slice(0, 100).replace(/[#\n]/g, ' ').trim()}...`
            : 'Learn how to use Polymarket prediction markets'
    );

    // Progress within category
    const categoryModules = useMemo(() =>
        modules.filter(m => m.category === category),
        [category]
    );
    const categoryIndex = categoryModules.findIndex(m => m.slug === slug);
    const progressPercent = categoryModules.length > 1
        ? Math.round(((categoryIndex + 1) / categoryModules.length) * 100)
        : 100;

    // Setup scroll-triggered animations for article content
    const setupScrollAnimations = useCallback(() => {
        if (!containerRef.current || prefersReducedMotion()) return;

        const article = containerRef.current.querySelector('article');
        if (!article) return;

        // Kill existing ScrollTriggers for this container to prevent duplicates
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars.trigger && article.contains(trigger.vars.trigger as Element)) {
                trigger.kill();
            }
        });

        // Animate headings
        const headings = article.querySelectorAll('h2, h3, h4');
        headings.forEach((heading) => {
            gsap.fromTo(heading,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // Animate paragraphs with stagger effect
        const paragraphs = article.querySelectorAll('p');
        paragraphs.forEach((p) => {
            gsap.fromTo(p,
                { opacity: 0, y: 15 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: p,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // Animate lists
        const lists = article.querySelectorAll('ul, ol');
        lists.forEach((list) => {
            const items = list.querySelectorAll('li');
            items.forEach((item, i) => {
                gsap.fromTo(item,
                    { opacity: 0, x: -10 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.4,
                        delay: i * 0.05,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });
        });

        // Animate code blocks
        const codeBlocks = article.querySelectorAll('pre');
        codeBlocks.forEach((block) => {
            gsap.fromTo(block,
                { opacity: 0, scale: 0.98 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: block,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // Animate blockquotes and callouts
        const callouts = article.querySelectorAll('blockquote, [class*="bg-blue-900"], [class*="bg-green-900"], [class*="bg-yellow-900"]');
        callouts.forEach((callout) => {
            gsap.fromTo(callout,
                { opacity: 0, x: 20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: callout,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // Refresh to account for all new triggers
        ScrollTrigger.refresh();
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        // Track this lesson as visited
        if (category && slug) {
            markAsVisited(lessonPath);
        }

        // Reset scroll
        window.scrollTo(0, 0);

        // Simple entrance animation (respects reduced motion)
        if (!prefersReducedMotion()) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        // Setup scroll animations after a brief delay to ensure content is rendered
        const timer = setTimeout(() => {
            setupScrollAnimations();
        }, 100);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            // Kill all ScrollTriggers when unmounting
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };

    }, [category, slug, markAsVisited, lessonPath, setupScrollAnimations]);

    if (!module) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h2 className="text-2xl font-bold text-zinc-300 mb-2">Lesson not found</h2>
                    <p className="text-zinc-500 mb-6">The lesson you're looking for doesn't exist.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

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
            className="relative"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            key={`${category}-${slug}`}
        >
            {/* Table of Contents (desktop only) */}
            <TableOfContents content={module.content} />

            <div ref={containerRef} className="max-w-3xl mx-auto px-6 py-8 lg:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link
                        to={`/lessons/${module.category}`}
                        className="hover:text-white transition-colors capitalize"
                    >
                        {module.category.replace('-', ' ')}
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-zinc-400 truncate max-w-[200px]">{module.title}</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded uppercase tracking-wider">
                            {module.category.replace('-', ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {readingTime} min read
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 leading-tight">
                        {module.title}
                    </h1>

                    {/* Progress bar */}
                    <div className="mt-6 flex items-center gap-3">
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className="text-xs text-zinc-500">
                            {categoryIndex + 1} of {categoryModules.length}
                        </span>
                    </div>
                </div>

                {/* Article content */}
                <article className="prose prose-invert prose-lg max-w-none
                    prose-headings:text-zinc-100 prose-headings:scroll-mt-24
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:font-bold
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-zinc-300 prose-p:leading-relaxed
                    prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white
                    prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-300 prose-code:text-sm
                    prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
                    prose-ul:text-zinc-300 prose-ol:text-zinc-300
                    prose-li:marker:text-zinc-600
                    prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:py-1 prose-blockquote:not-italic
                    prose-img:rounded-xl prose-img:border prose-img:border-zinc-800
                ">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            note: Note,
                            tip: Tip,
                            warning: Warning,
                            videoplayer: VideoPlayer,
                            steps: Steps,
                            "steps.step": Step,
                            step: Step,
                            // Add IDs to headings for TOC navigation
                            h2: ({ children, ...props }: { children: React.ReactNode }) => {
                                const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
                                return <h2 id={id} {...props}>{children}</h2>;
                            },
                            h3: ({ children, ...props }: { children: React.ReactNode }) => {
                                const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
                                return <h3 id={id} {...props}>{children}</h3>;
                            },
                            h4: ({ children, ...props }: { children: React.ReactNode }) => {
                                const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
                                return <h4 id={id} {...props}>{children}</h4>;
                            },
                            iframe: (props: any) => {
                                const { node, ...rest } = props;
                                return (
                                    <div className="aspect-video w-full my-8 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                                        <iframe {...rest} className="w-full h-full" />
                                    </div>
                                );
                            }
                        } as any}
                    >
                        {module.content}
                    </ReactMarkdown>
                </article>

                {/* Completion button */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => {
                            markAsCompleted(lessonPath);
                            announce(`${module.title} marked as complete`);
                        }}
                        disabled={lessonIsCompleted}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${lessonIsCompleted
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105'
                            }`}
                    >
                        {lessonIsCompleted ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Lesson Completed
                            </>
                        ) : (
                            <>
                                <Circle className="w-5 h-5" />
                                Mark as Complete
                            </>
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <div className="mt-16 pt-8 border-t border-zinc-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {prevModule ? (
                            <Link
                                to={`/lessons/${prevModule.category}/${prevModule.slug}`}
                                className="group p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                            >
                                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                                    <ArrowLeft className="w-3 h-3" /> Previous
                                </div>
                                <div className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                                    {prevModule.title}
                                </div>
                            </Link>
                        ) : <div />}

                        {nextModule ? (
                            <Link
                                to={`/lessons/${nextModule.category}/${nextModule.slug}`}
                                className="group p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all md:text-right"
                            >
                                <div className="flex items-center justify-end gap-2 text-xs text-zinc-500 mb-2">
                                    Next <ArrowRight className="w-3 h-3" />
                                </div>
                                <div className="font-medium text-zinc-300 group-hover:text-blue-400 transition-colors">
                                    {nextModule.title}
                                </div>
                            </Link>
                        ) : (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 md:col-span-2 text-center">
                                <div className="text-2xl mb-2">🎉</div>
                                <div className="font-medium text-white mb-1">Congratulations!</div>
                                <p className="text-sm text-zinc-400">
                                    You've completed all lessons in the {category?.replace('-', ' ')} category.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
