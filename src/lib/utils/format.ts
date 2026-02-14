/**
 * Formatting Utility Functions
 * 
 * Helper functions for formatting numbers, dates, and other data for display
 */

/**
 * Format large numbers with thousand separators
 * @param num Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('en-US');
}

/**
 * Format bytes to human-readable size
 * @param bytes Size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format Unix timestamp to readable date
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

/**
 * Format timestamp to relative time (e.g., "5 minutes ago")
 * @param timestamp Unix timestamp in seconds
 * @returns Relative time string
 */
export function formatTimeAgo(timestamp: number): string {
    const now = Date.now();
    const then = timestamp * 1000;
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
        return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
    } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 30) {
        return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
        return formatDate(timestamp);
    }
}

/**
 * Format mining difficulty
 * @param difficulty Difficulty value
 * @returns Formatted difficulty string
 */
export function formatDifficulty(difficulty: number): string {
    if (difficulty >= 1e12) {
        return `${(difficulty / 1e12).toFixed(2)}T`;
    } else if (difficulty >= 1e9) {
        return `${(difficulty / 1e9).toFixed(2)}B`;
    } else if (difficulty >= 1e6) {
        return `${(difficulty / 1e6).toFixed(2)}M`;
    } else if (difficulty >= 1e3) {
        return `${(difficulty / 1e3).toFixed(2)}K`;
    }
    return difficulty.toString();
}

/**
 * Format hash rate
 * @param hashrate Hash rate in H/s
 * @returns Formatted hash rate string
 */
export function formatHashrate(hashrate: number): string {
    const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
    let unitIndex = 0;
    let value = hashrate;

    while (value >= 1000 && unitIndex < units.length - 1) {
        value /= 1000;
        unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Truncate text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.slice(0, maxLength)}...`;
}

/**
 * Copy text to clipboard
 * @param text Text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        throw err;
    }
}

/**
 * Format percentage
 * @param value Decimal value (e.g., 0.25 for 25%)
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
}
