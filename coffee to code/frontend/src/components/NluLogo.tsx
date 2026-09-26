import React from 'react';

interface NluLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const NluLogo: React.FC<NluLogoProps> = ({
  size = 36,
  className = '',
  showText = false,
}) => {
  return (
    <div
      className={`nlu-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer Dark Blue Ring */}
        <circle cx="50" cy="50" r="48" fill="#004880" stroke="#004880" strokeWidth="2" />
        {/* Outer White Border Line */}
        <circle cx="50" cy="50" r="43" fill="#004880" stroke="#ffffff" strokeWidth="2.5" />
        {/* Inner Light Blue Cavity */}
        <circle cx="50" cy="50" r="38" fill="#0077c8" stroke="#ffffff" strokeWidth="1.5" />

        {/* NLU Stylized Delta / Triangle Crest */}
        <polygon
          points="50,18 80,72 20,72"
          fill="#ffffff"
          stroke="#004880"
          strokeWidth="3"
        />
        {/* Inner Cutout Triangle */}
        <polygon
          points="50,30 70,66 30,66"
          fill="#004880"
        />
        {/* Central Core Triangle (Bright Yellow / Gold accent) */}
        <polygon
          points="50,42 62,62 38,62"
          fill="#ffe600"
        />

        {/* Laurel wreath accents on sides */}
        <path
          d="M 12 50 C 12 70, 30 88, 50 88 C 70 88, 88 70, 88 50"
          stroke="#ffe600"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 6"
        />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.95rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            NATIONAL LOUIS
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            UNIVERSITY • 1886
          </span>
        </div>
      )}
    </div>
  );
};

export default NluLogo;
