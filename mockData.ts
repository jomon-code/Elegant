import {
  Habit,
  ScheduleItem,
  Goal,
  NotificationItem,
  Achievement,
  UserProfile,
  SmartSuggestion,
  DayAnalytics,
  PhysicalDetails,
  CalorieMeterData
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Elena C.',
  tagline: 'Building a balanced, high-focus lifestyle',
  email: 'elena.c@trackora.app',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  startOfDay: '06:00',
  theme: 'light',
  weekStartsOn: 'monday',
  level: 6,
  levelTitle: 'Consistency Vanguard',
  currentXp: 1850,
  xpToNextLevel: 2500,
  totalHabitsCompleted: 142,
  streakFreezes: 2,
  maxStreakFreezes: 3,
  streakFreezeActiveToday: false,
  soundEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  smartReminders: true,
};

export const INITIAL_DAILY_WINS = [
  {
    id: 'win-1',
    title: 'Completed 20-min Morning Meditation',
    category: 'mindfulness' as const,
    time: '07:20 AM',
    xpEarned: 35,
    icon: '🧘',
  },
  {
    id: 'win-2',
    title: 'Crushed 12.08 Km outdoor running route',
    category: 'fitness' as const,
    time: '08:45 AM',
    xpEarned: 50,
    icon: '🏃',
  },
  {
    id: 'win-3',
    title: 'Logged 120 pages of deep reading',
    category: 'learning' as const,
    time: '09:30 AM',
    xpEarned: 40,
    icon: '📖',
  },
];

export const INITIAL_PHYSICAL_DETAILS: PhysicalDetails = {
  heightCm: 172,
  weightKg: 62.5,
  targetWeightKg: 60.0,
  age: 26,
  gender: 'female',
  activityLevel: 'moderate',
  bodyFatPercentage: 19.5,
  restingHeartRate: 62,
  bloodPressure: '118/78',
  lastUpdated: '2026-09-25',
};

export const INITIAL_CALORIE_DATA: CalorieMeterData = {
  dailyTargetCalories: 2150,
  burnedCalories: 520,
  targetProteinGrams: 115,
  targetCarbsGrams: 230,
  targetFatsGrams: 65,
  meals: [
    {
      id: 'meal-1',
      name: 'Greek Yogurt Bowl with Berries & Chia Seeds',
      calories: 380,
      proteinGrams: 28,
      carbsGrams: 42,
      fatsGrams: 9,
      mealType: 'breakfast',
      time: '08:15 AM',
    },
    {
      id: 'meal-2',
      name: 'Grilled Salmon with Quinoa & Steamed Greens',
      calories: 620,
      proteinGrams: 46,
      carbsGrams: 52,
      fatsGrams: 18,
      mealType: 'lunch',
      time: '01:00 PM',
    },
    {
      id: 'meal-3',
      name: 'Matcha Green Tea Latte & Raw Almonds',
      calories: 190,
      proteinGrams: 7,
      carbsGrams: 14,
      fatsGrams: 12,
      mealType: 'snack',
      time: '04:30 PM',
    },
  ],
};

