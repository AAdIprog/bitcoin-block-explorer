'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mempoolAPI } from '@/lib/api/mempool';
import type { Transaction } from '@/lib/api/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import { formatDate, formatBytes } from '@/lib/utils/format';
import { formatHash, formatBTC, formatSatoshis, calculateFee, calculateFeeRate, getScriptType } from '@/lib/utils/bitcoin';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Coins } from 'lucide-react';
import Link from 'next/link';

export default function TransactionPage() {
    const params = useParams();
    const router = useRouter();
    const [tx, setTx] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                setLoading(true);
                const txData = await mempoolAPI.getTransaction(params.id as string);
                setTx(txData);
            } catch (err) {
                console.error('Error fetching transaction:', err);
                setError('Transaction not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchTransaction();
        }
    }, [params.id]);

    if (loading) {
        return <LoadingSpinner size="lg" />;
    }

    if (error || !tx) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error || 'Transaction not found'}</p>
                <button onClick={() => router.push('/')} className="cyber-button">
                    Go Home
                </button>
            </div>
        );
    }

    const fee = calculateFee(tx);
    const feeRate = calculateFeeRate(tx);
    const totalInput = tx.vin.reduce((sum, input) => sum + (input.prevout?.value || 0), 0);
    const totalOutput = tx.vout.reduce((sum, output) => sum + output.value, 0);

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

            {/* Transaction Header */}
            <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gradient">Transaction Details</h1>
                <p className="text-sm font-mono text-gray-400 break-all">{tx.txid}</p>
            </div>

            {/* Status Card */}
            <Card hover={false}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {tx.status.confirmed ? (
                            <>
                                <CheckCircle className="text-green-400" size={24} />
                                <div>
                                    <p className="font-semibold text-green-400">Confirmed</p>
                                    {tx.status.block_height && (
                                        <Link
                                            href={`/block/${tx.status.block_height}`}
                                            className="text-sm text-cyber-blue-400 hover:text-cyber-blue-300"
                                        >
                                            Block #{tx.status.block_height.toLocaleString()}
                                        </Link>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Clock className="text-yellow-400 animate-pulse" size={24} />
                                <div>
                                    <p className="font-semibold text-yellow-400">Unconfirmed</p>
                                    <p className="text-sm text-gray-400">In mempool</p>
                                </div>
                            </>
                        )}
                    </div>
                    {tx.status.block_time && (
                        <p className="text-sm text-gray-400">{formatDate(tx.status.block_time)}</p>
                    )}
                </div>
            </Card>

            {/* Transaction Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover={false}>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Fee</p>
                        <p className="text-2xl font-bold text-cyber-blue-400">
                            {formatSatoshis(fee)} sats
                        </p>
                        <p className="text-sm text-gray-500">{formatBTC(fee, 8)} BTC</p>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Fee Rate</p>
                        <p className="text-2xl font-bold text-cyber-purple-400">
                            {feeRate.toFixed(2)} sat/vB
                        </p>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Size</p>
                        <p className="text-2xl font-bold text-cyber-pink-400">
                            {formatBytes(tx.size)}
                        </p>
                        <p className="text-sm text-gray-500">{(tx.weight / 4).toFixed(0)} vB</p>
                    </div>
                </Card>
            </div>

            {/* Transaction Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inputs */}
                <Card hover={false} className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <span className="text-cyber-blue-400">Inputs ({tx.vin.length})</span>
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {tx.vin.map((input, index) => (
                            <div key={index} className="p-3 rounded-lg glass-strong">
                                {input.is_coinbase ? (
                                    <div>
                                        <p className="text-sm font-semibold text-yellow-400">Coinbase (New Coins)</p>
                                        <p className="text-xs text-gray-500 mt-1">Block Reward</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {input.prevout?.scriptpubkey_address && (
                                            <Link
                                                href={`/address/${input.prevout.scriptpubkey_address}`}
                                                className="text-xs font-mono text-cyber-blue-400 hover:text-cyber-blue-300 break-all"
                                            >
                                                {input.prevout.scriptpubkey_address}
                                            </Link>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-200">
                                                {formatBTC(input.prevout?.value || 0, 8)} BTC
                                            </span>
                                            {input.prevout?.scriptpubkey_type && (
                                                <span className="text-xs px-2 py-1 rounded bg-cyber-blue-500/20 text-cyber-blue-400">
                                                    {getScriptType(input.prevout.scriptpubkey_type).name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Total Input</span>
                            <span className="font-semibold text-cyber-blue-400">
                                {formatBTC(totalInput, 8)} BTC
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Arrow */}
                <div className="hidden lg:flex items-center justify-center">
                    <ArrowRight className="text-cyber-purple-400" size={48} />
                </div>

                {/* Outputs */}
                <Card hover={false} className="lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <span className="text-cyber-purple-400">Outputs ({tx.vout.length})</span>
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {tx.vout.map((output, index) => (
                            <div key={index} className="p-3 rounded-lg glass-strong">
                                <div className="space-y-2">
                                    {output.scriptpubkey_address ? (
                                        <Link
                                            href={`/address/${output.scriptpubkey_address}`}
                                            className="text-xs font-mono text-cyber-purple-400 hover:text-cyber-purple-300 break-all"
                                        >
                                            {output.scriptpubkey_address}
                                        </Link>
                                    ) : (
                                        <p className="text-xs text-gray-500">OP_RETURN or Non-standard</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-200">
                                            {formatBTC(output.value, 8)} BTC
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-cyber-purple-500/20 text-cyber-purple-400">
                                            {getScriptType(output.scriptpubkey_type).name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Total Output</span>
                            <span className="font-semibold text-cyber-purple-400">
                                {formatBTC(totalOutput, 8)} BTC
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Additional Details */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-4 text-gradient">Technical Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-400">Version</p>
                        <p className="text-gray-200 font-mono">{tx.version}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Locktime</p>
                        <p className="text-gray-200 font-mono">{tx.locktime}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Weight</p>
                        <p className="text-gray-200 font-mono">{tx.weight.toLocaleString()} WU</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Virtual Size</p>
                        <p className="text-gray-200 font-mono">{(tx.weight / 4).toFixed(0)} vB</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
