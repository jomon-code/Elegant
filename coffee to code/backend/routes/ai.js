const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Live dynamic campus simulation states
function getCanteenLiveStatus() {
  const currentHour = new Date().getHours();
  let queueCount = 12;
  let waitMin = 8;
  let status = 'Moderate Rush';

  if (currentHour >= 12 && currentHour <= 14) {
    queueCount = 26;
    waitMin = 15;
    status = 'Peak Lunch Rush';
  } else if (currentHour >= 16 && currentHour <= 18) {
    queueCount = 18;
    waitMin = 10;
    status = 'Evening Snack Rush';
  } else if (currentHour < 9 || currentHour > 20) {
    queueCount = 3;
    waitMin = 2;
    status = 'Low Traffic';
  }

  return {
    queueCount,
    waitMinutes: waitMin,
    status,
    recommendation: queueCount > 10 ? 'Best to pre-order or use XP Priority Pass.' : 'Walk-in is fast and convenient right now.',
    popularItems: ['Cold Brew Coffee & Croissant', 'Paneer Kathi Roll', 'Berry Smoothie', 'Masala Dosa Combo'],
    specialsToday: 'Student combo: Filter Coffee + Veg Puff for $3.50 (Or 60 XP for free coffee!)'
  };
}

// Student Timetable Schedule
const STUDENT_TIMETABLE = [
  {
    courseCode: 'CS301',
    courseName: 'Data Structures & Algorithms',
    instructor: 'Prof. Ananya Sharma',
    room: 'Room 204',
    block: 'Block B',
    floor: 2,
    time: '10:30 AM - 11:45 AM',
    day: 'Monday, Wednesday, Friday',
    status: 'Upcoming Next',
    startsInMinutes: 24,
    walkingTimeMinutes: 4,
    recommendedRoute: 'Take Central Quad walk to Block B, enter East door, take stairs to 2nd Floor right wing.'
  },
  {
    courseCode: 'EE204',
    courseName: 'Signals & Systems',
    instructor: 'Dr. Michael Hayes',
    room: 'Room 108',
    block: 'Block A',
    floor: 1,
    time: '01:15 PM - 02:30 PM',
    day: 'Monday, Wednesday',
    status: 'Scheduled',
    startsInMinutes: 185,
    walkingTimeMinutes: 2,
    recommendedRoute: 'Block A main concourse ground floor.'
  },
  {
    courseCode: 'CS305',
    courseName: 'Database Management Systems Lab',
    instructor: 'Prof. Rajesh K.',
    room: 'Lab 3A',
    block: 'Block A',
    floor: 3,
    time: '03:00 PM - 05:00 PM',
    day: 'Wednesday',
    status: 'Scheduled',
    startsInMinutes: 290,
    walkingTimeMinutes: 5,
    recommendedRoute: 'Take Elevator A to 3rd floor, turn left.'
  }
];

// GET /api/ai/canteen-status
router.get('/canteen-status', protect, (req, res) => {
  res.json(getCanteenLiveStatus());
});

// GET /api/ai/timetable
router.get('/timetable', protect, (req, res) => {
  res.json({ timetable: STUDENT_TIMETABLE });
});

