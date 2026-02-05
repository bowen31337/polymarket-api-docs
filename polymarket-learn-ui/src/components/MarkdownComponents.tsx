import type { ReactNode } from 'react';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const Note = ({ children }: { children: ReactNode }) => (
    <div className="my-6 p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg flex gap-3 text-blue-200">
        <Info className="w-6 h-6 flex-shrink-0 mt-1" />
        <div className="prose prose-invert prose-blue max-w-none">{children}</div>
    </div>
);

export const Tip = ({ children }: { children: ReactNode }) => (
    <div className="my-6 p-4 bg-green-900/20 border-l-4 border-green-500 rounded-r-lg flex gap-3 text-green-200">
        <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
        <div className="prose prose-invert prose-green max-w-none">{children}</div>
    </div>
);

export const Warning = ({ children }: { children: ReactNode }) => (
    <div className="my-6 p-4 bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg flex gap-3 text-yellow-200">
        <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
        <div className="prose prose-invert prose-yellow max-w-none">{children}</div>
    </div>
);

export const VideoPlayer = ({ src }: { src: string }) => (
    <div className="my-8 aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 flex items-center justify-center group relative">
        <iframe
            src={src}
            className="w-full h-full"
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    </div>
);

export const Steps = ({ children }: { children: ReactNode }) => (
    <div className="space-y-4 my-8 relative pl-4 border-l border-zinc-700">
        {children}
    </div>
);

export const Step = ({ children }: { children: ReactNode }) => (
    <div className="pl-6 relative">
        <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-zinc-800 border border-zinc-600" />
        <div className="prose prose-invert max-w-none">{children}</div>
    </div>
);
