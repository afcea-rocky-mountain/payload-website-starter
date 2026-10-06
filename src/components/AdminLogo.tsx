import React from 'react'

/** Wordmark shown on the admin login screen and in the nav. */
export const AdminLogo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <AdminIcon />
    <span
      style={{
        fontFamily: 'Fraunces, Georgia, serif',
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: '-0.02em',
      }}
    >
      AFCEA Rocky Mountain
    </span>
  </div>
)

/** Same mark as public/favicon.svg so the admin, tab icon and site all share one brand. */
export const AdminIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="15" fill="#020668" />
    <circle cx="16" cy="16" r="10" fill="none" stroke="#c9a85c" strokeWidth="1" />
    <circle cx="16" cy="16" r="6" fill="none" stroke="#c9a85c" strokeWidth="1" opacity=".75" />
    <path
      d="M16 4 L24 22 L8 22 Z"
      fill="none"
      stroke="#c9a85c"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)
