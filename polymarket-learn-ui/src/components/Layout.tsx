import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { categories, modules } from '../lib/modules';
import { Search, SearchTrigger } from './Search';
import { SkipLink } from './SkipLink';
import { useProgress } from '../hooks/useProgress';

import { Menu, X, BookOpen, ChevronRight, Home, CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

// Category icons for sidebar
const categoryIcons: Record<string, string> = {
    'get-started': '🚀',
    'markets': '📊',
    'trading': '💹',
    'deposits': '💰',
    'FAQ': '❓'
};

export const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories));
    const location = useLocation();
    const { isCompleted, getCompletionPercentage, progress } = useProgress();

    const totalProgress = getCompletionPercentage(modules.length);

    // Open search with Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Auto-expand current category
    useEffect(() => {
        const currentCategory = location.pathname.split('/')[2];
        if (currentCategory) {
            setExpandedCategories(prev => new Set(prev).add(currentCategory));
        }
    }, [location]);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Skip Link for Accessibility */}
            <SkipLink />

            {/* Search Modal */}
            <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                <Link to="/" className="font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" /> Polymarket Learn
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 text-zinc-400 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-zinc-950 border-r border-zinc-900 transform transition-transform duration-300 lg:translate-x-0 lg:static
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-zinc-900">
                        <Link to="/" className="text-xl font-bold flex items-center gap-2 tracking-tight mb-4 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white font-bold">P</span>
                            </div>
                            <span>Learn</span>
                        </Link>

                        {/* Search trigger */}
                        <SearchTrigger onClick={() => setIsSearchOpen(true)} />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {/* Home link */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <div className="h-px bg-zinc-900 my-3" />

                        {categories.map(category => {
                            const isExpanded = expandedCategories.has(category);
                            const categoryModules = modules.filter(m => m.category === category);
                            const isCategoryActive = location.pathname.includes(`/learn/${category}`);

                            return (
                                <div key={category} className="mb-1">
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isCategoryActive
                                                ? 'text-white bg-zinc-900'
                                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{categoryIcons[category] || '📄'}</span>
                                            <span className="capitalize">{category.replace('-', ' ')}</span>
                                        </span>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                    </button>

                                    {isExpanded && (
                                        <ul className="mt-1 ml-4 pl-4 border-l border-zinc-800 space-y-0.5">
                                            {categoryModules.map(m => {
                                                const isActive = location.pathname === `/learn/${m.category}/${m.slug}`;
                                                const lessonCompleted = isCompleted(`${m.category}/${m.slug}`);
                                                return (
                                                    <li key={m.slug}>
                                                        <Link
                                                            to={`/learn/${m.category}/${m.slug}`}
                                                            onClick={() => setIsSidebarOpen(false)}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive
                                                                    ? 'bg-blue-600/10 text-blue-400 font-medium border-l-2 border-blue-500 -ml-[1px]'
                                                                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                                                                }`}
                                                        >
                                                            {lessonCompleted ? (
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                                                            ) : (
                                                                <Circle className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                                                            )}
                                                            <span className="truncate">{m.title}</span>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-zinc-900">
                        {/* Progress bar */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-zinc-500">Your Progress</span>
                                <span className="text-zinc-400 font-medium">{totalProgress}%</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                                    style={{ width: `${totalProgress}%` }}
                                />
                            </div>
                            <div className="text-xs text-zinc-600 mt-1">
                                {progress.completedLessons.length} of {modules.length} lessons completed
                            </div>
                        </div>
                        <a
                            href="https://polymarket.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            Visit Polymarket →
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 lg:ml-0 pt-16 lg:pt-0 min-h-screen outline-none"
            >
                <AnimatePresence mode="wait">
                    <Outlet key={location.pathname} />
                </AnimatePresence>
            </main>
        </div>
    );
};
