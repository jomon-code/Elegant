import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Flame,
  Award,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { habits, analytics, user, longestStreak } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Filter analytics data based on selected period
  const dataLength = filterPeriod === 'week' ? 7 : filterPeriod === 'month' ? 30 : 90;
  // If we have 30, for 90 we can project smoothly
  const displayData = analytics.slice(analytics.length - Math.min(analytics.length, dataLength));

  const totalCompleted = user.totalHabitsCompleted;
  const avgCompletionRate = Math.round(
    displayData.reduce((acc, d) => acc + d.completionRate, 0) / (displayData.length || 1)
  );

  // Best performing habits
  const sortedHabits = [...habits].sort((a, b) => b.completionRate - a.completionRate);
  const bestHabit = sortedHabits[0];

  // Category performance
  const categoriesList = ['health', 'fitness', 'mindfulness', 'productivity', 'learning', 'lifestyle'] as const;
  const categoryStats = categoriesList.map((cat) => {
    const catHabits = habits.filter((h) => h.category === cat);
    const avgRate = catHabits.length > 0
      ? Math.round(catHabits.reduce((acc, h) => acc + h.completionRate, 0) / catHabits.length)
      : 80;
    return {
      category: cat,
      count: catHabits.length,
      rate: avgRate,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Productivity & Streak Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive behavioral telemetry, completion trends, and consistency insights
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'week'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'month'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setFilterPeriod('quarter')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'quarter'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Last 3 Months
          </button>
        </div>
      </div>

      {/* Useful Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Completed</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {totalCompleted}
          </p>
          <span className="text-[10px] text-emerald-500 font-bold">Lifetime logs</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Completion Rate</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {avgCompletionRate}%
          </p>
          <span className="text-[10px] text-emerald-500 font-bold">Top tier</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Longest Streak</span>
          <p className="text-xl font-black text-orange-500 mt-1 flex items-center gap-1">
            <Flame className="w-4 h-4 fill-orange-500" />
            {longestStreak}d
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Personal record</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Daily Average</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            6.4
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Habits / day</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Peak Day</span>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">
            Friday
          </p>
          <span className="text-[10px] text-purple-500 font-bold">94% consistency</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Top Habit</span>
          <p className="text-sm font-black text-slate-900 dark:text-white mt-2 truncate">
            {bestHabit?.name.split(' ')[0] || 'Reading'}
          </p>
          <span className="text-[10px] text-emerald-500 font-bold">{bestHabit?.completionRate || 92}% adherence</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habit Completion Line & Bar Trend (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Completion & Productivity Trajectory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite trend curve over {displayData.length} recorded days
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              +8.4% Momentum
            </span>
          </div>

          {/* SVG Multi-layer Trend Visualization */}
          <div className="h-64 flex flex-col justify-end pt-4">
            <div className="flex-1 flex items-end gap-1.5 sm:gap-2 px-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              {displayData.map((d, i) => (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col justify-end h-full group relative cursor-pointer"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap transition-opacity pointer-events-none">
                    {d.dayName}: {d.completionRate}%
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500/80 to-teal-400 rounded-t-md transition-all duration-300 group-hover:from-emerald-500 group-hover:to-teal-300"
                    style={{ height: `${d.completionRate}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-2 px-2 font-medium">
              <span>{displayData[0]?.date}</span>
              <span>Mid Period</span>
              <span>{displayData[displayData.length - 1]?.date} (Today)</span>
            </div>
          </div>
        </div>

        {/* Category Performance (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Category Performance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adherence distribution by life pillar
            </p>
          </div>

          <div className="space-y-3.5 my-4">
            {categoryStats.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                    {item.category} ({item.count} habits)
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.rate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            Health & Learning show your strongest neuro-pathway adherence.
          </p>
        </div>
      </div>

      {/* Secondary Row: Best Performing Habits & Missed Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performing Habits */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Top Performing Habits</span>
          </h2>

          <div className="space-y-3">
            {sortedHabits.slice(0, 4).map((h, idx) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-xs text-slate-400">
                    #{idx + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${h.color}15`, color: h.color }}
                  >
                    <DynamicIcon name={h.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {h.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Streak: {h.currentStreak} days • Best: {h.bestStreak} days
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {h.completionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missed Habit Patterns */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span>Missed Habit Diagnostic Patterns</span>
          </h2>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 mb-1">
                Evening Screen Curfew Skips (Past 10:15 PM)
              </h4>
              <p className="text-xs text-rose-800/80 dark:text-rose-300 leading-relaxed">
                Missed 4 times over the last 14 days, primarily on Thursday evenings when working late.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                Weekend Meditation Variance
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300 leading-relaxed">
                Saturday wake-up times fluctuate by 90 minutes, delaying morning mindfulness sessions.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40">
              <h4 className="text-xs font-bold text-sky-900 dark:text-sky-200 mb-1">
                Mid-day Hydration Dip
              </h4>
              <p className="text-xs text-sky-800/80 dark:text-sky-300 leading-relaxed">
                Water intake slows down significantly between 2 PM and 4 PM during meetings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
