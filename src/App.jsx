import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, User, Utensils, ShoppingBag, Phone, Dumbbell, Menu, X } from 'lucide-react';

// Components
import DailySchedule from './components/DailySchedule';
import BodyModel from './components/BodyModel';
import CalendarView from './components/CalendarView';
import Profile from './components/Dashboard/Profile';
import DietSupplement from './components/Dashboard/DietSupplement';
import Store from './components/Dashboard/Store';
import ExerciseLibrary from './components/Dashboard/ExerciseLibrary';
import Contacts from './components/Dashboard/Contacts';

// Data & Service
import { schedule } from './data/schedule';
import { storage } from './services/storage';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-prime text-white shadow-lg shadow-prime/25' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {isActive && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />}
    </Link>
  );
};

const Sidebar = ({ onClose }) => (
  <div className="w-64 bg-[#0f0f1a]/95 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col h-full z-20 relative">
    <div className="flex items-center justify-between mb-10 px-2 mt-8 md:mt-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-prime to-sec flex items-center justify-center shadow-lg shadow-prime/20">
          <Dumbbell className="text-white" size={20} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">AESTHETIC</h1>
          <p className="text-xs text-prime tracking-[0.2em] font-semibold">GAINS</p>
        </div>
      </div>
      {/* Mobile Close Button */}
      <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:text-white">
        <X size={24} />
      </button>
    </div>

    <nav className="space-y-2 flex-1">
      <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
      <SidebarItem to="/calendar" icon={Calendar} label="Calendar" onClick={onClose} />
      <SidebarItem to="/profile" icon={User} label="Profile & Injuries" onClick={onClose} />
      <SidebarItem to="/diet" icon={Utensils} label="Diet & Supps" onClick={onClose} />
      <SidebarItem to="/exercises" icon={Dumbbell} label="Exercises" onClick={onClose} />
      <SidebarItem to="/store" icon={ShoppingBag} label="Store" onClick={onClose} />
      <SidebarItem to="/contacts" icon={Phone} label="Contacts & SOS" onClick={onClose} />
    </nav>

    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
      <p className="text-xs text-gray-500 mb-2">Pro Member</p>
      <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
        <div className="bg-prime w-3/4 h-full"></div>
      </div>
    </div>
  </div>
);

// Menu Toggle Component
const MenuToggle = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white shadow-lg hover:bg-white/10 transition"
  >
    <Menu size={24} />
  </button>
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
    <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden relative pt-16 md:pt-0">
      {/* Left: Sidebar Panel */}
      <div className="w-full md:w-1/3 md:min-w-[400px] p-4 md:p-6 h-auto md:h-full flex flex-col gap-6">
        <div className="bg-black/20 p-4 md:p-6 rounded-2xl border border-white/5 flex-1 flex flex-col min-h-[500px] md:min-h-0">
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
      <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black/50 to-black rounded-3xl m-4 border border-white/5 overflow-hidden min-h-[500px]">
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
    <div className="p-4 md:p-8 h-full overflow-y-auto pt-20 md:pt-8">
      <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-prime to-sec">Workout History</h2>
      <div className="max-w-4xl mx-auto pb-20">
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-[#0f0f1a] text-white font-sans overflow-hidden selection:bg-prime selection:text-white">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <MenuToggle onClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Sidebar - Hidden on mobile unless toggled */}
        <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 relative overflow-hidden flex flex-col w-full">
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
