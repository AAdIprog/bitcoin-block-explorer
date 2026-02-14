import axios, { AxiosInstance } from 'axios';
import type {
    Block,
    Transaction,
    Address,
    AddressTransaction,
    MempoolStats,
    FeeEstimate,
} from './types';

/**
 * Mempool.space API Client
 * 
 * This client interacts with the Mempool.space API to fetch Bitcoin blockchain data.
 * Supports both testnet and mainnet networks.
 * 
 * API Documentation: https://mempool.space/docs/api/rest
 */
class MempoolAPI {
    private client: AxiosInstance;
    private baseURL: string;

    constructor() {
        // Use environment variable or default to testnet
        this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mempool.space/testnet/api';

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error.message);
                throw error;
            }
        );
    }

    /**
   * Get the latest blocks
   * @param startHeight Optional starting block height
   * @returns Array of recent blocks
   */
    async getLatestBlocks(startHeight?: number): Promise<Block[]> {
        try {
            // Use /blocks endpoint which returns an array of the latest blocks
            // Or /blocks/:height to get blocks starting from a specific height
            const endpoint = startHeight ? `/blocks/${startHeight}` : '/blocks';
            const response = await this.client.get<Block[]>(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error fetching latest blocks:', error);
            throw error;
        }
    }

    /**
     * Get block by hash or height
     * @param hashOrHeight Block hash or height
     * @returns Block details
     */
    async getBlock(hashOrHeight: string | number): Promise<Block> {
        try {
            const response = await this.client.get<Block>(`/block/${hashOrHeight}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching block:', error);
            throw error;
        }
    }

    /**
     * Get transactions in a block
     * @param hash Block hash
     * @param startIndex Starting index for pagination
     * @returns Array of transaction IDs
     */
    async getBlockTransactions(hash: string, startIndex: number = 0): Promise<string[]> {
        try {
            const response = await this.client.get<string[]>(`/block/${hash}/txids`);
            return response.data;
        } catch (error) {
            console.error('Error fetching block transactions:', error);
            throw error;
        }
    }

    /**
     * Get transaction by ID
     * @param txid Transaction ID
     * @returns Transaction details
     */
    async getTransaction(txid: string): Promise<Transaction> {
        try {
            const response = await this.client.get<Transaction>(`/tx/${txid}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching transaction:', error);
            throw error;
        }
    }

    /**
     * Get address information
     * @param address Bitcoin address
     * @returns Address details including balance and transaction count
     */
    async getAddress(address: string): Promise<Address> {
        try {
            const response = await this.client.get<Address>(`/address/${address}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching address:', error);
            throw error;
        }
    }

    /**
     * Get address transactions
     * @param address Bitcoin address
     * @returns Array of transactions for the address
     */
    async getAddressTransactions(address: string): Promise<AddressTransaction[]> {
        try {
            const response = await this.client.get<AddressTransaction[]>(`/address/${address}/txs`);
            return response.data;
        } catch (error) {
            console.error('Error fetching address transactions:', error);
            throw error;
        }
    }

    /**
     * Get mempool statistics
     * @returns Current mempool stats including size and fee distribution
     */
    async getMempoolStats(): Promise<MempoolStats> {
        try {
            const response = await this.client.get<MempoolStats>('/mempool');
            return response.data;
        } catch (error) {
            console.error('Error fetching mempool stats:', error);
            throw error;
        }
    }

    /**
     * Get recent mempool transactions
     * @returns Array of recent unconfirmed transactions
     */
    async getMempoolRecent(): Promise<Transaction[]> {
        try {
            const response = await this.client.get<Transaction[]>('/mempool/recent');
            return response.data;
        } catch (error) {
            console.error('Error fetching recent mempool transactions:', error);
            throw error;
        }
    }

    /**
     * Get fee estimates for different priority levels
     * @returns Fee estimates in sat/vB
     */
    async getFeeEstimates(): Promise<FeeEstimate> {
        try {
            const response = await this.client.get<FeeEstimate>('/v1/fees/recommended');
            return response.data;
        } catch (error) {
            console.error('Error fetching fee estimates:', error);
            throw error;
        }
    }

    /**
     * Get current block height (tip)
     * @returns Current blockchain height
     */
    async getBlockHeight(): Promise<number> {
        try {
            const response = await this.client.get<number>('/blocks/tip/height');
            return response.data;
        } catch (error) {
            console.error('Error fetching block height:', error);
            throw error;
        }
    }

    /**
     * Get block hash at specific height
     * @param height Block height
     * @returns Block hash
     */
    async getBlockHash(height: number): Promise<string> {
        try {
            const response = await this.client.get<string>(`/block-height/${height}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching block hash:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const mempoolAPI = new MempoolAPI();