// POST /api/ai/ask
router.post('/ask', protect, (req, res) => {
  const { question } = req.body;
  const q = (question || '').toLowerCase().trim();
  const userName = req.user.name || 'Campus Student';

  const canteen = getCanteenLiveStatus();
  const nextClass = STUDENT_TIMETABLE[0];

  let answer = '';
  let intent = 'general';
  let actions = [];
  let suggestions = [];

  // 1. Where is my next class / timetable query
  if (q.includes('next class') || q.includes('timetable') || q.includes('schedule') || q.includes('where is my class') || q.includes('class today')) {
    intent = 'timetable';
    answer = `📍 **Your next class is ${nextClass.courseName} (${nextClass.courseCode})**\n\n` +
      `• **Location:** ${nextClass.block}, **${nextClass.room}** (Floor ${nextClass.floor})\n` +
      `• **Instructor:** ${nextClass.instructor}\n` +
      `• **Time:** ${nextClass.time} *(Starts in ~${nextClass.startsInMinutes} mins)*\n` +
      `• **Est. Walking Time:** ${nextClass.walkingTimeMinutes} minutes\n` +
      `• **Fastest Route:** ${nextClass.recommendedRoute}\n\n` +
      `💡 *Tip: Remember to scan the QR code when you arrive to earn **+10 XP** for attendance!*`;
    
    actions = [
      { label: '🗺️ Navigate to Room 204', link: '/navigation' },
      { label: '📋 Open QR Attendance', link: '/attendance' }
    ];
    suggestions = [
      'Is canteen crowded now?',
      'Check my attendance percentage',
      'Find quiet study rooms'
    ];
  }
  // 2. Is canteen crowded / cafeteria / food query
  else if (q.includes('canteen') || q.includes('cafeteria') || q.includes('crowded') || q.includes('food') || q.includes('lunch') || q.includes('coffee') || q.includes('wait time') || q.includes('queue')) {
    intent = 'canteen';
    answer = `☕ **Central Cafeteria Live Status:**\n\n` +
      `• **Queue Length:** **${canteen.queueCount} people**\n` +
      `• **Estimated Wait:** **~${canteen.waitMinutes} min wait**\n` +
      `• **Rush Meter:** ${canteen.status}\n` +
      `• **Recommendation:** ${canteen.recommendation}\n\n` +
      `🔥 **Popular Right Now:** ${canteen.popularItems.join(', ')}\n` +
      `✨ **Special Offer:** ${canteen.specialsToday}\n\n` +
      `💡 *Gamification Perk: You can redeem **60 XP** for a 100% free artisan coffee voucher or **80 XP** for an Express Queue Pass!*`;

    actions = [
      { label: '🎁 Redeem Coffee (60 XP)', action: 'open_perks' },
      { label: '⚡ Get Queue Pass (80 XP)', action: 'open_perks' }
    ];
    suggestions = [
      'Where is my next class?',
      'How much XP do I have?',
      'Find quiet study rooms'
    ];
  }
  // 3. Attendance query
  else if (q.includes('attendance') || q.includes('percentage') || q.includes('check-in') || q.includes('qr')) {
    intent = 'attendance';
    answer = `📊 **Attendance Summary for ${userName}:**\n\n` +
      `• **Overall Campus Attendance:** **82.4%** ✅ (Safe zone)\n` +
      `• **CS301 Data Structures:** **72.0%** ⚠️ *(Below 75% threshold! Attend the next 2 lectures to reach 78%)*\n` +
      `• **EE204 Signals & Systems:** **88.5%** ✅\n` +
      `• **CS305 DBMS Lab:** **84.0%** ✅\n\n` +
      `🏆 **Gamification Reward:** Each verified QR check-in awards **+10 XP** directly to your profile and advances your weekly streak!`;

    actions = [
      { label: '📋 Open QR Attendance Check-In', link: '/attendance' },
      { label: '🏆 View Leaderboard Rank', action: 'open_leaderboard' }
    ];
    suggestions = [
      'Where is my next class?',
      'How much XP do I have?',
      'What can I redeem?'
    ];
  }
  // 4. Study rooms / library / quiet space
  else if (q.includes('quiet') || q.includes('study room') || q.includes('library') || q.includes('free room') || q.includes('vacant room') || q.includes('empty room')) {
    intent = 'rooms';
    answer = `📚 **Recommended Quiet Study Spots Right Now:**\n\n` +
      `1. **Block C - Room 302 (Collaborative Study Pod)**\n` +
      `   • Current Status: Available (14 empty seats)\n` +
      `   • Sound Level: Quiet (<35 dB)\n` +
      `   • Amenities: Fast Wi-Fi 6, Dual Whiteboards, AC\n\n` +
      `2. **University Library - 2nd Floor Silent Alcove**\n` +
      `   • Current Status: 85% quiet rating, 6 study booths open\n` +
      `   • Amenities: Power sockets at every desk, individual reading lamps\n\n` +
      `3. **Block A - Seminar Hall 102**\n` +
      `   • Open for individual study until 1:00 PM\n\n` +
      `💡 *You can also reserve a private Acoustic Study Pod for 2 hours in the XP Rewards Store (100 XP)!*`;

    actions = [
      { label: '🏢 View All Campus Rooms', link: '/rooms' },
      { label: '🎁 Reserve Study Pod (100 XP)', action: 'open_perks' }
    ];
    suggestions = [
      'Where is my next class?',
      'Is canteen crowded now?',
      'Redeem 1 free print in library'
    ];
  }
  // 5. XP / Leaderboard / Redeem / Rewards query
  else if (q.includes('xp') || q.includes('redeem') || q.includes('point') || q.includes('leaderboard') || q.includes('reward') || q.includes('print') || q.includes('perk')) {
    intent = 'gamification';
    answer = `🏆 **Campus XP & Rewards Program:**\n\n` +
      `• **Attend Class (QR Scan):** **+10 XP**\n` +
      `• **File Campus Ticket & Resolve:** **+50 XP** *(+15 XP file, +35 XP resolved)*\n` +
      `• **Report / Return Lost Item:** **+30 XP**\n` +
      `• **RSVP & Attend Event:** **+20 XP**\n\n` +
      `🎁 **Perks You Can Redeem Right Now:**\n` +
      `1. 🖨️ **1 Free Print in Library (10 pages)** — **50 XP**\n` +
      `2. ☕ **Free Artisan Coffee at Canteen** — **60 XP**\n` +
      `3. ⚡ **Cafeteria Priority Queue Pass** — **80 XP**\n` +
      `4. 🎧 **2-Hour Private Study Pod** — **100 XP**\n` +
      `5. 📚 **Bookstore 20% Off Coupon** — **120 XP**\n\n` +
      `🥇 *Check the Top 10 Leaderboard in your sidebar to see if you made the campus podium!*`;

    actions = [
      { label: '🎁 Redeem 1 Free Print (50 XP)', action: 'open_perks' },
      { label: '🏆 View Top 10 Leaderboard', action: 'open_leaderboard' }
    ];
    suggestions = [
      'How to earn +50 XP on complaints?',
      'Where is my next class?',
      'Is canteen crowded now?'
    ];
  }
  // 6. Complaints / Support tickets
  else if (q.includes('complaint') || q.includes('ticket') || q.includes('maintenance') || q.includes('ac') || q.includes('wifi') || q.includes('broken')) {
    intent = 'complaints';
    answer = `🛠️ **Facilities & Support Desk:**\n\n` +
      `• **Active Incident on Record:** "Broken AC in Lab 3A"\n` +
      `• **Current Status:** In Progress (Assigned to Facilities Maintenance)\n` +
      `• **Est. Resolution:** Technicians on site; expected completion today by 3:00 PM.\n\n` +
      `✨ **Gamification Bonus Active:**\n` +
      `Filing a campus complaint gives you **+15 XP**, and verifying its resolution awards an additional **+35 XP** (**Total +50 XP**)! Help keep our campus running smoothly.`;

    actions = [
      { label: '🛠️ File / View Tickets', link: '/complaints' },
      { label: '🏆 Check XP Balance', action: 'open_leaderboard' }
    ];
    suggestions = [
      'Where is my next class?',
      'Is canteen crowded now?',
      'Check my attendance percentage'
    ];
  }
  // 7. Lost and Found
  else if (q.includes('lost') || q.includes('found') || q.includes('bottle') || q.includes('calculator') || q.includes('id card') || q.includes('keys')) {
    intent = 'lostfound';
    answer = `🔍 **Lost & Found Automated Cross-Matching:**\n\n` +
      `Our intelligent registry currently tracks 4 items reported today:\n` +
      `• **Blue Hydroflask Water Bottle** (Found in Block B Quad)\n` +
      `• **Texas Instruments Scientific Calculator** (Found in Library Floor 1)\n` +
      `• **Student ID Card (CSE Dept)** (Admin Security Desk)\n` +
      `• **Car Key with NLU Lanyard** (Cafeteria Counter)\n\n` +
      `Did you find something? Reporting a found item awards **+30 XP** (Good Samaritan badge)!`;

    actions = [
      { label: '🔍 Check Lost & Found Board', link: '/lostfound' }
    ];
    suggestions = [
      'Where is my next class?',
      'Is canteen crowded now?',
      'How much XP do I have?'
    ];
  }
  // 8. Emergency / Security
  else if (q.includes('emergency') || q.includes('sos') || q.includes('security') || q.includes('help') || q.includes('fire') || q.includes('doctor') || q.includes('ambulance')) {
    intent = 'emergency';
    answer = `🚨 **Campus Emergency Response Network:**\n\n` +
      `• **Campus Security Control Desk:** +1 (312) 261-3000 *(24/7 Hotline)*\n` +
      `• **Campus Health & First Aid Clinic:** Ground Floor, Admin Tower (Ext. 104)\n` +
      `• **Nearest Emergency Exit:** West Stairwell in Block B / North Lobby Exit in Block A\n` +
      `• **Instant Geo-Beacon:** Click the red **SOS button** on the bottom right of your screen to broadcast your exact real-time GPS location to campus emergency wardens.`;

    actions = [
      { label: '🚨 Open Emergency Hub', link: '/emergency' }
    ];
    suggestions = [
      'Where is my next class?',
      'Is canteen crowded now?'
    ];
  }
  // 9. Default smart response
  else {
    intent = 'general';
    answer = `👋 Hello ${userName}! I'm **Campus AI**, your intelligent 24/7 campus concierge.\n\n` +
      `Here is what I can do for you in real-time:\n` +
      `• 📍 **Timetable & Classrooms:** Ask *"Where is my next class?"* for live room navigation.\n` +
      `• ☕ **Canteen Live Rush:** Ask *"Is canteen crowded now?"* for live queue counts & wait times.\n` +
      `• 📊 **Attendance Tracker:** Ask *"Check my attendance percentage"* to see threshold alerts.\n` +
      `• 🏆 **XP & Rewards Store:** Ask *"What can I redeem?"* to claim free library prints (50 XP), coffee, and perks.\n` +
      `• 🛠️ **Campus Facilities:** Ask *"Status of my complaints"* or file maintenance tickets (+50 XP).\n` +
      `• 🔍 **Lost & Found Matching:** Ask about lost items or return found items (+30 XP).\n\n` +
      `How can I assist you right now?`;

    actions = [
      { label: '📍 Next Class', question: 'Where is my next class?' },
      { label: '☕ Canteen Rush', question: 'Is canteen crowded now?' },
      { label: '🖨️ Free Print (50 XP)', action: 'open_perks' }
    ];
    suggestions = [
      'Where is my next class?',
      'Is canteen crowded now?',
      'Check my attendance percentage',
      'How to earn +50 XP on complaints?'
    ];
  }

  res.json({
    answer,
    intent,
    actions,
    suggestions,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
