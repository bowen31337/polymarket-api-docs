import { Link } from 'react-router-dom';
import { Github, Twitter, ExternalLink } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="py-16 px-6 bg-black border-t border-zinc-900">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">P</span>
                            </div>
                            <span className="text-xl font-bold text-white">Polymarket Learn</span>
                        </div>
                        <p className="text-zinc-500 text-sm max-w-sm mb-6">
                            Learn everything about prediction markets. From getting started to advanced trading strategies.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://twitter.com/Polymarket"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com/Polymarket"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Learn */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Learn</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/lessons/get-started" className="text-zinc-500 hover:text-white text-sm transition-colors">
                                    Get Started
                                </Link>
                            </li>
                            <li>
                                <Link to="/lessons/markets" className="text-zinc-500 hover:text-white text-sm transition-colors">
                                    Markets
                                </Link>
                            </li>
                            <li>
                                <Link to="/lessons/trading" className="text-zinc-500 hover:text-white text-sm transition-colors">
                                    Trading
                                </Link>
                            </li>
                            <li>
                                <Link to="/lessons/deposits" className="text-zinc-500 hover:text-white text-sm transition-colors">
                                    Deposits
                                </Link>
                            </li>
                            <li>
                                <Link to="/lessons/FAQ" className="text-zinc-500 hover:text-white text-sm transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://polymarket.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                                >
                                    Polymarket <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.polymarket.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                                >
                                    API Docs <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://discord.gg/polymarket"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                                >
                                    Discord <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-600 text-sm">
                        © {new Date().getFullYear()} Polymarket. Educational content for learning purposes.
                    </p>
                    <p className="text-zinc-700 text-xs">
                        This is an unofficial educational resource.
                    </p>
                </div>
            </div>
        </footer>
    );
};
