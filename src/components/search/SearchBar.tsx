'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { detectSearchType } from '@/lib/utils/bitcoin';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) {
            setError('Please enter a search query');
            return;
        }

        setIsSearching(true);
        setError('');

        try {
            const searchType = detectSearchType(query.trim());

            if (!searchType) {
                setError('Invalid search query. Enter a block height, block hash, transaction ID, or address.');
                setIsSearching(false);
                return;
            }

            // Route based on search type
            if (searchType === 'block') {
                router.push(`/block/${query.trim()}`);
            } else if (searchType === 'transaction') {
                router.push(`/tx/${query.trim()}`);
            } else if (searchType === 'address') {
                router.push(`/address/${query.trim()}`);
            }

            setQuery('');
        } catch (err) {
            setError('Search failed. Please try again.');
            console.error('Search error:', err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setError('');
                        }}
                        placeholder="Search by block height, hash, txid, or address..."
                        className="cyber-input pr-12 text-sm md:text-base"
                        disabled={isSearching}
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white hover:bg-gray-200 text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSearching ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Search size={20} />
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <p className="mt-2 text-sm text-red-400 animate-slide-down">{error}</p>
            )}
        </div>
    );
}
