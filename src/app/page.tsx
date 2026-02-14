import BlockList from "@/components/blocks/BlockList";
import { Activity, TrendingUp, Database, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16 fade-in">
      {/* Hero Section - Massive Text */}
      <section className="text-center space-y-8 py-16">
        <h1 className="text-massive text-gradient-dramatic uppercase tracking-tight skew-chaos">
          BITCOIN
        </h1>
        <div className="space-y-4">
          <p className="text-hero-large text-white flex items-center justify-center gap-3">
            <Zap className="text-white rotate-chaos-1" size={48} />
            EXPLORE THE BLOCKCHAIN WITH MAXIMUM CHAOS
            <Zap className="text-white rotate-chaos-2" size={48} />
          </p>
          <p className="text-2xl text-white font-bold uppercase tracking-wide">
            NO RULES. PURE DEGEN ENERGY.
          </p>
        </div>
      </section>

      {/* Quick Stats - Chaotic Neon Bordered Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Network Card - Tilted left */}
        <div className="card-dramatic border-neon-cyan text-center rotate-chaos-1 hover-chaos offset-chaos-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-gray-800">
              <Activity className="text-white" size={40} />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Network</p>
              <p className="text-3xl font-black text-white uppercase">
                {process.env.NEXT_PUBLIC_BITCOIN_NETWORK === 'mainnet' ? 'MAINNET' : 'TESTNET'}
              </p>
            </div>
          </div>
        </div>

        {/* Status Card - Tilted right */}
        <div className="card-dramatic border-neon-purple text-center rotate-chaos-4 hover-chaos offset-chaos-2">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-gray-800">
              <TrendingUp className="text-gray-300" size={40} />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Status</p>
              <p className="text-3xl font-black text-gray-300 uppercase">
                MOONING
              </p>
            </div>
          </div>
        </div>

        {/* Data Source Card - Tilted left */}
        <div className="card-dramatic border-neon-green text-center rotate-chaos-3 hover-chaos offset-chaos-3">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-gray-800">
              <Database className="text-gray-400" size={40} />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Data</p>
              <p className="text-3xl font-black text-gray-400 uppercase">
                MEGA BLOCKS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blocks */}
      <section className="px-4">
        <BlockList />
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <h2 className="text-4xl font-black text-center mb-12 text-gradient-dramatic uppercase rotate-chaos-2">
          CHAOS FEATURES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-dramatic border-neon-cyan hover:border-neon-cyan rotate-chaos-1 hover-chaos">
            <h3 className="text-xl font-bold text-white mb-3 uppercase">Block Explorer</h3>
            <p className="text-sm text-gray-400">
              View detailed block information including transactions, miner data, and timestamps.
            </p>
          </div>
          <div className="card-dramatic border-neon-purple hover:border-neon-purple rotate-chaos-5 hover-chaos">
            <h3 className="text-xl font-bold text-gray-300 mb-3 uppercase">Transaction Details</h3>
            <p className="text-sm text-gray-400">
              Analyze inputs, outputs, fees, and script types for any transaction.
            </p>
          </div>
          <div className="card-dramatic border-neon-pink hover:border-neon-pink rotate-chaos-2 hover-chaos">
            <h3 className="text-xl font-bold text-gray-400 mb-3 uppercase">Mempool Insights</h3>
            <p className="text-sm text-gray-400">
              Real-time mempool statistics and fee distribution visualization.
            </p>
          </div>
          <div className="card-dramatic border-neon-green hover:border-neon-green rotate-chaos-4 hover-chaos">
            <h3 className="text-xl font-bold text-gray-500 mb-3 uppercase">Fee Estimation</h3>
            <p className="text-sm text-gray-400">
              Get recommended fees for different priority levels and confirmation times.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
