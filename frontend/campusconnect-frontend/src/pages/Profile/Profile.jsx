import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../lib/api";
import { Mail, Shield, Edit3, Calendar, Award, BookOpen, Users, X, Check } from "lucide-react";

const badges = [
  { name: "Active Member", color: "var(--accent)", bg: "var(--accent-soft)", border: "rgba(245,166,35,0.2)" },
  { name: "Early Adopter", color: "var(--blue)", bg: "var(--blue-soft)", border: "rgba(74,140,255,0.2)" },
  { name: "Post Creator", color: "var(--green)", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  { name: "Club Joiner", color: "var(--purple)", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
  { name: "Mentor Seeker", color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)" },
];

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [profileData, setProfileData] = useState({
    bio: user?.bio || "",
    year: user?.year || "",
    major: user?.major || "",
    expertise: user?.expertise || "",
  });
  const [form, setForm] = useState({ ...profileData });

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
      No profile found.
    </div>
  );

  const displayName = user.name || user.username || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = {};
      if (form.bio !== undefined) payload.bio = form.bio;
      if (form.year) payload.year = parseInt(form.year);
      if (form.major !== undefined) payload.major = form.major;
      if (form.expertise !== undefined) payload.expertise = form.expertise;

      await API.put("/api/profile", payload);

      // ✅ Update displayed data immediately
      const updated = { ...profileData, ...payload };
      setProfileData(updated);
      setForm(updated);
      setEditing(false);
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 999, padding: "0.75rem 1.25rem", borderRadius: "0.625rem", background: toast.type === "error" ? "rgba(248,113,113,0.15)" : "rgba(52,211,153,0.15)", border: `1px solid ${toast.type === "error" ? "rgba(248,113,113,0.3)" : "rgba(52,211,153,0.3)"}`, color: toast.type === "error" ? "var(--red)" : "var(--green)", fontSize: "0.875rem", fontWeight: 500 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <Sidebar user={user} />

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Profile hero */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", overflow: "hidden" }} className="animate-fade-up">
            {/* Banner */}
            <div style={{ height: "100px", background: "linear-gradient(135deg, #1a1f35 0%, #161926 50%, #1a1428 100%)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-20px", right: "10%", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)", borderRadius: "9999px" }} />
            </div>

            <div style={{ padding: "0 1.5rem 1.5rem", position: "relative" }}>
              {/* Avatar */}
              <div style={{ width: "72px", height: "72px", borderRadius: "9999px", background: "var(--accent)", color: "#0a0c14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.25rem", border: "3px solid var(--bg-card)", marginTop: "-36px", marginBottom: "0.75rem", position: "relative", zIndex: 1 }}>
                {initials}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
                    {displayName}
                  </h1>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      <Mail size={13} style={{ color: "var(--text-muted)" }} />
                      {user.email || "No email set"}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      <Shield size={13} style={{ color: "var(--text-muted)" }} />
                      <span style={{ padding: "0.1rem 0.5rem", borderRadius: "0.25rem", background: "var(--accent-soft)", color: "var(--accent)", fontSize: "0.7rem", fontWeight: 600, textTransform: "capitalize" }}>
                        {user.role}
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      <Calendar size={13} /> Joined 2024
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn-ghost"
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
                >
                  <Edit3 size={13} />
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Edit Form */}
              {editing ? (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell others about yourself..."
                      className="form-input"
                      style={{ resize: "none", minHeight: "70px" }}
                      rows={3}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Year</label>
                      <input
                        type="number"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        placeholder="e.g. 2"
                        className="form-input"
                        min={1} max={5}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Major</label>
                      <input
                        value={form.major}
                        onChange={(e) => setForm({ ...form, major: e.target.value })}
                        placeholder="e.g. Computer Science"
                        className="form-input"
                      />
                    </div>
                  </div>
                  {(user.role === "teacher" || user.role === "mentor") && (
                    <div>
                      <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Expertise</label>
                      <input
                        value={form.expertise}
                        onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                        placeholder="e.g. Machine Learning, Web Development"
                        className="form-input"
                      />
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="btn-primary"
                      style={{ display: "flex", alignItems: "center", gap: "0.375rem", opacity: saving ? 0.7 : 1 }}
                    >
                      <Check size={14} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="btn-ghost"
                      style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: profileData.bio ? "var(--text-secondary)" : "var(--text-muted)", fontStyle: profileData.bio ? "normal" : "italic", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                  {profileData.bio || "No bio yet. Click Edit Profile to add one!"}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }} className="animate-fade-up animate-delay-1">
            {[
              { label: "Posts", value: "24", icon: <BookOpen size={14} /> },
              { label: "Clubs", value: "3", icon: <Users size={14} /> },
              { label: "Mentors", value: "2", icon: <Users size={14} /> },
              { label: "Badges", value: "5", icon: <Award size={14} /> },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: "1rem", textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Details + Badges */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="animate-fade-up animate-delay-2">
            <div className="card">
              <h2 className="section-heading" style={{ marginBottom: "1rem" }}>Account Details</h2>
              {[
                { label: "Username", value: user.username || user.name },
                { label: "Email", value: user.email || "Not set" },
                { label: "Role", value: user.role, accent: true },
                { label: "Year", value: profileData.year ? `Year ${profileData.year}` : "Not set" },
                { label: "Major", value: profileData.major || "Not set" },
                { label: "Expertise", value: profileData.expertise || "Not set" },
                { label: "Status", value: "Active", green: true },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{item.label}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: item.accent ? "var(--accent)" : item.green ? "var(--green)" : "var(--text-primary)", textTransform: item.accent ? "capitalize" : "none" }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="card">
              <h2 className="section-heading" style={{ marginBottom: "1rem" }}>Badges Earned</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {badges.map((b, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", borderRadius: "0.5rem", background: b.bg, border: `1px solid ${b.border}`, color: b.color, fontSize: "0.75rem", fontWeight: 600 }}>
                    <Award size={12} /> {b.name}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "1.25rem", padding: "0.875rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.625rem" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Progress to next badge</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Community Leader</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600 }}>68%</span>
                </div>
                <div style={{ height: "4px", borderRadius: "2px", background: "var(--border)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "68%", background: "var(--accent)", borderRadius: "2px" }} />
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
