const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Seed leaderboard data
let leaderboard = [
  { rank: 1, id: 'u_1', name: 'Sophia Chen', role: 'student', department: 'Computer Science', xp: 840, level: 5, title: 'Campus Legend', avatarColor: '#004880', streak: 14, badges: ['Perfect Attendance', 'Code Wizard', 'Top Contributor'] },
  { rank: 2, id: 'u_2', name: 'Marcus Vance', role: 'student', department: 'Electrical Engineering', xp: 710, level: 4, title: 'Campus Champion', avatarColor: '#0091ea', streak: 11, badges: ['Problem Solver', 'Fixer'] },
  { rank: 3, id: 'u_3', name: 'Aaliyah Patel', role: 'student', department: 'Biotechnology', xp: 620, level: 4, title: 'Campus Champion', avatarColor: '#d97706', streak: 9, badges: ['Lab Master', 'Eco Crusader'] },
  { rank: 4, id: 'u_4', name: 'Alice Johnson', role: 'student', department: 'Computer Science', xp: 480, level: 3, title: 'Campus Scholar', avatarColor: '#10b981', streak: 7, badges: ['Quick Check-in', 'Community Helper'] },
  { rank: 5, id: 'u_5', name: 'David Kim', role: 'student', department: 'Mechanical Engineering', xp: 430, level: 3, title: 'Campus Scholar', avatarColor: '#8b5cf6', streak: 6, badges: ['Maker Space Star'] },
  { rank: 6, id: 'u_6', name: 'Elena Rostova', role: 'student', department: 'Business Analytics', xp: 390, level: 3, title: 'Campus Scholar', avatarColor: '#ec4899', streak: 5, badges: ['Event Organizer'] },
  { rank: 7, id: 'u_7', name: 'Rohan Gupta', role: 'student', department: 'Information Science', xp: 350, level: 3, title: 'Campus Scholar', avatarColor: '#06b6d4', streak: 5, badges: ['Bug Hunter'] },
  { rank: 8, id: 'u_8', name: 'Zoe Martinez', role: 'student', department: 'Architecture', xp: 310, level: 2, title: 'Campus Explorer', avatarColor: '#f59e0b', streak: 4, badges: ['Design Fellow'] },
  { rank: 9, id: 'u_9', name: 'Liam O\'Connor', role: 'student', department: 'Data Science', xp: 280, level: 2, title: 'Campus Explorer', avatarColor: '#6366f1', streak: 3, badges: ['Active Citizen'] },
  { rank: 10, id: 'u_10', name: 'Priya Sharma', role: 'student', department: 'Civil Engineering', xp: 260, level: 2, title: 'Campus Explorer', avatarColor: '#14b8a6', streak: 3, badges: ['Early Bird'] },
];

// Available Campus Perks to redeem with XP
const PERKS_CATALOG = [
  {
    id: 'perk_print',
    title: '1 Free Print in Library',
    description: '10 pages of complimentary black & white or color laser printing at University Library Floor 1.',
    category: 'academic',
    cost: 50,
    icon: 'Printer',
    tag: 'Most Popular',
    expiryDays: 14,
  },
  {
    id: 'perk_coffee',
    title: 'Free Artisan Coffee at Canteen',
    description: 'One complimentary hot/cold specialty brew or filter coffee at Campus Central Cafeteria.',
    category: 'dining',
    cost: 60,
    icon: 'Coffee',
    tag: 'Quick Sip',
    expiryDays: 7,
  },
  {
    id: 'perk_queue',
    title: 'Cafeteria Priority Queue Pass',
    description: 'Bypass the lunch rush hour queue during peak hours (12:30 PM - 2:00 PM).',
    category: 'dining',
    cost: 80,
    icon: 'Zap',
    tag: 'Speed Pass',
    expiryDays: 5,
  },
  {
    id: 'perk_study_pod',
    title: 'Reserved 2-Hour Silent Study Pod',
    description: 'Guaranteed acoustic study booth with dual 4K monitors & fast charging in Block C.',
    category: 'facility',
    cost: 100,
    icon: 'Headphones',
    tag: 'Focus Mode',
    expiryDays: 10,
  },
  {
    id: 'perk_bookstore',
    title: 'Campus Bookstore 20% Off Coupon',
    description: 'Valid for all textbooks, stationery, and engineering supplies at the University Book Depot.',
    category: 'store',
    cost: 120,
    icon: 'BookOpen',
    tag: 'Save 20%',
    expiryDays: 30,
  },
  {
    id: 'perk_vip_event',
    title: 'VIP Front-Row Seat at Tech Fest',
    description: 'Reserved front-row keynote seating and exclusive networking pass for Campus Annual Summit.',
    category: 'event',
    cost: 150,
    icon: 'Star',
    tag: 'VIP Access',
    expiryDays: 20,
  },
  {
    id: 'perk_merch',
    title: 'NLU Campus Hoodie 50% Off Voucher',
    description: 'Heavyweight organic cotton collegiate hoodie voucher at Student Union Store.',
    category: 'store',
    cost: 250,
    icon: 'Tag',
    tag: 'Exclusive Merch',
    expiryDays: 45,
  }
];

