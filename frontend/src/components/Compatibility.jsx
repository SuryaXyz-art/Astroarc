import React, { useState } from 'react';
import { analyzeCompatibility } from '../services/api';
import { Heart, Sparkles } from 'lucide-react';

export default function Compatibility({ profile }) {
    const [partnerDetails, setPartnerDetails] = useState({ name: '', birthDate: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!profile) return alert('Please save your Astro Profile first!');
        setLoading(true);

        try {
            const res = await analyzeCompatibility(profile, partnerDetails);
            if (res.success) {
                setResult(res.compatibility);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="mt-8 flex flex-col items-center w-full">
            <div className="w-full bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl text-center relative overflow-hidden">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500 mb-6">
                    Cosmic Compatibility
                </h3>

                {!result ? (
                    <form onSubmit={handleAnalyze} className="flex flex-col gap-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Partner's Name</label>
                            <input
                                type="text"
                                required
                                value={partnerDetails.name}
                                onChange={e => setPartnerDetails({ ...partnerDetails, name: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-red-400 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Partner's Date of Birth</label>
                            <input
                                type="date"
                                required
                                value={partnerDetails.birthDate}
                                onChange={e => setPartnerDetails({ ...partnerDetails, birthDate: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-red-400 text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all shadow-md font-bold"
                        >
                            <Heart size={20} className={loading ? 'animate-pulse' : ''} />
                            {loading ? 'Analyzing...' : 'Check Compatibility'}
                        </button>
                    </form>
                ) : (
                    <div className="animate-fadeIn">
                        <div className="flex justify-center items-center gap-6 mb-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-400">{profile.name}</p>
                                <p className="text-xl font-bold text-pink-400">{result.signA}</p>
                            </div>
                            <Sparkles className="text-yellow-400" size={24} />
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-400">{partnerDetails.name}</p>
                                <p className="text-xl font-bold text-red-500">{result.signB}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
                                <p className="text-sm text-slate-400 mb-1">Love Score</p>
                                <p className="text-3xl font-bold text-red-400">{result.loveScore}%</p>
                            </div>
                            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
                                <p className="text-sm text-slate-400 mb-1">Marriage Score</p>
                                <p className="text-3xl font-bold text-pink-400">{result.marriageScore}%</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300 text-left border border-slate-700">
                            <p className="mb-2 font-semibold text-slate-200">Cosmic Analysis</p>
                            <p className="italic leading-relaxed">"{result.analysisText}"</p>
                        </div>

                        <button
                            onClick={() => setResult(null)}
                            className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-slate-600 text-sm"
                        >
                            Analyze Another Connection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
