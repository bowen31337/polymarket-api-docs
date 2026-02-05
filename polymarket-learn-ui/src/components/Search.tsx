import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, FileText, ArrowRight } from 'lucide-react';
import { modules } from '../lib/modules';
import { useAriaLive } from './AriaLive';

interface SearchResult {
    category: string;
    slug: string;
    title: string;
    snippet: string;
    matchScore: number;
}

interface SearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Search = ({ isOpen, onClose }: SearchProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const navigate = useNavigate();
    const { announce } = useAriaLive();

    // Store the trigger element and focus input when opened
    useEffect(() => {
        if (isOpen) {
            // Store the currently focused element as trigger
            triggerRef.current = document.activeElement as HTMLElement;
            // Focus the input after a brief delay to ensure modal is rendered
            setTimeout(() => inputRef.current?.focus(), 10);
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        } else {
            // Return focus to trigger when closing
            if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
                triggerRef.current.focus();
            }
        }
    }, [isOpen]);

    // Focus trap - cycle through focusable elements within modal
    const handleFocusTrap = useCallback((e: KeyboardEvent) => {
        if (!isOpen || e.key !== 'Tab' || !modalRef.current) return;

        // Get all focusable elements in the modal
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'input, button, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift+Tab on first element -> go to last
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        // Tab on last element -> go to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        window.addEventListener('keydown', handleFocusTrap);
        return () => window.removeEventListener('keydown', handleFocusTrap);
    }, [handleFocusTrap]);

    // Search logic
    const performSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();
        const searchResults: SearchResult[] = modules
            .map(module => {
                const titleMatch = module.title.toLowerCase().includes(lowerQuery);
                const contentMatch = module.content.toLowerCase().includes(lowerQuery);

                if (!titleMatch && !contentMatch) return null;

                // Find snippet around the match
                let snippet = '';
                if (contentMatch) {
                    const index = module.content.toLowerCase().indexOf(lowerQuery);
                    const start = Math.max(0, index - 50);
                    const end = Math.min(module.content.length, index + 100);
                    snippet = (start > 0 ? '...' : '') +
                        module.content.slice(start, end).replace(/\n/g, ' ').trim() +
                        (end < module.content.length ? '...' : '');
                } else {
                    // Get first line of content
                    snippet = module.content.split('\n').find(line => line && !line.startsWith('#'))?.slice(0, 100) || '';
                }

                return {
                    category: module.category,
                    slug: module.slug,
                    title: module.title,
                    snippet,
                    matchScore: titleMatch ? 2 : 1
                };
            })
            .filter((r): r is SearchResult => r !== null)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 8);

        setResults(searchResults);
        setSelectedIndex(0);

        // Announce results count to screen readers
        if (searchQuery.trim()) {
            const count = searchResults.length;
            if (count === 0) {
                announce(`No results found for ${searchQuery}`);
            } else {
                announce(`${count} ${count === 1 ? 'result' : 'results'} found`);
            }
        }
    }, [announce]);

    useEffect(() => {
        const debounce = setTimeout(() => performSearch(query), 150);
        return () => clearTimeout(debounce);
    }, [query, performSearch]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(i => Math.min(i + 1, results.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(i => Math.max(i - 1, 0));
                    break;
                case 'Enter':
                    if (results[selectedIndex]) {
                        navigate(`/lessons/${results[selectedIndex].category}/${results[selectedIndex].slug}`);
                        onClose();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, navigate, onClose]);

    // Global shortcut to open search
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (!isOpen) {
                    // This would need to be handled by parent
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Search Modal */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search lessons"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
                                <SearchIcon className="w-5 h-5 text-zinc-500" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search lessons..."
                                    className="flex-1 bg-transparent text-lg text-white placeholder-zinc-500 outline-none"
                                />
                                <button
                                    ref={closeButtonRef}
                                    onClick={onClose}
                                    className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                                    aria-label="Close search"
                                >
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            {/* Results */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {results.length > 0 ? (
                                    <div className="p-2">
                                        {results.map((result, index) => (
                                            <button
                                                key={`${result.category}-${result.slug}`}
                                                onClick={() => {
                                                    navigate(`/lessons/${result.category}/${result.slug}`);
                                                    onClose();
                                                }}
                                                className={`w-full text-left p-3 rounded-xl transition-colors flex items-start gap-3 ${index === selectedIndex
                                                    ? 'bg-blue-600/20 border border-blue-500/30'
                                                    : 'hover:bg-zinc-800'
                                                    }`}
                                            >
                                                <FileText className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-white">{result.title}</span>
                                                        <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">
                                                            {result.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-zinc-500 truncate mt-1">
                                                        {result.snippet}
                                                    </p>
                                                </div>
                                                <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-opacity ${index === selectedIndex ? 'text-blue-400 opacity-100' : 'opacity-0'
                                                    }`} />
                                            </button>
                                        ))}
                                    </div>
                                ) : query ? (
                                    <div className="p-8 text-center text-zinc-500">
                                        No results found for "{query}"
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-zinc-500">
                                        <p className="mb-2">Search for lessons</p>
                                        <p className="text-xs">Type to search through all learning content</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-600">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">↑↓</kbd>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">↵</kbd>
                                        Select
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">esc</kbd>
                                        Close
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Search trigger button for layout
export const SearchTrigger = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors w-full"
    >
        <SearchIcon className="w-4 h-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline px-1.5 py-0.5 bg-zinc-800 rounded text-xs">⌘K</kbd>
    </button>
);
