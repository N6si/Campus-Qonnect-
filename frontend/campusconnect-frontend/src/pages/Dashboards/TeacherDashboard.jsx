import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import API from "../../lib/api";
import {
  BookOpen, Users, Calendar, Clock, CheckCircle2, TrendingUp,
  ArrowRight, Star, X, Plus, Trash2, ChevronRight
} from "lucide-react";

// ── MODAL WRAPPER ─────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", width: "100%", maxWidth: "520px", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", margin: "1rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.25rem" }}>
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── MY COURSES MODAL ──────────────────────────────────────────
function CoursesModal({ onClose }) {
  const [courses, setCourses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_courses") || "[]"); } catch { return []; }
  });
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", schedule: "" });

  const save = (updated) => {
    setCourses(updated);
    localStorage.setItem("cc_courses", JSON.stringify(updated));
  };

  const addCourse = () => {
    if (!form.title.trim()) return;
    save([...courses, { id: Date.now(), ...form }]);
    setForm({ title: "", description: "", schedule: "" });
    setAdding(false);
  };

  const deleteCourse = (id) => save(courses.filter(c => c.id !== id));

  return (
    <Modal title="📚 My Courses" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {courses.length === 0 && !adding && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            No courses yet. Add your first course!
          </div>
        )}

        {courses.map((c) => (
          <div key={c.id} style={{ padding: "0.875rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{c.title}</div>
              {c.description && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{c.description}</div>}
              {c.schedule && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "var(--blue)", marginTop: "0.375rem" }}>
                  <Clock size={11} /> {c.schedule}
                </div>
              )}
            </div>
            <button onClick={() => deleteCourse(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem" }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {adding ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", padding: "0.875rem", background: "var(--bg-secondary)", border: "1px solid var(--accent)", borderRadius: "0.75rem" }}>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Course title *" className="form-input" />
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="form-input" />
            <input value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} placeholder="Schedule e.g. Mon/Wed 3:00 PM" className="form-input" />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={addCourse} className="btn-primary" style={{ fontSize: "0.8rem" }}>Save Course</button>
              <button onClick={() => setAdding(false)} className="btn-ghost" style={{ fontSize: "0.8rem" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "0.75rem", border: "1px dashed var(--border)", background: "transparent", color: "var(--accent)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            <Plus size={15} /> Add Course
          </button>
        )}
      </div>
    </Modal>
  );
}

// ── STUDENTS MODAL ────────────────────────────────────────────
function StudentsModal({ onClose }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/api/mentor/requests");
        // Get unique accepted students
        const accepted = res.data?.filter(r => r.status === "accepted") || [];
        const unique = [];
        const seen = new Set();
        accepted.forEach(r => {
          if (!seen.has(r.student_username)) {
            seen.add(r.student_username);
            unique.push(r);
          }
        });
        setStudents(unique);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <Modal title="👨‍🎓 My Students" onClose={onClose}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading students...</div>
      ) : students.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          No accepted mentees yet. Accept mentor requests to see students here!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {students.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0", borderBottom: i < students.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "9999px", background: "var(--accent-soft)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--accent)", flexShrink: 0 }}>
                {s.student_username.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.student_username}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Requested: {s.mentor_name}</div>
              </div>
              <span style={{ padding: "0.2rem 0.6rem", borderRadius: "0.375rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "var(--green)", fontSize: "0.7rem", fontWeight: 600 }}>
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ── SCHEDULE MODAL ────────────────────────────────────────────
function ScheduleModal({ onClose }) {
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_schedule") || "[]"); } catch { return []; }
  });
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", student: "", date: "", time: "", notes: "" });

  const save = (updated) => {
    setSessions(updated);
    localStorage.setItem("cc_schedule", JSON.stringify(updated));
  };

  const addSession = () => {
    if (!form.title.trim() || !form.date) return;
    save([...sessions, { id: Date.now(), ...form }].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setForm({ title: "", student: "", date: "", time: "", notes: "" });
    setAdding(false);
  };

  const deleteSession = (id) => save(sessions.filter(s => s.id !== id));

  const isToday = (dateStr) => new Date(dateStr).toDateString() === new Date().toDateString();
  const isPast = (dateStr) => new Date(dateStr) < new Date() && !isToday(dateStr);

  return (
    <Modal title="📅 Schedule" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {sessions.length === 0 && !adding && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            No sessions scheduled. Add one below!
          </div>
        )}

        {sessions.map((s) => (
          <div key={s.id} style={{ padding: "0.875rem", background: "var(--bg-secondary)", border: `1px solid ${isToday(s.date) ? "rgba(52,211,153,0.3)" : "var(--border)"}`, borderRadius: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: isPast(s.date) ? 0.5 : 1 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.title}</span>
                {isToday(s.date) && <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: "0.25rem", background: "rgba(52,211,153,0.1)", color: "var(--green)", fontWeight: 600 }}>TODAY</span>}
              </div>
              {s.student && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>with {s.student}</div>}
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "var(--blue)", marginTop: "0.375rem" }}>
                <Clock size={11} /> {s.date} {s.time && `at ${s.time}`}
              </div>
              {s.notes && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{s.notes}</div>}
            </div>
            <button onClick={() => deleteSession(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem" }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {adding ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", padding: "0.875rem", background: "var(--bg-secondary)", border: "1px solid var(--accent)", borderRadius: "0.75rem" }}>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Session title *" className="form-input" />
            <input value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} placeholder="Student name" className="form-input" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input" />
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="form-input" />
            </div>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optional)" className="form-input" />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={addSession} className="btn-primary" style={{ fontSize: "0.8rem" }}>Save Session</button>
              <button onClick={() => setAdding(false)} className="btn-ghost" style={{ fontSize: "0.8rem" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "0.75rem", border: "1px dashed var(--border)", background: "transparent", color: "var(--accent)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            <Plus size={15} /> Schedule Session
          </button>
        )}
      </div>
    </Modal>
  );
}

