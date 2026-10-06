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

export const AdminIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
    <rect width="28" height="28" fill="#103C6D" />
    <polygon points="0,20 28,6 28,0 0,0" fill="#c9a85c" opacity="0.9" />
  </svg>
)
