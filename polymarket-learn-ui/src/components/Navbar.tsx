import { motion } from 'framer-motion';

export const Navbar = () => {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/50 border-b border-white/10"
        >
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Polymarket Learn</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <a href="#intro" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">What is it?</a>
                <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it Works</a>
                <a href="#faq" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">FAQ</a>
            </div>

            <button className="bg-white text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-zinc-200 transition-colors">
                Launch App
            </button>
        </motion.nav>
    );
};
