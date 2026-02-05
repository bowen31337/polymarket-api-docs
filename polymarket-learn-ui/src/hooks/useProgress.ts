import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'polymarket-learn-progress';

interface Progress {
    completedLessons: string[];
    lastVisited: string | null;
    visitCount: number;
}

const defaultProgress: Progress = {
    completedLessons: [],
    lastVisited: null,
    visitCount: 0
};

export const useProgress = () => {
    const [progress, setProgress] = useState<Progress>(defaultProgress);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setProgress({
                    ...defaultProgress,
                    ...parsed,
                    visitCount: (parsed.visitCount || 0) + 1
                });
            } else {
                setProgress({ ...defaultProgress, visitCount: 1 });
            }
        } catch {
            setProgress({ ...defaultProgress, visitCount: 1 });
        }
    }, []);

    // Save to localStorage whenever progress changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch {
            // localStorage might be full or disabled
        }
    }, [progress]);

    const markAsCompleted = useCallback((lessonPath: string) => {
        setProgress(prev => {
            if (prev.completedLessons.includes(lessonPath)) {
                return prev;
            }
            return {
                ...prev,
                completedLessons: [...prev.completedLessons, lessonPath]
            };
        });
    }, []);

    const markAsVisited = useCallback((lessonPath: string) => {
        setProgress(prev => ({
            ...prev,
            lastVisited: lessonPath
        }));
    }, []);

    const isCompleted = useCallback((lessonPath: string) => {
        return progress.completedLessons.includes(lessonPath);
    }, [progress.completedLessons]);

    const getCompletionPercentage = useCallback((totalLessons: number) => {
        if (totalLessons === 0) return 0;
        return Math.round((progress.completedLessons.length / totalLessons) * 100);
    }, [progress.completedLessons.length]);

    const resetProgress = useCallback(() => {
        setProgress({ ...defaultProgress, visitCount: progress.visitCount });
    }, [progress.visitCount]);

    const isFirstVisit = progress.visitCount === 1;

    return {
        progress,
        markAsCompleted,
        markAsVisited,
        isCompleted,
        getCompletionPercentage,
        resetProgress,
        isFirstVisit
    };
};
