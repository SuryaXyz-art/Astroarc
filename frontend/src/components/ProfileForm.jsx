import React, { useState, useEffect } from 'react';
import { saveProfile, getProfile } from '../services/api';

export default function ProfileForm({ walletAddress }) {
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        birthTime: '',
        birthLocation: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile(walletAddress);
                if (data.success && data.user) {
                    setFormData({
                        name: data.user.name || '',
                        birthDate: data.user.birthDate || '',
                        birthTime: data.user.birthTime || '',
                        birthLocation: data.user.birthLocation || ''
                    });
                }
            } catch (err) {
                console.error('No existing profile found');
            }
            setLoading(false);
        };
        if (walletAddress) fetchProfile();
    }, [walletAddress]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await saveProfile({ walletAddress, ...formData });
            setMessage('Profile saved successfully!');
        } catch (err) {
            setMessage('Failed to save profile.');
        }
        setSaving(false);
    };

    if (loading) return <div className="text-slate-400">Loading profile...</div>;

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    placeholder="Cosmic Voyager" required
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-300 mb-1">Birth Date</label>
                    <input
                        type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-300 mb-1">Birth Time</label>
                    <input
                        type="time" name="birthTime" value={formData.birthTime} onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Birth Location</label>
                <input
                    type="text" name="birthLocation" value={formData.birthLocation} onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    placeholder="City, Country" required
                />
            </div>
            <button
                type="submit" disabled={saving}
                className="mt-2 w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-colors shadow-md font-semibold"
            >
                {saving ? 'Saving...' : 'Save Astro Profile'}
            </button>
            {message && <p className="text-sm mt-2 text-center text-green-400">{message}</p>}
        </form>
    );
}
