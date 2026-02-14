'use client';

import Card from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, Clock, Coins, AlertCircle } from 'lucide-react';

export default function AnalyticsPage() {
    // Mock UTXO age data (in a real implementation, this would come from an API)
    const utxoAgeData = [
        { name: '< 1 day', value: 5, color: '#ff006e' },
        { name: '1-7 days', value: 8, color: '#ec4899' },
        { name: '1-3 months', value: 12, color: '#a78bfa' },
        { name: '3-6 months', value: 15, color: '#8b5cf6' },
        { name: '6-12 months', value: 18, color: '#60a5fa' },
        { name: '1-2 years', value: 20, color: '#3b82f6' },
        { name: '2-5 years', value: 12, color: '#00f0ff' },
        { name: '5+ years', value: 10, color: '#00ff9f' },
    ];

    const totalBTC = utxoAgeData.reduce((sum, item) => sum + item.value, 0);

    // Mock whale movements
    const whaleMovements = [
        {
            amount: 1250,
            age: '3.5 years',
            timestamp: Date.now() - 3600000,
            txid: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
        },
        {
            amount: 850,
            age: '5.2 years',
            timestamp: Date.now() - 7200000,
            txid: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
        },
        {
            amount: 2100,
            age: '6.8 years',
            timestamp: Date.now() - 10800000,
            txid: 'z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1',
        },
    ];

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gradient">UTXO Age Analytics</h1>
                <p className="text-gray-400 mt-2">Analyze Bitcoin supply distribution by age</p>
            </div>

            {/* Info Banner */}
            <Card hover={false} className="bg-cyber-blue-500/10 border-cyber-blue-500/30">
                <div className="flex items-start space-x-3">
                    <AlertCircle className="text-cyber-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                        <h3 className="font-semibold text-cyber-blue-400 mb-1">About UTXO Age Analytics</h3>
                        <p className="text-sm text-gray-400">
                            This page shows how long Bitcoin has been sitting unspent (UTXO age). Older coins moving
                            can indicate long-term holders selling or "whale" activity. This is a demonstration with
                            mock data - a production version would integrate with blockchain analytics APIs.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover={false}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-cyber-blue-500/20">
                            <Coins className="text-cyber-blue-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Supply Analyzed</p>
                            <p className="text-3xl font-bold text-cyber-blue-400">
                                {totalBTC.toFixed(2)}M BTC
                            </p>
                        </div>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-cyber-purple-500/20">
                            <Clock className="text-cyber-purple-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Avg UTXO Age</p>
                            <p className="text-3xl font-bold text-cyber-purple-400">
                                2.3 years
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
                            <p className="text-sm text-gray-400">Whale Movements (24h)</p>
                            <p className="text-3xl font-bold text-cyber-pink-400">
                                {whaleMovements.length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* UTXO Age Distribution Chart */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-6 text-gradient">UTXO Age Distribution</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={utxoAgeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {utxoAgeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 10, 15, 0.9)',
                                    border: '1px solid rgba(0, 240, 255, 0.3)',
                                    borderRadius: '8px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-300 mb-4">Supply by Age</h4>
                        {utxoAgeData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg glass">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-gray-300">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-200">
                                        {item.value.toFixed(2)}M BTC
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {((item.value / totalBTC) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Whale Movements */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-4 text-gradient">
                    Recent Whale Movements (Old Coins Moving)
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                    Large amounts of Bitcoin that have been dormant for years
                </p>
                <div className="space-y-4">
                    {whaleMovements.map((movement, index) => (
                        <div key={index} className="p-4 rounded-lg glass-strong">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-cyber-pink-500/20">
                                        <TrendingUp className="text-cyber-pink-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-cyber-pink-400">
                                            {movement.amount.toLocaleString()} BTC Moved
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Dormant for {movement.age}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(movement.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="text-xs font-mono text-gray-400 break-all">
                                {movement.txid}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Insights */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-4 text-gradient">Key Insights</h3>
                <div className="space-y-4 text-sm">
                    <div className="p-4 rounded-lg bg-cyber-blue-500/10">
                        <h4 className="font-semibold text-cyber-blue-400 mb-2">Long-term Holders</h4>
                        <p className="text-gray-400">
                            {((utxoAgeData.slice(-3).reduce((sum, item) => sum + item.value, 0) / totalBTC) * 100).toFixed(1)}%
                            of Bitcoin supply has been unspent for over 2 years, indicating strong long-term holder conviction.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyber-purple-500/10">
                        <h4 className="font-semibold text-cyber-purple-400 mb-2">Recent Activity</h4>
                        <p className="text-gray-400">
                            {((utxoAgeData.slice(0, 2).reduce((sum, item) => sum + item.value, 0) / totalBTC) * 100).toFixed(1)}%
                            of supply has moved in the last week, suggesting active trading and network usage.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
