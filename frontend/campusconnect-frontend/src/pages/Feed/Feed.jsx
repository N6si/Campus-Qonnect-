import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import { Send, Plus, Zap, Rss, Settings } from "lucide-react";

const quickActions = [
  { id: 1, name: "Join Club", icon: <Plus size={18} />, route: "/clubs" },
  { id: 2, name: "Ask Mentor", icon: <Zap size={18} />, route: "/mentors" },
  { id: 3, name: "View Feed", icon: <Rss size={18} />, route: "/feed" },
  { id: 4, name: "Edit Profile", icon: <Settings size={18} />, route: "/profile" },
];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [posting, setPosting] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ---------------- POSTS ---------------- */

  const fetchPosts = async () => {
    try {
      const res = await API.get("/api/posts");
      setPosts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- CLUBS ---------------- */

  const fetchClubs = async () => {
    try {
      const res = await API.get("/api/clubs");
      setClubs(res.data || []);
    } catch (err) {
      console.error("Failed to load clubs");
    }
  };

  const joinClub = async (clubId) => {
    try {
      await API.post(`/api/clubs/${clubId}/join`);
      alert("Joined club successfully!");
    } catch (err) {
      alert("Failed to join club");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchClubs();
  }, []);

  /* ---------------- CREATE POST ---------------- */

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setPosting(true);

    try {
      await API.post("/api/posts", form);
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
          maxWidth: "1500px",
          margin: "0 auto",
          padding: "2rem",
          display: "flex",
          gap: "1.5rem",
        }}
      >
        <Sidebar user={user} />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* CREATE POST */}

          <div className="card">
            <h3>Create Post</h3>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                placeholder="Post title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="form-input"
              />

              <textarea
                placeholder="What's on your mind?"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="form-input"
              />

              <button type="submit" className="btn-primary">
                <Send size={16} /> {posting ? "Posting..." : "Post"}
              </button>
            </form>
          </div>

          {/* QUICK ACTIONS */}

          <div className="card">
            <h3>Quick Actions</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "10px",
              }}
            >
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => navigate(action.route)}
                  style={{
                    padding: "15px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-secondary)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {action.icon}
                  <span>{action.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* POSTS */}

          <div>
            <h3>Recent Posts</h3>

            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p>No posts yet</p>
            )}
          </div>

          {/* ACTIVE CLUBS */}

          <div className="card">
            <h3>Active Clubs</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: "12px",
              }}
            >
              {clubs.length > 0 ? (
                clubs.map((club) => (
                  <div
                    key={club.id}
                    style={{
                      padding: "15px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <h4>{club.name}</h4>
                    <p style={{ fontSize: "13px", opacity: 0.7 }}>
                      {club.description}
                    </p>

                    <button
                      onClick={() => joinClub(club.id)}
                      className="btn-primary"
                      style={{ marginTop: "10px" }}
                    >
                      Join Club
                    </button>
                  </div>
                ))
              ) : (
                <p>No clubs available</p>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
