import React, { useState, useRef, useEffect } from 'react';
import { chatWithAgent } from '../services/api';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function AIChat({ profile, chartData }) {
    const [messages, setMessages] = useState([
        { role: 'ai', content: `Greetings, ${profile?.name || 'Traveler'}. I am the Astro Agent. What cosmic insights do you seek today?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatWithAgent({
                message: userMessage,
                profile,
                chartData
            });

            if (res.success) {
                setMessages(prev => [...prev, { role: 'ai', content: res.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: 'Connection to the stars was interrupted. Please try again.' }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Cosmic interference occurred.' }]);
        }
        setLoading(false);
    };

    return (
        <div className="mt-8 flex flex-col w-full max-w-lg bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden h-[500px]">
            <div className="flex items-center gap-2 bg-slate-900/50 p-4 border-b border-slate-700">
                <Sparkles className="text-purple-400" size={24} />
                <h3 className="text-xl font-bold text-white">Astro Agent</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-purple-600'}`}>
                                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
                                }`}>
                                {/* Basic markdown simulation by splitting newlines */}
                                {msg.content.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1 last:mb-0">{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[85%]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-700 flex gap-1 items-center">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-slate-900/50 border-t border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the stars..."
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-full focus:outline-none focus:border-purple-500 text-white placeholder-slate-400"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors shadow-md disabled:bg-slate-700 disabled:text-slate-500"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
