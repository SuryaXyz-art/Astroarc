import React, { useState } from 'react';
import { getPredictionMarketContract } from '../services/contract';
import { ethers } from 'ethers';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

export default function PredictionMarket() {
    const [markets] = useState([
        { id: 1, question: 'Will ETH cross $4000 before April?', aiSignal: 'Jupiter aligns with Venus. Favorable growth energy present.', yesPool: 1.5, noPool: 0.8, status: 'open' },
        { id: 2, question: 'Will the upcoming sports match trigger an upset?', aiSignal: 'Mars retrograde indicates high volatility and unexpected reversals.', yesPool: 0.5, noPool: 2.1, status: 'open' }
    ]);
    const [betting, setBetting] = useState({});

    const placeBet = async (marketId, isYes) => {
        setBetting({ ...betting, [marketId]: 'betting' });
        try {
            if (!window.ethereum) throw new Error('Wallet required');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = await getPredictionMarketContract(signer);

            const tx = await contract.placeBet(marketId, isYes, { value: ethers.parseEther("0.05") }); // 0.05 ETH hardcoded for demo
            await tx.wait();

            setBetting({ ...betting, [marketId]: 'success' });
            alert('Bet placed successfully!');
        } catch (e) {
            console.error('Betting interaction failed', e);
            setBetting({ ...betting, [marketId]: 'error' });
            alert(`Transaction failed: ${e.reason || e.message}`);
        }
    };

    return (
        <div className="mt-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-6 flex justify-center items-center gap-2">
                <Activity size={28} />
                Cosmic Prediction Market
            </h3>

            <div className="flex flex-col gap-5">
                {markets.map((m) => (
                    <div key={m.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-xl">
                        <h4 className="font-bold text-slate-100 text-lg mb-2">{m.question}</h4>

                        <div className="bg-indigo-900/40 border border-indigo-700/50 rounded-lg p-3 mb-4 text-sm text-indigo-300 italic">
                            <strong>✨ Astro AI Insight:</strong> "{m.aiSignal}"
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm font-medium">
                            <div className="flex justify-between p-2 rounded bg-slate-700 text-slate-300">
                                <span>Yes Pool:</span>
                                <span className="text-emerald-400">{m.yesPool} ETH</span>
                            </div>
                            <div className="flex justify-between p-2 rounded bg-slate-700 text-slate-300">
                                <span>No Pool:</span>
                                <span className="text-red-400">{m.noPool} ETH</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => placeBet(m.id, true)}
                                disabled={betting[m.id] === 'betting'}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl transition-colors font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
                            >
                                <TrendingUp size={18} /> Stake YES (0.05 ETH)
                            </button>
                            <button
                                onClick={() => placeBet(m.id, false)}
                                disabled={betting[m.id] === 'betting'}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600/90 hover:bg-red-500 text-white rounded-xl transition-colors font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-50"
                            >
                                <TrendingDown size={18} /> Stake NO (0.05 ETH)
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
