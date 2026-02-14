import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Flame, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { schedule as scheduleData } from '../data/schedule';
import { storage } from '../services/storage';

const DailySchedule = ({ onMuscleSelect }) => {
    const [completed, setCompleted] = useState(false);
    const [CaloriesBurned, setCaloriesBurned] = useState(0);
    const [user, setUser] = useState(storage.getUser());

    const today = new Date();
    const dayName = format(today, 'EEEE');
    const todayWorkout = scheduleData.find(d => d.day === dayName);

    useEffect(() => {
        const history = storage.getHistory();
        const dateKey = format(today, 'yyyy-MM-dd');
        if (history[dateKey] && history[dateKey].completed) {
            setCompleted(true);
            setCaloriesBurned(history[dateKey].caloriesBurned || 0);
        }

        // Highlight muscles for today
        if (todayWorkout) {
            onMuscleSelect(todayWorkout.muscles);
        }
    }, [dayName]);

    const toggleComplete = () => {
        const dateKey = format(today, 'yyyy-MM-dd');
        const isNowCompleted = !completed;
        setCompleted(isNowCompleted);

        // Estimate calories (Example: 400 per workout)
        const burned = isNowCompleted ? 450 : 0;
        setCaloriesBurned(burned);

        storage.logWorkout(dateKey, {
            completed: isNowCompleted,
            caloriesBurned: burned
        });
    };

    if (!todayWorkout) return <div className="text-white">Rest Day</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">{todayWorkout.focus}</h2>
                    <p className="text-gray-400">{dayName}'s Plan</p>
                </div>

                {/* Pro Feature: Real-time Analytics? */}
                {user.isPro ? (
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 px-3 py-1 rounded-full text-xs font-bold text-white border border-yellow-400/50 flex items-center gap-1">
                        <Flame size={12} /> PRO ANALYTICS
                    </div>
                ) : (
                    <div className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-400 flex items-center gap-1">
                        <Lock size={12} /> Standard
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {todayWorkout.exercises.map((ex, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-prime/50 transition group cursor-pointer"
                        onMouseEnter={() => onMuscleSelect(ex.target ? [ex.target] : [])}
                        onMouseLeave={() => onMuscleSelect(todayWorkout.muscles)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-white group-hover:text-prime transition">{ex.name}</h3>
                            <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">{ex.sets} x {ex.reps}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
                <button
                    onClick={toggleComplete}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${completed
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-prime hover:bg-prime/80 text-white'
                        }`}
                >
                    {completed ? <CheckCircle /> : <Circle />}
                    {completed ? 'Workout Completed' : 'Mark as Complete'}
                </button>

                {completed && (
                    <div className="mt-4 flex justify-center items-center gap-2 text-orange-400 animate-pulse">
                        <Flame size={20} />
                        <span className="font-bold">{CaloriesBurned} kcal Burned</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailySchedule;
