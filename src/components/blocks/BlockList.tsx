'use client';

import { useEffect, useState } from 'react';
import { mempoolAPI } from '@/lib/api/mempool';
import type { Block } from '@/lib/api/types';
import BlockCard from './BlockCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import { RefreshCw } from 'lucide-react';

export default function BlockList() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchBlocks = async (showRefreshing = false) => {
        try {
            if (showRefreshing) setRefreshing(true);
            const data = await mempoolAPI.getLatestBlocks();

            // Ensure data is an array before calling slice
            if (Array.isArray(data)) {
                setBlocks(data.slice(0, 15)); // Show latest 15 blocks
            } else {
                console.error('API returned non-array data:', data);
                setBlocks([]);
            }
            setError('');
        } catch (err) {
            console.error('Error fetching blocks:', err);
            setError('Failed to load blocks. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBlocks();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchBlocks(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <LoadingSpinner size="lg" />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={() => {
                        setLoading(true);
                        fetchBlocks();
                    }}
                    className="cyber-button"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <h2 className="text-4xl md:text-5xl font-black text-gradient-dramatic uppercase tracking-tight">
                    LATEST CHAOS BLOCKS
                </h2>
                <button
                    onClick={() => fetchBlocks(true)}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg border-neon-green card-dramatic hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                    <RefreshCw size={20} className={refreshing ? 'animate-spin text-neon-green' : 'text-neon-green'} />
                    <span className="text-sm font-bold uppercase text-neon-green">Refresh</span>
                </button>
            </div>

            {/* Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blocks.map((block) => (
                    <BlockCard key={block.id} block={block} />
                ))}
            </div>
        </div>
    );
}
