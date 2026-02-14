import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, PieChart, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { storage } from '../../services/storage';

const MacroBar = ({ label, current, target, color }) => {
    const percent = Math.min((current / target) * 100, 100);
    return (
        <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{label}</span>
                <span className="text-gray-400">{current} / {target}g</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

const DietSupplement = () => {
    const [diet, setDiet] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [user, setUser] = useState(storage.getUser());
    const [stack, setStack] = useState([]);

    // Input states
    const [input, setInput] = useState({ calories: '', protein: '', carbs: '', fats: '' });
    const [newSupp, setNewSupp] = useState({ name: '', dosage: '', time: 'Morning' });

    const today = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        const d = storage.getDiet();
        setDiet(d[today] || { calories: 0, protein: 0, carbs: 0, fats: 0 });
        const u = storage.getUser();
        setUser(u);
        setStack(u.stack || []);
    }, [today]);

    const addMeal = () => {
        const mealData = {
            calories: parseInt(input.calories) || 0,
            protein: parseInt(input.protein) || 0,
            carbs: parseInt(input.carbs) || 0,
            fats: parseInt(input.fats) || 0
        };
        storage.logDiet(today, mealData);

        // Update local state immediately
        setDiet(prev => ({
            calories: prev.calories + mealData.calories,
            protein: prev.protein + mealData.protein,
            carbs: prev.carbs + mealData.carbs,
            fats: prev.fats + mealData.fats
        }));
        setInput({ calories: '', protein: '', carbs: '', fats: '' });
    };

    const addSupplement = () => {
        if (!newSupp.name) return;
        const updatedStack = [...stack, { ...newSupp, id: Date.now() }];
        setStack(updatedStack);

        const updatedUser = { ...user, stack: updatedStack };
        storage.saveUser(updatedUser);
        setUser(updatedUser);
        setNewSupp({ name: '', dosage: '', time: 'Morning' });
    };

    const removeSupplement = (id) => {
        const updatedStack = stack.filter(s => s.id !== id);
        setStack(updatedStack);
        const updatedUser = { ...user, stack: updatedStack };
        storage.saveUser(updatedUser);
        setUser(updatedUser);
    };

    return (
        <div className="space-y-6 text-white p-4 h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <PieChart className="text-prime" /> Nutrition & Stack
            </h2>

            {/* Macro Tracker */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="font-semibold mb-4 text-lg">Daily Macros</h3>

                <MacroBar label="Protein" current={diet.protein} target={user.targets?.protein || 150} color="bg-blue-500" />
                <MacroBar label="Carbs" current={diet.carbs} target={user.targets?.carbs || 300} color="bg-green-500" />
                <MacroBar label="Fats" current={diet.fats} target={user.targets?.fats || 70} color="bg-yellow-500" />

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Energy</span>
                    <span className="text-xl font-bold">{diet.calories} / {user.targets?.calories || 2500} <span className="text-xs text-gray-500">kcal</span></span>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                    <input
                        type="number" placeholder="Kcal"
                        className="bg-black/40 rounded p-2 text-xs border border-white/10"
                        value={input.calories} onChange={e => setInput({ ...input, calories: e.target.value })}
                    />
                    <input
                        type="number" placeholder="Prot (g)"
                        className="bg-black/40 rounded p-2 text-xs border border-white/10"
                        value={input.protein} onChange={e => setInput({ ...input, protein: e.target.value })}
                    />
                    <input
                        type="number" placeholder="Carb (g)"
                        className="bg-black/40 rounded p-2 text-xs border border-white/10"
                        value={input.carbs} onChange={e => setInput({ ...input, carbs: e.target.value })}
                    />
                    <input
                        type="number" placeholder="Fat (g)"
                        className="bg-black/40 rounded p-2 text-xs border border-white/10"
                        value={input.fats} onChange={e => setInput({ ...input, fats: e.target.value })}
                    />
                </div>
                <button onClick={addMeal} className="w-full mt-2 bg-prime/20 hover:bg-prime/30 text-prime py-2 rounded text-sm transition">
                    + Log Meal
                </button>
            </div>

            {/* Supplement Stack */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                    <Activity size={18} className="text-orange-500" /> My Stack
                </h3>

                <div className="space-y-2 mb-4">
                    {stack.length === 0 ? <p className="text-gray-500 text-sm italic">Stack is empty.</p> :
                        stack.map((supp) => (
                            <motion.div
                                key={supp.id}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5"
                            >
                                <div>
                                    <p className="font-medium text-sm text-white">{supp.name}</p>
                                    <p className="text-xs text-gray-500">{supp.dosage} • {supp.time}</p>
                                </div>
                                <button onClick={() => removeSupplement(supp.id)} className="text-red-400 hover:text-red-300 p-1">
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))
                    }
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <input
                        type="text" placeholder="Name (e.g. Creatine)"
                        className="bg-black/40 rounded p-2 text-xs border border-white/10 col-span-3"
                        value={newSupp.name} onChange={e => setNewSupp({ ...newSupp, name: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Dosage (5g)"
                        className="bg-black/40 rounded p-2 text-xs border border-white/10"
                        value={newSupp.dosage} onChange={e => setNewSupp({ ...newSupp, dosage: e.target.value })}
                    />
                    <select
                        className="bg-black/40 rounded p-2 text-xs border border-white/10 col-span-2"
                        value={newSupp.time} onChange={e => setNewSupp({ ...newSupp, time: e.target.value })}
                    >
                        <option>Morning</option>
                        <option>Pre-Workout</option>
                        <option>Intra-Workout</option>
                        <option>Post-Workout</option>
                        <option>Bedtime</option>
                    </select>
                </div>
                <button onClick={addSupplement} className="w-full mt-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 py-2 rounded text-sm transition">
                    + Add to Stack
                </button>
            </div>
        </div>
    );
};

export default DietSupplement;
