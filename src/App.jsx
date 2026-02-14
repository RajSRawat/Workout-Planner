import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, User, Utensils, ShoppingBag, Phone, Dumbbell } from 'lucide-react';

// Components
import DailySchedule from './components/DailySchedule';
import BodyModel from './components/BodyModel';
import CalendarView from './components/CalendarView';
import Profile from './components/Dashboard/Profile';
import DietSupplement from './components/Dashboard/DietSupplement';
import Store from './components/Dashboard/Store';
import Store from './components/Dashboard/Store';
import ExerciseLibrary from './components/Dashboard/ExerciseLibrary';
import Contacts from './components/Dashboard/Contacts';

// Data & Service
import { schedule } from './data/schedule';
import { storage } from './services/storage';

const SidebarItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-prime text-white shadow-lg shadow-prime/25' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {isActive && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />}
    </Link>
  );
};

const Sidebar = () => (
  <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col h-full z-20">
    <div className="flex items-center gap-3 mb-10 px-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-prime to-sec flex items-center justify-center shadow-lg shadow-prime/20">
        <Dumbbell className="text-white" size={20} />
      </div>
      <div>
        <h1 className="font-bold text-lg tracking-wide">AESTHETIC</h1>
        <p className="text-xs text-prime tracking-[0.2em] font-semibold">GAINS</p>
      </div>
    </div>

    <nav className="space-y-2 flex-1">
      <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
      <SidebarItem to="/calendar" icon={Calendar} label="Calendar" />
      <SidebarItem to="/profile" icon={User} label="Profile & Injuries" />
      <SidebarItem to="/diet" icon={Utensils} label="Diet & Supps" />
      <SidebarItem to="/exercises" icon={Dumbbell} label="Exercises" />
      <SidebarItem to="/store" icon={ShoppingBag} label="Store" />
      <SidebarItem to="/contacts" icon={Phone} label="Contacts & SOS" />
    </nav>

    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
      <p className="text-xs text-gray-500 mb-2">Pro Member</p>
      <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
        <div className="bg-prime w-3/4 h-full"></div>
      </div>
    </div>
  </div>
);

// Dashboard Home Component
const DashboardHome = () => {
  const [selectedDay, setSelectedDay] = useState(schedule[0]);
  const [highlightedMuscles, setHighlightedMuscles] = useState([]);
  const [view, setView] = useState('schedule'); // 'schedule' or 'calendar'
  const [history, setHistory] = useState(storage.getHistory());
  // Refresh history when view changes
  useEffect(() => { if (view === 'calendar') setHistory(storage.getHistory()); }, [view]);

  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todaySchedule = schedule.find(d => d.day === today);
    if (todaySchedule) setSelectedDay(todaySchedule);
  }, []);

  useEffect(() => {
    if (selectedDay) {
      const muscles = new Set();
      selectedDay.exercises.forEach(ex => ex.muscles.forEach(m => muscles.add(m)));
      setHighlightedMuscles(Array.from(muscles));
    } else {
      setHighlightedMuscles([]);
    }
  }, [selectedDay]);

  return (
    <div className="flex h-full">
      {/* Left: Sidebar Panel */}
      <div className="w-1/3 min-w-[400px] p-6 h-full overflow-hidden flex flex-col gap-6">
        <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex-1 overflow-hidden flex flex-col">
          {/* View Toggles */}
          <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-lg">
            <button
              onClick={() => setView('schedule')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${view === 'schedule' ? 'bg-prime text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Today's Plan
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${view === 'calendar' ? 'bg-prime text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              History & Stats
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {view === 'schedule' ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                <DailySchedule onMuscleSelect={setHighlightedMuscles} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                <CalendarView history={history} onSelectDate={() => { }} selectedDate={new Date()} />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Right: 3D Model */}
      <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black/50 to-black rounded-3xl m-4 border border-white/5 overflow-hidden">
        <BodyModel highlightedMuscles={highlightedMuscles} />
        <div className="absolute bottom-6 right-6 text-right">
          <h2 className="text-4xl font-bold text-white/10 uppercase tracking-widest pointer-events-none">
            {view === 'schedule' ? (selectedDay?.focus || "Rest Day") : "Analytics"}
          </h2>
        </div>
      </div>
    </div>
  );
}

const CalendarPage = () => {
  const [history, setHistory] = useState(storage.getHistory());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // In a real app, clicking a date would show details
  // For now, it just selects the date visually

  return (
    <div className="p-8 h-full">
      <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-prime to-sec">Workout History</h2>
      <div className="max-w-4xl mx-auto">
        <CalendarView history={history} onSelectDate={setSelectedDate} selectedDate={selectedDate} />

        <div className="mt-8 bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-4">Log Workout</h3>
          <p className="text-gray-400 text-sm mb-4">Mark today's workout as complete to keep your streak!</p>
          <button
            onClick={() => {
              const dateStr = selectedDate.toISOString().split('T')[0];
              storage.logWorkout(dateStr, { completed: true, type: 'Full Body' });
              setHistory(storage.getHistory());
            }}
            className="bg-prime hover:bg-prime/80 px-6 py-2 rounded-lg font-medium transition"
          >
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#0f0f1a] text-white font-sans overflow-hidden selection:bg-prime selection:text-white">
        <Sidebar />
        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/diet" element={<DietSupplement />} />
              <Route path="/store" element={<Store />} />
              <Route path="/exercises" element={<ExerciseLibrary />} />
              <Route path="/contacts" element={<Contacts />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
