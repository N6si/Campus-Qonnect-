import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Rss, User, Users, Bot, MessageSquare, BookOpen } from "lucide-react";

export default function Sidebar({ className = "", user }) {
  const location = useLocation();

  const links = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={16} /> },
    { name: "Feed", path: "/feed", icon: <Rss size={16} /> },
    { name: "Profile", path: "/profile", icon: <User size={16} /> },
    { name: "Mentor Requests", path: "/mentor/requests", icon: <Users size={16} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={16} /> },
    { name: "Question Bank", path: "/question-bank", icon: <BookOpen size={16} />, highlight2: true }, // NEW
    { name: "AI Assistant", path: "/ai-assistant", icon: <Bot size={16} />, highlight: true },
  ];

  return (
    <aside style={{ width: "220px", flexShrink: 0 }} className={`hidden md:block ${className}`}>
      {/* User card */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "0.875rem", padding: "1rem", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ position: "relative" }}>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.username || user?.name || "U"}&background=f5a623&color=0a0c14&bold=true&size=40`}
              alt="avatar"
              style={{ width: "40px", height: "40px", borderRadius: "9999px", objectFit: "cover" }}
            />
            <span className="status-online" />
          </div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: 1.2 }}>
              {user?.username || user?.name || "User"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "capitalize", marginTop: "2px" }}>
              {user?.role || "student"}
            </div>
          </div>
        </div>
        <div style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: "1px solid var(--border)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
          CampusConnect · Student Life
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const isHighlight = link.highlight;
          const isHighlight2 = link.highlight2;
          return (
            <Link
              key={link.name}
              to={link.path}
              style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                fontSize: "0.8125rem", fontWeight: 500,
                color: isActive ? "var(--accent)" : isHighlight ? "var(--purple)" : isHighlight2 ? "var(--green)" : "var(--text-secondary)",
                background: isActive ? "var(--accent-soft)" : isHighlight ? "rgba(167,139,250,0.08)" : isHighlight2 ? "rgba(52,211,153,0.08)" : "transparent",
                border: isActive ? "1px solid rgba(245,166,35,0.15)" : isHighlight ? "1px solid rgba(167,139,250,0.15)" : isHighlight2 ? "1px solid rgba(52,211,153,0.15)" : "1px solid transparent",
                textDecoration: "none", transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = isHighlight ? "var(--purple)" : isHighlight2 ? "var(--green)" : "var(--text-primary)";
                  e.currentTarget.style.background = isHighlight ? "rgba(167,139,250,0.12)" : isHighlight2 ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = isHighlight ? "var(--purple)" : isHighlight2 ? "var(--green)" : "var(--text-secondary)";
                  e.currentTarget.style.background = isHighlight ? "rgba(167,139,250,0.08)" : isHighlight2 ? "rgba(52,211,153,0.08)" : "transparent";
                }
              }}
            >
              <span style={{ color: isActive ? "var(--accent)" : isHighlight ? "var(--purple)" : isHighlight2 ? "var(--green)" : "var(--text-muted)" }}>
                {link.icon}
              </span>
              {link.name}
              {isHighlight && (
                <span style={{ marginLeft: "auto", fontSize: "0.6rem", padding: "0.1rem 0.35rem", borderRadius: "0.25rem", background: "rgba(167,139,250,0.15)", color: "var(--purple)", fontWeight: 700 }}>AI</span>
              )}
              {isHighlight2 && (
                <span style={{ marginLeft: "auto", fontSize: "0.6rem", padding: "0.1rem 0.35rem", borderRadius: "0.25rem", background: "rgba(52,211,153,0.15)", color: "var(--green)", fontWeight: 700 }}>NEW</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom accent */}
      <div style={{ marginTop: "1.5rem", padding: "1rem", background: "linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(74,140,255,0.05) 100%)", border: "1px solid rgba(245,166,35,0.12)", borderRadius: "0.75rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent)", marginBottom: "0.375rem", fontFamily: "Syne, sans-serif" }}>QUICK STATS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {[{ label: "Posts", val: "24" }, { label: "Clubs", val: "3" }, { label: "Badges", val: "5" }].map((s) => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.label}</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "Syne, sans-serif" }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
