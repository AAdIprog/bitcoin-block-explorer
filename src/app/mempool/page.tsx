'use client';

import { useEffect, useState } from 'react';
import { mempoolAPI } from '@/lib/api/mempool';
import type { MempoolStats, Transaction } from '@/lib/api/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import { formatBytes, formatNumber } from '@/lib/utils/format';
import { formatHash, formatSatoshis, calculateFeeRate } from '@/lib/utils/bitcoin';
import { Activity, Database, TrendingUp, RefreshCw, Hash } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MempoolPage() {
    const [stats, setStats] = useState<MempoolStats | null>(null);
    const [recentTxs, setRecentTxs] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const fetchMempoolData = async (showRefreshing = false) => {
        try {
            if (showRefreshing) setRefreshing(true);
            const [statsData, txData] = await Promise.all([
                mempoolAPI.getMempoolStats(),
                mempoolAPI.getMempoolRecent(),
            ]);
            setStats(statsData);
            setRecentTxs(txData.slice(0, 20));
            setError('');
        } catch (err) {
            console.error('Error fetching mempool data:', err);
            setError('Failed to load mempool data.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMempoolData();

        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            fetchMempoolData(true);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <LoadingSpinner size="lg" />;
    }

    if (error || !stats) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error || 'Failed to load mempool data'}</p>
                <button onClick={() => fetchMempoolData()} className="cyber-button">
                    Try Again
                </button>
            </div>
        );
    }

    // Prepare fee distribution data for chart
    const feeDistribution = stats.fee_histogram.map(([feeRate, count]) => ({
        feeRate: `${feeRate}+`,
        count,
    })).slice(0, 10);

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient">Mempool Dashboard</h1>
                    <p className="text-gray-400 mt-2">Real-time Bitcoin mempool statistics</p>
                </div>
                <button
                    onClick={() => fetchMempoolData(true)}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg glass hover:glass-strong transition-all duration-200 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    <span className="text-sm">Refresh</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover={false}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-cyber-blue-500/20">
                            <Activity className="text-cyber-blue-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Pending Transactions</p>
                            <p className="text-3xl font-bold text-cyber-blue-400">
                                {formatNumber(stats.count)}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-cyber-purple-500/20">
                            <Database className="text-cyber-purple-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Mempool Size</p>
                            <p className="text-3xl font-bold text-cyber-purple-400">
                                {formatBytes(stats.vsize)}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-cyber-pink-500/20">
                            <TrendingUp className="text-cyber-pink-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Fees</p>
                            <p className="text-3xl font-bold text-cyber-pink-400">
                                {formatSatoshis(stats.total_fee)} sats
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Fee Distribution Chart */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-6 text-gradient">Fee Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={feeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="feeRate"
                            stroke="#888"
                            tick={{ fill: '#888' }}
                            label={{ value: 'Fee Rate (sat/vB)', position: 'insideBottom', offset: -5, fill: '#888' }}
                        />
                        <YAxis
                            stroke="#888"
                            tick={{ fill: '#888' }}
                            label={{ value: 'Transaction Count', angle: -90, position: 'insideLeft', fill: '#888' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 10, 15, 0.9)',
                                border: '1px solid rgba(0, 240, 255, 0.3)',
                                borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#00f0ff' }}
                        />
                        <Bar dataKey="count" fill="url(#colorGradient)" />
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#b026ff" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Recent Transactions */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-4 text-gradient">
                    Recent Mempool Transactions
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recentTxs.map((tx) => {
                        const feeRate = calculateFeeRate(tx);
                        return (
                            <Link
                                key={tx.txid}
                                href={`/tx/${tx.txid}`}
                                className="block p-4 rounded-lg glass hover:glass-strong transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Hash className="text-gray-400" size={16} />
                                        <span className="text-sm font-mono text-gray-300">{formatHash(tx.txid)}</span>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                                        Unconfirmed
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Fee Rate</span>
                                    <span className="font-semibold text-cyber-blue-400">
                                        {feeRate.toFixed(2)} sat/vB
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
