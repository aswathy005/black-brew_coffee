import React from 'react';

export function BrandLogo({ size = 'md', onClick }) {
  const isSmall = size === 'sm';

  return (
    <a
      href="#home"
      onClick={onClick}
      className="brand-logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '10px' : '12px',
        textDecoration: 'none',
        flexShrink: 0,
      }}
      aria-label="BLACK & BREW Coffee House"
    >
      <svg
        width={isSmall ? 34 : 40}
        height={isSmall ? 34 : 40}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Steam Flourishes */}
        <path
          d="M17.5 14C17.5 11 20 9.5 20 6.5"
          stroke="#FFC928"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M23 13C23 10.5 25.5 9 25 6"
          stroke="#FFC928"
          strokeWidth="1.9"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Cup Body */}
        <path
          d="M10 18.5H31V24.5C31 29.7467 26.7467 34 21.5 34H19.5C14.2533 34 10 29.7467 10 24.5V18.5Z"
          stroke="#FFC928"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Cup Liquid Line */}
        <path
          d="M13 21.5H28"
          stroke="#FFC928"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Handle */}
        <path
          d="M31 20.5H34C35.933 20.5 37.5 22.067 37.5 24C37.5 25.933 35.933 27.5 34 27.5H30.5"
          stroke="#FFC928"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Saucer */}
        <path
          d="M7 37.5C11.5 39.2 29.5 39.2 34 37.5"
          stroke="#FFC928"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: isSmall ? '1.08rem' : '1.24rem',
            letterSpacing: '0.02em',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
          }}
        >
          BLACK &amp; BREW
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: isSmall ? '0.52rem' : '0.58rem',
            letterSpacing: '0.26em',
            color: '#D4B76A',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}
        >
          COFFEE HOUSE
        </span>
      </div>
    </a>
  );
}