// In-memory user gamification records
const userGamification = new Map();

// Helper to compute user level and title
function computeLevel(xp) {
  if (xp >= 1000) return { level: 5, title: 'Campus Legend', nextLevelXp: 1500 };
  if (xp >= 500) return { level: 4, title: 'Campus Champion', nextLevelXp: 1000 };
  if (xp >= 250) return { level: 3, title: 'Campus Scholar', nextLevelXp: 500 };
  if (xp >= 100) return { level: 2, title: 'Campus Explorer', nextLevelXp: 250 };
  return { level: 1, title: 'Campus Novice', nextLevelXp: 100 };
}

// GET /api/gamification/leaderboard
router.get('/leaderboard', protect, (req, res) => {
  // Sort and assign top 10
  leaderboard.sort((a, b) => b.xp - a.xp);
  leaderboard.forEach((item, index) => {
    item.rank = index + 1;
  });
  res.json({ leaderboard: leaderboard.slice(0, 10) });
});

// GET /api/gamification/perks
router.get('/perks', protect, (req, res) => {
  res.json({ perks: PERKS_CATALOG });
});

// GET /api/gamification/profile
router.get('/profile', protect, (req, res) => {
  const userId = req.user._id || req.user.id || 'default_user';
  if (!userGamification.has(userId)) {
    // Default state: Alice has 480 XP
    const initialXp = req.user.role === 'student' ? 480 : 650;
    const { level, title, nextLevelXp } = computeLevel(initialXp);
    userGamification.set(userId, {
      xp: initialXp,
      level,
      title,
      nextLevelXp,
      streak: 7,
      history: [
        { id: 'h_1', action: 'attend_class', title: 'Attended Data Structures (CS301)', xp: 10, type: 'earned', timestamp: new Date(Date.now() - 3600000 * 2) },
        { id: 'h_2', action: 'file_complaint', title: 'Submitted Maintenance Report', xp: 15, type: 'earned', timestamp: new Date(Date.now() - 3600000 * 24) },
        { id: 'h_3', action: 'resolve_complaint', title: 'Facility Ticket Resolved', xp: 35, type: 'earned', timestamp: new Date(Date.now() - 3600000 * 48) },
      ],
      redeemedPerks: [],
    });
  }

  const profile = userGamification.get(userId);
  res.json({ profile });
});

