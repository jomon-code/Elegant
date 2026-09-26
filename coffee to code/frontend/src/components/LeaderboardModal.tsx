import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Trophy,
  Flame,
  Award,
  Crown,
  Sparkles,
  ArrowRight,
  Gift,
  Shield,
  Star,
} from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardModalProps {
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const { leaderboard, xp, level, setOpenRewardsModal } = useGamification();
  const { user } = useAuth();
  const [filterDept, setFilterDept] = useState<string>('all');

  const top3 = leaderboard.slice(0, 3);
  const ranks4to10 = leaderboard.slice(3, 10);

  const filteredEntries = filterDept === 'all'
    ? leaderboard
    : leaderboard.filter(e => e.department?.toLowerCase().includes(filterDept.toLowerCase()));

  const handleOpenStore = () => {
    onClose();
    setOpenRewardsModal(true);
  };

  return (
    <div className="leaderboard-modal-overlay">
      <div className="leaderboard-modal-container animate-in">
        {/* Header */}
        <div className="leaderboard-header">
          <div className="leaderboard-title-group">
            <div className="leaderboard-crown-icon">
              <Trophy size={22} />
            </div>
            <div>
              <h2 className="leaderboard-heading">Campus Champions Leaderboard</h2>
              <p className="leaderboard-subheading">
                Top 10 academic and campus community contributors this season
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleOpenStore}
              title="Open Perks Store"
            >
              <Gift size={15} />
              <span>Redeem Perks</span>
            </button>

            <button className="leaderboard-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Podium for Top 3 */}
        <div className="leaderboard-podium-section">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="podium-col rank-2">
              <div className="podium-avatar-wrap">
                <div className="podium-avatar silver">
                  {top3[1].name.charAt(0)}
                </div>
                <div className="podium-medal silver">2</div>
              </div>
              <div className="podium-name">{top3[1].name}</div>
              <div className="podium-xp">{top3[1].xp} XP</div>
              <div className="podium-bar silver">
                <span className="podium-tier-label">🥈 Silver</span>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top3[0] && (
            <div className="podium-col rank-1">
              <Crown size={28} className="crown-gold" />
              <div className="podium-avatar-wrap">
                <div className="podium-avatar gold">
                  {top3[0].name.charAt(0)}
                </div>
                <div className="podium-medal gold">1</div>
              </div>
              <div className="podium-name">{top3[0].name}</div>
              <div className="podium-xp gold-text">{top3[0].xp} XP</div>
              <div className="podium-bar gold">
                <span className="podium-tier-label">🥇 Champion</span>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="podium-col rank-3">
              <div className="podium-avatar-wrap">
                <div className="podium-avatar bronze">
                  {top3[2].name.charAt(0)}
                </div>
                <div className="podium-medal bronze">3</div>
              </div>
              <div className="podium-name">{top3[2].name}</div>
              <div className="podium-xp">{top3[2].xp} XP</div>
              <div className="podium-bar bronze">
                <span className="podium-tier-label">🥉 Bronze</span>
              </div>
            </div>
          )}
        </div>

        {/* Top 10 Table */}
        <div className="leaderboard-list-wrap">
          <div className="leaderboard-table-header">
            <span style={{ width: '45px' }}>Rank</span>
            <span style={{ flex: 1 }}>Student / Contributor</span>
            <span style={{ width: '130px', textAlign: 'center' }}>Department</span>
            <span style={{ width: '80px', textAlign: 'center' }}>Streak</span>
            <span style={{ width: '90px', textAlign: 'right' }}>Total XP</span>
          </div>

          <div className="leaderboard-table-body">
            {leaderboard.map((entry) => {
              const isCurrentUser =
                entry.name === (user?.name || 'Alice Johnson') ||
                entry.id === (user?._id || user?.id);

              return (
                <div
                  key={entry.id}
                  className={`leaderboard-row ${isCurrentUser ? 'current-user-row' : ''}`}
                >
                  <div className="rank-num">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </div>

                  <div className="row-user-info">
                    <div
                      className="row-avatar"
                      style={{ backgroundColor: entry.avatarColor || 'var(--primary)' }}
                    >
                      {entry.name.charAt(0)}
                    </div>
                    <div>
                      <div className="row-name">
                        <span>{entry.name}</span>
                        {isCurrentUser && <span className="you-pill">YOU</span>}
                      </div>
                      <div className="row-title">
                        <span>Level {entry.level} • {entry.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className="row-dept">
                    {entry.department || 'General'}
                  </div>

                  <div className="row-streak">
                    {entry.streak ? (
                      <span className="streak-badge">
                        <Flame size={12} /> {entry.streak}d
                      </span>
                    ) : (
                      '—'
                    )}
                  </div>

                  <div className="row-xp">
                    <strong>{entry.xp}</strong> <small>XP</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / Callout */}
        <div className="leaderboard-modal-footer">
          <div className="footer-xp-tip">
            <Sparkles size={16} />
            <span>Earn <strong>+10 XP</strong> per class check-in & <strong>+50 XP</strong> per resolved maintenance ticket!</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleOpenStore}>
            <span>Redeem for Free Print & Perks</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