// ── NEW SESSION MODAL ─────────────────────────────────────────
function NewSessionModal({ onClose }) {
  const [form, setForm] = useState({ title: "", student: "", date: "", time: "", notes: "" });
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!form.title.trim() || !form.date) return;
    const existing = JSON.parse(localStorage.getItem("cc_schedule") || "[]");
    const updated = [...existing, { id: Date.now(), ...form }].sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem("cc_schedule", JSON.stringify(updated));
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  return (
    <Modal title="✨ New Session" onClose={onClose}>
      {saved ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <CheckCircle2 size={40} style={{ color: "var(--green)", margin: "0 auto 1rem" }} />
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Session scheduled!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Session Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Web Development" className="form-input" />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Student Name</label>
            <input value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} placeholder="e.g. student1" className="form-input" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input" />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Time</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="form-input" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." className="form-input" style={{ resize: "none" }} rows={2} />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            <button onClick={save} className="btn-primary">Schedule Session</button>
            <button onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────
export default function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [modal, setModal] = useState(null); // "courses" | "students" | "schedule" | "new-session"
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/api/mentor/requests");
        const data = res.data || [];
        setPendingCount(data.filter(r => r.status === "pending").length);
        setAcceptedCount(data.filter(r => r.status === "accepted").length);
      } catch {}
    };
    fetch();
  }, []);

  // Get next scheduled session
  const getNextSession = () => {
    try {
      const sessions = JSON.parse(localStorage.getItem("cc_schedule") || "[]");
      const upcoming = sessions.filter(s => new Date(s.date) >= new Date());
      return upcoming[0] || null;
    } catch { return null; }
  };
  const nextSession = getNextSession();

  const statCards = [
    { label: "Active Mentees", value: acceptedCount || "0", icon: <Users size={18} />, color: "var(--blue)", change: "Accepted requests" },
    { label: "Pending Requests", value: pendingCount || "0", icon: <CheckCircle2 size={18} />, color: "var(--accent)", change: "Awaiting response" },
    { label: "Courses", value: JSON.parse(localStorage.getItem("cc_courses") || "[]").length || "0", icon: <BookOpen size={18} />, color: "var(--green)", change: "Active courses" },
    { label: "Engagement", value: "85%", icon: <TrendingUp size={18} />, color: "var(--purple)", change: "This month" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Modals */}
      {modal === "courses" && <CoursesModal onClose={() => setModal(null)} />}
      {modal === "students" && <StudentsModal onClose={() => setModal(null)} />}
      {modal === "schedule" && <ScheduleModal onClose={() => setModal(null)} />}
      {modal === "new-session" && <NewSessionModal onClose={() => setModal(null)} />}

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <Sidebar user={user} />

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Hero */}
          <div className="hero-banner animate-fade-up">
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="tag" style={{ marginBottom: "0.5rem", display: "inline-flex" }}>Teacher Dashboard</span>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0.5rem 0 0.5rem", lineHeight: 1.2 }}>
                Welcome, Prof. <span className="gradient-text">{user?.username || user?.name || "Teacher"}</span> 👋
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
                  <div style={{ padding: "0.5rem", borderRadius: "0.5rem", background: `${s.color}15`, color: s.color, display: "flex" }}>{s.icon}</div>
                  <TrendingUp size={12} style={{ color: "var(--text-muted)" }} />
                </div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.25rem" }}>{s.value}</div>
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
                <button onClick={() => setModal("new-session")} className="btn-primary" style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Plus size={13} /> New Session
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {[
                  { label: "My Courses", icon: <BookOpen size={16} />, color: "var(--blue)", key: "courses" },
                  { label: "Students", icon: <Users size={16} />, color: "var(--green)", key: "students" },
                  { label: "Schedule", icon: <Calendar size={16} />, color: "var(--purple)", key: "schedule" },
                ].map((a) => (
                  <button key={a.key}
                    onClick={() => setModal(a.key)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "0.875rem 0.5rem", borderRadius: "0.625rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, transition: "all 0.15s ease", fontFamily: "DM Sans, sans-serif" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.color = a.color; e.currentTarget.style.borderColor = `${a.color}30`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <span style={{ color: a.color }}>{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Next session */}
              <div
                onClick={() => setModal("schedule")}
                style={{ marginTop: "1rem", padding: "0.875rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  NEXT SESSION
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {nextSession ? nextSession.title : "No sessions scheduled"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      <Clock size={11} />
                      {nextSession ? `${nextSession.date}${nextSession.time ? ` at ${nextSession.time}` : ""}` : "Click to add a session"}
                    </div>
                  </div>
                  {nextSession ? (
                    <span style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "var(--green)", fontSize: "0.7rem", fontWeight: 600 }}>
                      Upcoming
                    </span>
                  ) : (
                    <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
                  )}
                </div>
              </div>
            </div>

            {/* Teaching Insights */}
            <div className="card">
              <h2 className="section-heading" style={{ marginBottom: "1rem" }}>Teaching Insights</h2>
              {[
                { label: "Sessions Completed", value: "24/30", pct: 80, color: "var(--green)" },
                { label: "Student Engagement", value: "85%", pct: 85, color: "var(--blue)" },
                { label: "Requests Resolved", value: `${pendingCount === 0 ? 100 : Math.round((acceptedCount / (acceptedCount + pendingCount)) * 100) || 0}%`, pct: pendingCount === 0 ? 100 : Math.round((acceptedCount / (acceptedCount + pendingCount)) * 100) || 0, color: "var(--purple)" },
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

              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>
                  TOP MENTEE
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "9999px", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "var(--accent)" }}>PS</div>
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>Priya Sharma</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>6 sessions completed</div>
                  </div>
                  <Star size={14} style={{ color: "var(--accent)", marginLeft: "auto" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Requests inline */}
          <div className="card animate-fade-up animate-delay-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className="section-heading">Mentorship Requests</h2>
              {pendingCount > 0 && (
                <span style={{ padding: "0.2rem 0.6rem", borderRadius: "0.375rem", background: "var(--accent-soft)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--accent)", fontSize: "0.7rem", fontWeight: 600 }}>
                  {pendingCount} pending
                </span>
              )}
            </div>
            <TeacherRequestsInline onUpdate={() => {
              API.get("/api/mentor/requests").then(res => {
                const data = res.data || [];
                setPendingCount(data.filter(r => r.status === "pending").length);
                setAcceptedCount(data.filter(r => r.status === "accepted").length);
              }).catch(() => {});
            }} />
          </div>

        </main>
      </div>
    </div>
  );
}

// ── INLINE REQUESTS (no full page) ───────────────────────────
function TeacherRequestsInline({ onUpdate }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/mentor/requests");
      setRequests((res.data || []).slice(0, 5)); // show latest 5
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, action) => {
    try {
      await API.put(`/api/mentor/requests/${id}`, { action });
      fetchRequests();
      onUpdate();
    } catch {}
  };

  if (loading) return <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "1rem" }}>Loading...</div>;
  if (requests.length === 0) return <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "1rem" }}>No requests yet.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {requests.map((r) => (
        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.625rem" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9999px", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "var(--accent)", flexShrink: 0 }}>
            {r.student_username.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {r.student_username} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>→</span> <span style={{ color: "var(--blue)" }}>{r.mentor_name}</span>
            </div>
            {r.message && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.message}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
            {r.status === "pending" ? (
              <>
                <button onClick={() => handleAction(r.id, "accept")} style={{ padding: "0.3rem 0.625rem", borderRadius: "0.375rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "var(--green)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>Accept</button>
                <button onClick={() => handleAction(r.id, "reject")} style={{ padding: "0.3rem 0.625rem", borderRadius: "0.375rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>Reject</button>
              </>
            ) : (
              <span style={{ padding: "0.2rem 0.6rem", borderRadius: "0.375rem", background: r.status === "accepted" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${r.status === "accepted" ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`, color: r.status === "accepted" ? "var(--green)" : "#f87171", fontSize: "0.7rem", fontWeight: 600, textTransform: "capitalize" }}>
                {r.status}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
