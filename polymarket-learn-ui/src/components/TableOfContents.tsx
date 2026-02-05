import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Parse headings from markdown content
        const headingRegex = /^(#{2,4})\s+(.+)$/gm;
        const items: TOCItem[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            items.push({ id, text, level });
        }

        setHeadings(items);
    }, [content]);

    useEffect(() => {
        // Observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 2) return null;

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden xl:block fixed right-8 top-32 w-64"
        >
            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400 mb-4">
                    <List className="w-4 h-4" />
                    On this page
                </div>
                <nav className="space-y-1">
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={`
                                block w-full text-left text-sm py-1 transition-colors
                                ${heading.level === 2 ? 'pl-0' : heading.level === 3 ? 'pl-3' : 'pl-6'}
                                ${activeId === heading.id
                                    ? 'text-blue-400 font-medium'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }
                            `}
                        >
                            {heading.text}
                        </button>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};
