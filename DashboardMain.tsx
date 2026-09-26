import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Sparkles,
  MessageSquare,
  Bell,
  Heart,
  Zap,
  ChevronDown,
  ArrowUpRight,
  Send,
  Snowflake,
  Trophy,
  Home,
  Flame,
  Activity,
  User,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyWinsCard } from './DailyWinsCard';
import { HabitHeatmapCard } from './HabitHeatmapCard';
import { CalorieMeterView } from './CalorieMeterView';
import { PhysicalDetailsView } from './PhysicalDetailsView';
import { ProfileView } from './ProfileView';
import { AboutView } from './AboutView';

interface DashboardMainProps {
  onOpenAskAI?: () => void;
  onOpenAddTasks?: () => void;
  onOpenNotifications?: () => void;
  onOpenChat?: () => void;
  onOpenStreakFreeze?: () => void;
  onOpenLevelXP?: () => void;
}

export const DashboardMain: React.FC<DashboardMainProps> = ({
  onOpenAskAI,
  onOpenAddTasks,
  onOpenNotifications,
  onOpenChat,
  onOpenStreakFreeze,
  onOpenLevelXP,
}) => {
  const {
    user,
    addToast,
    setIsCreateHabitOpen,
    currentTrackerView,
    setCurrentTrackerView,
  } = useApp();

  // Date selection state
  const weekDays = [
    { day: 'Sat', date: 19 },
    { day: 'Sun', date: 20 },
    { day: 'Mon', date: 21 },
    { day: 'Tue', date: 22 },
    { day: 'Wed', date: 23 },
    { day: 'Thu', date: 24 },
    { day: 'Fri', date: 25 },
  ];
  const [selectedDayNumber, setSelectedDayNumber] = useState(22);

  // Daily Tasks state matching screenshot
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: 'Meditation',
      time: '07:00 - 07:20 AM',
      completed: true,
      iconType: 'lotus',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'task-2',
      title: 'Skincare routine',
      time: '07:45 - 08:00 AM',
      completed: true,
      iconType: 'flower',
      iconBg: 'bg-pink-50 text-pink-500',
    },
    {
      id: 'task-3',
      title: 'Journaling',
      time: '08:00 - 08:30 AM',
      completed: true,
      iconType: 'pen',
      iconBg: 'bg-orange-50 text-orange-500',
    },
    {
      id: 'task-4',
      title: 'Wake up & drink water',
      time: '08:30 - 09:00 AM',
      completed: true,
      iconType: 'dumbbell',
      iconBg: 'bg-slate-100 text-slate-500',
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          addToast(next ? 'Task Completed' : 'Task Incomplete', `${t.title} updated.`);
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  // Habit Streak View Mode
  const [streakMode, setStreakMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedStreakDay, setSelectedStreakDay] = useState(22);

  const streakDays = [
    { day: 12, status: 'checked' },
    { day: 13, status: 'checked' },
    { day: 14, status: 'partial' },
    { day: 15, status: 'missed' },
    { day: 16, status: 'checked' },
    { day: 17, status: 'missed' },
    { day: 18, status: 'checked' },
    { day: 19, status: 'missed' },
    { day: 20, status: 'checked' },
    { day: 21, status: 'checked' },
    { day: 22, status: 'active' },
    { day: 23, status: 'future' },
    { day: 24, status: 'future' },
    { day: 25, status: 'future' },
    { day: 26, status: 'future' },
    { day: 27, status: 'future' },
    { day: 28, status: 'future' },
  ];

  // Favourite Habit Bar Chart Data
  const habitBars = [
    { name: 'Walk', height: 42, active: false, time: '25 min', change: '+2%' },
    { name: 'Journaling', height: 60, active: false, time: '30 min', change: '+3%' },
    { name: 'Meditation', height: 94, active: true, time: '45 min', change: '▲ 4% vs last month' },
    { name: 'Drink water', height: 50, active: false, time: '2.5L', change: '+1%' },
    { name: 'Cardio', height: 68, active: false, time: '35 min', change: '+5%' },
    { name: 'Skincare', height: 56, active: false, time: '20 min', change: '+1%' },
  ];
  const [selectedBar, setSelectedBar] = useState(2); // Meditation

  // Journaling input
  const [journalSummary, setJournalSummary] = useState('');

  const handleSaveJournal = () => {
    if (!journalSummary.trim()) {
      addToast('Daily Journal', 'Please enter your reflection for today.', 'info');
      return;
    }
    addToast('Journal Entry Saved ✨', 'Added to your daily reflections and consistency score.', 'success');
    setJournalSummary('');
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-5">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {currentTrackerView === 'home' && 'Dashboard'}
            {currentTrackerView === 'calories' && 'Calorie Meter'}
            {currentTrackerView === 'physical' && 'Physical Details'}
            {currentTrackerView === 'profile' && 'My Profile'}
            {currentTrackerView === 'about' && 'About Trackora'}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {currentTrackerView === 'home' && 'Build consistency & circadian harmony'}
            {currentTrackerView === 'calories' && 'Daily energy expenditure & macro balance'}
            {currentTrackerView === 'physical' && 'Biometrics, BMI, and body composition'}
            {currentTrackerView === 'profile' && 'Manage personal account & routine preferences'}
            {currentTrackerView === 'about' && 'Trackora architecture & behavioral philosophy'}
          </p>
        </div>

        {/* Right Nav Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Streak Freeze Status Pill */}
          <button
            onClick={onOpenStreakFreeze}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs border ${
              user.streakFreezeActiveToday
                ? 'bg-sky-50 border-sky-300 text-sky-700 ring-2 ring-sky-300/40'
                : 'bg-white border-slate-200/80 text-slate-700 hover:bg-sky-50/50 hover:border-sky-200'
            }`}
            title="Streak Freeze Vault"
          >
            <Snowflake className={`w-3.5 h-3.5 ${user.streakFreezeActiveToday ? 'text-sky-600 animate-spin-slow' : 'text-sky-500'}`} />
            <span>
              {user.streakFreezeActiveToday ? 'Shield Active' : `${user.streakFreezes} Freezes`}
            </span>
          </button>

          {/* Level & XP Progression Pill */}
          <button
            onClick={onOpenLevelXP}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs hover:bg-emerald-50/40 hover:border-emerald-200 transition-all text-xs font-bold text-slate-800"
            title={`Level ${user.level} (${Math.round((user.currentXp / user.xpToNextLevel) * 100)}% XP)`}
          >
            <div className="flex items-center gap-1 text-emerald-600">
              <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>Lvl {user.level}</span>
            </div>
            {/* Mini XP Bar */}
            <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((user.currentXp / user.xpToNextLevel) * 100))}%` }}
              />
            </div>
          </button>

          {/* Ask AI Button */}
          <button
            onClick={onOpenAskAI}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all text-xs font-bold text-slate-800"
          >
            {/* Iridescent Rainbow Ring Icon */}
            <div className="w-4 h-4 rounded-full p-[1.5px] bg-gradient-to-tr from-pink-500 via-amber-400 to-emerald-400 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-purple-600" />
              </div>
            </div>
            <span>Ask AI</span>
          </button>

          {/* Chat Bubble Button */}
          <button
            onClick={onOpenChat}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors"
            title="Chat & Community"
          >
            <MessageSquare className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Notification Bell Button */}
          <button
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>

          {/* Elena Profile Avatar & Name - Clickable to open Profile */}
          <button
            onClick={() => setCurrentTrackerView('profile')}
            className={`flex items-center gap-2 pl-1 select-none hover:opacity-85 transition-opacity ${
              currentTrackerView === 'profile' ? 'ring-2 ring-purple-500 rounded-full pr-2' : ''
            }`}
            title="View Profile & Settings"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
              alt="Elena C."
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
            />
            <span className="text-xs font-bold text-slate-800 hidden sm:inline">
              Elena C.
            </span>
          </button>
        </div>
      </div>

      {/* Modern Tracker Navigation Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto custom-scrollbar select-none">
        <button
          onClick={() => setCurrentTrackerView('home')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'home'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTrackerView('calories')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'calories'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Calorie Meter</span>
        </button>

        <button
          onClick={() => setCurrentTrackerView('physical')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'physical'
              ? 'bg-white text-teal-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Physical Details</span>
        </button>

        <button
          onClick={() => setCurrentTrackerView('profile')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'profile'
              ? 'bg-white text-purple-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setCurrentTrackerView('about')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'about'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>About</span>
        </button>
      </div>

      {/* Conditionally Render Active View */}
      {currentTrackerView === 'calories' && <CalorieMeterView />}
      {currentTrackerView === 'physical' && <PhysicalDetailsView />}
      {currentTrackerView === 'profile' && <ProfileView />}
      {currentTrackerView === 'about' && <AboutView />}

      {currentTrackerView === 'home' && (
        <>

      {/* Grid Row 1: Sleep Time & Daily Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card A: Sleep Time (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">Sleep time</h3>

            <div className="flex items-center justify-between gap-4">
              {/* 2x2 Stats Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
                {/* 1. Total Sleep Duration */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">7h 20m</p>
                    <p className="text-[10px] text-slate-400 font-medium">Total sleep duration</p>
                  </div>
                </div>

                {/* 2. Deep Sleep */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 14 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">1h 9m</p>
                    <p className="text-[10px] text-slate-400 font-medium">Deep sleep</p>
                  </div>
                </div>

                {/* 3. Sleep Quality */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12h8m4 0h4M8 6h4m4 0h4M6 18h6m4 0h2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">82%</p>
                    <p className="text-[10px] text-slate-400 font-medium">Sleep quality</p>
                  </div>
                </div>

                {/* 4. Sleep Regularity */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">82%</p>
                    <p className="text-[10px] text-slate-400 font-medium">Sleep quality</p>
                  </div>
                </div>
              </div>

              {/* Right Concentric Sleep Arcs Diagram */}
              <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Outer light gray base */}
                  <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="6" fill="none" />
                  {/* Outer arc: light green/teal */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#86EFAC"
                    strokeWidth="6"
                    strokeDasharray="264"
                    strokeDashoffset="180"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Middle arc: light purple */}
                  <circle cx="50" cy="50" r="32" stroke="#F8FAFC" strokeWidth="6" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="32"
                    stroke="#D8B4FE"
                    strokeWidth="6"
                    strokeDasharray="201"
                    strokeDashoffset="140"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Inner arc: Vibrant Indigo/Blue */}
                  <circle cx="50" cy="50" r="22" stroke="#F8FAFC" strokeWidth="6" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="22"
                    stroke="#4F46E5"
                    strokeWidth="6"
                    strokeDasharray="138"
                    strokeDashoffset="75"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card B: Calendar & Daily Tasks (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header: Month & + Add Tasks button */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Januari, <span className="text-slate-600 font-semibold">2025</span>
              </h3>

              <button
                onClick={onOpenAddTasks || (() => setIsCreateHabitOpen(true))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F2D27] hover:bg-[#16211C] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Tasks</span>
              </button>
            </div>

            {/* Week Slider Strip */}
            <div className="flex items-center justify-between gap-1 py-1 px-1 border-b border-slate-100 pb-3">
              <button className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-around flex-1 gap-1">
                {weekDays.map((item) => {
                  const isSelected = item.date === selectedDayNumber;
                  return (
                    <button
                      key={item.date}
                      onClick={() => setSelectedDayNumber(item.date)}
                      className={`flex flex-col items-center py-1.5 px-2.5 rounded-2xl transition-all ${
                        isSelected
                          ? 'bg-[#E06D53] text-white shadow-sm font-bold scale-105'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-[10px] ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                        {item.day}
                      </span>
                      <span className="text-sm font-extrabold mt-0.5">{item.date}</span>
                    </button>
                  );
                })}
              </div>

              <button className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tasks List */}
            <div className="space-y-2 mt-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Category Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${task.iconBg}`}>
                      {task.iconType === 'lotus' && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3c-2 4-5 7-9 8 4 1 7 4 9 10 2-6 5-9 9-10-4-1-7-4-9-8z" />
                        </svg>
                      )}
                      {task.iconType === 'flower' && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" />
                        </svg>
                      )}
                      {task.iconType === 'pen' && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      )}
                      {task.iconType === 'dumbbell' && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6.5 6.5 11 11M3 9l3-3M15 21l3-3M9 3l3 3M18 12l3 3" />
                        </svg>
                      )}
                    </div>

                    <div className="truncate">
                      <p
                        className={`text-xs font-bold tracking-tight truncate ${
                          task.id === 'task-4' ? 'line-through text-slate-800' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">{task.time}</p>
                    </div>
                  </div>

                  {/* Done Pill Button */}
                  {task.id !== 'task-4' ? (
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                        task.completed
                          ? 'bg-white border-slate-200/80 text-slate-800 shadow-2xs hover:bg-slate-50'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Done</span>
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Heart Rate & Cortisol Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card A: Heart Rate */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-500">Heart rate</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">72</span>
              <span className="text-xs font-bold text-slate-400">Bpm</span>
            </div>

            {/* ECG Pulse Wave SVG */}
            <div className="w-32 h-10">
              <svg className="w-full h-full" viewBox="0 0 120 40" fill="none">
                <path
                  d="M0 20 L25 20 L32 20 L38 28 L44 8 L50 32 L56 16 L62 24 L68 20 L120 20"
                  stroke="#F87171"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Pill Footer */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50/70 text-emerald-800 border border-emerald-100/60">
              <span>🌱</span>
              <span>Lower HR after meditation</span>
            </span>
          </div>
        </div>

        {/* Card B: Cortisol */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-500">Cortisol</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight">56</span>
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>

            {/* Horizontal Color Meter Bar with Needle */}
            <div className="w-36 flex flex-col items-center">
              {/* Needle Indicator */}
              <div className="w-full relative h-2">
                <div
                  className="absolute -top-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-800 transition-all duration-300"
                  style={{ left: '56%', transform: 'translateX(-50%)' }}
                />
              </div>

              {/* Gradient Track */}
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 shadow-inner" />
            </div>
          </div>

          {/* Pill Footer */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50/70 text-amber-900 border border-amber-100/60">
              <span>⚡</span>
              <span>Stress higher today</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Habit Streak Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Habit streak
            </h3>
            {/* Filter Pill */}
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
              <span>This month</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Segmented Toggle: Monthly / Yearly */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full">
            <button
              onClick={() => setStreakMode('monthly')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                streakMode === 'monthly'
                  ? 'bg-[#1C2833] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setStreakMode('yearly')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                streakMode === 'yearly'
                  ? 'bg-[#1C2833] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Horizontal Days Track */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 custom-scrollbar">
          {streakDays.map((item) => {
            const isDaySelected = selectedStreakDay === item.day;

            return (
              <div
                key={item.day}
                onClick={() => setSelectedStreakDay(item.day)}
                className="flex flex-col items-center gap-1.5 cursor-pointer min-w-[28px]"
              >
                {/* Status Capsule */}
                <div
                  className={`w-7 h-9 rounded-xl flex items-center justify-center transition-all ${
                    item.status === 'checked'
                      ? 'bg-emerald-50 text-emerald-600'
                      : item.status === 'partial'
                      ? 'bg-amber-50 text-amber-500'
                      : item.status === 'missed'
                      ? 'bg-rose-50 text-rose-500'
                      : item.status === 'active'
                      ? 'bg-[#E06D53] text-white shadow-sm ring-2 ring-rose-300'
                      : 'border border-slate-200/80 bg-slate-50/50 text-slate-300'
                  }`}
                >
                  {item.status === 'checked' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {item.status === 'partial' && (
                    <div className="w-3 h-3 rounded-full border-2 border-amber-500 border-t-transparent animate-spin-slow" />
                  )}
                  {item.status === 'missed' && <span className="font-black text-xs">!</span>}
                  {item.status === 'active' && (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white" />
                  )}
                  {item.status === 'future' && (
                    <div className="w-2.5 h-2.5 rounded-full border border-slate-300" />
                  )}
                </div>

                {/* Day Number */}
                <span
                  className={`text-[11px] font-bold ${
                    isDaySelected ? 'text-slate-900 underline decoration-[#E06D53] decoration-2' : 'text-slate-400'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Row 4: Favourite Habit & Journaling Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-6">
        {/* Card A: Favourite Habit (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Favourite habit
            </h3>
          </div>

          {/* Bar Chart Area with Benchmark and Floating Tooltip */}
          <div className="relative pt-12 pb-2">
            {/* Dotted Benchmark Line */}
            <div className="absolute top-10 inset-x-0 border-b border-dashed border-slate-200 pointer-events-none" />

            {/* Floating Tooltip Card over Meditation */}
            <div className="absolute top-0 left-[38%] -translate-x-1/2 bg-white rounded-2xl p-2.5 shadow-md border border-slate-100 z-10 text-left min-w-[120px] pointer-events-none animate-fade-in">
              <p className="text-[10px] font-semibold text-slate-400">
                {habitBars[selectedBar].name}
              </p>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                {habitBars[selectedBar].time}
              </p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                {habitBars[selectedBar].change}
              </p>
            </div>

            {/* Bars Track */}
            <div className="flex items-end justify-between gap-3 h-32 px-2">
              {habitBars.map((bar, idx) => {
                const isMeditation = bar.name === 'Meditation';
                const isSelected = selectedBar === idx;

                return (
                  <div
                    key={bar.name}
                    onClick={() => setSelectedBar(idx)}
                    className="flex flex-col items-center gap-2 flex-1 cursor-pointer group"
                  >
                    {/* Bar Pill */}
                    <div
                      className={`w-full rounded-2xl transition-all duration-300 relative flex items-start justify-center pt-1.5 ${
                        isMeditation
                          ? 'bg-[#2E7D66] hover:bg-[#256854] shadow-sm'
                          : isSelected
                          ? 'bg-slate-300'
                          : 'bg-slate-100 group-hover:bg-slate-200'
                      }`}
                      style={{ height: `${bar.height}%` }}
                    >
                      {/* Lotus icon inside meditation bar */}
                      {isMeditation && (
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 3c-2 4-5 7-9 8 4 1 7 4 9 10 2-6 5-9 9-10-4-1-7-4-9-8z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Bar Label */}
                    <span
                      className={`text-[10px] font-semibold truncate ${
                        isSelected || isMeditation ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {bar.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card B: LET'S TRY NEW FEATURE Journaling (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl p-6 border border-slate-200/60 shadow-2xs relative overflow-hidden bg-gradient-to-br from-[#F5F8F7] via-[#F4F7F6] to-[#EFF4F2] flex flex-col justify-between">
          {/* Ambient Colorful Pastel Blurred Orbs */}
          <div className="absolute top-2 left-6 w-20 h-20 rounded-full bg-emerald-300/40 blur-2xl pointer-events-none" />
          <div className="absolute top-4 left-1/3 w-20 h-20 rounded-full bg-indigo-400/35 blur-2xl pointer-events-none" />
          <div className="absolute top-2 right-1/4 w-20 h-20 rounded-full bg-rose-400/40 blur-2xl pointer-events-none" />
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-amber-300/45 blur-2xl pointer-events-none" />

          {/* Heading with styled curved uppercase & cursive script */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
            <div className="text-center sm:text-left flex-1">
              <p className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-700 uppercase">
                LET'S TRY NEW FEATURE
              </p>
              <h4 className="font-cursive text-3xl sm:text-4xl text-slate-800 -mt-1 drop-shadow-xs">
                Journaling
              </h4>
            </div>

            {/* Try now button */}
            <button
              onClick={handleSaveJournal}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-slate-800 text-xs font-bold shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 shrink-0 border border-slate-200/60"
            >
              <span>Try now</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Interactive Journal Textarea Box */}
          <div className="relative z-10 bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-white/80 shadow-2xs mt-2">
            <textarea
              value={journalSummary}
              onChange={(e) => setJournalSummary(e.target.value)}
              placeholder="Write a summary of your day"
              rows={2}
              className="w-full bg-transparent resize-none outline-none text-xs text-slate-800 placeholder:text-slate-400 font-medium"
            />

            <div className="flex items-center justify-between pt-1 border-t border-slate-100/60 mt-1">
              <span className="text-[10px] text-slate-400">
                {journalSummary.length > 0 ? `${journalSummary.length} characters` : 'Mindful reflection'}
              </span>
              <button
                onClick={handleSaveJournal}
                className="p-1 rounded-full text-slate-400 hover:text-emerald-600 transition-colors"
                title="Send / Log entry"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 5: Daily Wins & Habit Consistency Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-6">
        <div className="lg:col-span-5">
          <DailyWinsCard />
        </div>
        <div className="lg:col-span-7">
          <HabitHeatmapCard />
        </div>
      </div>
      </>
      )}
    </div>
  );
};
