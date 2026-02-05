/**
 * SkipLink - Accessibility component for keyboard navigation
 *
 * Provides a skip link that appears on focus and allows users to bypass
 * navigation and jump directly to main content. This is a WCAG 2.1 AA requirement.
 */

interface SkipLinkProps {
    targetId?: string;
    label?: string;
}

export const SkipLink = ({
    targetId = 'main-content',
    label = 'Skip to main content'
}: SkipLinkProps) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href={`#${targetId}`}
            onClick={handleClick}
            className="
                sr-only focus:not-sr-only
                focus:fixed focus:top-4 focus:left-4 focus:z-[100]
                focus:px-4 focus:py-2 focus:rounded-lg
                focus:bg-blue-600 focus:text-white
                focus:font-medium focus:text-sm
                focus:shadow-lg focus:shadow-blue-500/30
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black
                transition-all
            "
        >
            {label}
        </a>
    );
};
