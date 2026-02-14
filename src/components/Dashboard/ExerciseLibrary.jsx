import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Dumbbell, ChevronRight } from 'lucide-react';
import { exerciseLibrary } from '../data/exercises';

const ExerciseLibrary = () => {
    const [selectedMuscle, setSelectedMuscle] = useState('chest');
    const [search, setSearch] = useState('');

    const muscles = Object.keys(exerciseLibrary);

    const filteredExercises = exerciseLibrary[selectedMuscle].filter(ex =>
        ex.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col p-6 text-white overflow-hidden">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Dumbbell className="text-prime" /> Exercise Library
            </h2>

            {/* Muscle Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto custom-scrollbar pb-2">
                {muscles.map(m => (
                    <button
                        key={m}
                        onClick={() => setSelectedMuscle(m)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition ${selectedMuscle === m
                                ? 'bg-prime text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder={`Search ${selectedMuscle} exercises...`}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-prime"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {filteredExercises.map((ex, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-prime/30 transition flex justify-between items-center group"
                    >
                        <div>
                            <h3 className="font-bold text-lg group-hover:text-prime transition">{ex.name}</h3>
                            <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-black/30 px-2 py-0.5 rounded text-gray-400">{ex.type}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${ex.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                                        ex.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                    }`}>
                                    {ex.difficulty}
                                </span>
                            </div>
                        </div>
                        <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition">
                            <ChevronRight className="text-gray-400" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseLibrary;
