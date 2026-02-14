import type { Transaction, ScriptType } from '../api/types';

/**
 * Bitcoin Utility Functions
 * 
 * These functions demonstrate understanding of Bitcoin protocol concepts
 * including satoshis, script types, fees, and address validation.
 */

const SATOSHIS_PER_BTC = 100000000;

/**
 * Convert satoshis to BTC
 * @param satoshis Amount in satoshis
 * @returns Amount in BTC
 */
export function satoshisToBTC(satoshis: number): number {
    return satoshis / SATOSHIS_PER_BTC;
}

/**
 * Convert BTC to satoshis
 * @param btc Amount in BTC
 * @returns Amount in satoshis
 */
export function btcToSatoshis(btc: number): number {
    return Math.round(btc * SATOSHIS_PER_BTC);
}

/**
 * Format hash for display (truncate middle)
 * @param hash Full hash string
 * @param startChars Number of characters to show at start
 * @param endChars Number of characters to show at end
 * @returns Truncated hash
 */
export function formatHash(hash: string, startChars: number = 8, endChars: number = 8): string {
    if (hash.length <= startChars + endChars) {
        return hash;
    }
    return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

/**
 * Identify Bitcoin script type from scriptpubkey_type
 * 
 * Common script types:
 * - P2PKH (Pay to Public Key Hash): Legacy addresses starting with 1
 * - P2SH (Pay to Script Hash): Legacy multisig/segwit addresses starting with 3
 * - P2WPKH (Pay to Witness Public Key Hash): Native SegWit addresses starting with bc1q
 * - P2WSH (Pay to Witness Script Hash): Native SegWit multisig addresses
 * - P2TR (Pay to Taproot): Taproot addresses starting with bc1p
 * 
 * @param scriptType Script type string from API
 * @returns Human-readable script type
 */
export function getScriptType(scriptType: string): { type: ScriptType; name: string; description: string } {
    const scriptTypes: Record<string, { type: ScriptType; name: string; description: string }> = {
        'p2pkh': {
            type: 'p2pkh',
            name: 'P2PKH',
            description: 'Pay to Public Key Hash (Legacy)',
        },
        'p2sh': {
            type: 'p2sh',
            name: 'P2SH',
            description: 'Pay to Script Hash (Multisig/SegWit)',
        },
        'v0_p2wpkh': {
            type: 'p2wpkh',
            name: 'P2WPKH',
            description: 'Pay to Witness Public Key Hash (SegWit)',
        },
        'v0_p2wsh': {
            type: 'p2wsh',
            name: 'P2WSH',
            description: 'Pay to Witness Script Hash (SegWit Multisig)',
        },
        'v1_p2tr': {
            type: 'p2tr',
            name: 'P2TR',
            description: 'Pay to Taproot (Taproot)',
        },
        'multisig': {
            type: 'multisig',
            name: 'Multisig',
            description: 'Bare Multisig',
        },
        'op_return': {
            type: 'nulldata',
            name: 'OP_RETURN',
            description: 'Null Data (Unspendable)',
        },
    };

    return scriptTypes[scriptType] || {
        type: 'nonstandard',
        name: 'Non-standard',
        description: 'Non-standard script',
    };
}

/**
 * Calculate transaction fee
 * Fee = Sum of inputs - Sum of outputs
 * 
 * @param tx Transaction object
 * @returns Fee in satoshis
 */
export function calculateFee(tx: Transaction): number {
    if (tx.fee !== undefined) {
        return tx.fee;
    }

    const inputSum = tx.vin.reduce((sum, input) => {
        return sum + (input.prevout?.value || 0);
    }, 0);

    const outputSum = tx.vout.reduce((sum, output) => {
        return sum + output.value;
    }, 0);

    return inputSum - outputSum;
}

/**
 * Calculate transaction fee rate in sat/vB
 * 
 * Fee rate determines transaction priority in the mempool.
 * Higher fee rates get confirmed faster.
 * 
 * @param tx Transaction object
 * @returns Fee rate in satoshis per virtual byte
 */
export function calculateFeeRate(tx: Transaction): number {
    const fee = calculateFee(tx);
    const vsize = tx.weight / 4; // Virtual size = weight / 4
    return fee / vsize;
}

/**
 * Estimate confirmation time based on number of confirmations
 * @param confirmations Number of confirmations
 * @returns Human-readable time estimate
 */
export function getConfirmationTime(confirmations: number): string {
    if (confirmations === 0) {
        return 'Unconfirmed';
    }

    const minutes = confirmations * 10; // Average 10 minutes per block

    if (minutes < 60) {
        return `~${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `~${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(hours / 24);
    return `~${days} day${days > 1 ? 's' : ''} ago`;
}

/**
 * Validate Bitcoin address format
 * 
 * Basic validation for common address types:
 * - Legacy (P2PKH): starts with 1
 * - Legacy (P2SH): starts with 3
 * - SegWit (Bech32): starts with bc1
 * - Testnet: starts with m, n, or tb1
 * 
 * @param address Bitcoin address
 * @returns True if valid format
 */
export function validateAddress(address: string): boolean {
    // Mainnet addresses
    const mainnetRegex = /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/;
    // Testnet addresses
    const testnetRegex = /^(m|n|tb1|2)[a-zA-HJ-NP-Z0-9]{25,62}$/;

    return mainnetRegex.test(address) || testnetRegex.test(address);
}

/**
 * Validate transaction ID format
 * @param txid Transaction ID (64 character hex string)
 * @returns True if valid format
 */
export function validateTxid(txid: string): boolean {
    return /^[a-fA-F0-9]{64}$/.test(txid);
}

/**
 * Validate block hash format
 * @param hash Block hash (64 character hex string)
 * @returns True if valid format
 */
export function validateBlockHash(hash: string): boolean {
    return /^[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate block height
 * @param height Block height (positive integer)
 * @returns True if valid
 */
export function validateBlockHeight(height: string | number): boolean {
    const num = typeof height === 'string' ? parseInt(height, 10) : height;
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
}

/**
 * Detect search query type
 * @param query Search query
 * @returns Type of query (block, transaction, address, or null)
 */
export function detectSearchType(query: string): 'block' | 'transaction' | 'address' | null {
    const trimmed = query.trim();

    // Check if it's a block height (number)
    if (validateBlockHeight(trimmed)) {
        return 'block';
    }

    // Check if it's a transaction ID or block hash (64 char hex)
    if (validateTxid(trimmed) || validateBlockHash(trimmed)) {
        // Could be either - we'll try block first, then transaction
        return 'block';
    }

    // Check if it's an address
    if (validateAddress(trimmed)) {
        return 'address';
    }

    return null;
}

/**
 * Format BTC amount with proper decimal places
 * @param satoshis Amount in satoshis
 * @param decimals Number of decimal places
 * @returns Formatted BTC string
 */
export function formatBTC(satoshis: number, decimals: number = 8): string {
    const btc = satoshisToBTC(satoshis);
    return btc.toFixed(decimals);
}

/**
 * Format satoshis with thousand separators
 * @param satoshis Amount in satoshis
 * @returns Formatted string
 */
export function formatSatoshis(satoshis: number): string {
    return satoshis.toLocaleString('en-US');
}