// Generate realistic last 30 days of history
export const generateHistory = (rate: number, totalDays: number = 30): { [date: string]: boolean } => {
  const history: { [date: string]: boolean } = {};
  const today = new Date();
  for (let i = totalDays; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    // Slightly higher rate on weekdays
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const effectiveRate = isWeekend ? rate * 0.85 : Math.min(0.98, rate * 1.05);
    // Deterministic pseudo-random based on date
    const hash = (d.getFullYear() * 1000 + d.getMonth() * 31 + d.getDate() * 7) % 100;
    history[dateKey] = (hash / 100) < effectiveRate;
  }
  return history;
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Hydrate (2.5L Water)',
    description: 'Drink 8 glasses of fresh water throughout the day for mental clarity and energy.',
    category: 'health',
    frequency: 'daily',
    target: '8 glasses',
    targetValue: 8,
    currentValue: 6,
    unit: 'glasses',
    currentStreak: 12,
    bestStreak: 21,
    completionRate: 92,
    reminderTime: '08:00',
    preferredTimeOfDay: 'anytime',
    color: '#0284c7', // Sky Blue
    icon: 'Droplets',
    completedToday: true,
    paused: false,
    history: generateHistory(0.92),
    createdAt: '2026-08-01',
    difficulty: 'easy',
  },
  {
    id: 'habit-2',
    name: 'Morning Workout & Cardio',
    description: '30-45 minutes HIIT or brisk running to boost metabolism and stamina.',
    category: 'fitness',
    frequency: 'weekdays',
    target: '40 mins',
    targetValue: 40,
    currentValue: 40,
    unit: 'mins',
    currentStreak: 9,
    bestStreak: 16,
    completionRate: 85,
    reminderTime: '07:00',
    preferredTimeOfDay: 'morning',
    color: '#10b981', // Emerald
    icon: 'Dumbbell',
    completedToday: true,
    paused: false,
    history: generateHistory(0.85),
    createdAt: '2026-08-05',
    relatedGoalId: 'goal-2',
    difficulty: 'medium',
  },
  {
    id: 'habit-3',
    name: 'Read Non-Fiction Book',
    description: 'Read at least 20 focused pages of books on philosophy, design, or tech.',
    category: 'learning',
    frequency: 'daily',
    target: '20 pages',
    targetValue: 20,
    currentValue: 20,
    unit: 'pages',
    currentStreak: 14,
    bestStreak: 24,
    completionRate: 88,
    reminderTime: '20:30',
    preferredTimeOfDay: 'evening',
    color: '#8b5cf6', // Violet
    icon: 'BookOpen',
    completedToday: true,
    paused: false,
    history: generateHistory(0.88),
    createdAt: '2026-08-10',
    relatedGoalId: 'goal-1',
    difficulty: 'easy',
  },
  {
    id: 'habit-4',
    name: 'Mindful Meditation',
    description: '10 minutes of box breathing or calm guided mindfulness to reset the mind.',
    category: 'mindfulness',
    frequency: 'daily',
    target: '10 mins',
    targetValue: 10,
    currentValue: 10,
    unit: 'mins',
    currentStreak: 5,
    bestStreak: 18,
    completionRate: 78,
    reminderTime: '06:45',
    preferredTimeOfDay: 'morning',
    color: '#06b6d4', // Cyan
    icon: 'Sparkles',
    completedToday: true,
    paused: false,
    history: generateHistory(0.78),
    createdAt: '2026-08-12',
    relatedGoalId: 'goal-4',
    difficulty: 'easy',
  },
  {
    id: 'habit-5',
    name: 'Deep Work Session',
    description: '90 minutes of high-priority uninterrupted coding or creative output without tabs or phone.',
    category: 'productivity',
    frequency: 'weekdays',
    target: '90 mins',
    targetValue: 90,
    currentValue: 90,
    unit: 'mins',
    currentStreak: 7,
    bestStreak: 15,
    completionRate: 84,
    reminderTime: '09:00',
    preferredTimeOfDay: 'morning',
    color: '#f59e0b', // Amber
    icon: 'Brain',
    completedToday: true,
    paused: false,
    history: generateHistory(0.84),
    createdAt: '2026-08-15',
    relatedGoalId: 'goal-3',
    difficulty: 'hard',
  },
  {
    id: 'habit-6',
    name: 'Sleep Before 11:00 PM',
    description: 'Wind down screens at 10:15 PM and be in bed before 11:00 PM for 8h quality rest.',
    category: 'health',
    frequency: 'daily',
    target: 'In bed 10:45 PM',
    targetValue: 1,
    currentValue: 0,
    unit: 'check',
    currentStreak: 4,
    bestStreak: 12,
    completionRate: 72,
    reminderTime: '22:15',
    preferredTimeOfDay: 'evening',
    color: '#6366f1', // Indigo
    icon: 'Moon',
    completedToday: false,
    paused: false,
    history: generateHistory(0.72),
    createdAt: '2026-08-18',
    difficulty: 'medium',
  },
  {
    id: 'habit-7',
    name: 'Daily Journal & Reflection',
    description: 'Write 3 things grateful for and one key takeaway lesson from the day.',
    category: 'mindfulness',
    frequency: 'daily',
    target: '1 entry',
    targetValue: 1,
    currentValue: 0,
    unit: 'entry',
    currentStreak: 3,
    bestStreak: 10,
    completionRate: 70,
    reminderTime: '21:30',
    preferredTimeOfDay: 'evening',
    color: '#ec4899', // Pink
    icon: 'PenTool',
    completedToday: false,
    paused: false,
    history: generateHistory(0.70),
    createdAt: '2026-08-20',
    difficulty: 'easy',
  },
  {
    id: 'habit-8',
    name: 'Healthy Homecooked Meal',
    description: 'Prepare a nutrient-dense lunch or dinner with greens and lean protein.',
    category: 'lifestyle',
    frequency: 'daily',
    target: '2 meals',
    targetValue: 2,
    currentValue: 1,
    unit: 'meals',
    currentStreak: 8,
    bestStreak: 14,
    completionRate: 80,
    reminderTime: '12:30',
    preferredTimeOfDay: 'afternoon',
    color: '#84cc16', // Lime
    icon: 'Apple',
    completedToday: false,
    paused: false,
    history: generateHistory(0.80),
    createdAt: '2026-08-22',
    difficulty: 'medium',
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    time: '06:30',
    durationMinutes: 15,
    name: 'Wake Up & Natural Sunlight',
    category: 'lifestyle',
    completed: true,
    reminderEnabled: true,
    color: '#f59e0b',
    icon: 'Sun',
    notes: 'Hydrate with lemon water & 5 min fresh air'
  },
  {
    id: 'sch-2',
    time: '06:45',
    durationMinutes: 15,
    name: 'Mindful Box Meditation',
    category: 'mindfulness',
    completed: true,
    reminderEnabled: false,
    color: '#06b6d4',
    icon: 'Sparkles',
    habitId: 'habit-4',
    notes: 'Breathwork session on cushion'
  },
  {
    id: 'sch-3',
    time: '07:00',
    durationMinutes: 45,
    name: 'Morning Workout & Cardio',
    category: 'fitness',
    completed: true,
    reminderEnabled: true,
    color: '#10b981',
    icon: 'Dumbbell',
    habitId: 'habit-2',
    notes: 'Upper body resistance + 15m run'
  },
  {
    id: 'sch-4',
    time: '08:00',
    durationMinutes: 30,
    name: 'Nourishing Breakfast & Hydration',
    category: 'health',
    completed: true,
    reminderEnabled: false,
    color: '#0284c7',
    icon: 'Coffee',
    habitId: 'habit-1',
    notes: 'Oats, berries, walnuts & green tea'
  },
  {
    id: 'sch-5',
    time: '09:00',
    durationMinutes: 90,
    name: 'Deep Work Session: Core Architecture',
    category: 'productivity',
    completed: true,
    reminderEnabled: true,
    color: '#8b5cf6',
    icon: 'Brain',
    habitId: 'habit-5',
    notes: 'Zero distractions, notifications on DND'
  },
  {
    id: 'sch-6',
    time: '11:00',
    durationMinutes: 45,
    name: 'Team Sync & Standup',
    category: 'productivity',
    completed: true,
    reminderEnabled: true,
    color: '#3b82f6',
    icon: 'Users',
    notes: 'Sprint progress & design reviews'
  },
  {
    id: 'sch-7',
    time: '13:00',
    durationMinutes: 45,
    name: 'Mindful Lunch & Walk in Park',
    category: 'lifestyle',
    completed: false,
    reminderEnabled: false,
    color: '#84cc16',
    icon: 'Footprints',
    habitId: 'habit-8',
    notes: '15 min outdoor stroll for digestion'
  },
  {
    id: 'sch-8',
    time: '18:00',
    durationMinutes: 30,
    name: 'Evening Wind-down & Reading',
    category: 'learning',
    completed: false,
    reminderEnabled: true,
    color: '#a855f7',
    icon: 'BookOpen',
    habitId: 'habit-3',
    notes: 'Chapter 4: Designing Data-Intensive Apps'
  },
  {
    id: 'sch-9',
    time: '21:30',
    durationMinutes: 20,
    name: 'Daily Reflection & Journaling',
    category: 'mindfulness',
    completed: false,
    reminderEnabled: true,
    color: '#ec4899',
    icon: 'PenTool',
    habitId: 'habit-7',
    notes: 'Log wins, obstacles & gratitude'
  },
  {
    id: 'sch-10',
    time: '22:30',
    durationMinutes: 30,
    name: 'Bedtime Preparation & Sleep',
    category: 'health',
    completed: false,
    reminderEnabled: true,
    color: '#6366f1',
    icon: 'Moon',
    habitId: 'habit-6',
    notes: 'Dim lights, cool bedroom to 19°C'
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Read 12 Books This Year',
    description: 'Expand mental models across software architecture, behavioral psychology, and biography.',
    targetValue: 12,
    currentValue: 8,
    unit: 'books',
    deadline: '2026-12-31',
    progressPercentage: 67,
    relatedHabitIds: ['habit-3'],
    category: 'learning',
    completed: false,
    createdAt: '2026-01-01',
  },
  {
    id: 'goal-2',
    title: 'Exercise 150 Times',
    description: 'Maintain functional strength, cardiovascular endurance, and joint mobility.',
    targetValue: 150,
    currentValue: 114,
    unit: 'sessions',
    deadline: '2026-12-31',
    progressPercentage: 76,
    relatedHabitIds: ['habit-2'],
    category: 'fitness',
    completed: false,
    createdAt: '2026-01-01',
  },
  {
    id: 'goal-3',
    title: 'Study 100 Hours of Distributed Systems',
    description: 'Deep dive into event-driven design, Raft consensus, and scalable cloud databases.',
    targetValue: 100,
    currentValue: 68,
    unit: 'hours',
    deadline: '2026-11-30',
    progressPercentage: 68,
    relatedHabitIds: ['habit-5'],
    category: 'productivity',
    completed: false,
    createdAt: '2026-03-01',
  },
  {
    id: 'goal-4',
    title: 'Meditate for 30 Consecutive Days',
    description: 'Build neuro-resilience and reduce daily cortisol through sustained morning practice.',
    targetValue: 30,
    currentValue: 18,
    unit: 'days',
    deadline: '2026-10-15',
    progressPercentage: 60,
    relatedHabitIds: ['habit-4'],
    category: 'mindfulness',
    completed: false,
    createdAt: '2026-09-01',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '🔥 Streak Milestone Impending!',
    message: 'You are just 1 day away from reaching a 10-day streak in Morning Workout & Cardio!',
    timestamp: '15 mins ago',
    type: 'streak',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Upcoming Reminder: Reading at 18:00',
    message: 'Time for your 20-minute focused book session. Today’s goal: 20 pages.',
    timestamp: '1 hour ago',
    type: 'reminder',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Morning Routine Crushed! 🌅',
    message: 'Fantastic job Alex! You completed all 4 morning habits before 10:00 AM.',
    timestamp: '3 hours ago',
    type: 'achievement',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Weekly Consistency Boost 📈',
    message: 'Your overall habit consistency is up 8% compared to last week (now at 84%).',
    timestamp: 'Yesterday',
    type: 'insight',
    read: true,
  },
  {
    id: 'notif-5',
    title: 'Level 6 Reached! 🎉',
    message: 'You unlocked the "Productivity Enthusiast" tier and earned 250 bonus XP.',
    timestamp: '2 days ago',
    type: 'achievement',
    read: true,
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: '7 Day Streak',
    description: 'Maintain any habit for 7 consecutive days without skipping.',
    icon: 'Trophy',
    badge: '🏆',
    unlocked: true,
    unlockedAt: '2026-08-15',
    progress: 100,
    xpReward: 150,
    category: 'streak',
  },
  {
    id: 'ach-2',
    title: '30 Day Master',
    description: 'Keep a core habit alive for 30 consecutive days.',
    icon: 'Flame',
    badge: '🔥',
    unlocked: false,
    progress: 70, // 21/30
    xpReward: 500,
    category: 'streak',
  },
  {
    id: 'ach-3',
    title: 'Reading Champion',
    description: 'Complete 25 book reading sessions and log over 500 pages.',
    icon: 'BookOpen',
    badge: '📚',
    unlocked: true,
    unlockedAt: '2026-09-02',
    progress: 100,
    xpReward: 250,
    category: 'habits',
  },
  {
    id: 'ach-4',
    title: 'Fitness Starter',
    description: 'Complete 20 workout or cardio sessions in your routine.',
    icon: 'Dumbbell',
    badge: '💪',
    unlocked: true,
    unlockedAt: '2026-08-28',
    progress: 100,
    xpReward: 200,
    category: 'habits',
  },
  {
    id: 'ach-5',
    title: 'Early Bird',
    description: 'Complete your morning routine before 8:00 AM on 5 consecutive days.',
    icon: 'Sun',
    badge: '🌅',
    unlocked: true,
    unlockedAt: '2026-09-10',
    progress: 100,
    xpReward: 200,
    category: 'consistency',
  },
  {
    id: 'ach-6',
    title: 'Goal Crusher',
    description: 'Achieve 100% completion on any major quarterly goal.',
    icon: 'Target',
    badge: '🎯',
    unlocked: false,
    progress: 76,
    xpReward: 400,
    category: 'consistency',
  },
  {
    id: 'ach-7',
    title: 'Zen Master',
    description: 'Complete 20 mindful meditation sessions.',
    icon: 'Sparkles',
    badge: '🧘',
    unlocked: true,
    unlockedAt: '2026-09-18',
    progress: 100,
    xpReward: 200,
    category: 'habits',
  },
  {
    id: 'ach-8',
    title: 'Iron Discipline',
    description: 'Complete 100% of all scheduled habits for an entire week.',
    icon: 'ShieldCheck',
    badge: '🛡️',
    unlocked: false,
    progress: 88,
    xpReward: 600,
    category: 'special',
  }
];

