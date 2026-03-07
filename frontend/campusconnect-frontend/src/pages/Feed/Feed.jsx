import React, { useEffect, useState, useContext } from "react";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import { Send, Plus, Zap, Rss, Settings, ChevronRight, X, Check, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEMO_CLUBS = [
  { id: 1, name: "Coding Club", short: "Build projects and compete in hackathons." },
  { id: 2, name: "Music Club", short: "Jam sessions and open mics every week." },
  { id: 3, name: "AI Innovators", short: "Research & workshops on AI topics." },
  { id: 4, name: "Design Studio", short: "UI/UX workshops and design sprints." },
];

// ── MODAL ─────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", width: "100%", maxWidth: "480px", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", margin: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── JOIN CLUB MODAL ───────────────────────────────────────────
function JoinClubModal({ onClose }) {
  const [joined, setJoined] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_joined_clubs") || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState(null);

  const toggle = (clubName) => {
    let updated;
    if (joined.includes(clubName)) {
      updated = joined.filter(c => c !== clubName);
      setToast(`Left ${clubName}`);
    } else {
      updated = [...joined, clubName];
      setToast(`Joined ${clubName}! 🎉`);
    }
    setJoined(updated);
    localStorage.setItem("cc_joined_clubs", JSON.stringify(updated));
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <Modal title="🎯 Join a Club" onClose={onClose}>
      {toast && (
        <div style={{ marginBottom: "1rem", padding: "0.625rem 1rem", borderRadius: "0.5rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "var(--green)", fontSize: "0.8125rem", fontWeight: 500 }}>
          {toast}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {DEMO_CLUBS.map((c) => {
          const isJoined = joined.includes(c.name);
          return (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem", background: "var(--bg-secondary)", border: `1px solid ${isJoined ? "rgba(52,211,153,0.3)" : "var(--border)"}`, borderRadius: "0.75rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Users size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{c.short}</div>
              </div>
              <button
                onClick={() => toggle(c.name)}
                style={{ padding: "0.35rem 0.75rem", borderRadius: "0.375rem", background: isJoined ? "rgba(52,211,153,0.1)" : "var(--accent-soft)", border: `1px solid ${isJoined ? "rgba(52,211,153,0.2)" : "rgba(245,166,35,0.2)"}`, color: isJoined ? "var(--green)" : "var(--accent)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                {isJoined ? <><Check size={11} /> Joined</> : <>+ Join</>}
              </button>
            </div>
          );
        })}
      </div>
      {joined.length > 0 && (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          You're in {joined.length} club{joined.length > 1 ? "s" : ""}: <strong style={{ color: "var(--accent)" }}>{joined.join(", ")}</strong>
        </div>
      )}
    </Modal>
  );
}

// ── ASK MENTOR MODAL ──────────────────────────────────────────
function AskMentorModal({ onClose }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    API.get("/api/teachers")
      .then(res => setTeachers(res.data?.length > 0 ? res.data : []))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false));
  }, []);

  const send = async () => {
    if (!selected) return;
    setSending(true);
    try {
      await API.post("/api/mentor/request", { mentor_name: selected, message });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <Modal title="✅ Request Sent!" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎉</div>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>Request sent to {selected}!</div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>You'll be notified when they respond.</div>
        <button onClick={onClose} className="btn-primary">Done</button>
      </div>
    </Modal>
  );

  return (
    <Modal title="⚡ Ask a Mentor" onClose={onClose}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading mentors...</div>
      ) : teachers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          No teachers available yet. Check back soon!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem" }}>SELECT A MENTOR</div>
          {teachers.map((t) => (
            <div
              key={t.username}
              onClick={() => setSelected(t.username)}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "var(--bg-secondary)", border: `1px solid ${selected === t.username ? "var(--accent)" : "var(--border)"}`, borderRadius: "0.75rem", cursor: "pointer", transition: "all 0.15s ease" }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "9999px", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--accent)", flexShrink: 0 }}>
                {t.username.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{t.username}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--accent)" }}>{t.expertise || "Not specified"}</div>
              </div>
              {selected === t.username && <Check size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />}
            </div>
          ))}

          {selected && (
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Message (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Introduce yourself and explain what you need help with..."
                className="form-input"
                style={{ resize: "none", minHeight: "70px" }}
                rows={3}
              />
            </div>
          )}

          <button
            onClick={send}
            disabled={!selected || sending}
            className="btn-primary"
            style={{ opacity: (!selected || sending) ? 0.5 : 1, marginTop: "0.25rem" }}
          >
            {sending ? "Sending..." : "Send Request"}
          </button>
        </div>
      )}
    </Modal>
  );
}

