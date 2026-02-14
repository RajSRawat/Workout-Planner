import React, { useState, useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfYear,
    endOfYear,
    isWithinInterval,
    parseISO
} from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Dumbbell, BarChart3, Calendar as CalIcon, Flame, Activity } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const CalendarView = ({ history, onSelectDate, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState('month'); // 'week', 'month', 'year'

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // --- ANALYTICS LOGIC ---
    const stats = useMemo(() => {
        const now = new Date();
        let start, end;

        if (viewMode === 'week') {
            start = startOfWeek(now);
            end = endOfWeek(now);
        } else if (viewMode === 'month') {
            start = startOfMonth(currentMonth);
            end = endOfMonth(currentMonth);
        } else {
            start = startOfYear(currentMonth);
            end = endOfYear(currentMonth);
        }

        let totalWorkouts = 0;
        let totalCalories = 0;
        let streak = 0; // Simplified streak for this period

        Object.keys(history).forEach(dateStr => {
            const date = parseISO(dateStr);
            if (isWithinInterval(date, { start, end })) {
                if (history[dateStr].completed) {
                    totalWorkouts++;
                    totalCalories += (history[dateStr].caloriesBurned || 0);
                }
            }
        });

        return { totalWorkouts, totalCalories };
    }, [history, viewMode, currentMonth]);

    return (
        <div className="space-y-6 h-full overflow-y-auto custom-scrollbar p-1">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-prime/20 rounded-xl text-prime">
                        <CalIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Progress Tracker</h2>
                        <p className="text-sm text-gray-400">Track your consistency over time</p>
                    </div>
                </div>

                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                    {['week', 'month', 'year'].map(mode => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-4 py-1.5 rounded-md text-sm capitalize transition ${viewMode === mode ? 'bg-prime text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label={`${viewMode}ly Workouts`}
                    value={stats.totalWorkouts}
                    icon={Dumbbell}
                    color="blue"
                />
                <StatCard
                    label="Calories Burned"
                    value={stats.totalCalories.toLocaleString()}
                    icon={Flame}
                    color="orange"
                />
                <StatCard
                    label="Consistency Score"
                    value={`${stats.totalWorkouts > 0 ? 'High' : 'Low'}`}
                    icon={Activity}
                    color="green"
                />
            </div>

            {/* Calendar Grid (Only visible in Month view for now, could expand) */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-prime to-sec">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex space-x-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4 text-gray-500 font-medium uppercase tracking-wider">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-3">
                    {days.map((day, dayIdx) => {
                        const formattedDate = format(day, 'yyyy-MM-dd');
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const dayData = history[formattedDate];
                        const hasWorkout = !!dayData;

                        return (
                            <motion.div
                                key={day.toString()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelectDate(day)}
                                className={`
                                    aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer relative border transition-all duration-200 group
                                    ${!isCurrentMonth ? 'opacity-0 pointer-events-none' :
                                        isSelected ? 'bg-prime text-white border-prime shadow-[0_0_15px_rgba(139,92,246,0.5)]' :
                                            'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10 hover:border-white/20'}
                                `}
                            >
                                <span className="text-sm font-semibold">{format(day, 'd')}</span>
                                {hasWorkout && (
                                    <div className="absolute bottom-2 w-full flex justify-center">
                                        {dayData.completed ?
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.8)]" /> :
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                        }
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
