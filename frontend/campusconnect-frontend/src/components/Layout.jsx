import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}