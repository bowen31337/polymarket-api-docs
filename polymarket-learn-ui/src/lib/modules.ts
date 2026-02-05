export interface Module {
    path: string;
    category: string;
    slug: string;
    title: string;
    content: string;
}

// Use Vite's import.meta.glob to load all markdown files as raw text
// Path goes from src/lib/ -> up to src/ -> up to polymarket-learn-ui/ -> up to polymarket_api/ -> docs/
const modulesGlob = import.meta.glob('../../../docs/polymarket-learn/**/*.md', { query: '?raw', import: 'default', eager: true });

export const modules: Module[] = Object.entries(modulesGlob).map(([path, content]) => {
    // path is like "/docs/polymarket-learn/get-started/what-is-polymarket.md"
    const parts = path.split('/');
    const filename = parts.pop() || '';
    const category = parts.pop() || 'general';
    const slug = filename.replace('.md', '');

    // Extract title from first H1 or filename
    const titleMatch = (content as string).match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return {
        path,
        category,
        slug,
        title,
        content: content as string
    };
});

export const categories = Array.from(new Set(modules.map(m => m.category))).sort((a, b) => {
    // Custom sort order
    const order = ['get-started', 'markets', 'trading', 'deposits', 'FAQ'];
    return order.indexOf(a) - order.indexOf(b);
});

export const getModule = (category: string, slug: string) => {
    return modules.find(m => m.category === category && m.slug === slug);
};
