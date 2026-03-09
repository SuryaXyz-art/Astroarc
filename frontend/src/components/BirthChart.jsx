import React, { useState, useRef } from 'react';
import { generateChart } from '../services/api';
import { storeReportOnChain, mintChartNFT } from '../services/contract';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Sparkles } from 'lucide-react';

export default function BirthChart({ profile }) {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [minting, setMinting] = useState(false);
    const [error, setError] = useState('');
    const [txHash, setTxHash] = useState('');
    const chartRef = useRef(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setTxHash('');
        try {
            const dataPayload = {
                birthDate: profile?.birthDate || '1995-05-15',
                birthTime: profile?.birthTime || '14:30',
                birthLocation: profile?.birthLocation || 'New York, USA'
            };
            const res = await generateChart(dataPayload);
            if (res.success) {
                setChartData(res.chartData);
            } else {
                setError(res.error || 'Failed to generate chart');
            }
        } catch (err) {
            setError('Error connecting to chart service');
        }
        setLoading(false);
    };

    const handleDownload = async () => {
        if (!chartRef.current) return;
        try {
            const canvas = await html2canvas(chartRef.current, { backgroundColor: '#0f172a' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('AstroTalk_BirthChart.pdf');
        } catch (err) {
            console.error('Error downloading PDF', err);
        }
    };

    const handleMint = async () => {
        if (!chartData) return;
        setMinting(true);
        setError('');
        setTxHash('');

        try {
            // 1. Create unique hash identifier for the chart
            const chartIdentifier = `AstroTalk-${Date.now()}-${chartData.zodiacSign}`;

            // 2. Store on chain (Hackathon mock prediction & IPFS link)
            const storeRes = await storeReportOnChain(
                chartIdentifier,
                `Your destiny is intertwined with ${chartData.zodiacSign}`,
                `ipfs://mock-cid-for-${chartIdentifier}`
            );

            if (!storeRes.success) throw new Error(storeRes.error);

            // 3. Mint NFT (mock index 0 for now)
            const mintRes = await mintChartNFT(0);
            if (!mintRes.success) throw new Error(mintRes.error);

            setTxHash(mintRes.hash || storeRes.hash);
        } catch (err) {
            setError(err.message || 'Minting failed. Are you connected to Arc Testnet?');
        } finally {
            setMinting(false);
        }
    };

    if (!chartData) {
        return (
            <div className="flex flex-col items-center mt-6">
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg font-bold"
                >
                    {loading ? 'Consulting the Stars...' : (
                        <>
                            <Sparkles size={20} />
                            Generate Birth Chart
                        </>
                    )}
                </button>
                {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
            </div>
        );
    }

    return (
        <div className="mt-8 flex flex-col items-center w-full animate-fadeIn">
            <div
                ref={chartRef}
                className="w-full glass-card p-8 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-700"></div>

                <div className="relative z-10">
                    <h3 className="text-3xl font-display font-bold text-gradient mb-8 text-center">
                        Cosmic Blueprint
                    </h3>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="glass-panel p-5 rounded-2xl text-center border border-white/5 hover:border-purple-500/30 transition-colors">
                            <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-widest">Sun Sign</p>
                            <p className="text-2xl font-bold text-gradient-gold">{chartData.zodiacSign}</p>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl text-center border border-white/5 hover:border-indigo-500/30 transition-colors">
                            <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-widest">Ascendant</p>
                            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{chartData.ascendant}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Planetary Placements</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {chartData.planets.map((planet, idx) => (
                                <div key={idx} className="flex justify-between items-center glass-panel p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="text-slate-200 font-medium">{planet.name}</span>
                                    <span className="text-pink-300 font-semibold">{planet.sign}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
                <button
                    onClick={handleDownload}
                    className="flex-1 max-w-[280px] flex items-center justify-center gap-2 px-6 py-3.5 glass-panel hover:bg-white/10 text-white rounded-xl transition-all duration-300 border border-white/10 shadow-lg font-medium"
                >
                    <Download size={18} />
                    Export PDF
                </button>

                <button
                    onClick={handleMint}
                    disabled={minting}
                    className="flex-1 max-w-[280px] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl transition-all font-bold shadow-lg shadow-pink-500/25 disabled:opacity-75 disabled:cursor-not-allowed group"
                >
                    <Sparkles size={18} className="group-hover:animate-spin-slow" />
                    {minting ? 'Minting on Arc...' : 'Mint as Arc NFT'}
                </button>
            </div>

            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}

            {txHash && (
                <a
                    href={`https://testnet.arcscan.app/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/50"
                >
                    View Transaction on ArcScan
                </a>
            )}
        </div>
    );
}
