'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mempoolAPI } from '@/lib/api/mempool';
import type { Block } from '@/lib/api/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import { formatDate, formatBytes, formatDifficulty } from '@/lib/utils/format';
import { formatHash } from '@/lib/utils/bitcoin';
import { ArrowLeft, Hash, Clock, Database, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function BlockPage() {
    const params = useParams();
    const router = useRouter();
    const [block, setBlock] = useState<Block | null>(null);
    const [txids, setTxids] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlock = async () => {
            try {
                setLoading(true);
                const blockData = await mempoolAPI.getBlock(params.id as string);
                setBlock(blockData);

                // Fetch transaction IDs
                const txData = await mempoolAPI.getBlockTransactions(blockData.id);
                setTxids(txData);
            } catch (err) {
                console.error('Error fetching block:', err);
                setError('Block not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBlock();
        }
    }, [params.id]);

    if (loading) {
        return <LoadingSpinner size="lg" />;
    }

    if (error || !block) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error || 'Block not found'}</p>
                <button onClick={() => router.push('/')} className="cyber-button">
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 fade-in">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-400 hover:text-cyber-blue-400 transition-colors duration-200"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Block Header */}
            <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Block <span className="text-gradient">#{block.height.toLocaleString()}</span>
                </h1>

                {/* Navigation */}
                <div className="flex items-center space-x-4">
                    {block.height > 0 && (
                        <Link
                            href={`/block/${block.height - 1}`}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg glass hover:glass-strong transition-all duration-200"
                        >
                            <ChevronLeft size={16} />
                            <span className="text-sm">Previous</span>
                        </Link>
                    )}
                    <Link
                        href={`/block/${block.height + 1}`}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg glass hover:glass-strong transition-all duration-200"
                    >
                        <span className="text-sm">Next</span>
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Block Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card hover={false}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-cyber-blue-400">
                            <Hash size={20} />
                            <h3 className="font-semibold">Block Hash</h3>
                        </div>
                        <p className="text-sm font-mono text-gray-300 break-all">{block.id}</p>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-cyber-purple-400">
                            <Clock size={20} />
                            <h3 className="font-semibold">Timestamp</h3>
                        </div>
                        <p className="text-sm text-gray-300">{formatDate(block.timestamp)}</p>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-cyber-pink-400">
                            <Database size={20} />
                            <h3 className="font-semibold">Transactions</h3>
                        </div>
                        <p className="text-2xl font-bold text-cyber-pink-400">
                            {block.tx_count.toLocaleString()}
                        </p>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-cyber-neon-green">
                            <Cpu size={20} />
                            <h3 className="font-semibold">Difficulty</h3>
                        </div>
                        <p className="text-2xl font-bold text-cyber-neon-green">
                            {formatDifficulty(block.difficulty)}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Additional Details */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-4 text-gradient">Block Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-400">Size</p>
                        <p className="text-gray-200 font-mono">{formatBytes(block.size)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Weight</p>
                        <p className="text-gray-200 font-mono">{block.weight.toLocaleString()} WU</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Version</p>
                        <p className="text-gray-200 font-mono">{block.version}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Nonce</p>
                        <p className="text-gray-200 font-mono">{block.nonce.toLocaleString()}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-gray-400">Merkle Root</p>
                        <p className="text-gray-200 font-mono text-xs break-all">{block.merkle_root}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-gray-400">Previous Block Hash</p>
                        <Link
                            href={`/block/${block.previousblockhash}`}
                            className="text-cyber-blue-400 hover:text-cyber-blue-300 font-mono text-xs break-all"
                        >
                            {block.previousblockhash}
                        </Link>
                    </div>
                </div>
            </Card>

            {/* Transactions List */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-4 text-gradient">
                    Transactions ({txids.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {txids.slice(0, 50).map((txid, index) => (
                        <Link
                            key={txid}
                            href={`/tx/${txid}`}
                            className="block p-3 rounded-lg glass hover:glass-strong transition-all duration-200"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">#{index + 1}</span>
                                <span className="text-sm font-mono text-gray-300">{formatHash(txid)}</span>
                            </div>
                        </Link>
                    ))}
                    {txids.length > 50 && (
                        <p className="text-center text-gray-400 text-sm py-4">
                            Showing first 50 of {txids.length} transactions
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
}
