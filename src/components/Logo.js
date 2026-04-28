import React from 'react';
import { SiSpeedtest } from 'react-icons/si';

export default function Logo({ size = 'md', showTagline = false }) {
  const sizes = {
    sm: { icon: 20, title: '1rem', tagline: '0.65rem', gap: 8 },
    md: { icon: 28, title: '1.25rem', tagline: '0.7rem', gap: 10 },
    lg: { icon: 38, title: '1.8rem', tagline: '0.8rem', gap: 12 },
    xl: { icon: 48, title: '2.2rem', tagline: '0.9rem', gap: 14 },
  };
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      <div style={{
        width: s.icon + 16, height: s.icon + 16, borderRadius: 10,
        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(59,130,246,0.35)', flexShrink: 0
      }}>
        <SiSpeedtest size={s.icon} color="white" />
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: s.title,
          background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1.1, letterSpacing: '-0.02em'
        }}>
          SecureAssess
        </div>
        {showTagline && (
          <div style={{ fontSize: s.tagline, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
            by PixelWind Technologies
          </div>
        )}
      </div>
    </div>
  );
}
