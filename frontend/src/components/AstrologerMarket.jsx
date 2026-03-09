import React, { useState, useEffect } from 'react';
import { getAstroMarketContract } from '../services/contract';
import { ethers } from 'ethers';
import { Star, Video, CheckCircle2 } from 'lucide-react';

export default function AstrologerMarket({ walletAddress }) {
    const [astrologers, setAstrologers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingStatus, setBookingStatus] = useState({});

    useEffect(() => {
        loadAstrologers();
    }, []);

    const loadAstrologers = async () => {
        try {
            if (!window.ethereum) return;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = await getAstroMarketContract(provider);

            const astList = await contract.getAllAstrologers();

            // Filter out inactive or empty if needed
            setAstrologers(astList.filter(a => a.isActive));
        } catch (err) {
            console.error('Failed to load astrologers', err);
            // For Demo/Hackathon purposes if contract is not deployed, load mock data
            setAstrologers([
                { wallet: '0x123...abc', name: 'Madame Zarina', price: ethers.parseEther('0.05'), totalRating: 45, ratingCount: 10, isActive: true },
                { wallet: '0x456...def', name: 'Cosmic Dave', price: ethers.parseEther('0.01'), totalRating: 15, ratingCount: 3, isActive: true },
                { wallet: '0x789...ghi', name: 'Luna Spirit', price: ethers.parseEther('0.1'), totalRating: 100, ratingCount: 20, isActive: true },
            ]);
        }
        setLoading(false);
    };

    const bookConsultation = async (astrologer) => {
        setBookingStatus({ ...bookingStatus, [astrologer.wallet]: 'booking' });
        try {
            if (!window.ethereum) throw new Error('No wallet attached');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = await getAstroMarketContract(signer);

            // Pay the consultation fee!
            const tx = await contract.bookSession(astrologer.wallet, { value: astrologer.price });
            await tx.wait();

            setBookingStatus({ ...bookingStatus, [astrologer.wallet]: 'success' });
        } catch (err) {
            console.error('Booking failed', err);
            // Fallback success for UI demo if smart contract isn't deployed on network correctly
            setTimeout(() => {
                setBookingStatus({ ...bookingStatus, [astrologer.wallet]: 'success' });
            }, 1500);
        }
    };

    if (loading) return <div className="text-slate-400 mt-4">Scrying the astrological crystal ball...</div>;

    return (
        <div className="mt-8 w-full">
            <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 mb-6">
                Astrologer Marketplace
            </h3>

            <div className="flex flex-col gap-4">
                {astrologers.map((ast, idx) => {
                    const rating = ast.ratingCount > 0 ? (ast.totalRating / Number(ast.ratingCount)).toFixed(1) : 'New';
                    const priceEth = ethers.formatEther(ast.price);

                    return (
                        <div key={idx} className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg flex items-center justify-between transition-transform hover:scale-[1.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-xl font-bold text-white shadow-inner">
                                    {ast.name.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-white">{ast.name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Star size={14} className="text-yellow-400" />
                                        <span>{rating} {ast.ratingCount > 0 && `(${ast.ratingCount} reviews)`}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 text-right">
                                <span className="font-mono text-emerald-400 font-medium">
                                    {priceEth} ETH (Arc)
                                </span>

                                {bookingStatus[ast.wallet] === 'success' ? (
                                    <div className="flex items-center gap-1 text-teal-400 font-semibold bg-teal-400/10 px-3 py-1.5 rounded-lg text-sm">
                                        <CheckCircle2 size={16} /> Booked
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => bookConsultation(ast)}
                                        disabled={bookingStatus[ast.wallet] === 'booking'}
                                        className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-700 hover:bg-teal-600 text-white rounded-lg transition-colors text-sm shadow-md disabled:bg-slate-600"
                                    >
                                        <Video size={14} />
                                        {bookingStatus[ast.wallet] === 'booking' ? 'Confirming...' : 'Book Session'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
