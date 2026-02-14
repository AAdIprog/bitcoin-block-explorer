'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SearchBar from '../search/SearchBar';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const network = process.env.NEXT_PUBLIC_BITCOIN_NETWORK || 'testnet';

    return (
        <>
            <header className="sticky top-0 z-50 glass-strong">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white to-gray-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <span className="text-2xl font-bold text-black">₿</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gradient">Bitcoin Explorer</h1>
                                <p className="text-xs text-gray-400 uppercase">{network}</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                            >
                                HOME
                            </Link>
                            <Link
                                href="/mempool"
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                            >
                                MEMPOOL
                            </Link>
                            <Link
                                href="/fees"
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                            >
                                FEES
                            </Link>
                            <Link
                                href="/analytics"
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                            >
                                ANALYTICS
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg glass hover:glass-strong transition-all duration-200"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Search Bar - Desktop - Integrated into header */}
                    <div className="hidden md:block mt-4">
                        <SearchBar />
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden glass-strong border-t border-gray-700 animate-slide-down">
                        <div className="container mx-auto px-4 py-4 space-y-4">
                            {/* Mobile Search */}
                            <SearchBar />

                            {/* Mobile Navigation */}
                            <nav className="flex flex-col space-y-2">
                                <Link
                                    href="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                                >
                                    HOME
                                </Link>
                                <Link
                                    href="/mempool"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                                >
                                    MEMPOOL
                                </Link>
                                <Link
                                    href="/fees"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                                >
                                    FEES
                                </Link>
                                <Link
                                    href="/analytics"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                                >
                                    ANALYTICS
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}
            </header>
            {/* Purple accent line below header */}
            <div className="header-accent"></div>
        </>
    );
}
