/**
 * LessonSkeleton - Loading placeholder for lesson content
 *
 * Displays animated skeleton placeholders that match the approximate
 * layout of actual lesson content, improving perceived performance.
 */

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
    <div className={`bg-zinc-800/50 rounded animate-pulse ${className}`} />
);

export const LessonSkeleton = () => {
    return (
        <div className="max-w-3xl mx-auto px-6 py-8 lg:py-12">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-2 mb-6">
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="h-4 w-4 rounded-full" />
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-4 w-4 rounded-full" />
                <SkeletonBlock className="h-4 w-32" />
            </div>

            {/* Header skeleton */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <SkeletonBlock className="h-6 w-24" />
                    <SkeletonBlock className="h-4 w-20" />
                </div>
                <SkeletonBlock className="h-12 w-3/4 mb-2" />
                <SkeletonBlock className="h-12 w-1/2" />

                {/* Progress bar skeleton */}
                <div className="mt-6 flex items-center gap-3">
                    <SkeletonBlock className="flex-1 h-1" />
                    <SkeletonBlock className="h-4 w-16" />
                </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-6">
                {/* Paragraph 1 */}
                <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-full" />
                    <SkeletonBlock className="h-5 w-full" />
                    <SkeletonBlock className="h-5 w-4/5" />
                </div>

                {/* Heading */}
                <SkeletonBlock className="h-8 w-64 mt-8" />

                {/* Paragraph 2 */}
                <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-full" />
                    <SkeletonBlock className="h-5 w-full" />
                    <SkeletonBlock className="h-5 w-3/4" />
                </div>

                {/* List skeleton */}
                <div className="space-y-3 pl-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                            <SkeletonBlock className="h-2 w-2 rounded-full flex-shrink-0" />
                            <SkeletonBlock className="h-5 w-full max-w-md" />
                        </div>
                    ))}
                </div>

                {/* Code block skeleton */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                    <SkeletonBlock className="h-4 w-48" />
                    <SkeletonBlock className="h-4 w-64" />
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="h-4 w-56" />
                </div>

                {/* Another heading */}
                <SkeletonBlock className="h-7 w-48 mt-8" />

                {/* More paragraphs */}
                <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-full" />
                    <SkeletonBlock className="h-5 w-full" />
                    <SkeletonBlock className="h-5 w-2/3" />
                </div>

                {/* Callout skeleton */}
                <div className="flex gap-3 p-4 bg-blue-900/10 border-l-4 border-blue-500/50 rounded-r-lg">
                    <SkeletonBlock className="h-6 w-6 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <SkeletonBlock className="h-5 w-full" />
                        <SkeletonBlock className="h-5 w-3/4" />
                    </div>
                </div>
            </div>

            {/* Completion button skeleton */}
            <div className="mt-12 flex justify-center">
                <SkeletonBlock className="h-12 w-48 rounded-xl" />
            </div>

            {/* Navigation skeleton */}
            <div className="mt-16 pt-8 border-t border-zinc-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SkeletonBlock className="h-24 rounded-xl" />
                    <SkeletonBlock className="h-24 rounded-xl" />
                </div>
            </div>
        </div>
    );
};
