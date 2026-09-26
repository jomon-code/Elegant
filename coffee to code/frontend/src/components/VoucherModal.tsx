import React, { useState } from 'react';
import { X, Check, Copy, Printer, Coffee, Zap, Headphones, BookOpen, Star, Tag, Award, Sparkles } from 'lucide-react';
import { RedeemedVoucher } from '../types';
import toast from 'react-hot-toast';

interface VoucherModalProps {
  voucher: RedeemedVoucher;
  onClose: () => void;
}

const VoucherModal: React.FC<VoucherModalProps> = ({ voucher, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.voucherCode);
    setCopied(true);
    toast.success('Voucher code copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const getPerkIcon = (cat: string) => {
    switch (cat) {
      case 'academic': return <Printer size={32} />;
      case 'dining': return <Coffee size={32} />;
      case 'facility': return <Headphones size={32} />;
      case 'store': return <Tag size={32} />;
      case 'event': return <Star size={32} />;
      default: return <Award size={32} />;
    }
  };

  return (
    <div className="voucher-modal-overlay">
      <div className="voucher-card animate-in">
        {/* Header */}
        <div className="voucher-header">
          <div className="voucher-badge-top">
            <Sparkles size={14} />
            <span>NLU Verified Campus Perk</span>
          </div>
          <button className="voucher-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Voucher Body */}
        <div className="voucher-body">
          <div className="voucher-icon-circle">
            {getPerkIcon(voucher.category)}
          </div>

          <h2 className="voucher-title">{voucher.perkTitle}</h2>
          <p className="voucher-subtitle">
            Redeemed for <strong>{voucher.cost} XP</strong> • Status: <span style={{ color: 'var(--success, #10b981)', fontWeight: 700 }}>ACTIVE</span>
          </p>

          {/* Ticket Barcode / Code Box */}
          <div className="voucher-code-box">
            <div className="voucher-code-label">OFFICIAL PASS CODE</div>
            <div className="voucher-code-digits">{voucher.voucherCode}</div>
            
            <button
              className={`voucher-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Simulated Stylized Barcode */}
          <div className="voucher-barcode-wrapper">
            <div className="voucher-barcode-lines">
              {Array.from({ length: 42 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: (i % 3 === 0 ? '3px' : i % 5 === 0 ? '4px' : '1.5px'),
                    height: '38px',
                    backgroundColor: '#002244',
                    marginRight: '2px',
                    opacity: i % 7 === 0 ? 0.4 : 0.9,
                  }}
                />
              ))}
            </div>
            <div className="voucher-barcode-sub">AUTHENTICATED • SCAN AT CAMPUS TERMINAL</div>
          </div>

          {/* Instructions */}
          <div className="voucher-instructions">
            <div className="voucher-inst-item">
              <span className="inst-num">1</span>
              <span>Present this pass or barcode at the respective campus desk / self-kiosk.</span>
            </div>
            <div className="voucher-inst-item">
              <span className="inst-num">2</span>
              <span>Valid until {new Date(voucher.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="voucher-footer">
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
            Done & Save Pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;
