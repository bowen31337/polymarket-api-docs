import { useEffect } from 'react';

const BASE_TITLE = 'Polymarket Learn';
const SEPARATOR = ' | ';

/**
 * Hook to update the document title
 *
 * @param title - The page-specific title (or empty string for just base title)
 * @param options - Options for title format
 */
export const useDocumentTitle = (
    title?: string,
    options?: { appendBase?: boolean }
) => {
    const { appendBase = true } = options || {};

    useEffect(() => {
        const fullTitle = title
            ? appendBase
                ? `${title}${SEPARATOR}${BASE_TITLE}`
                : title
            : BASE_TITLE;

        document.title = fullTitle;

        // Cleanup: restore base title when component unmounts
        return () => {
            document.title = BASE_TITLE;
        };
    }, [title, appendBase]);
};

/**
 * Hook to update meta description
 */
export const useMetaDescription = (description: string) => {
    useEffect(() => {
        let metaTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'description';
            document.head.appendChild(metaTag);
        }

        const originalDescription = metaTag.content;
        metaTag.content = description;

        return () => {
            metaTag!.content = originalDescription;
        };
    }, [description]);
};
