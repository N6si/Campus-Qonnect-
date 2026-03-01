import React, { useEffect, useState, useContext } from "react";
import API from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { Users, FileText, MessageSquare, TrendingUp, Shield, Settings, Flag, Download, Server, HardDrive, ArrowRight, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) { console.error(err); }
    })();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats?.users_count ?? "—", icon: <Users size={18} />, color: "var(--blue)", change: "+12 today" },
    { label: "Total Posts", value: stats?.posts_count ?? "—", icon: <FileText size={18} />, color: "var(--purple)", change: "+5 today" },
    { label: "Mentor Requests", value: stats?.mentor_requests ?? "—", icon: <MessageSquare size={18} />, color: "var(--accent)", change: "3 pending" },
    { label: "Active Sessions", value: "8", icon: <Activity size={18} />, color: "var(--green)", change: "Live now" },
  ];

  const quickTools = [
    { label: "User Management", sub: "Manage accounts and roles", icon: <Users size={15} />, color: "var(--blue)" },
    { label: "Content Moderation", sub: "Review flagged content", icon: <Flag size={15} />, color: "var(--red)" },
    { label: "System Settings", sub: "Configure platform options", icon: <Settings size={15} />, color: "var(--purple)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <Sidebar user={user} />

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Hero */}
          <div className="hero-banner animate-fade-up">
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="tag" style={{ marginBottom: "0.5rem", display: "inline-flex" }}>Admin Dashboard</span>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0.5rem 0 0.5rem", lineHeight: 1.2 }}>
                Platform Control{" "}
                <span className="gradient-text">Centre</span>{" "}
                🛡️
              </h1>
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>
                Monitor and manage your CampusConnect platform
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {statCards.map((s, i) => (
              <div key={i} className={`card animate-fade-up animate-delay-${i + 1}`} style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ padding: "0.5rem", borderRadius: "0.5rem", background: `${s.color}15`, color: s.color, display: "flex" }}>
                    {s.icon}
                  </div>
                  <TrendingUp size={12} style={{ color: "var(--text-muted)" }} />
                </div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.25rem" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.7rem", color: s.color, fontWeight: 500 }}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="animate-fade-up animate-delay-2">

            {/* Recent Activity */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 className="section-heading">Recent Activity</h2>
                <button style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
                  View all <ArrowRight size={12} />
                </button>
              </div>
              {[
                { label: "New User Signups", sub: "Last 24 hours", value: "+12", color: "var(--green)" },
                { label: "Active Sessions", sub: "Current", value: "8", color: "var(--blue)" },
                { label: "Flagged Posts", sub: "Needs review", value: "3", color: "var(--red)" },
                { label: "New Mentor Requests", sub: "Today", value: "5", color: "var(--accent)" },
              ].map((a, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{a.label}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{a.sub}</div>
                  </div>
                  <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: a.color }}>{a.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Tools */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 className="section-heading">Quick Tools</h2>
                <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", padding: "0.3rem 0.75rem" }}>
                  <Download size={12} /> Export CSV
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {quickTools.map((t, i) => (
                  <button key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.625rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", textAlign: "left", transition: "all 0.15s ease", width: "100%" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
                  >
                    <div style={{ padding: "0.4rem", borderRadius: "0.375rem", background: `${t.color}15`, color: t.color, display: "flex", flexShrink: 0 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{t.label}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{t.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card animate-fade-up animate-delay-3">
            <h2 className="section-heading" style={{ marginBottom: "1rem" }}>System Status</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Server Load", value: 28, icon: <Server size={14} />, color: "var(--green)" },
                { label: "Storage Used", value: 42, icon: <HardDrive size={14} />, color: "var(--blue)" },
                { label: "Memory Usage", value: 61, icon: <Activity size={14} />, color: "var(--accent)" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "1rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      <span style={{ color: s.color }}>{s.icon}</span>
                      {s.label}
                    </div>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>{s.value}%</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "2px", background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.value}%`, background: s.color, borderRadius: "2px", transition: "width 0.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