// ── MAIN FEED ─────────────────────────────────────────────────
function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
      <h3 className="section-heading">{title}</h3>
      {action && (
        <button style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
          {action} <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [posting, setPosting] = useState(false);
  const [modal, setModal] = useState(null); // "join-club" | "ask-mentor"
  const [teachers, setTeachers] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_joined_clubs") || "[]"); } catch { return []; }
  });
  const [clubToast, setClubToast] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await API.get("/api/posts"); // ✅ FIXED: was /posts
      setPosts(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/api/teachers");
      setTeachers(res.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchPosts();
    fetchTeachers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setPosting(true);
    try {
      await API.post("/api/posts", form); // ✅ FIXED: was /posts
      setForm({ title: "", content: "" });
      fetchPosts();
    } catch (err) {
      alert("Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const joinClub = (clubName) => {
    let updated;
    const current = JSON.parse(localStorage.getItem("cc_joined_clubs") || "[]");
    if (current.includes(clubName)) {
      updated = current.filter(c => c !== clubName);
      setClubToast(`Left ${clubName}`);
    } else {
      updated = [...current, clubName];
      setClubToast(`Joined ${clubName}! 🎉`);
    }
    localStorage.setItem("cc_joined_clubs", JSON.stringify(updated));
    setJoinedClubs(updated);
    setTimeout(() => setClubToast(null), 2500);
  };

  const sendMentorRequest = async (mentorName) => {
    try {
      await API.post("/api/mentor/request", { mentor_name: mentorName, message: "Connecting from feed" });
      setClubToast(`Request sent to ${mentorName}! ✅`);
      setTimeout(() => setClubToast(null), 2500);
    } catch (err) {
      setClubToast(err.response?.data?.detail || "Already requested!");
      setTimeout(() => setClubToast(null), 2500);
    }
  };

  const quickActions = [
    { id: "join-club", name: "Join Club", icon: <Plus size={18} />, color: "var(--blue)", bg: "rgba(74,140,255,0.12)", action: () => setModal("join-club") },
    { id: "ask-mentor", name: "Ask Mentor", icon: <Zap size={18} />, color: "var(--purple)", bg: "rgba(167,139,250,0.12)", action: () => setModal("ask-mentor") },
    { id: "view-feed", name: "View Feed", icon: <Rss size={18} />, color: "var(--accent)", bg: "var(--accent-soft)", action: () => window.scrollTo({ top: 600, behavior: "smooth" }) },
    { id: "edit-profile", name: "Edit Profile", icon: <Settings size={18} />, color: "var(--green)", bg: "rgba(52,211,153,0.12)", action: () => navigate("/profile") },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Modals */}
      {modal === "join-club" && <JoinClubModal onClose={() => { setModal(null); setJoinedClubs(JSON.parse(localStorage.getItem("cc_joined_clubs") || "[]")); }} />}
      {modal === "ask-mentor" && <AskMentorModal onClose={() => setModal(null)} />}

      {/* Toast */}
      {clubToast && (
        <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 999, padding: "0.75rem 1.25rem", borderRadius: "0.625rem", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "var(--green)", fontSize: "0.875rem", fontWeight: 500 }}>
          {clubToast}
        </div>
      )}

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <Sidebar user={user} />

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Create Post */}
          <div className="card animate-fade-up">
            <SectionHeader title="Create Post" />
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input placeholder="Post title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" required />
              <textarea placeholder="What's on your mind?" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="form-input" style={{ resize: "none", minHeight: "80px" }} rows={3} required />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Posting as <strong style={{ color: "var(--accent)" }}>{user?.username || "Guest"}</strong>
                </span>
                <button type="submit" disabled={posting} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.375rem", opacity: posting ? 0.7 : 1 }}>
                  <Send size={14} /> {posting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="card animate-fade-up animate-delay-1">
            <SectionHeader title="Quick Actions" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
              {quickActions.map((a) => (
                <button
                  key={a.id}
                  onClick={a.action}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1rem 0.5rem", borderRadius: "0.625rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s ease", fontFamily: "DM Sans, sans-serif" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = a.bg; e.currentTarget.style.color = a.color; e.currentTarget.style.borderColor = `${a.color}30`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <span style={{ color: a.color }}>{a.icon}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{a.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="animate-fade-up animate-delay-2">
            <SectionHeader title="Recent Posts" action="View all" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {posts.length > 0 ? (
                posts.map((p) => <PostCard key={p.id} post={p} />)
              ) : (
                <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  No posts yet. Be the first to share something!
                </div>
              )}
            </div>
          </div>

          {/* Available Mentors — REAL from DB */}
          <div className="card animate-fade-up animate-delay-3">
            <SectionHeader title="Available Mentors" action="View all" />
            {teachers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                No mentors available yet.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
                {teachers.map((t) => (
                  <div key={t.username} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1rem", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "var(--accent-soft)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "var(--accent)", flexShrink: 0 }}>
                        {t.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.username}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--accent)" }}>{t.expertise || "Teacher"}</div>
                      </div>
                    </div>
                    {t.bio && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>{t.bio.slice(0, 50)}{t.bio.length > 50 ? "..." : ""}</div>}
                    <button
                      onClick={() => sendMentorRequest(t.username)}
                      style={{ width: "100%", padding: "0.4rem", borderRadius: "0.375rem", background: "var(--accent-soft)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--accent)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                    >
                      Request Mentor
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clubs */}
          <div className="card animate-fade-up">
            <SectionHeader title="Active Clubs" action="Browse all" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {DEMO_CLUBS.map((c) => {
                const isJoined = joinedClubs.includes(c.name);
                return (
                  <div key={c.id} style={{ background: "var(--bg-secondary)", border: `1px solid ${isJoined ? "rgba(52,211,153,0.3)" : "var(--border)"}`, borderRadius: "0.75rem", padding: "1rem", transition: "all 0.2s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Users size={16} style={{ color: "var(--accent)" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{c.short}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => joinClub(c.name)}
                      style={{ width: "100%", padding: "0.4rem", borderRadius: "0.375rem", background: isJoined ? "rgba(52,211,153,0.1)" : "rgba(74,140,255,0.1)", border: `1px solid ${isJoined ? "rgba(52,211,153,0.2)" : "rgba(74,140,255,0.2)"}`, color: isJoined ? "var(--green)" : "var(--blue)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}
                    >
                      {isJoined ? <><Check size={11} /> Joined</> : <>+ Join Club</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Suggestions — real teachers */}
          {teachers.length > 0 && (
            <div style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(74,140,255,0.04) 100%)", border: "1px solid rgba(245,166,35,0.12)", borderRadius: "1rem", padding: "1.25rem" }} className="animate-fade-up">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span>✨</span>
                <h3 className="section-heading">Smart Suggestions</h3>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem", marginTop: "0.25rem" }}>
                Recommended mentors based on your profile
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                {teachers.slice(0, 3).map((t) => (
                  <div key={t.username} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "0.75rem", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(245,166,35,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    <div style={{ width: "36px", height: "36px", borderRadius: "9999px", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--accent)", flexShrink: 0 }}>
                      {t.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.username}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{t.expertise || "Teacher"}</div>
                    </div>
                    <button
                      onClick={() => sendMentorRequest(t.username)}
                      style={{ padding: "0.3rem 0.5rem", borderRadius: "0.375rem", background: "var(--accent-soft)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--accent)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", flexShrink: 0 }}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
