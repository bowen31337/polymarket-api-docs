import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';

interface AriaLiveContextType {
    announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AriaLiveContext = createContext<AriaLiveContextType | null>(null);

/**
 * Hook to access the aria-live announcement function
 */
export const useAriaLive = () => {
    const context = useContext(AriaLiveContext);
    if (!context) {
        throw new Error('useAriaLive must be used within AriaLiveProvider');
    }
    return context;
};

/**
 * Provider component that creates aria-live regions for screen reader announcements
 */
export const AriaLiveProvider = ({ children }: { children: ReactNode }) => {
    const [politeMessage, setPoliteMessage] = useState('');
    const [assertiveMessage, setAssertiveMessage] = useState('');

    const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        if (priority === 'assertive') {
            setAssertiveMessage(message);
        } else {
            setPoliteMessage(message);
        }

        // Clear the message after a delay to allow repeated announcements
        setTimeout(() => {
            if (priority === 'assertive') {
                setAssertiveMessage('');
            } else {
                setPoliteMessage('');
            }
        }, 1000);
    }, []);

    return (
        <AriaLiveContext.Provider value={{ announce }}>
            {children}
            {/* Polite region - for non-critical updates */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {politeMessage}
            </div>
            {/* Assertive region - for important updates */}
            <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
            >
                {assertiveMessage}
            </div>
        </AriaLiveContext.Provider>
    );
};
