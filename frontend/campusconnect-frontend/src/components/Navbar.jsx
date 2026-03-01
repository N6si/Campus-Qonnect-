import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Search, Bell, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Feed", path: "/feed" },
    { label: "Profile", path: "/profile" },
    ...(user?.role === "teacher" ? [{ label: "Mentor Requests", path: "/mentor/requests" }] : []),
  ];

  return (
    <header
      style={{
        background: "rgba(10,12,20,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="max-w-screen-2xl mx-auto px-5 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div
              style={{
                background: "var(--accent)",
                color: "#0a0c14",
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            >
              CC
            </div>
            <span
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}
            >
              CampusConnect
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => {
              const isActive = location.pathname === l.path;
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    transition: "color 0.15s ease, background 0.15s ease",
                    background: isActive ? "var(--accent-soft)" : "transparent",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = "var(--text-secondary)";
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div
              style={{
                background: searchFocused ? "var(--bg-card)" : "var(--bg-secondary)",
                border: `1px solid ${searchFocused ? "var(--accent)" : "var(--border)"}`,
                boxShadow: searchFocused ? "0 0 0 3px var(--accent-soft)" : "none",
                borderRadius: "0.5rem",
                transition: "all 0.2s ease",
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5"
            >
              <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                placeholder="Search mentors, clubs..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "0.8125rem",
                  width: "180px",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />
            </div>

            {/* Notification bell */}
            {user && (
              <button
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  padding: "0.4rem",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <Bell size={16} />
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    background: "var(--accent)",
                  }}
                />
              </button>
            )}

            {/* User info + logout */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    padding: "0.375rem 0.625rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.username || user.name}&background=f5a623&color=0a0c14&bold=true`}
                      alt="avatar"
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "9999px",
                        objectFit: "cover",
                      }}
                    />
                    <span className="status-online" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
                      {user.username || user.name}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                      {user.role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.5rem",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--red)";
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)";
                    e.currentTarget.style.background = "rgba(248,113,113,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost" style={{ textDecoration: "none" }}>Login</Link>
                <Link to="/signup" className="btn-primary" style={{ textDecoration: "none" }}>Sign up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            style={{ borderTop: "1px solid var(--border)", marginTop: "0.75rem", paddingTop: "0.75rem" }}
            className="md:hidden flex flex-col gap-1 pb-2"
          >
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: location.pathname === l.path ? "var(--accent)" : "var(--text-secondary)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  background: location.pathname === l.path ? "var(--accent-soft)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
