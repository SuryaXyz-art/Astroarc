import React, { useState, useEffect } from 'react';
import './index.css';
import WalletConnect from './components/WalletConnect';
import ProfileForm from './components/ProfileForm';
import BirthChart from './components/BirthChart';
import AIChat from './components/AIChat';
import Compatibility from './components/Compatibility';
import AstrologerMarket from './components/AstrologerMarket';
import PredictionMarket from './components/PredictionMarket';
import Notifications from './components/Notifications';
import { getProfile } from './services/api';
import { Home, MessageCircle, Star, Heart, Users, Activity, Bell, WalletIcon, Sparkles } from 'lucide-react';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(walletAddress);
        if (data.success && data.user) setProfile(data.user);
      } catch (e) {
        setProfile(null);
      }
    };
    if (walletAddress) fetchProfile();
  }, [walletAddress]);

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Wallet', icon: WalletIcon },
    { name: 'Birth Chart', icon: Star },
    { name: 'Compatibility', icon: Heart },
    { name: 'Astrologers', icon: Users },
    { name: 'Prediction Market', icon: Activity },
    { name: 'AI Astrology Chat', icon: MessageCircle },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="flex min-h-screen bg-cosmic-900 text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Animated Subtle Background Background in index.css */}

      {/* Sidebar Component Desktop */}
      <aside className="w-72 bg-cosmic-800/40 border-r border-white/5 flex flex-col p-6 shadow-2xl backdrop-blur-xl hidden lg:flex sticky top-0 h-screen z-20">
        <div className="flex items-center gap-3 mb-12 pt-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            AstroTalk
          </h1>
        </div>
        <nav className="flex-1 space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-medium ${isActive
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/10 text-purple-300 border border-purple-500/20 shadow-lg shadow-purple-900/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                  }`}
              >
                <Icon size={20} className={isActive ? "text-purple-400" : "text-slate-500"} />
                {item.name}
              </button>
            )
          })}
        </nav>
        <div className="pt-6 border-t border-white/5 mt-auto">
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-300 tracking-wider">ARC NETWORK</div>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-24 lg:pb-0">
        {/* Mobile Header Top */}
        <div className="lg:hidden flex items-center justify-between p-4 px-6 border-b border-white/5 glass-panel sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" size={24} />
            <h1 className="text-xl font-bold text-gradient">AstroTalk</h1>
          </div>
          {walletAddress && (
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <WalletIcon size={16} className="text-purple-300" />
            </div>
          )}
        </div>

        <div className="p-4 md:p-8 lg:p-12 w-full flex justify-center min-h-full">
          <div className="max-w-4xl w-full flex flex-col items-center animate-fadeIn relative z-10">

            <div className="w-full flex justify-center">
              {!walletAddress && activeTab !== 'Wallet' ? (
                <div className="text-center mt-12 md:mt-24 w-full max-w-md">
                  <div className="glass-card p-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-purple-900/50 flex items-center justify-center mb-6 border border-purple-500/30 shadow-xl shadow-purple-500/20 animate-float">
                      <Sparkles className="text-purple-400" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 text-white">Unlock Your Destiny</h2>
                    <p className="text-slate-400 mb-8 font-medium">Connect your web3 wallet to access cosmic insights on the Arc Network.</p>
                    <div className="w-full">
                      <WalletConnect onConnect={setWalletAddress} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  {/* Tab Title (Mobile) */}
                  <div className="lg:hidden mb-6 flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{activeTab}</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </div>

                  {/* Dynamic Component Rendering based on Tab */}
                  {activeTab === 'Wallet' && (
                    <div className="w-full max-w-lg mx-auto p-8 glass-card border border-white/10 text-center relative overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <h2 className="text-2xl font-semibold mb-8 text-white">Wallet & Profile</h2>
                      <div className="mb-6">
                        <WalletConnect onConnect={setWalletAddress} />
                      </div>
                      {walletAddress && (
                        <div className="mt-8 pt-8 border-t border-white/5 relative z-10 text-left">
                          <ProfileForm walletAddress={walletAddress} />
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Home' && walletAddress && (
                    <div className="w-full grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-3 p-8 glass-card bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                        <h2 className="text-3xl font-display font-bold mb-3 text-white">Welcome Back, <span className="text-gradient-gold">{profile?.name || 'Traveler'}</span></h2>
                        <p className="text-indigo-200/80 text-lg max-w-xl">The stars align in your favor today. Explore your cosmic blueprint on the Arc Network.</p>
                      </div>
                      <div className="md:col-span-2">
                        <Notifications />
                      </div>
                      <div className="md:col-span-1 flex flex-col gap-6">
                        {/* Daily Horoscope widget */}
                        <div className="p-6 glass-card relative overflow-hidden">
                          <div className="absolute -right-4 -top-4 text-purple-500/10 rotate-12">
                            <Star size={100} fill="currentColor" />
                          </div>
                          <div className="relative z-10">
                            <h3 className="text-lg font-bold text-pink-400 mb-3 flex items-center gap-2">
                              <Sparkles size={16} /> Daily Insight
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">Your ruling planet indicates major shifts in your personal sector. Keep an open mind and embrace the new Web3 world.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Birth Chart' && <BirthChart profile={profile} />}

                  {activeTab === 'Compatibility' && <Compatibility profile={profile} />}

                  {activeTab === 'Astrologers' && <AstrologerMarket walletAddress={walletAddress} />}

                  {activeTab === 'Prediction Market' && <PredictionMarket />}

                  {activeTab === 'AI Astrology Chat' && <AIChat profile={profile} />}

                  {activeTab === 'Notifications' && <Notifications />}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 glass-panel border-t border-white/10 z-30 pb-safe">
        <nav className="flex justify-around items-center p-2 overflow-x-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex flex-col items-center p-2 min-w-[64px] rounded-xl transition-all ${isActive ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <div className={`p-1.5 rounded-lg mb-1 ${isActive ? 'bg-purple-500/20' : ''}`}>
                  <Icon size={20} className={isActive ? 'text-purple-400' : ''} />
                </div>
                <span className="text-[10px] font-medium whitespace-nowrap">{item.name === 'AI Astrology Chat' ? 'AI Chat' : item.name.replace(' Market', '')}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  );
}

export default App;