export const INITIAL_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: 'sug-1',
    title: 'Shift Evening Workout to 6:30 PM',
    description: 'Data analysis shows you complete workouts 28% more reliably before dinner rather than after 8:00 PM.',
    rationale: 'Based on your completion logs from the past 3 weeks, evening sessions after 8 PM suffered 3 skips due to fatigue.',
    type: 'schedule_adjust',
    impact: 'high',
    category: 'fitness',
    applied: false,
    dismissed: false,
    targetHabitId: 'habit-2',
    suggestedTime: '18:30',
  },
  {
    id: 'sug-2',
    title: 'Reading Habit Pairs Best with Herbal Tea',
    description: 'You complete reading 92% of the time when preceded by your 8:00 PM wind-down routine.',
    rationale: 'Habit stacking triggers a calm transition state, minimizing phone interruptions.',
    type: 'habit_tweak',
    impact: 'medium',
    category: 'learning',
    applied: false,
    dismissed: false,
    targetHabitId: 'habit-3',
  },
  {
    id: 'sug-3',
    title: 'Simplify Morning Routine: 5 Tasks to 4 Tasks',
    description: 'Combining hydration with your meditation warmup increases morning adherence from 78% to 94%.',
    rationale: 'Reducing decision friction early in the morning prevents routine bottlenecks.',
    type: 'routine_optimize',
    impact: 'medium',
    category: 'productivity',
    applied: false,
    dismissed: false,
  },
  {
    id: 'sug-4',
    title: 'High Consistency Detected: Time to Add a New Habit!',
    description: 'You have maintained an 84%+ overall consistency score over the last 14 days.',
    rationale: 'Your neuro-routine is stabilized. You have cognitive bandwidth to add a light 5-minute stretch or micro-skill practice.',
    type: 'habit_add',
    impact: 'high',
    category: 'lifestyle',
    applied: false,
    dismissed: false,
  }
];

// 30 days of analytics data
export const generateAnalyticsData = (): DayAnalytics[] => {
  const days: DayAnalytics[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  // Preset realistic pattern for the last 30 days
  const basePercentages = [
    78, 85, 91, 88, 92, 74, 80, 85, 88, 94, 91, 86, 75, 82,
    88, 90, 85, 92, 95, 78, 84, 82, 91, 76, 88, 94, 71, 84, 87, 85
  ];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = dayNames[d.getDay()];
    const completionRate = basePercentages[29 - i] || 82;
    const habitsTotal = 8;
    const habitsCompleted = Math.round((completionRate / 100) * habitsTotal);
    const productivityScore = Math.min(98, Math.round(completionRate * 0.95 + 6));

    days.push({
      date: dateStr,
      dayName,
      completionRate,
      habitsCompleted,
      habitsTotal,
      productivityScore,
    });
  }

  return days;
};

export const INITIAL_ANALYTICS = generateAnalyticsData();
