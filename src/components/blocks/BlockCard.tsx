'use client';

import Link from 'next/link';
import { Clock, Hash, Database, Blocks } from 'lucide-react';
import type { Block } from '@/lib/api/types';
import { formatHash } from '@/lib/utils/bitcoin';
import { formatTimeAgo } from '@/lib/utils/format';
import Card from '../ui/Card';

interface BlockCardProps {
    block: Block;
}

// Array of chaotic rotation classes to randomly assign
const chaoticRotations = [
    'rotate-chaos-1',
    'rotate-chaos-2',
    'rotate-chaos-3',
    'rotate-chaos-4',
    'rotate-chaos-5'
];

// Get a consistent rotation based on block height
const getChaoticClass = (height: number) => {
    return chaoticRotations[height % chaoticRotations.length];
};

export default function BlockCard({ block }: BlockCardProps) {
    const rotationClass = getChaoticClass(block.height);

    return (
        <Link href={`/block/${block.id}`}>
            <Card className={`group ${rotationClass} hover-chaos`}>
                <div className="space-y-3">
                    {/* Block Height */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Blocks className="text-gray-400" size={20} />
                            <span className="text-sm text-gray-400">Block</span>
                        </div>
                        <span className="text-2xl font-bold text-gradient group-hover:neon-text transition-all duration-300">
                            #{block.height.toLocaleString()}
                        </span>
                    </div>

                    {/* Block Hash */}
                    <div className="flex items-center space-x-2">
                        <Hash className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-300 font-mono">
                            {formatHash(block.id)}
                        </span>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center space-x-2">
                        <Clock className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-400">
                            {formatTimeAgo(block.timestamp)}
                        </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700/50">
                        <div>
                            <p className="text-xs text-gray-500">Transactions</p>
                            <p className="text-lg font-semibold text-white">
                                {block.tx_count.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Size</p>
                            <p className="text-lg font-semibold text-gray-300">
                                {(block.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
