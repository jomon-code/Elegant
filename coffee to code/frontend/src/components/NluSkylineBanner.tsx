import React from 'react';

interface NluSkylineBannerProps {
  height?: number | string;
  className?: string;
  showText?: boolean;
}

export const NluSkylineBanner: React.FC<NluSkylineBannerProps> = ({
  height = 180,
  className = '',
  showText = false,
}) => {
  return (
    <div
      className={`nlu-skyline-banner-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 85%, #e0f2fe 100%)',
        borderBottom: '2px solid #bae6fd',
        borderRadius: 'var(--radius-lg, 16px)',
      }}
    >
      <svg
        viewBox="0 0 1200 480"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
          display: 'block',
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Halftone Pattern for Bean and Trees */}
          <pattern id="nlu-dots-cyan" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2" fill="#38bdf8" />
          </pattern>
          <pattern id="nlu-dots-yellow" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="2.2" fill="#facc15" />
          </pattern>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="beanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* ── Background & Sky ── */}
        <rect width="1200" height="480" fill="url(#skyGrad)" />

        {/* ── Background Ferris Wheel (Navy Pier) ── */}
        <g stroke="#7dd3fc" strokeWidth="2.5" fill="none" opacity="0.65">
          <circle cx="850" cy="180" r="160" strokeDasharray="6 4" />
          <circle cx="850" cy="180" r="110" />
          <circle cx="850" cy="180" r="60" />
          {/* Spokes */}
          <line x1="850" y1="20" x2="850" y2="340" />
          <line x1="690" y1="180" x2="1010" y2="180" />
          <line x1="737" y1="67" x2="963" y2="293" />
          <line x1="737" y1="293" x2="963" y2="67" />
          {/* Yellow Gondolas */}
          <circle cx="850" cy="20" r="8" fill="#ffe600" stroke="#004880" strokeWidth="2" />
          <circle cx="1010" cy="180" r="8" fill="#ffe600" stroke="#004880" strokeWidth="2" />
          <circle cx="690" cy="180" r="8" fill="#ffe600" stroke="#004880" strokeWidth="2" />
          <circle cx="963" cy="67" r="8" fill="#0091ea" stroke="#004880" strokeWidth="2" />
          <circle cx="737" cy="67" r="8" fill="#0091ea" stroke="#004880" strokeWidth="2" />
          <circle cx="963" cy="293" r="8" fill="#0091ea" stroke="#004880" strokeWidth="2" />
          <circle cx="737" cy="293" r="8" fill="#0091ea" stroke="#004880" strokeWidth="2" />
        </g>

        {/* ── Festoon Garland String Lights Across Sky ── */}
        <g fill="none" stroke="#38bdf8" strokeWidth="2">
          {/* Left arc */}
          <path d="M 460 30 Q 560 100 660 70" />
          {/* Right arc */}
          <path d="M 660 70 Q 760 110 880 60" />
        </g>
        {/* Light Bulbs */}
        <circle cx="490" cy="55" r="7" fill="#ffe600" stroke="#004880" strokeWidth="2" />
        <circle cx="530" cy="80" r="7" fill="#00a3ff" stroke="#004880" strokeWidth="2" />
        <circle cx="580" cy="88" r="7" fill="#ffe600" stroke="#004880" strokeWidth="2" />
        <circle cx="625" cy="79" r="7" fill="#38bdf8" stroke="#004880" strokeWidth="2" />
        <circle cx="695" cy="85" r="7" fill="#ffe600" stroke="#004880" strokeWidth="2" />
        <circle cx="740" cy="98" r="7" fill="#004880" stroke="#004880" strokeWidth="2" />
        <circle cx="790" cy="92" r="7" fill="#ffe600" stroke="#004880" strokeWidth="2" />
        <circle cx="835" cy="76" r="7" fill="#00a3ff" stroke="#004880" strokeWidth="2" />

        {/* ── Snowflakes / Ice Crystals ── */}
        <g stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round">
          {/* Snowflake 1 */}
          <g transform="translate(60, 45)">
            <line x1="0" y1="-18" x2="0" y2="18" />
            <line x1="-18" y1="0" x2="18" y2="0" />
            <line x1="-12" y1="-12" x2="12" y2="12" />
            <line x1="-12" y1="12" x2="12" y2="-12" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" stroke="#0091ea" strokeWidth="2" />
          </g>
          {/* Snowflake 2 */}
          <g transform="translate(425, 45)">
            <line x1="0" y1="-16" x2="0" y2="16" />
            <line x1="-16" y1="0" x2="16" y2="0" />
            <line x1="-11" y1="-11" x2="11" y2="11" />
            <line x1="-11" y1="11" x2="11" y2="-11" />
          </g>
          {/* Snowflake 3 */}
          <g transform="translate(560, 150)">
            <line x1="0" y1="-14" x2="0" y2="14" />
            <line x1="-14" y1="0" x2="14" y2="0" />
            <line x1="-10" y1="-10" x2="10" y2="10" />
            <line x1="-10" y1="10" x2="10" y2="-10" />
          </g>
        </g>

        {/* ── Left Skyscraper (Willis Tower Style) ── */}
        <g>
          <rect x="35" y="60" width="105" height="320" fill="#ffffff" stroke="#004880" strokeWidth="3.5" />
          {/* Antenna */}
          <line x1="87" y1="60" x2="87" y2="15" stroke="#004880" strokeWidth="4" />
          <circle cx="87" cy="15" r="4" fill="#004880" />
          {/* Horizontal bands */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="35" y1={85 + i * 24} x2="140" y2={85 + i * 24} stroke="#0091ea" strokeWidth="2.5" />
          ))}
        </g>

        {/* ── National Louis University Main Campus Building ── */}
        <g>
          <rect x="155" y="80" width="180" height="300" fill="#e2e8f0" stroke="#004880" strokeWidth="4" />
          
          {/* Billboard Sign on Roof: NATIONAL LOUIS UNIVERSITY */}
          <rect x="150" y="24" width="190" height="56" fill="#ffffff" stroke="#004880" strokeWidth="3.5" rx="3" />
          {/* Support beams */}
          <line x1="180" y1="80" x2="180" y2="70" stroke="#004880" strokeWidth="4" />
          <line x1="310" y1="80" x2="310" y2="70" stroke="#004880" strokeWidth="4" />
          
          {/* NLU Seal / Logo in Billboard */}
          <g transform="translate(162, 33)">
            <circle cx="18" cy="18" r="16" fill="#004880" />
            <circle cx="18" cy="18" r="13" fill="#ffffff" />
            <polygon points="18,8 28,26 8,26" fill="#004880" />
            <polygon points="18,13 24,24 12,24" fill="#ffffff" />
          </g>
          {/* Text in Billboard */}
          <text x="204" y="44" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="10.5" fontWeight="800" fill="#004880" letterSpacing="1">
            NATIONAL
          </text>
          <text x="204" y="56" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="10.5" fontWeight="800" fill="#004880" letterSpacing="1">
            LOUIS
          </text>
          <text x="204" y="68" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="8" fontWeight="700" fill="#004880" letterSpacing="0.8">
            UNIVERSITY
          </text>

          {/* Decorative roof corbels */}
          <path d="M 165 92 Q 175 84 185 92 Q 195 84 205 92" fill="none" stroke="#004880" strokeWidth="3" />
          <path d="M 285 92 Q 295 84 305 92 Q 315 84 325 92" fill="none" stroke="#004880" strokeWidth="3" />

          {/* Building Windows Grid with glowing yellow windows! */}
          {/* Row 1 */}
          <rect x="170" y="110" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="210" y="110" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="250" y="110" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="290" y="110" width="32" height="28" fill="#ffe600" stroke="#004880" strokeWidth="2" /> {/* Glowing yellow window! */}

          {/* Row 2 */}
          <rect x="170" y="150" width="32" height="28" fill="#0091ea" stroke="#004880" strokeWidth="2" />
          <rect x="210" y="150" width="32" height="28" fill="#94a3b8" stroke="#004880" strokeWidth="2" />
          <rect x="250" y="150" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="290" y="150" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />

          {/* Row 3 */}
          <rect x="170" y="190" width="32" height="28" fill="#ffe600" stroke="#004880" strokeWidth="2" /> {/* Glowing yellow window! */}
          <rect x="210" y="190" width="32" height="28" fill="#ffe600" stroke="#004880" strokeWidth="2" /> {/* Glowing yellow window! */}
          <rect x="250" y="190" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="290" y="190" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />

          {/* Row 4 */}
          <rect x="170" y="230" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="210" y="230" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="250" y="230" width="32" height="28" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="290" y="230" width="32" height="28" fill="#0091ea" stroke="#004880" strokeWidth="2" />

          {/* Vertical decorative mullions */}
          <line x1="206" y1="100" x2="206" y2="380" stroke="#004880" strokeWidth="3" />
          <line x1="286" y1="100" x2="286" y2="380" stroke="#004880" strokeWidth="3" />
        </g>

        {/* ── Center-Left John Hancock Cross-Braced Tower ── */}
        <g>
          {/* Tapered tower */}
          <polygon points="360,380 475,380 460,5 375,5" fill="#bae6fd" stroke="#004880" strokeWidth="3.5" />
          {/* Cross bracing (X) */}
          <line x1="375" y1="5" x2="475" y2="190" stroke="#ffffff" strokeWidth="5" />
          <line x1="460" y1="5" x2="360" y2="190" stroke="#ffffff" strokeWidth="5" />
          <line x1="375" y1="5" x2="475" y2="190" stroke="#004880" strokeWidth="2.5" />
          <line x1="460" y1="5" x2="360" y2="190" stroke="#004880" strokeWidth="2.5" />

          <line x1="365" y1="190" x2="475" y2="380" stroke="#ffffff" strokeWidth="5" />
          <line x1="470" y1="190" x2="360" y2="380" stroke="#ffffff" strokeWidth="5" />
          <line x1="365" y1="190" x2="475" y2="380" stroke="#004880" strokeWidth="2.5" />
          <line x1="470" y1="190" x2="360" y2="380" stroke="#004880" strokeWidth="2.5" />
        </g>

        {/* ── Angled Facade Buildings Behind The Bean (Crain Communications Building Style) ── */}
        <g>
          <polygon points="630,90 705,35 705,380 630,380" fill="#bae6fd" stroke="#004880" strokeWidth="3.5" />
          <polygon points="705,35 805,130 805,380 705,380" fill="#0077c8" stroke="#004880" strokeWidth="3.5" />
          {/* Snowflake inside diamond rooftop */}
          <g transform="translate(755, 95)" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round">
            <line x1="0" y1="-16" x2="0" y2="16" />
            <line x1="-16" y1="0" x2="16" y2="0" />
            <line x1="-11" y1="-11" x2="11" y2="11" />
            <line x1="-11" y1="11" x2="11" y2="-11" />
          </g>
          {/* Horizontal lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="630" y1={120 + i * 20} x2="705" y2={120 + i * 20} stroke="#ffffff" strokeWidth="2.5" />
          ))}
        </g>

        {/* ── Historic Chicago Clock Tower (Wrigley Building style) ── */}
        <g>
          {/* Main Tower Body */}
          <rect x="800" y="130" width="140" height="250" fill="#e2e8f0" stroke="#004880" strokeWidth="4" />
          {/* Center Upper Section */}
          <rect x="835" y="45" width="70" height="85" fill="#f8fafc" stroke="#004880" strokeWidth="3.5" />
          {/* Cupola roof */}
          <polygon points="840,45 870,10 900,45" fill="#004880" />

          {/* Yellow Glowing Clock Face */}
          <circle cx="870" cy="80" r="22" fill="#ffe600" stroke="#004880" strokeWidth="3" />
          <circle cx="870" cy="80" r="16" fill="#ffe600" stroke="#004880" strokeWidth="1" strokeDasharray="2 2" />
          {/* Clock Hands pointing to 12:00 */}
          <line x1="870" y1="80" x2="870" y2="67" stroke="#004880" strokeWidth="3" strokeLinecap="round" />
          <line x1="870" y1="80" x2="879" y2="80" stroke="#004880" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="870" cy="80" r="2.5" fill="#004880" />

          {/* Tower Arched Windows */}
          <rect x="855" y="105" width="12" height="20" rx="6" fill="#0091ea" stroke="#004880" strokeWidth="1.5" />
          <rect x="873" y="105" width="12" height="20" rx="6" fill="#0091ea" stroke="#004880" strokeWidth="1.5" />

          {/* Grid Windows on Lower Tower with yellow glow windows */}
          {/* Row 1 */}
          <rect x="815" y="150" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="845" y="150" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="875" y="150" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="905" y="150" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />

          {/* Row 2 */}
          <rect x="815" y="185" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="845" y="185" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="875" y="185" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="905" y="185" width="22" height="26" fill="#ffe600" stroke="#004880" strokeWidth="2" /> {/* Yellow window */}

          {/* Row 3 */}
          <rect x="815" y="220" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="845" y="220" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="875" y="220" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="905" y="220" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />

          {/* Row 4 */}
          <rect x="815" y="255" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="845" y="255" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="875" y="255" width="22" height="26" fill="#004880" stroke="#004880" strokeWidth="2" />
          <rect x="905" y="255" width="22" height="26" fill="#ffe600" stroke="#004880" strokeWidth="2" /> {/* Yellow window */}

          {/* Additional right wing windows */}
          <rect x="935" y="270" width="14" height="24" fill="#ffe600" stroke="#004880" strokeWidth="1.5" />
        </g>

        {/* ── Millennium Park: Cloud Gate ("The Bean") with Festive Yellow Bow! ── */}
        <g>
          {/* Main Bean Dome */}
          <path
            d="M 370 380 C 370 200, 680 200, 780 380 C 720 380, 710 320, 580 320 C 450 320, 440 380, 370 380 Z"
            fill="url(#beanGrad)"
            stroke="#004880"
            strokeWidth="4"
          />
          {/* Halftone texture overlay on top of bean */}
          <path
            d="M 370 380 C 370 200, 680 200, 780 380 C 720 380, 710 320, 580 320 C 450 320, 440 380, 370 380 Z"
            fill="url(#nlu-dots-cyan)"
            opacity="0.8"
          />
          {/* Inner reflection arch */}
          <path
            d="M 465 380 C 465 335, 655 335, 685 380"
            fill="#0077c8"
            stroke="#004880"
            strokeWidth="3.5"
          />

          {/* Festive Bow Ribbon on Top of the Bean */}
          <g transform="translate(570, 160)">
            {/* Left Bow Loop */}
            <path
              d="M 0 45 C -45 20, -50 0, -25 -10 C 0 -20, 5 30, 0 45 Z"
              fill="#ffffff"
              stroke="#004880"
              strokeWidth="3.5"
            />
            {/* Left Bow Inner Ribbon (Bright Yellow) */}
            <path
              d="M -5 35 C -35 20, -40 5, -20 -3 C -5 -10, 0 25, -5 35 Z"
              fill="#ffe600"
              stroke="#004880"
              strokeWidth="2.5"
            />
            {/* Right Bow Loop */}
            <path
              d="M 0 45 C 45 20, 50 0, 25 -10 C 0 -20, -5 30, 0 45 Z"
              fill="#ffffff"
              stroke="#004880"
              strokeWidth="3.5"
            />
            {/* Right Bow Inner Ribbon (Bright Yellow) */}
            <path
              d="M 5 35 C 35 20, 40 5, 20 -3 C 5 -10, 0 25, 5 35 Z"
              fill="#ffe600"
              stroke="#004880"
              strokeWidth="2.5"
            />
            {/* Hanging Ribbon Tails */}
            <polygon points="-15,45 -25,95 -5,80 0,45" fill="#e2e8f0" stroke="#004880" strokeWidth="3" />
            <polygon points="15,45 25,95 5,80 0,45" fill="#e2e8f0" stroke="#004880" strokeWidth="3" />
            {/* Center Knot (Bright Blue / Yellow) */}
            <circle cx="0" cy="40" r="14" fill="#0091ea" stroke="#004880" strokeWidth="3.5" />
            <circle cx="0" cy="40" r="8" fill="#ffe600" />
          </g>
        </g>

        {/* ── Festive Winter Holiday Pine Tree on Left ── */}
        <g>
          {/* Tree Base / Tier 3 */}
          <path
            d="M 2 380 Q 40 360 85 360 Q 130 360 170 380 Q 150 330 140 310 L 30 310 Z"
            fill="#bae6fd"
            stroke="#004880"
            strokeWidth="3.5"
          />
          {/* Tier 2 */}
          <path
            d="M 25 310 Q 55 285 85 285 Q 115 285 145 310 Q 130 250 120 230 L 50 230 Z"
            fill="#bae6fd"
            stroke="#004880"
            strokeWidth="3.5"
          />
          {/* Tier 1 (Top) */}
          <path
            d="M 45 230 Q 65 205 85 205 Q 105 205 125 230 L 85 135 Z"
            fill="#bae6fd"
            stroke="#004880"
            strokeWidth="3.5"
          />
          {/* Snowy Scallop Edges */}
          <path
            d="M 25 310 Q 40 325 55 310 Q 70 325 85 310 Q 100 325 115 310 Q 130 325 145 310"
            fill="#ffffff"
            stroke="#004880"
            strokeWidth="3"
          />
          <path
            d="M 2 380 Q 25 395 50 380 Q 75 395 100 380 Q 125 395 150 380 Q 165 395 170 380"
            fill="#ffffff"
            stroke="#004880"
            strokeWidth="3"
          />
          {/* Golden Star on Top */}
          <polygon
            points="85,115 90,130 105,130 93,140 98,155 85,145 72,155 77,140 65,130 80,130"
            fill="#ffe600"
            stroke="#004880"
            strokeWidth="2.5"
          />
          {/* Blue & Gold Baubles */}
          <circle cx="65" cy="215" r="6" fill="#004880" stroke="#004880" strokeWidth="2" />
          <circle cx="105" cy="270" r="7" fill="#ffe600" stroke="#004880" strokeWidth="2" />
          <circle cx="55" cy="340" r="8" fill="#0091ea" stroke="#004880" strokeWidth="2" />
          <circle cx="115" cy="345" r="7" fill="#ffe600" stroke="#004880" strokeWidth="2" />
          {/* Wrapped Holiday Gift Box */}
          <rect x="52" y="348" width="46" height="32" fill="#ffffff" stroke="#004880" strokeWidth="3" />
          <line x1="75" y1="348" x2="75" y2="380" stroke="#0091ea" strokeWidth="3" />
          <line x1="52" y1="364" x2="98" y2="364" stroke="#0091ea" strokeWidth="3" />
          <rect x="100" y="362" width="35" height="18" fill="#ffe600" stroke="#004880" strokeWidth="2.5" />
        </g>

        {/* ── Winter Deciduous Trees with Yellow and Blue Foliage ── */}
        <g>
          {/* Stylized White/Blue Pine (Far Left) */}
          <path d="M 160 380 C 140 330, 140 280, 175 250 C 210 280, 210 330, 190 380 Z" fill="#0091ea" stroke="#004880" strokeWidth="3" />
          <line x1="175" y1="250" x2="175" y2="380" stroke="#ffffff" strokeWidth="3" />

          {/* Rounded White Poplar Tree */}
          <path d="M 230 380 C 210 320, 210 260, 250 240 C 290 260, 290 320, 270 380 Z" fill="#ffffff" stroke="#004880" strokeWidth="3" />
          <line x1="250" y1="240" x2="250" y2="380" stroke="#004880" strokeWidth="3" />

          {/* Yellow Dotted Foliage Tree on Right */}
          <path
            d="M 685 380 C 660 350, 660 280, 710 255 C 740 240, 780 260, 785 300 C 810 320, 805 360, 785 380 Z"
            fill="#fef08a"
            stroke="#004880"
            strokeWidth="3.5"
          />
          <path
            d="M 685 380 C 660 350, 660 280, 710 255 C 740 240, 780 260, 785 300 C 810 320, 805 360, 785 380 Z"
            fill="url(#nlu-dots-yellow)"
          />
          <line x1="740" y1="280" x2="740" y2="380" stroke="#004880" strokeWidth="3.5" />

          {/* Cyan Dotted Cloud Tree on Right */}
          <path
            d="M 780 380 C 765 340, 775 285, 825 260 C 875 240, 920 285, 915 340 C 935 360, 925 380, 905 380 Z"
            fill="#38bdf8"
            stroke="#004880"
            strokeWidth="3.5"
          />
          <path
            d="M 780 380 C 765 340, 775 285, 825 260 C 875 240, 920 285, 915 340 C 935 360, 925 380, 905 380 Z"
            fill="url(#nlu-dots-cyan)"
          />
          <line x1="850" y1="280" x2="850" y2="380" stroke="#ffffff" strokeWidth="3.5" />

          {/* Right Snowy Christmas Pine */}
          <g transform="translate(930, 220)">
            <polygon points="50,0 20,60 80,60" fill="#bae6fd" stroke="#004880" strokeWidth="3" />
            <polygon points="50,50 10,110 90,110" fill="#bae6fd" stroke="#004880" strokeWidth="3" />
            <polygon points="50,100 0,160 100,160" fill="#bae6fd" stroke="#004880" strokeWidth="3" />
            <polygon points="50,-10 54,0 65,0 56,8 60,18 50,12 40,18 44,8 35,0 46,0" fill="#ffe600" stroke="#004880" strokeWidth="1.5" />
          </g>
        </g>

        {/* ── Shoreline Divider ── */}
        <line x1="0" y1="380" x2="1200" y2="380" stroke="#004880" strokeWidth="4" />

        {/* ── Chicago River / Lake Michigan Animated Waves ── */}
        <g stroke="#0091ea" strokeWidth="4" fill="none" strokeLinecap="round">
          {/* Wave 1 */}
          <path d="M 0 405 C 50 395, 80 415, 130 405 C 180 395, 210 415, 260 405 C 310 395, 340 415, 390 405 C 440 395, 470 415, 520 405 C 570 395, 600 415, 650 405 C 700 395, 730 415, 780 405 C 830 395, 860 415, 910 405 C 960 395, 990 415, 1040 405 C 1090 395, 1120 415, 1200 405" />
          {/* Wave 2 */}
          <path d="M 0 435 C 50 425, 80 445, 130 435 C 180 425, 210 445, 260 435 C 310 425, 340 445, 390 435 C 440 425, 470 445, 520 435 C 570 425, 600 445, 650 435 C 700 425, 730 445, 780 435 C 830 425, 860 445, 910 435 C 960 425, 990 445, 1040 435 C 1090 425, 1120 445, 1200 435" />
          {/* Wave 3 (Ice Cyan) */}
          <path
            d="M 0 465 C 50 455, 80 475, 130 465 C 180 455, 210 475, 260 465 C 310 455, 340 475, 390 465 C 440 455, 470 475, 520 465 C 570 455, 600 475, 650 465 C 700 455, 730 475, 780 465 C 830 455, 860 475, 910 465 C 960 455, 990 475, 1040 465 C 1090 455, 1120 475, 1200 465"
            stroke="#38bdf8"
            strokeWidth="3.5"
          />
        </g>

        {/* ── Chicago Water Taxi / Tour Boat Cruising on River ── */}
        <g transform="translate(730, 395)">
          {/* Boat Cabin Upper Roof */}
          <rect x="75" y="5" width="200" height="8" fill="#ffffff" stroke="#004880" strokeWidth="2.5" />
          {/* Boat Railing posts */}
          <line x1="85" y1="5" x2="85" y2="13" stroke="#004880" strokeWidth="2.5" />
          <line x1="110" y1="5" x2="110" y2="13" stroke="#004880" strokeWidth="2.5" />
          <line x1="135" y1="5" x2="135" y2="13" stroke="#004880" strokeWidth="2.5" />
          <line x1="160" y1="5" x2="160" y2="13" stroke="#004880" strokeWidth="2.5" />
          <line x1="185" y1="5" x2="185" y2="13" stroke="#004880" strokeWidth="2.5" />
          <line x1="210" y1="5" x2="210" y2="13" stroke="#004880" strokeWidth="2.5" />
          <line x1="235" y1="5" x2="235" y2="13" stroke="#004880" strokeWidth="2.5" />
          <line x1="260" y1="5" x2="260" y2="13" stroke="#004880" strokeWidth="2.5" />

          {/* Cabin Body */}
          <polygon points="50,15 280,15 285,42 30,42" fill="#ffffff" stroke="#004880" strokeWidth="3" />
          {/* Wheelhouse Window */}
          <polygon points="53,20 68,20 62,35 45,35" fill="#0077c8" stroke="#004880" strokeWidth="2" />
          {/* Passenger Windows */}
          <rect x="75" y="22" width="16" height="15" fill="#004880" stroke="#004880" strokeWidth="1.5" />
          <rect x="100" y="22" width="16" height="15" fill="#004880" stroke="#004880" strokeWidth="1.5" />
          <rect x="125" y="22" width="16" height="15" fill="#004880" stroke="#004880" strokeWidth="1.5" />
          <rect x="150" y="22" width="16" height="15" fill="#004880" stroke="#004880" strokeWidth="1.5" />
          <rect x="175" y="22" width="16" height="15" fill="#004880" stroke="#004880" strokeWidth="1.5" />
          <rect x="200" y="22" width="16" height="15" fill="#ffe600" stroke="#004880" strokeWidth="1.5" /> {/* Glowing yellow window! */}
          <rect x="225" y="22" width="16" height="15" fill="#004880" stroke="#004880" strokeWidth="1.5" />
          <rect x="250" y="22" width="16" height="15" fill="#004880" stroke="#004880" strokeWidth="1.5" />

          {/* Lower Hull (Azure Blue) */}
          <polygon points="5,42 290,42 280,68 40,68" fill="#0077c8" stroke="#004880" strokeWidth="3.5" />
          {/* Life Rings */}
          <g transform="translate(60, 54)">
            <circle cx="0" cy="0" r="9" fill="#ffffff" stroke="#004880" strokeWidth="2" />
            <circle cx="0" cy="0" r="4.5" fill="#0077c8" stroke="#004880" strokeWidth="1.5" />
            <line x1="-9" y1="0" x2="-4.5" y2="0" stroke="#ffe600" strokeWidth="3" />
            <line x1="4.5" y1="0" x2="9" y2="0" stroke="#ffe600" strokeWidth="3" />
          </g>
          <g transform="translate(85, 54)">
            <circle cx="0" cy="0" r="9" fill="#ffffff" stroke="#004880" strokeWidth="2" />
            <circle cx="0" cy="0" r="4.5" fill="#0077c8" stroke="#004880" strokeWidth="1.5" />
            <line x1="-9" y1="0" x2="-4.5" y2="0" stroke="#ffe600" strokeWidth="3" />
            <line x1="4.5" y1="0" x2="9" y2="0" stroke="#ffe600" strokeWidth="3" />
          </g>
        </g>

        {/* Optional Title Overlay */}
        {showText && (
          <g transform="translate(40, 440)">
            <rect x="0" y="-30" width="380" height="38" fill="rgba(255,255,255,0.92)" stroke="#004880" strokeWidth="2" rx="8" />
            <text x="16" y="-6" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="16" fontWeight="800" fill="#004880">
              NATIONAL LOUIS UNIVERSITY
            </text>
            <text x="270" y="-6" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="13" fontWeight="700" fill="#0091ea">
              SMART CAMPUS
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default NluSkylineBanner;
