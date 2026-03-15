import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, ChevronRight } from 'lucide-react';

export const AuthOverlay = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        try {
            const res = await fetch(`http://localhost:5001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                if (isLogin) {
                    onLogin(data);
                } else {
                    setIsLogin(true);
                    setError('Registration successful! Please login.');
                }
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Backend connection failed. Is the Python server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
            <div className="scanline pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-black border border-terminal-bright/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,255,65,0.1)] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldCheck size={120} />
                </div>

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-terminal-bright/20 rounded-xl">
                        <Lock className="text-terminal-bright w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter text-white">SYSTEM_ACCESS</h1>
                        <p className="text-[10px] text-terminal-bright/60 uppercase font-mono tracking-widest">
                            {isLogin ? 'Authorization Required' : 'Create New Credential'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-mono focus:border-terminal-bright/50 focus:bg-white/10 transition-all outline-none"
                                placeholder="ENT_USER_ID"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Secure Token</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-mono focus:border-terminal-bright/50 focus:bg-white/10 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            ERROR: {error}
                        </motion.div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-terminal-bright text-black font-black uppercase py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Initialize Session' : 'Create Account')}
                        {!loading && <ChevronRight size={18} />}
                    </button>
                </form>

                <div className="mt-10 pt-10 border-t border-white/5 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[10px] font-black uppercase tracking-tighter text-white/40 hover:text-terminal-bright transition-colors"
                    >
                        {isLogin ? "Request New Credential Node" : "Existing Access? Return to Gate"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
