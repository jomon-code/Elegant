import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import {
  X,
  Sparkles,
  Printer,
  Coffee,
  Zap,
  Headphones,
  BookOpen,
  Star,
  Tag,
  Gift,
  Ticket,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Lock,
  Flame,
  Award,
} from 'lucide-react';
import { PerkItem, RedeemedVoucher } from '../types';

interface RewardsModalProps {
  onClose: () => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ onClose }) => {
  const {
    xp,
    level,
    title,
    nextLevelXp,
    streak,
    perks,
    redeemedPerks,
    redeemPerk,
    profile,
    setActiveVoucherModal,
  } = useGamification();

  const [activeTab, setActiveTab] = useState<'store' | 'vouchers' | 'rules'>('store');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const handleRedeem = async (perk: PerkItem) => {
    setRedeemingId(perk.id);
    try {
      await redeemPerk(perk.id);
    } finally {
      setRedeemingId(null);
    }
  };

  const getPerkIcon = (cat: string) => {
    switch (cat) {
      case 'academic': return <Printer size={24} />;
      case 'dining': return <Coffee size={24} />;
      case 'facility': return <Headphones size={24} />;
      case 'store': return <Tag size={24} />;
      case 'event': return <Star size={24} />;
      default: return <Gift size={24} />;
    }
  };

  const xpProgressPercent = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  return (
    <div className="rewards-modal-overlay">
      <div className="rewards-modal-container animate-in">
        {/* Modal Top Header */}
        <div className="rewards-modal-header">
          <div className="rewards-brand-badge">
            <Sparkles size={16} />
            <span>Campus XP & Perks Vault</span>
          </div>
          <button className="rewards-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* User XP Hero Banner */}
        <div className="rewards-hero">
          <div className="rewards-hero-content">
            <div className="rewards-hero-left">
              <div className="rewards-level-tag">
                <span>Level {level}</span> • <strong>{title}</strong>
              </div>
              <div className="rewards-xp-balance">
                <span className="rewards-xp-number">{xp}</span>
                <span className="rewards-xp-unit">XP Balance</span>
              </div>
              <div className="rewards-streak-chip">
                <Flame size={14} className="streak-flame" />
                <span>{streak}-Day Active Streak</span>
              </div>
            </div>

            <div className="rewards-hero-right">
              <div className="rewards-progress-label">
                <span>Progress to Next Rank</span>
                <span>{xp} / {nextLevelXp} XP</span>
              </div>
              <div className="rewards-progress-track">
                <div
                  className="rewards-progress-bar"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
              <div className="rewards-progress-sub">
                {nextLevelXp - xp > 0 ? `${nextLevelXp - xp} XP needed for Level ${level + 1}` : 'Maximum level reached!'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="rewards-tabs">
          <button
            className={`rewards-tab ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            <Gift size={16} />
            <span>Perks Store ({perks.length})</span>
          </button>
          <button
            className={`rewards-tab ${activeTab === 'vouchers' ? 'active' : ''}`}
            onClick={() => setActiveTab('vouchers')}
          >
            <Ticket size={16} />
            <span>My Vouchers ({redeemedPerks.length})</span>
          </button>
          <button
            className={`rewards-tab ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <Award size={16} />
            <span>How to Earn XP</span>
          </button>
        </div>

        {/* Tab 1: Perks Catalog */}
        {activeTab === 'store' && (
          <div className="rewards-body-scroll">
            <div className="rewards-perks-grid">
              {perks.map((perk) => {
                const canAfford = xp >= perk.cost;
                const isRedeeming = redeemingId === perk.id;

                return (
                  <div
                    key={perk.id}
                    className={`perk-card ${!canAfford ? 'locked' : ''} ${perk.id === 'perk_print' ? 'highlight-featured' : ''}`}
                  >
                    {perk.tag && <div className="perk-tag">{perk.tag}</div>}

                    <div className="perk-card-top">
                      <div className="perk-icon-bubble">
                        {getPerkIcon(perk.category)}
                      </div>
                      <div className="perk-cost-chip">
                        <span>{perk.cost} XP</span>
                      </div>
                    </div>

                    <h3 className="perk-title">{perk.title}</h3>
                    <p className="perk-desc">{perk.description}</p>

                    <div className="perk-card-footer">
                      <div className="perk-validity">
                        <Clock size={12} />
                        <span>Valid {perk.expiryDays} days once claimed</span>
                      </div>

                      <button
                        className={`btn ${canAfford ? 'btn-primary' : 'btn-secondary'} btn-sm perk-redeem-btn`}
                        disabled={!canAfford || isRedeeming}
                        onClick={() => handleRedeem(perk)}
                      >
                        {isRedeeming ? (
                          'Issuing Pass...'
                        ) : canAfford ? (
                          <>
                            <span>Redeem Perk</span>
                            <ArrowRight size={14} />
                          </>
                        ) : (
                          <>
                            <Lock size={13} />
                            <span>Need {perk.cost - xp} more XP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Redeemed Vouchers */}
        {activeTab === 'vouchers' && (
          <div className="rewards-body-scroll">
            {redeemedPerks.length === 0 ? (
              <div className="rewards-empty-state">
                <Ticket size={48} className="empty-icon" />
                <h3>No Vouchers Claimed Yet</h3>
                <p>Redeem your earned XP from class attendance or resolved tickets to unlock free library prints, coffee & passes!</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('store')}>
                  Browse Perks Store
                </button>
              </div>
            ) : (
              <div className="vouchers-list">
                {redeemedPerks.map((vouch) => (
                  <div key={vouch.id} className="voucher-item-row">
                    <div className="voucher-item-icon">
                      {getPerkIcon(vouch.category)}
                    </div>
                    <div className="voucher-item-info">
                      <div className="voucher-item-title">{vouch.perkTitle}</div>
                      <div className="voucher-item-meta">
                        <span>Code: <strong>{vouch.voucherCode}</strong></span>
                        <span>•</span>
                        <span>Expires {new Date(vouch.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="voucher-item-action">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveVoucherModal(vouch)}
                      >
                        View Digital Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: How to Earn XP Rules */}
        {activeTab === 'rules' && (
          <div className="rewards-body-scroll">
            <div className="xp-rules-container">
              <div className="xp-rule-card">
                <div className="rule-badge-xp">+10 XP</div>
                <div className="rule-info">
                  <h4>Attend Class & QR Check-In</h4>
                  <p>Scan the cryptographic QR token during lecture to automatically log presence and receive instant XP.</p>
                </div>
              </div>

              <div className="xp-rule-card highlight-rule">
                <div className="rule-badge-xp gold">+50 XP</div>
                <div className="rule-info">
                  <h4>File Campus Ticket & Resolve</h4>
                  <p>Earn <strong>+15 XP</strong> when filing an infrastructure issue, plus <strong>+35 XP</strong> when verified resolved (+50 XP total)!</p>
                </div>
              </div>

              <div className="xp-rule-card">
                <div className="rule-badge-xp">+30 XP</div>
                <div className="rule-info">
                  <h4>Report Found Item (Good Samaritan)</h4>
                  <p>Return lost IDs, books, or devices to campus reception or post a report on Lost & Found.</p>
                </div>
              </div>

              <div className="xp-rule-card">
                <div className="rule-badge-xp">+20 XP</div>
                <div className="rule-info">
                  <h4>RSVP & Attend Campus Events</h4>
                  <p>Join hackathons, workshops, cultural summits, or academic seminars to grow your network and score XP.</p>
                </div>
              </div>

              <div className="xp-rule-card">
                <div className="rule-badge-xp">+15 XP</div>
                <div className="rule-info">
                  <h4>Daily Campus Grid Check-In</h4>
                  <p>Log in daily to maintain your consecutive streak and unlock rare multiplier bonuses.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsModal;
