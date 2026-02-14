import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { User, Activity, AlertTriangle, Save, ExternalLink, Zap, Crown, TrendingUp, Shield, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const [user, setUser] = useState(storage.getUser());
    const [editMode, setEditMode] = useState(false);
    const [newInjury, setNewInjury] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const handleSave = () => {
        storage.saveUser(user);
        setEditMode(false);
    };

    const addInjury = () => {
        if (newInjury.trim()) {
            setUser({ ...user, injuries: [...user.injuries, newInjury] });
            setNewInjury('');
        }
    };

    const removeInjury = (index) => {
        const updated = user.injuries.filter((_, i) => i !== index);
        setUser({ ...user, injuries: updated });
    };

    const activatePro = () => {
        setShowConfetti(true);
        setTimeout(() => {
            setUser({ ...user, isPro: true });
            storage.saveUser({ ...user, isPro: true });
            setShowConfetti(false);
        }, 1500);
    };

    return (
        <div className="space-y-6 text-white p-6 h-full overflow-y-auto custom-scrollbar relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-prime to-sec">
                        {user.isPro ? 'Elite Dashboard' : 'Member Profile'}
                    </h2>
                    {user.isPro && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mt-2"
                        >
                            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/50 font-bold tracking-widest uppercase flex items-center gap-1">
                                <Crown size={12} /> Pro Athlete
                            </span>
                            <span className="text-xs text-gray-500">ID: #8829-PRO</span>
                        </motion.div>
                    )}
                </div>
                <button
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-prime/20 hover:bg-prime/30 border border-prime/50 rounded-lg transition"
                >
                    {editMode ? <Save size={18} /> : <User size={18} />}
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            {/* --- PRO SECTION --- */}
            <AnimatePresence mode="wait">
                {!user.isPro ? (
                    /* SALES CARD */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-gray-900 to-black p-1 rounded-2xl border border-yellow-500/30 shadow-2xl relative overflow-hidden group"
                    >
                        {/* Animated border glowing effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition duration-1000 animate-pulse pointer-events-none" />

                        <div className="bg-[#0f0f10] rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                            <div className="space-y-4 max-w-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
                                        <Crown size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Unlock Elite Performance</h3>
                                        <p className="text-yellow-500/80 font-medium">Become a Pro Member today</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-gray-400">
                                    <li className="flex items-center gap-2"><Zap size={16} className="text-yellow-500" /> Advanced 3D Body Analysis</li>
                                    <li className="flex items-center gap-2"><Activity size={16} className="text-yellow-500" /> Real-time Recovery Tracking</li>
                                    <li className="flex items-center gap-2"><BarChart2 size={16} className="text-yellow-500" /> Muscle Balance Radar Charts</li>
                                </ul>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <div className="text-center">
                                    <span className="text-3xl font-bold text-white">$9.99</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                                {showConfetti ? (
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} className="text-yellow-400 font-bold">Unlocking...</motion.div>
                                ) : (
                                    <button
                                        onClick={activatePro}
                                        className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition transform hover:scale-105"
                                    >
                                        ACTIVATE NOW
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* PRO DASHBOARD */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* 1. Muscle Balance Radar (Simulated) */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-prime" /> Muscle Balance</h4>
                            <div className="aspect-square relative flex items-center justify-center">
                                {/* Simulated Radar Chart Visual using CSS/Divs for simplicity */}
                                <div className="w-3/4 h-3/4 border border-white/10 rounded-full absolute" />
                                <div className="w-1/2 h-1/2 border border-white/10 rounded-full absolute" />
                                <div className="w-full h-px bg-white/10 absolute rotate-0" />
                                <div className="w-full h-px bg-white/10 absolute rotate-60" />
                                <div className="w-full h-px bg-white/10 absolute rotate-120" />

                                {/* The "Chart" Polygon */}
                                <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 absolute drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                                    <polygon points="50,10 90,40 80,80 20,80 10,40" fill="rgba(139,92,246,0.3)" stroke="#8b5cf6" strokeWidth="2" />
                                </svg>
                                <div className="absolute font-xs text-gray-500 transform -translate-y-16">Upper</div>
                                <div className="absolute font-xs text-gray-500 transform translate-y-16">Lower</div>
                                <div className="absolute font-xs text-gray-500 transform translate-x-16">Core</div>
                                <div className="absolute font-xs text-gray-500 transform -translate-x-16">Cardio</div>
                            </div>
                            <div className="text-center mt-2 text-sm text-green-400">Excellent Symmetry</div>
                        </div>

                        {/* 2. Recovery Gauge */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative">
                            <div className="absolute top-4 right-4 text-green-500"><Shield size={20} /></div>
                            <h4 className="text-lg font-bold mb-6 self-start">Recovery Status</h4>

                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                                    <circle cx="64" cy="64" r="56" stroke="#4ade80" strokeWidth="12" fill="none" strokeDasharray="351" strokeDashoffset="70" strokeLinecap="round" />
                                </svg>
                                <div className="absolute text-3xl font-bold">85%</div>
                            </div>
                            <p className="mt-4 text-gray-400 text-sm text-center">Ready for High Intensity</p>
                        </div>

                        {/* 3. Weekly Focus */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                            <div>
                                <h4 className="text-lg font-bold mb-2">Weekly Focus</h4>
                                <p className="text-sm text-gray-400">Based on your recent history</p>
                            </div>

                            <div className="space-y-4 my-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Strength</span>
                                        <span className="text-prime">Top 5%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-prime w-[85%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Endurance</span>
                                        <span className="text-gray-400">Avg</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[50%]" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-prime/10 p-3 rounded-lg border border-prime/20 text-xs text-prime flex gap-2">
                                <TrendingUp size={16} />
                                <span>Suggestion: Increase cardio duration by 10 mins.</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Stats */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Activity className="text-sec" /> Physical Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-400">Name</span>
                            {editMode ? <input className="bg-black/40 p-1 rounded text-right border border-white/20 text-white" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} /> : <span>{user.name}</span>}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-400">Age</span>
                            {editMode ? <input type="number" className="bg-black/40 p-1 rounded text-right w-20 border border-white/20 text-white" value={user.age} onChange={e => setUser({ ...user, age: parseInt(e.target.value) })} /> : <span>{user.age}</span>}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-400">Height (cm)</span>
                            {editMode ? <input type="number" className="bg-black/40 p-1 rounded text-right w-20 border border-white/20 text-white" value={user.height} onChange={e => setUser({ ...user, height: parseInt(e.target.value) })} /> : <span>{user.height} cm</span>}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-400">Weight (kg)</span>
                            {editMode ? <input type="number" className="bg-black/40 p-1 rounded text-right w-20 border border-white/20 text-white" value={user.weight} onChange={e => setUser({ ...user, weight: parseInt(e.target.value) })} /> : <span>{user.weight} kg</span>}
                        </div>
                    </div>
                </div>

                {/* Avatar Settings */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><User className="text-blue-400" /> Digital Avatar</h3>
                    <p className="text-sm text-gray-400 mb-4">Link your Ready Player Me avatar to see yourself in the app.</p>
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 block mb-1">Avatar URL (.glb)</label>
                        {editMode ? (
                            <input
                                type="text"
                                className="w-full bg-black/40 p-2 rounded border border-white/10 text-xs font-mono text-blue-200"
                                value={user.avatarUrl || ''}
                                onChange={e => setUser({ ...user, avatarUrl: e.target.value })}
                                placeholder="https://models.readyplayer.me/..."
                            />
                        ) : (
                            <div className="bg-black/20 p-2 rounded text-xs font-mono text-gray-400 truncate">
                                {user.avatarUrl || 'No avatar linked'}
                            </div>
                        )}
                    </div>
                    <a href="https://readyplayer.me" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-prime hover:text-white transition">
                        Create new avatar <ExternalLink size={14} />
                    </a>
                </div>

                {/* Injury Tracker */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm md:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="text-red-400" /> Injury Tracker</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.injuries.length === 0 ? <p className="text-gray-500 italic">No active injuries reported.</p> :
                            user.injuries.map((injury, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-red-200">
                                    <span>{injury}</span>
                                    {editMode && <button onClick={() => removeInjury(idx)} className="text-red-400 hover:text-white">×</button>}
                                </div>
                            ))
                        }
                    </div>
                    {editMode && (
                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                placeholder="Add new injury (e.g., 'Right Knee')..."
                                className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-prime text-white"
                                value={newInjury}
                                onChange={e => setNewInjury(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addInjury()}
                            />
                            <button onClick={addInjury} className="bg-prime hover:bg-prime/80 px-4 rounded text-sm transition font-medium">Add</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
