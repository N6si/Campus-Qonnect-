import React, { useContext } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { TrendingUp, Users, Award, FileText, ArrowRight, CheckCircle2, MessageSquare, BookOpen, Star } from "lucide-react";

const stats = [
  { label: "Total Posts", value: 24, icon: <FileText size={18} />, change: "+3 this week", color: "var(--blue)" },
  { label: "Clubs Joined", value: 3, icon: <Users size={18} />, change: "1 new this month", color: "var(--purple)" },
  { label: "Mentors Connected", value: 2, icon: <MessageSquare size={18} />, change: "Active sessions", color: "var(--green)" },
  { label: "Badges Earned", value: 5, icon: <Award size={18} />, change: "+2 recently", color: "var(--accent)" },
];

const recentActivity = [
  { icon: <CheckCircle2 size={14} />, color: "var(--green)", text: "Joined", bold: "AI Innovators Club", time: "2h ago" },
  { icon: <MessageSquare size={14} />, color: "var(--blue)", text: "Connected with", bold: "Dr. Ananya Rao", time: "5h ago" },
  { icon: <BookOpen size={14} />, color: "var(--purple)", text: "Created a post titled", bold: '"My AI Journey"', time: "1d ago" },
  { icon: <Star size={14} />, color: "var(--accent)", text: "Earned the", bold: "Active Member", suffix: "badge", time: "2d ago" },
];

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          gap: "1.5rem",
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main */}
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Hero Welcome */}
          <div className="hero-banner animate-fade-up">
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className="tag">Student Dashboard</span>
              </div>
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Welcome back,{" "}
                <span className="gradient-text">
                  {user?.username || user?.name || "Learner"}
                </span>{" "}
                👋
              </h1>
              <p style={{ color: "var(--text-secondary)", margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
                Here's your quick summary and recent updates
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {stats.map((s, i) => (
              <div
                key={i}
                className={`card animate-fade-up animate-delay-${i + 1}`}
                style={{ padding: "1.25rem" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      background: `${s.color}15`,
                      color: s.color,
                      display: "flex",
                    }}
                  >
                    {s.icon}
                  </div>
                  <TrendingUp size={12} style={{ color: "var(--text-muted)" }} />
                </div>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.7rem", color: s.color, fontWeight: 500 }}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div
            className="card animate-fade-up"
            style={{ animationDelay: "0.25s", opacity: 0 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className="section-heading">Recent Activity</h2>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                }}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 0",
                    borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "0.375rem",
                      background: `${a.color}15`,
                      color: a.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {a.icon}
                  </div>
                  <div style={{ flex: 1, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                    {a.text}{" "}
                    <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{a.bold}</strong>
                    {a.suffix ? ` ${a.suffix}` : ""}
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0 }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="animate-fade-up" >
            {/* Upcoming */}
            <div className="card">
              <h2 className="section-heading" style={{ marginBottom: "1rem" }}>Upcoming Events</h2>
              {[
                { title: "AI Hackathon 2025", date: "Mar 15", club: "AI Innovators", color: "var(--blue)" },
                { title: "Open Mic Night", date: "Mar 18", club: "Music Club", color: "var(--purple)" },
                { title: "Design Sprint", date: "Mar 22", club: "Design Studio", color: "var(--accent)" },
              ].map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.625rem 0",
                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "0.5rem",
                      background: `${e.color}15`,
                      border: `1px solid ${e.color}30`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "0.6rem", color: e.color, fontWeight: 700, fontFamily: "Syne, sans-serif", lineHeight: 1 }}>
                      {e.date.split(" ")[0].toUpperCase()}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: e.color, fontWeight: 800, fontFamily: "Syne, sans-serif", lineHeight: 1 }}>
                      {e.date.split(" ")[1]}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{e.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{e.club}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested mentors */}
            <div className="card">
              <h2 className="section-heading" style={{ marginBottom: "1rem" }}>Suggested Mentors</h2>
              {[
                { name: "Dr. Ananya Rao", spec: "AI & NLP", img: "https://i.pravatar.cc/40?img=32" },
                { name: "Prof. Vikram Singh", spec: "Software Eng.", img: "https://i.pravatar.cc/40?img=12" },
                { name: "Dr. Maria Chen", spec: "Robotics", img: "https://i.pravatar.cc/40?img=56" },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.625rem 0",
                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <img src={m.img} alt={m.name} style={{ width: "32px", height: "32px", borderRadius: "9999px", objectFit: "cover" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{m.spec}</div>
                  </div>
                  <button
                    style={{
                      padding: "0.3rem 0.625rem",
                      borderRadius: "0.375rem",
                      background: "var(--accent-soft)",
                      border: "1px solid rgba(245,166,35,0.2)",
                      color: "var(--accent)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
