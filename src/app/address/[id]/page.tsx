'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mempoolAPI } from '@/lib/api/mempool';
import type { Address, AddressTransaction } from '@/lib/api/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/format';
import { formatHash, formatBTC, formatSatoshis } from '@/lib/utils/bitcoin';
import { ArrowLeft, Wallet, ArrowDownCircle, ArrowUpCircle, Hash } from 'lucide-react';
import Link from 'next/link';

export default function AddressPage() {
    const params = useParams();
    const router = useRouter();
    const [address, setAddress] = useState<Address | null>(null);
    const [transactions, setTransactions] = useState<AddressTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                setLoading(true);
                const addressData = await mempoolAPI.getAddress(params.id as string);
                setAddress(addressData);

                const txData = await mempoolAPI.getAddressTransactions(params.id as string);
                setTransactions(txData);
            } catch (err) {
                console.error('Error fetching address:', err);
                setError('Address not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchAddress();
        }
    }, [params.id]);

    if (loading) {
        return <LoadingSpinner size="lg" />;
    }

    if (error || !address) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error || 'Address not found'}</p>
                <button onClick={() => router.push('/')} className="cyber-button">
                    Go Home
                </button>
            </div>
        );
    }

    const balance = address.chain_stats.funded_txo_sum - address.chain_stats.spent_txo_sum;
    const totalReceived = address.chain_stats.funded_txo_sum;
    const totalSent = address.chain_stats.spent_txo_sum;

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

            {/* Address Header */}
            <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gradient">Address Details</h1>
                <p className="text-sm font-mono text-gray-400 break-all">{address.address}</p>
            </div>

            {/* Balance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover={false}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-cyber-blue-500/20">
                            <Wallet className="text-cyber-blue-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Balance</p>
                            <p className="text-2xl font-bold text-cyber-blue-400">
                                {formatBTC(balance, 8)} BTC
                            </p>
                            <p className="text-xs text-gray-500">{formatSatoshis(balance)} sats</p>
                        </div>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-green-500/20">
                            <ArrowDownCircle className="text-green-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Received</p>
                            <p className="text-2xl font-bold text-green-400">
                                {formatBTC(totalReceived, 8)} BTC
                            </p>
                            <p className="text-xs text-gray-500">{formatSatoshis(totalReceived)} sats</p>
                        </div>
                    </div>
                </Card>

                <Card hover={false}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-red-500/20">
                            <ArrowUpCircle className="text-red-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Sent</p>
                            <p className="text-2xl font-bold text-red-400">
                                {formatBTC(totalSent, 8)} BTC
                            </p>
                            <p className="text-xs text-gray-500">{formatSatoshis(totalSent)} sats</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transaction Count */}
            <Card hover={false}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400">Total Transactions</p>
                        <p className="text-3xl font-bold text-gradient">{address.chain_stats.tx_count.toLocaleString()}</p>
                    </div>
                    {address.mempool_stats.tx_count > 0 && (
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Unconfirmed</p>
                            <p className="text-2xl font-bold text-yellow-400">{address.mempool_stats.tx_count}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Transaction History */}
            <Card hover={false}>
                <h3 className="text-xl font-semibold mb-4 text-gradient">
                    Transaction History ({transactions.length})
                </h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {transactions.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No transactions found</p>
                    ) : (
                        transactions.map((tx) => {
                            // Determine if this address received or sent in this transaction
                            const received = tx.vout.some(out => out.scriptpubkey_address === address.address);
                            const sent = tx.vin.some(input => input.prevout?.scriptpubkey_address === address.address);

                            // Calculate amount for this address
                            const receivedAmount = tx.vout
                                .filter(out => out.scriptpubkey_address === address.address)
                                .reduce((sum, out) => sum + out.value, 0);

                            const sentAmount = tx.vin
                                .filter(input => input.prevout?.scriptpubkey_address === address.address)
                                .reduce((sum, input) => sum + (input.prevout?.value || 0), 0);

                            const netAmount = receivedAmount - sentAmount;

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
                                        {tx.status.confirmed ? (
                                            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                                                Confirmed
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                                                Unconfirmed
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {tx.status.block_time && (
                                                <p className="text-xs text-gray-500">{formatDate(tx.status.block_time)}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-semibold ${netAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {netAmount > 0 ? '+' : ''}{formatBTC(netAmount, 8)} BTC
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {netAmount > 0 ? 'Received' : 'Sent'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </Card>
        </div>
    );
}
