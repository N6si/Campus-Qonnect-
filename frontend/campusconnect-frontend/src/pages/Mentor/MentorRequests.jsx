import React, { useEffect, useState, useContext } from "react";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { CheckCircle, XCircle, Clock, Send, Users } from "lucide-react";

const DEMO_MENTORS = [
  { name: "Dr. Ananya Rao", spec: "AI & NLP", avatar: "https://i.pravatar.cc/60?img=32" },
  { name: "Prof. Vikram Singh", spec: "Software Engineering", avatar: "https://i.pravatar.cc/60?img=12" },
  { name: "Dr. Maria Chen", spec: "Robotics", avatar: "https://i.pravatar.cc/60?img=56" },
  { name: "Dr. Liam O'Connor", spec: "Data Science", avatar: "https://i.pravatar.cc/60?img=8" },
  { name: "Dr. Sarah Mitchell", spec: "Machine Learning", avatar: "https://i.pravatar.cc/60?img=45" },
  { name: "Prof. James Wilson", spec: "Blockchain & Web3", avatar: "https://i.pravatar.cc/60?img=33" },
];

function StatusBadge({ status }) {
  const styles = {
    pending: { color: "var(--accent)", bg: "var(--accent-soft)", border: "rgba(245,166,35,0.2)", icon: <Clock size={11} /> },
    accepted: { color: "var(--green)", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", icon: <CheckCircle size={11} /> },
    rejected: { color: "var(--red)", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", icon: <XCircle size={11} /> },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: "0.375rem", background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: "0.7rem", fontWeight: 600, textTransform: "capitalize" }}>
      {s.icon} {status}
    </span>
  );
}

// ── STUDENT VIEW ──────────────────────────────────────────────
function StudentView({ user }) {
  const [myRequests, setMyRequests] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/api/mentor/my-requests");
      setMyRequests(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMyRequests(); }, []);

  const sendRequest = async (mentorName) => {
    setSending(true);
    try {
      await API.post("/api/mentor/request", { mentor_name: mentorName, message });
      setSelectedMentor(null);
      setMessage("");
      fetchMyRequests();
      showToast(`Request sent to ${mentorName}!`);
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to send request", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 999, padding: "0.75rem 1.25rem", borderRadius: "0.625rem", background: toast.type === "error" ? "rgba(248,113,113,0.15)" : "rgba(52,211,153,0.15)", border: `1px solid ${toast.type === "error" ? "rgba(248,113,113,0.3)" : "rgba(52,211,153,0.3)"}`, color: toast.type === "error" ? "var(--red)" : "var(--green)", fontSize: "0.875rem", fontWeight: 500 }}>
          {toast.msg}
        </div>
      )}

      {/* Available Mentors */}
      <div className="card">
        <h2 className="section-heading" style={{ marginBottom: "1rem" }}>Request a Mentor</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
          {DEMO_MENTORS.map((m) => (
            <div key={m.name} style={{ background: "var(--bg-secondary)", border: `1px solid ${selectedMentor === m.name ? "var(--accent)" : "var(--border)"}`, borderRadius: "0.75rem", padding: "1rem", transition: "all 0.2s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <img src={m.avatar} alt={m.name} style={{ width: "40px", height: "40px", borderRadius: "9999px" }} />
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{m.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{m.spec}</div>
                </div>
              </div>

              {selectedMentor === m.name ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <textarea
                    placeholder="Add a message (optional)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-input"
                    style={{ resize: "none", fontSize: "0.75rem", minHeight: "60px" }}
                    rows={2}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => sendRequest(m.name)}
                      disabled={sending}
                      style={{ flex: 1, padding: "0.4rem", borderRadius: "0.375rem", background: "var(--accent)", border: "none", color: "#0a0c14", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}
                    >
                      <Send size={11} /> {sending ? "Sending..." : "Send"}
                    </button>
                    <button
                      onClick={() => { setSelectedMentor(null); setMessage(""); }}
                      style={{ padding: "0.4rem 0.75rem", borderRadius: "0.375rem", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedMentor(m.name)}
                  style={{ width: "100%", padding: "0.4rem", borderRadius: "0.375rem", background: "var(--accent-soft)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--accent)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                >
                  Request Mentor
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* My Requests */}
      <div className="card">
        <h2 className="section-heading" style={{ marginBottom: "1rem" }}>My Requests</h2>
        {myRequests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            No requests sent yet. Request a mentor above!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {myRequests.map((r, i) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: i < myRequests.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{r.mentor_name}</div>
                  {r.message && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{r.message}</div>}
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{new Date(r.created_at).toLocaleDateString()}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── TEACHER VIEW ──────────────────────────────────────────────
function TeacherView({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/mentor/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (requestId, action) => {
    try {
      await API.put(`/api/mentor/requests/${requestId}`, { action });
      fetchRequests();
      showToast(`Request ${action}ed successfully!`);
    } catch (err) {
      showToast(err.response?.data?.detail || "Action failed", "error");
    }
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && (
        <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 999, padding: "0.75rem 1.25rem", borderRadius: "0.625rem", background: toast.type === "error" ? "rgba(248,113,113,0.15)" : "rgba(52,211,153,0.15)", border: `1px solid ${toast.type === "error" ? "rgba(248,113,113,0.3)" : "rgba(52,211,153,0.3)"}`, color: toast.type === "error" ? "var(--red)" : "var(--green)", fontSize: "0.875rem", fontWeight: 500 }}>
          {toast.msg}
        </div>
      )}

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 className="section-heading">Mentorship Requests</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["all", "pending", "accepted", "rejected"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.3rem 0.75rem", borderRadius: "0.375rem", border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`, background: filter === f ? "var(--accent-soft)" : "transparent", color: filter === f ? "var(--accent)" : "var(--text-muted)", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", textTransform: "capitalize", fontFamily: "DM Sans, sans-serif" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            No {filter === "all" ? "" : filter} requests found.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "9999px", background: "var(--accent-soft)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Users size={16} style={{ color: "var(--accent)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{r.student_username}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>→</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--blue)" }}>{r.mentor_name}</span>
                  </div>
                  {r.message && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.message}</div>}
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{new Date(r.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                  <StatusBadge status={r.status} />
                  {r.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(r.id, "accept")}
                        style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.35rem 0.75rem", borderRadius: "0.375rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "var(--green)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                      >
                        <CheckCircle size={12} /> Accept
                      </button>
                      <button
                        onClick={() => handleAction(r.id, "reject")}
                        style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.35rem 0.75rem", borderRadius: "0.375rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--red)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────
export default function MentorRequests() {
  const { user } = useContext(AuthContext);

  const isTeacher = user?.role === "teacher" || user?.role === "mentor" || user?.role === "admin";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <Sidebar user={user} />
        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="hero-banner animate-fade-up" style={{ marginBottom: "1.25rem" }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="tag" style={{ marginBottom: "0.5rem", display: "inline-flex" }}>
                {isTeacher ? "Teacher View" : "Student View"}
              </span>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.5rem 0 0.25rem" }}>
                {isTeacher ? "Manage Requests" : "Find a Mentor"} 🤝
              </h1>
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>
                {isTeacher ? "Review and respond to student mentorship requests" : "Request a mentor and track your request status"}
              </p>
            </div>
          </div>

          {isTeacher ? <TeacherView user={user} /> : <StudentView user={user} />}
        </main>
      </div>
    </div>
  );
}
