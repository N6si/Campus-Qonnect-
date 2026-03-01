import React from 'react';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Ambient glows */}
      <div
        style={{
          position: 'fixed',
          top: '-100px',
          left: '-100px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
          borderRadius: '9999px',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(74,140,255,0.05) 0%, transparent 70%)',
          borderRadius: '9999px',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
