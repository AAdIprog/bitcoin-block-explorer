# Bitcoin Block Explorer

A modern, feature-rich Bitcoin block explorer built for the Summer of Bitcoin 2026 application. This project demonstrates deep understanding of the Bitcoin protocol, blockchain technology, and modern web development practices.

![Bitcoin Explorer](https://img.shields.io/badge/Bitcoin-Explorer-orange?style=for-the-badge&logo=bitcoin)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### Core Functionality
- **🔍 Multi-Type Search**: Search by block height, block hash, transaction ID, or Bitcoin address
- **📦 Block Explorer**: View detailed block information including transactions, miner data, timestamps, and difficulty
- **💸 Transaction Details**: Analyze inputs, outputs, fees, script types, and confirmation status
- **👛 Address Tracking**: Monitor address balances, transaction history, and UTXO sets
- **⏱️ Real-Time Updates**: Auto-refreshing data for latest blocks and mempool statistics

### Advanced Features
- **🌊 Mempool Visualization**: Live mempool statistics with fee distribution charts
- **💰 Fee Estimation**: Recommended fees for high/medium/low priority transactions
- **📊 UTXO Age Analytics**: Visualize Bitcoin supply distribution by age with whale movement tracking
- **🎨 Cyberpunk UI**: Modern dark theme with glassmorphism effects and neon accents

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14+ (React 18+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Charts**: Recharts for data visualization
- **API**: Mempool.space API for Bitcoin testnet/mainnet data
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

## 🚀 Getting Started

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Configuration

The project uses environment variables in `.env.local`:

```env
# Network: 'testnet' or 'mainnet'
NEXT_PUBLIC_BITCOIN_NETWORK=testnet

# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://mempool.space/testnet/api

# Auto-refresh interval (milliseconds)
NEXT_PUBLIC_REFRESH_INTERVAL=30000
```

### Switching Networks

**Testnet (Default)**:
```env
NEXT_PUBLIC_BITCOIN_NETWORK=testnet
NEXT_PUBLIC_API_BASE_URL=https://mempool.space/testnet/api
```

**Mainnet**:
```env
NEXT_PUBLIC_BITCOIN_NETWORK=mainnet
NEXT_PUBLIC_API_BASE_URL=https://mempool.space/api
```

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard
4. Deploy to production: `vercel --prod`

## 📚 Bitcoin Concepts Demonstrated

### Blockchain Fundamentals
- **Blocks**: Height, hash, timestamp, merkle root, difficulty, nonce
- **Mining**: Proof of work, block rewards, difficulty adjustments
- **Transactions**: Inputs, outputs, signatures, locktime

### Script Types
- **P2PKH**: Pay to Public Key Hash (Legacy, starts with 1)
- **P2SH**: Pay to Script Hash (Starts with 3)
- **P2WPKH**: Pay to Witness Public Key Hash (SegWit, bc1q...)
- **P2WSH**: Pay to Witness Script Hash (SegWit multisig)
- **P2TR**: Pay to Taproot (bc1p...)

### Fee Market
- **Fee Calculation**: Inputs - Outputs
- **Fee Rate**: Satoshis per virtual byte (sat/vB)
- **Priority**: Higher fees = faster confirmation

## 🎯 What Makes This Unique

1. **Deep Bitcoin Knowledge**: Demonstrates understanding of blocks, transactions, UTXOs, script types, and fee markets
2. **Production-Quality Code**: Clean architecture, TypeScript types, error handling, responsive design
3. **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Recharts
4. **Real-Time Data**: Live updates from Mempool.space API
5. **Portfolio-Ready**: Professional UI/UX with cyberpunk aesthetic

## 📁 Project Structure

```
bitcoin-explorer/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/             # API client and utilities
│   └── styles/          # Global styles
├── public/              # Static assets
└── .env.local          # Environment variables
```

## 🙏 Acknowledgments

- **Mempool.space** for the excellent Bitcoin API
- **Summer of Bitcoin** for the opportunity
- **Bitcoin Core** developers

---

Built with ❤️ for Summer of Bitcoin 2026
