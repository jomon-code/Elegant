import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  CalendarDays,
  Search,
  MessageSquareWarning,
  Compass,
  Bell,
  ShieldAlert,
  BookOpen,
  Trophy,
  Gift,
  Flame,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/study-materials', icon: BookOpen, label: 'Study Materials', roles: ['student', 'faculty', 'admin'] },
  { path: '/rooms', icon: Building2, label: 'Rooms & Booking', roles: ['student', 'faculty', 'admin'] },
  { path: '/attendance', icon: ClipboardCheck, label: 'QR Attendance (+10 XP)', roles: ['student', 'faculty', 'admin'] },
  { path: '/events', icon: CalendarDays, label: 'Campus Events', roles: ['student', 'faculty', 'admin'] },
  { path: '/lostfound', icon: Search, label: 'Lost & Found (+30 XP)', roles: ['student', 'faculty', 'admin'] },
  { path: '/complaints', icon: MessageSquareWarning, label: 'Support & Tickets (+50 XP)', roles: ['student', 'faculty', 'admin'] },
  { path: '/navigation', icon: Compass, label: 'Interactive Wayfinding', roles: ['student', 'faculty', 'admin'] },
  { path: '/notifications', icon: Bell, label: 'Notification Feed', roles: ['student', 'faculty', 'admin'] },
  { path: '/emergency', icon: ShieldAlert, label: 'Emergency Console', roles: ['admin'] },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const { user, isRole } = useAuth();
  const {
    xp,
    level,
    title,
    streak,
    leaderboard,
    setOpenRewardsModal,
    setOpenLeaderboardModal,
  } = useGamification();

  const [leaderboardExpanded, setLeaderboardExpanded] = useState<boolean>(true);

  const filtered = NAV_ITEMS.filter((item) => !item.roles || isRole(...item.roles));

  return (
    <nav className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Navigation Hub Section */}
      <div className="sidebar-section-title">Navigation Hub</div>
      <ul className="sidebar-nav">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path} className="sidebar-nav-item">
              <Link
                to={item.path}
                className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="sidebar-icon-wrap">
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── TOP 10 LEADERBOARD IN SIDEBAR ── */}
      <div className="sidebar-gamify-section">
        <div
          className="sidebar-gamify-header"
          onClick={() => setLeaderboardExpanded((p) => !p)}
        >
          <div className="sidebar-gamify-title">
            <Trophy size={16} className="trophy-icon" />
            <span>Top 10 Leaderboard</span>
          </div>
          <div className="sidebar-gamify-controls">
            <button
              type="button"
              className="sidebar-perks-btn"
              onClick={(e) => {
                e.stopPropagation();
                setOpenRewardsModal(true);
              }}
              title="Open XP Rewards Store"
            >
              <Gift size={13} />
              <span>Perks</span>
            </button>
            {leaderboardExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {leaderboardExpanded && (
          <div className="sidebar-leaderboard-list animate-in">
            {leaderboard.slice(0, 10).map((entry) => {
              const isCurrentUser =
                entry.name === (user?.name || 'Alice Johnson') ||
                entry.id === (user?._id || user?.id);

              return (
                <div
                  key={entry.id}
                  className={`sidebar-lb-item ${isCurrentUser ? 'current-user' : ''}`}
                  onClick={() => setOpenLeaderboardModal(true)}
                  title={`${entry.name} • Level ${entry.level} ${entry.title} (${entry.xp} XP)`}
                >
                  <div className="sidebar-lb-rank">
                    {entry.rank === 1
                      ? '🥇'
                      : entry.rank === 2
                      ? '🥈'
                      : entry.rank === 3
                      ? '🥉'
                      : `#${entry.rank}`}
                  </div>

                  <div
                    className="sidebar-lb-avatar"
                    style={{ backgroundColor: entry.avatarColor || 'var(--primary)' }}
                  >
                    {entry.name.charAt(0)}
                  </div>

                  <div className="sidebar-lb-details">
                    <div className="sidebar-lb-name">
                      <span>{entry.name}</span>
                      {isCurrentUser && <span className="sidebar-you-badge">YOU</span>}
                    </div>
                    <div className="sidebar-lb-dept">
                      Lv.{entry.level} • {entry.department?.split(' ')[0] || 'Campus'}
                    </div>
                  </div>

                  <div className="sidebar-lb-xp">
                    <strong>{entry.xp}</strong>
                    <small>XP</small>
                  </div>
                </div>
              );
            })}

            {/* Quick Link to Rewards Shop */}
            <div className="sidebar-redeem-callout">
              <div className="redeem-callout-text">
                <Sparkles size={13} />
                <span>Got {xp} XP? Redeem for 1 Free Print in Library!</span>
              </div>
              <button
                className="btn btn-primary btn-sm sidebar-redeem-action"
                onClick={() => setOpenRewardsModal(true)}
              >
                <span>Redeem Perks</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Status Footer */}
      {user && (
        <div className="sidebar-footer">
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 72, 128, 0.08) 0%, rgba(186, 230, 253, 0.4) 100%)',
              border: '1px solid #bae6fd',
              borderRadius: 'var(--radius-sm)',
              padding: '0.55rem 0.75rem',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>❄️</span>
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                NLU Chicago Grid
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                }}
              >
                Downtown Campus Hub
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: '0.74rem',
              color: 'var(--text-light)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Logged in as
          </div>
          <div
            style={{
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              marginTop: '0.2rem',
            }}
          >
            {user.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {user.department || user.email}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
