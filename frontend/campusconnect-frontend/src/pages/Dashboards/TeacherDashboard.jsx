import React, { useContext } from "react";
import MentorRequests from "../Mentor/MentorRequests";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { BookOpen, Users, Calendar, Clock, CheckCircle2, TrendingUp, ArrowRight, Star } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useContext(AuthContext);

  const statCards = [
    { label: "Active Mentees", value: "12", icon: <Users size={18} />, color: "var(--blue)", change: "+2 this week" },
    { label: "Sessions Done", value: "24", icon: <CheckCircle2 size={18} />, color: "var(--green)", change: "24 of 30" },
    { label: "Pending Reviews", value: "3", icon: <BookOpen size={18} />, color: "var(--accent)", change: "Assignments" },
    { label: "Engagement", value: "85%", icon: <TrendingUp size={18} />, color: "var(--purple)", change: "This month" },
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
              <span className="tag" style={{ marginBottom: "0.5rem", display: "inline-flex" }}>Teacher Dashboard</span>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0.5rem 0 0.5rem", lineHeight: 1.2 }}>
                Welcome, Prof.{" "}
                <span className="gradient-text">{user?.username || user?.name || "Teacher"}</span>{" "}
                👋
              </h1>
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>
                Your mentorship dashboard — sessions, students, and requests
              </p>
            </div>
          </div>

          {/* Stats */}
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

          {/* Quick Actions + Insights */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="animate-fade-up animate-delay-2">

            {/* Mentor actions */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 className="section-heading">Mentor Actions</h2>
                <button className="btn-primary" style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}>
                  + New Session
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {[
                  { label: "My Courses", icon: <BookOpen size={16} />, color: "var(--blue)" },
                  { label: "Students", icon: <Users size={16} />, color: "var(--green)" },
                  { label: "Schedule", icon: <Calendar size={16} />, color: "var(--purple)" },
                ].map((a, i) => (
                  <button key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "0.875rem 0.5rem", borderRadius: "0.625rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, transition: "all 0.15s ease", fontFamily: "DM Sans, sans-serif" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.color = a.color; e.currentTarget.style.borderColor = `${a.color}30`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <span style={{ color: a.color }}>{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Next session */}
              <div style={{ marginTop: "1rem", padding: "0.875rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  NEXT SESSION
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Web Development</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      <Clock size={11} /> Today at 2:00 PM
                    </div>
                  </div>
                  <span style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "var(--green)", fontSize: "0.7rem", fontWeight: 600 }}>
                    Upcoming
                  </span>
                </div>
              </div>
            </div>

            {/* Teaching Insights */}
            <div className="card">
              <h2 className="section-heading" style={{ marginBottom: "1rem" }}>Teaching Insights</h2>
              {[
                { label: "Sessions Completed", value: "24/30", pct: 80, color: "var(--green)" },
                { label: "Student Engagement", value: "85%", pct: 85, color: "var(--blue)" },
                { label: "Requests Resolved", value: "70%", pct: 70, color: "var(--purple)" },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? "1rem" : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{m.label}</span>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.8125rem", color: "var(--text-primary)" }}>{m.value}</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "2px", background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: "2px" }} />
                  </div>
                </div>
              ))}

              {/* Top student */}
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>
                  TOP MENTEE
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <img src="https://i.pravatar.cc/32?img=20" alt="student" style={{ width: "32px", height: "32px", borderRadius: "9999px" }} />
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>Priya Sharma</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>6 sessions completed</div>
                  </div>
                  <Star size={14} style={{ color: "var(--accent)", marginLeft: "auto" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Requests */}
          <div className="card animate-fade-up animate-delay-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className="section-heading">Mentorship Requests</h2>
              <button style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
                View all <ArrowRight size={12} />
              </button>
            </div>
            <MentorRequests />
          </div>

        </main>
      </div>
    </div>
  );
}
