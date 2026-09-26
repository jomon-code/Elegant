import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  LeaderboardEntry,
  PerkItem,
  RedeemedVoucher,
  GamificationProfile,
  GamificationHistory
} from '../types';

interface XpAwardEvent {
  amount: number;
  reason: string;
  timestamp: number;
}

interface GamificationContextType {
  profile: GamificationProfile | null;
  xp: number;
  level: number;
  title: string;
  nextLevelXp: number;
  streak: number;
  leaderboard: LeaderboardEntry[];
  perks: PerkItem[];
  redeemedPerks: RedeemedVoucher[];
  recentAward: XpAwardEvent | null;
  addXp: (amount: number, reason: string, action?: string) => Promise<boolean>;
  redeemPerk: (perkId: string) => Promise<RedeemedVoucher | null>;
  openRewardsModal: boolean;
  setOpenRewardsModal: (open: boolean) => void;
  openLeaderboardModal: boolean;
  setOpenLeaderboardModal: (open: boolean) => void;
  activeVoucherModal: RedeemedVoucher | null;
  setActiveVoucherModal: (voucher: RedeemedVoucher | null) => void;
  refreshData: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
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

const DEFAULT_PERKS: PerkItem[] = [
  {
    id: 'perk_print',
    title: '1 Free Print in Library',
    description: '10 pages of complimentary black & white or color laser printing at University Library Floor 1.',
    category: 'academic',
    cost: 50,
    icon: 'Printer',
    tag: 'User Favorite',
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

function getLevelInfo(xp: number) {
  if (xp >= 1000) return { level: 5, title: 'Campus Legend', nextLevelXp: 1500 };
  if (xp >= 500) return { level: 4, title: 'Campus Champion', nextLevelXp: 1000 };
  if (xp >= 250) return { level: 3, title: 'Campus Scholar', nextLevelXp: 500 };
  if (xp >= 100) return { level: 2, title: 'Campus Explorer', nextLevelXp: 250 };
  return { level: 1, title: 'Campus Novice', nextLevelXp: 100 };
}

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(DEFAULT_LEADERBOARD);
  const [perks, setPerks] = useState<PerkItem[]>(DEFAULT_PERKS);
  const [redeemedPerks, setRedeemedPerks] = useState<RedeemedVoucher[]>([]);
  const [recentAward, setRecentAward] = useState<XpAwardEvent | null>(null);

  const [openRewardsModal, setOpenRewardsModal] = useState<boolean>(false);
  const [openLeaderboardModal, setOpenLeaderboardModal] = useState<boolean>(false);
  const [activeVoucherModal, setActiveVoucherModal] = useState<RedeemedVoucher | null>(null);

  const storageKey = user ? `campus_gamify_${user._id || user.id || user.email}` : 'campus_gamify_guest';

  // Load initial data
  const refreshData = useCallback(async () => {
    if (!user) return;

    try {
      // Try fetching from backend
      const [profRes, lbRes, perksRes] = await Promise.allSettled([
        api.get('/gamification/profile'),
        api.get('/gamification/leaderboard'),
        api.get('/gamification/perks'),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.data.profile) {
        setProfile(profRes.value.data.profile);
        setRedeemedPerks(profRes.value.data.profile.redeemedPerks || []);
      } else {
        // Fallback to localStorage or defaults
        loadLocalProfile();
      }

      if (lbRes.status === 'fulfilled' && lbRes.value.data.leaderboard) {
        setLeaderboard(lbRes.value.data.leaderboard);
      }

      if (perksRes.status === 'fulfilled' && perksRes.value.data.perks) {
        setPerks(perksRes.value.data.perks);
      }
    } catch {
      loadLocalProfile();
    }
  }, [user]);

  const loadLocalProfile = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setRedeemedPerks(parsed.redeemedPerks || []);
        return;
      }
    } catch {}

    const initialXp = user?.role === 'student' ? 480 : 650;
    const { level, title, nextLevelXp } = getLevelInfo(initialXp);
    const initialProfile: GamificationProfile = {
      xp: initialXp,
      level,
      title,
      nextLevelXp,
      streak: 7,
      history: [
        { id: 'h_1', action: 'attend_class', title: 'Attended Data Structures (CS301)', xp: 10, type: 'earned', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: 'h_2', action: 'file_complaint', title: 'Submitted Maintenance Report', xp: 15, type: 'earned', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
        { id: 'h_3', action: 'resolve_complaint', title: 'Facility Ticket Resolved', xp: 35, type: 'earned', timestamp: new Date(Date.now() - 3600000 * 48).toISOString() },
      ],
      redeemedPerks: [],
    };
    setProfile(initialProfile);
    try {
      localStorage.setItem(storageKey, JSON.stringify(initialProfile));
    } catch {}
  };

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Save profile to local storage whenever it changes
  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(profile));
      } catch {}
    }
  }, [profile, storageKey]);

  // Method to add XP
  const addXp = async (amount: number, reason: string, action?: string): Promise<boolean> => {
    const gained = Number(amount) || 10;
    setRecentAward({ amount: gained, reason, timestamp: Date.now() });

    // Toast alert with rich gamified UI
    toast.success(
      (t) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚡</span>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--nlu-gold, #ffe600)', fontSize: '0.95rem' }}>
              +{gained} XP EARNED!
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{reason}</div>
          </div>
        </div>
      ),
      {
        duration: 4500,
        style: {
          background: 'linear-gradient(135deg, #002244 0%, #004880 100%)',
          color: '#ffffff',
          border: '1px solid #ffe600',
          boxShadow: '0 8px 24px rgba(0, 72, 128, 0.4)',
        },
      }
    );

    try {
      // Update backend
      await api.post('/gamification/award', { amount: gained, reason, action });
    } catch {}

    // Update local state immediately
    setProfile((prev) => {
      const currentXp = (prev?.xp || 480) + gained;
      const { level, title, nextLevelXp } = getLevelInfo(currentXp);
      const wasLevel = prev?.level || 1;

      if (level > wasLevel) {
        // Trigger Level-up celebratory toast
        setTimeout(() => {
          toast.success(
            `🎉 LEVEL UP! You reached Level ${level} (${title})! New perks unlocked!`,
            {
              duration: 6000,
              style: {
                background: 'linear-gradient(135deg, #d97706 0%, #ffe600 100%)',
                color: '#002244',
                fontWeight: 800,
                fontSize: '1rem',
              },
            }
          );
        }, 600);
      }

      const newHistoryItem: GamificationHistory = {
        id: `tx_${Date.now()}`,
        action: action || 'activity',
        title: reason,
        xp: gained,
        type: 'earned',
        timestamp: new Date().toISOString(),
      };

      const updated: GamificationProfile = {
        xp: currentXp,
        level,
        title,
        nextLevelXp,
        streak: (prev?.streak || 7),
        history: [newHistoryItem, ...(prev?.history || [])],
        redeemedPerks: prev?.redeemedPerks || [],
      };

      // Also update leaderboard ranking locally
      setLeaderboard((lb) => {
        const copy = lb.map((item) =>
          item.name === (user?.name || 'Alice Johnson')
            ? { ...item, xp: currentXp, level, title }
            : item
        );
        copy.sort((a, b) => b.xp - a.xp);
        return copy.map((item, idx) => ({ ...item, rank: idx + 1 }));
      });

      return updated;
    });

    return true;
  };

  // Method to redeem a perk
  const redeemPerk = async (perkId: string): Promise<RedeemedVoucher | null> => {
    const perk = perks.find((p) => p.id === perkId);
    if (!perk) {
      toast.error('Perk not found in rewards catalog.');
      return null;
    }

    const currentXp = profile?.xp || 0;
    if (currentXp < perk.cost) {
      toast.error(`Insufficient XP! You have ${currentXp} XP, but need ${perk.cost} XP.`);
      return null;
    }

    try {
      const res = await api.post('/gamification/redeem', { perkId });
      if (res.data?.voucher) {
        const voucher: RedeemedVoucher = res.data.voucher;
        setRedeemedPerks((prev) => [voucher, ...prev]);
        setProfile((prev) => prev ? {
          ...prev,
          xp: res.data.newTotalXp,
          redeemedPerks: [voucher, ...prev.redeemedPerks]
        } : null);
        setActiveVoucherModal(voucher);
        toast.success(`🎉 Voucher generated! Enjoy your "${perk.title}"!`);
        return voucher;
      }
    } catch {}

    // Fallback local redemption
    const voucherCode = `NLU-${perk.id.replace('perk_', '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + (perk.expiryDays || 7) * 24 * 60 * 60 * 1000).toISOString();

    const voucher: RedeemedVoucher = {
      id: `vouch_${Date.now()}`,
      perkId: perk.id,
      perkTitle: perk.title,
      category: perk.category,
      voucherCode,
      cost: perk.cost,
      redeemedAt: new Date().toISOString(),
      expiresAt,
      status: 'active',
    };

    setRedeemedPerks((prev) => [voucher, ...prev]);
    setActiveVoucherModal(voucher);

    setProfile((prev) => {
      if (!prev) return null;
      const newXp = prev.xp - perk.cost;
      const { level, title, nextLevelXp } = getLevelInfo(newXp);
      return {
        ...prev,
        xp: newXp,
        level,
        title,
        nextLevelXp,
        history: [
          {
            id: `tx_${Date.now()}`,
            action: 'redeem',
            title: `Redeemed ${perk.title}`,
            xp: perk.cost,
            type: 'spent',
            timestamp: new Date().toISOString(),
          },
          ...prev.history,
        ],
        redeemedPerks: [voucher, ...prev.redeemedPerks],
      };
    });

    toast.success(`🎉 Voucher generated! Enjoy your "${perk.title}"!`);
    return voucher;
  };

  const xp = profile?.xp || 480;
  const level = profile?.level || 3;
  const title = profile?.title || 'Campus Scholar';
  const nextLevelXp = profile?.nextLevelXp || 500;
  const streak = profile?.streak || 7;

  return (
    <GamificationContext.Provider
      value={{
        profile,
        xp,
        level,
        title,
        nextLevelXp,
        streak,
        leaderboard,
        perks,
        redeemedPerks,
        recentAward,
        addXp,
        redeemPerk,
        openRewardsModal,
        setOpenRewardsModal,
        openLeaderboardModal,
        setOpenLeaderboardModal,
        activeVoucherModal,
        setActiveVoucherModal,
        refreshData,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
