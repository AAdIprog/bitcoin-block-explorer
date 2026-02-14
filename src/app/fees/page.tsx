'use client';

import { useEffect, useState } from 'react';
import { mempoolAPI } from '@/lib/api/mempool';
import type { FeeEstimate } from '@/lib/api/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import { Zap, Clock, Turtle, RefreshCw } from 'lucide-react';

export default function FeesPage() {
    const [fees, setFees] = useState<FeeEstimate | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const fetchFees = async (showRefreshing = false) => {
        try {
            if (showRefreshing) setRefreshing(true);
            const feeData = await mempoolAPI.getFeeEstimates();
            setFees(feeData);
            setError('');
        } catch (err) {
            console.error('Error fetching fees:', err);
            setError('Failed to load fee estimates.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFees();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchFees(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <LoadingSpinner size="lg" />;
    }

    if (error || !fees) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error || 'Failed to load fee estimates'}</p>
                <button onClick={() => fetchFees()} className="cyber-button">
                    Try Again
                </button>
            </div>
        );
    }

    const feeOptions = [
        {
            title: 'High Priority',
            description: 'Next block (~10 minutes)',
            fee: fees.fastestFee,
            icon: Zap,
            color: 'cyber-pink',
            bgColor: 'bg-cyber-pink-500/20',
        },
        {
            title: 'Medium Priority',
            description: '~30 minutes',
            fee: fees.halfHourFee,
            icon: Clock,
            color: 'cyber-purple',
            bgColor: 'bg-cyber-purple-500/20',
        },
        {
            title: 'Low Priority',
            description: '~1 hour',
            fee: fees.hourFee,
            icon: Turtle,
            color: 'cyber-blue',
            bgColor: 'bg-cyber-blue-500/20',
        },
    ];

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient">Fee Estimation</h1>
                    <p className="text-gray-400 mt-2">Recommended transaction fees for different priorities</p>
                </div>
                <button
                    onClick={() => fetchFees(true)}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg glass hover:glass-strong transition-all duration-200 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    <span className="text-sm">Refresh</span>
                </button>
            </div>

            {/* Fee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {feeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                        <Card key={option.title} hover={false} className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 rounded-full -mr-16 -mt-16" />
                            <div className="relative space-y-4">
                                <div className={`p-3 rounded-lg ${option.bgColor} w-fit`}>
                                    <Icon className={`text-${option.color}-400`} size={32} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold text-${option.color}-400`}>{option.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-700/50">
                                    <p className="text-4xl font-bold text-gradient">{option.fee}</p>
                                    <p className="text-sm text-gray-400 mt-1">sat/vB</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Additional Fee Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card hover={false}>
                    <h3 className="text-lg font-semibold mb-4 text-cyber-blue-400">Economy Fee</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Rate</span>
                            <span className="text-2xl font-bold text-cyber-blue-400">{fees.economyFee} sat/vB</span>
                        </div>
                        <p className="text-sm text-gray-500">For non-urgent transactions</p>
                    </div>
                </Card>

                <Card hover={false}>
                    <h3 className="text-lg font-semibold mb-4 text-cyber-purple-400">Minimum Fee</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Rate</span>
                            <span className="text-2xl font-bold text-cyber-purple-400">{fees.minimumFee} sat/vB</span>
                        </div>
                        <p className="text-sm text-gray-500">Network minimum relay fee</p>
                    </div>
                </Card>
            </div>

            {/* Fee Explanation */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-4 text-gradient">Understanding Bitcoin Fees</h3>
                <div className="space-y-4 text-sm text-gray-300">
                    <div>
                        <h4 className="font-semibold text-cyber-blue-400 mb-2">What are transaction fees?</h4>
                        <p className="text-gray-400">
                            Bitcoin transaction fees are paid to miners who include your transaction in a block.
                            Fees are calculated based on the transaction size in virtual bytes (vB), not the amount being sent.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-cyber-purple-400 mb-2">How to choose the right fee?</h4>
                        <p className="text-gray-400">
                            Higher fees mean faster confirmation times. If you need your transaction confirmed quickly,
                            use a higher fee rate. For non-urgent transactions, you can save money by using a lower fee rate.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-cyber-pink-400 mb-2">Fee rate (sat/vB)</h4>
                        <p className="text-gray-400">
                            The fee rate is measured in satoshis per virtual byte (sat/vB). Your total fee = fee rate × transaction size.
                            Transactions with higher fee rates are prioritized by miners.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
