import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, AlertTriangle, TrendingUp, Heart } from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        // Mocking AI-detected planetary events
        const initialAlerts = [
            { id: 1, type: 'warning', icon: AlertTriangle, color: 'text-orange-400', title: 'Mercury Retrograde Warning', time: '1h ago', message: 'Avoid signing major smart contracts for the next 48 hours.' },
            { id: 2, type: 'finance', icon: TrendingUp, color: 'text-emerald-400', title: 'Good Investment Period', time: '5h ago', message: 'Jupiter enters your 2nd house of wealth. Favorable energy for Arc Network staking.' },
            { id: 3, type: 'love', icon: Heart, color: 'text-pink-400', title: 'Relationship Alert', time: '1d ago', message: 'Venus aligns with Mars. Check compatibility with new connections today.' },
            { id: 4, type: 'luck', icon: Sparkles, color: 'text-yellow-400', title: 'Lucky Day Notification', time: '2d ago', message: 'The Moon sextiles the Sun. High intuition for Prediction Markets.' }
        ];
        setNotifications(initialAlerts);
        setUnread(initialAlerts.length);
    }, []);

    return (
        <div className="w-full bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl overflow-hidden mt-8">
            <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bell className="text-purple-400" size={20} />
                    <h3 className="text-lg font-bold text-white">Cosmic Alerts</h3>
                </div>
                {unread > 0 && (
                    <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unread} New
                    </span>
                )}
            </div>

            <div className="divide-y divide-slate-700 max-h-[300px] overflow-y-auto">
                {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                        <div key={n.id} className="p-4 hover:bg-slate-700/50 transition-colors flex gap-4 cursor-pointer" onClick={() => setUnread(Math.max(0, unread - 1))}>
                            <div className={`mt-1 bg-slate-800 p-2 rounded-full border border-slate-600 ${n.color}`}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-slate-200 text-sm">{n.title}</h4>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{n.time}</span>
                                </div>
                                <p className="text-sm text-slate-400 leading-snug">{n.message}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