// POST /api/gamification/award
router.post('/award', protect, (req, res) => {
  const userId = req.user._id || req.user.id || 'default_user';
  const { amount, reason, action } = req.body;
  const xpToAdd = Number(amount) || 10;

  if (!userGamification.has(userId)) {
    const { level, title, nextLevelXp } = computeLevel(480);
    userGamification.set(userId, {
      xp: 480,
      level,
      title,
      nextLevelXp,
      streak: 7,
      history: [],
      redeemedPerks: []
    });
  }

  const profile = userGamification.get(userId);
  const oldLevel = profile.level;
  profile.xp += xpToAdd;

  const levelInfo = computeLevel(profile.xp);
  profile.level = levelInfo.level;
  profile.title = levelInfo.title;
  profile.nextLevelXp = levelInfo.nextLevelXp;

  const entry = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    action: action || 'custom',
    title: reason || 'Earned campus activity XP',
    xp: xpToAdd,
    type: 'earned',
    timestamp: new Date()
  };
  profile.history.unshift(entry);

  // Update leaderboard entry if user is in leaderboard
  const lbUser = leaderboard.find(u => u.name === req.user.name || u.id === String(userId));
  if (lbUser) {
    lbUser.xp = profile.xp;
    lbUser.level = profile.level;
    lbUser.title = profile.title;
  } else {
    // Add to leaderboard candidate
    leaderboard.push({
      rank: leaderboard.length + 1,
      id: String(userId),
      name: req.user.name,
      role: req.user.role || 'student',
      department: req.user.department || 'Computer Science',
      xp: profile.xp,
      level: profile.level,
      title: profile.title,
      avatarColor: '#004880',
      streak: profile.streak,
      badges: ['Active Contributor']
    });
  }

  leaderboard.sort((a, b) => b.xp - a.xp);
  leaderboard.forEach((item, index) => {
    item.rank = index + 1;
  });

  const leveledUp = profile.level > oldLevel;

  res.json({
    success: true,
    awarded: xpToAdd,
    newTotalXp: profile.xp,
    level: profile.level,
    title: profile.title,
    leveledUp,
    entry,
    message: `+${xpToAdd} XP: ${reason || 'Activity recorded'}`
  });
});

// POST /api/gamification/redeem
router.post('/redeem', protect, (req, res) => {
  const userId = req.user._id || req.user.id || 'default_user';
  const { perkId } = req.body;
  const perk = PERKS_CATALOG.find(p => p.id === perkId);

  if (!perk) {
    return res.status(404).json({ message: 'Perk not found' });
  }

  if (!userGamification.has(userId)) {
    const { level, title, nextLevelXp } = computeLevel(480);
    userGamification.set(userId, {
      xp: 480,
      level,
      title,
      nextLevelXp,
      streak: 7,
      history: [],
      redeemedPerks: []
    });
  }

  const profile = userGamification.get(userId);
  if (profile.xp < perk.cost) {
    return res.status(400).json({ message: `Insufficient XP. You need ${perk.cost} XP, but have ${profile.xp} XP.` });
  }

  // Deduct XP
  profile.xp -= perk.cost;
  const levelInfo = computeLevel(profile.xp);
  profile.level = levelInfo.level;
  profile.title = levelInfo.title;
  profile.nextLevelXp = levelInfo.nextLevelXp;

  const voucherCode = `NLU-${perk.id.replace('perk_', '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const expiresAt = new Date(Date.now() + (perk.expiryDays || 7) * 24 * 60 * 60 * 1000);

  const voucher = {
    id: `vouch_${Date.now()}`,
    perkId: perk.id,
    perkTitle: perk.title,
    category: perk.category,
    voucherCode,
    cost: perk.cost,
    redeemedAt: new Date(),
    expiresAt,
    status: 'active'
  };

  profile.redeemedPerks.unshift(voucher);
  profile.history.unshift({
    id: `tx_${Date.now()}`,
    action: 'redeem_perk',
    title: `Redeemed ${perk.title}`,
    xp: perk.cost,
    type: 'spent',
    timestamp: new Date()
  });

  // Update leaderboard
  const lbUser = leaderboard.find(u => u.name === req.user.name || u.id === String(userId));
  if (lbUser) {
    lbUser.xp = profile.xp;
  }

  res.json({
    success: true,
    voucher,
    newTotalXp: profile.xp,
    message: `Successfully redeemed "${perk.title}"! Voucher code: ${voucherCode}`
  });
});

module.exports = router;
