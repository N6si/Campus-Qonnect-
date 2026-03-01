import React, { useEffect, useState, useContext } from "react";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import { Send, Plus, Zap, Users, Rss, Settings, ArrowRight, ChevronRight } from "lucide-react";

const DEMO_MENTORS = [
  { id: 1, name: "Dr. Ananya Rao", title: "Associate Professor", spec: "AI & NLP", avatar: "https://i.pravatar.cc/120?img=32" },
  { id: 2, name: "Prof. Vikram Singh", title: "Senior Lecturer", spec: "Software Engineering", avatar: "https://i.pravatar.cc/120?img=12" },
  { id: 3, name: "Dr. Maria Chen", title: "Research Scientist", spec: "Robotics", avatar: "https://i.pravatar.cc/120?img=56" },
  { id: 4, name: "Dr. Liam O'Connor", title: "Visiting Professor", spec: "Data Science", avatar: "https://i.pravatar.cc/120?img=8" },
];

const DEMO_CLUBS = [
  { id: 1, name: "Coding Club", short: "Build projects and compete in hackathons.", logo: "https://picsum.photos/seed/coding/80" },
  { id: 2, name: "Music Club", short: "Jam sessions and open mics every week.", logo: "https://picsum.photos/seed/music/80" },
  { id: 3, name: "AI Innovators", short: "Research & workshops on AI topics.", logo: "https://picsum.photos/seed/ai/80" },
  { id: 4, name: "Design Studio", short: "UI/UX workshops and design sprints.", logo: "https://picsum.photos/seed/design/80" },
];

const DEMO_SUGGESTIONS = [
  { id: 5, name: "Dr. Sarah Mitchell", note: "Machine Learning Expert", avatar: "https://i.pravatar.cc/100?img=45" },
  { id: 6, name: "Prof. James Wilson", note: "Blockchain & Web3", avatar: "https://i.pravatar.cc/100?img=33" },
  { id: 7, name: "Dr. Priya Sharma", note: "Cybersecurity Specialist", avatar: "https://i.pravatar.cc/100?img=28" },
];

const quickActions = [
  { id: 1, name: "Join Club", icon: <Plus size={18} />, color: "var(--blue)", bg: "rgba(74,140,255,0.12)" },
  { id: 2, name: "Ask Mentor", icon: <Zap size={18} />, color: "var(--purple)", bg: "rgba(167,139,250,0.12)" },
  { id: 3, name: "View Feed", icon: <Rss size={18} />, color: "var(--accent)", bg: "var(--accent-soft)" },
  { id: 4, name: "Edit Profile", icon: <Settings size={18} />, color: "var(--green)", bg: "rgba(52,211,153,0.12)" },
];

function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
      <h3 className="section-heading">{title}</h3>
      {action && (
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
  const [activeAction, setActiveAction] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }
    setPosting(true);
    try {
      await API.post("/posts", form);
      setForm({ title: "", content: "" });
      fetchPosts();
    } catch (err) {
      alert("Failed to post");
    } finally {
      setPosting(false);
    }
  };

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
        <Sidebar user={user} />

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Create Post */}
          <div className="card animate-fade-up">
            <SectionHeader title="Create Post" />
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input
                placeholder="Post title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="form-input"
                required
              />
              <textarea
                placeholder="What's on your mind?"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="form-input"
                style={{ resize: "none", minHeight: "80px" }}
                rows={3}
                required
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Posting as{" "}
                  <strong style={{ color: "var(--accent)" }}>{user?.username || user?.name || "Guest"}</strong>
                </span>
                <button
                  type="submit"
                  disabled={posting}
                  className="btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem", opacity: posting ? 0.7 : 1 }}
                >
                  <Send size={14} />
                  {posting ? "Posting..." : "Post"}
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
                  onClick={() => setActiveAction(activeAction === a.id ? null : a.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem 0.5rem",
                    borderRadius: "0.625rem",
                    background: activeAction === a.id ? a.bg : "var(--bg-secondary)",
                    border: `1px solid ${activeAction === a.id ? `${a.color}30` : "var(--border)"}`,
                    color: activeAction === a.id ? a.color : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (activeAction !== a.id) {
                      e.currentTarget.style.background = a.bg;
                      e.currentTarget.style.color = a.color;
                      e.currentTarget.style.borderColor = `${a.color}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeAction !== a.id) {
                      e.currentTarget.style.background = "var(--bg-secondary)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }
                  }}
                >
                  {a.icon}
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
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "1rem",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  No posts yet. Be the first to share something!
                </div>
              )}
            </div>
          </div>

          {/* Mentors */}
          <div className="card animate-fade-up animate-delay-3">
            <SectionHeader title="Available Mentors" action="View all" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {DEMO_MENTORS.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-strong)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <img src={m.avatar} alt={m.name} style={{ width: "40px", height: "40px", borderRadius: "9999px", objectFit: "cover" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{m.title}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <span className="tag-blue" style={{ fontSize: "0.7rem" }}>{m.spec}</span>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "0.375rem",
                      background: "var(--accent-soft)",
                      border: "1px solid rgba(245,166,35,0.2)",
                      color: "var(--accent)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Request Mentor
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clubs */}
          <div className="card animate-fade-up">
            <SectionHeader title="Active Clubs" action="Browse all" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {DEMO_CLUBS.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-strong)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <img src={c.logo} alt={c.name} style={{ width: "36px", height: "36px", borderRadius: "0.5rem", objectFit: "cover" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.short}</div>
                    </div>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "0.375rem",
                      background: "rgba(74,140,255,0.1)",
                      border: "1px solid rgba(74,140,255,0.2)",
                      color: "var(--blue)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Join Club
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Suggestions */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(74,140,255,0.04) 100%)",
              border: "1px solid rgba(245,166,35,0.12)",
              borderRadius: "1rem",
              padding: "1.25rem",
            }}
            className="animate-fade-up"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "1rem" }}>✨</span>
              <h3 className="section-heading">Smart Suggestions</h3>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem", marginTop: "0.25rem" }}>
              AI-powered mentor recommendations based on your interests
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {DEMO_SUGGESTIONS.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    padding: "0.75rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(245,166,35,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <img src={s.avatar} alt={s.name} style={{ width: "36px", height: "36px", borderRadius: "9999px", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{s.note}</div>
                  </div>
                  <button
                    style={{
                      padding: "0.3rem 0.5rem",
                      borderRadius: "0.375rem",
                      background: "var(--accent-soft)",
                      border: "1px solid rgba(245,166,35,0.2)",
                      color: "var(--accent)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                      flexShrink: 0,
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
