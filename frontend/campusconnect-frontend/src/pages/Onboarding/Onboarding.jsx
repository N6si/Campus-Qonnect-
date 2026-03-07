import React, { useState, useContext } from "react";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import { Check, ArrowRight, Sparkles, Users, BookOpen, Code, Brain, Music, Palette, Globe } from "lucide-react";

const INTERESTS = [
  { id: "ai", label: "AI & Machine Learning", icon: <Brain size={16} />, color: "var(--purple)" },
  { id: "web", label: "Web Development", icon: <Globe size={16} />, color: "var(--blue)" },
  { id: "cs", label: "Computer Science", icon: <Code size={16} />, color: "var(--accent)" },
  { id: "design", label: "UI/UX Design", icon: <Palette size={16} />, color: "#f472b6" },
  { id: "data", label: "Data Science", icon: <BookOpen size={16} />, color: "var(--green)" },
  { id: "music", label: "Music & Arts", icon: <Music size={16} />, color: "#fb923c" },
  { id: "research", label: "Research", icon: <Sparkles size={16} />, color: "var(--blue)" },
  { id: "clubs", label: "Clubs & Events", icon: <Users size={16} />, color: "var(--accent)" },
];

const STEPS = ["Welcome", "Interests", "Goals"];

export default function Onboarding({ onComplete }) {
  const { refreshUser } = useContext(AuthContext); // FIX: get refreshUser from context
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [goal, setGoal] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (id) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        interests: selectedInterests,
        goal: goal || null,
        ...(major && { major }),
        ...(year && { year: parseInt(year) }),
      };

      await API.put("/api/profile", payload);

      // FIX: refresh user in context so Profile page shows updated data immediately
      await refreshUser();

      onComplete();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "var(--bg-primary)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        width: "100%", maxWidth: "540px",
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "1.5rem", overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "var(--border)" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--accent)", transition: "width 0.4s ease", borderRadius: "2px" }} />
        </div>

        <div style={{ padding: "2rem" }}>

          {/* Step indicators */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.375rem",
                  color: i <= step ? "var(--accent)" : "var(--text-muted)",
                  fontSize: "0.75rem", fontWeight: i === step ? 700 : 500,
                }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "9999px",
                    background: i < step ? "var(--accent)" : i === step ? "var(--accent-soft)" : "var(--bg-secondary)",
                    border: `1px solid ${i <= step ? "var(--accent)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 700,
                    color: i < step ? "#0a0c14" : i === step ? "var(--accent)" : "var(--text-muted)",
                  }}>
                    {i < step ? <Check size={11} /> : i + 1}
                  </div>
                  {s}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: "24px", height: "1px", background: i < step ? "var(--accent)" : "var(--border)" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* STEP 0 — Welcome */}
          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎓</div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.75rem" }}>
                Welcome to CampusConnect!
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Let's set up your profile in just 2 quick steps so you can get the most out of your campus experience.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2rem", textAlign: "left" }}>
                {[
                  { emoji: "🤝", title: "Find Mentors", desc: "Connect with expert teachers" },
                  { emoji: "🎯", title: "Join Clubs", desc: "Explore your interests" },
                  { emoji: "🤖", title: "AI Assistant", desc: "Get help anytime" },
                  { emoji: "📝", title: "Share Posts", desc: "Connect with peers" },
                ].map((f, i) => (
                  <div key={i} style={{ padding: "0.875rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
                    <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{f.emoji}</div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>{f.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{f.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Your Year</label>
                    <select value={year} onChange={e => setYear(e.target.value)} className="form-input" style={{ width: "100%" }}>
                      <option value="">Select year</option>
                      {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Your Major</label>
                    <input value={major} onChange={e => setMajor(e.target.value)} placeholder="e.g. Computer Science" className="form-input" />
                  </div>
                </div>
              </div>

              <button onClick={() => setStep(1)} className="btn-primary" style={{ width: "100%", padding: "0.875rem", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                Get Started <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 1 — Interests */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎯</div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
                  What are you into?
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  Pick your interests — we'll find the right mentors for you
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "1.5rem" }}>
                {INTERESTS.map((interest) => {
                  const selected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.625rem",
                        padding: "0.75rem 1rem", borderRadius: "0.75rem", textAlign: "left",
                        background: selected ? `${interest.color}15` : "var(--bg-secondary)",
                        border: `1px solid ${selected ? interest.color : "var(--border)"}`,
                        color: selected ? interest.color : "var(--text-secondary)",
                        cursor: "pointer", transition: "all 0.15s ease",
                        fontFamily: "DM Sans, sans-serif", fontSize: "0.8125rem", fontWeight: 600,
                      }}
                    >
                      <span style={{ color: interest.color }}>{interest.icon}</span>
                      {interest.label}
                      {selected && <Check size={13} style={{ marginLeft: "auto", flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "0.625rem" }}>
                <button onClick={() => setStep(0)} className="btn-ghost" style={{ flex: 1, padding: "0.75rem" }}>Back</button>
                <button onClick={() => setStep(2)} className="btn-primary" style={{ flex: 2, padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Goals */}
          {step === 2 && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🚀</div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
                  What's your goal?
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  This helps us personalize your experience
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.5rem" }}>
                {[
                  { id: "mentor", emoji: "🤝", title: "Find a mentor", desc: "Get guidance from experienced teachers" },
                  { id: "network", emoji: "👥", title: "Build my network", desc: "Connect with fellow students" },
                  { id: "learn", emoji: "📚", title: "Learn new skills", desc: "Explore courses and resources" },
                  { id: "projects", emoji: "💡", title: "Work on projects", desc: "Collaborate with others on cool ideas" },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "0.875rem 1rem", borderRadius: "0.75rem", textAlign: "left",
                      background: goal === g.id ? "var(--accent-soft)" : "var(--bg-secondary)",
                      border: `1px solid ${goal === g.id ? "var(--accent)" : "var(--border)"}`,
                      cursor: "pointer", transition: "all 0.15s ease",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{g.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: goal === g.id ? "var(--accent)" : "var(--text-primary)" }}>{g.title}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{g.desc}</div>
                    </div>
                    {goal === g.id && <Check size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />}
                  </button>
                ))}
              </div>

              <div style={{ padding: "1rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  ✅ {selectedInterests.length} interests selected
                  {major && ` • ${major}`}
                  {year && ` • Year ${year}`}
                  {goal && ` • Goal: ${goal}`}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                  Your profile is ready to go! You can update these anytime in Profile Settings.
                </div>
              </div>

              {error && (
                <div style={{ padding: "0.75rem 1rem", background: "#ff000015", border: "1px solid #ff000040", borderRadius: "0.5rem", color: "#ff6b6b", fontSize: "0.8rem", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.625rem" }}>
                <button onClick={() => setStep(1)} className="btn-ghost" style={{ flex: 1, padding: "0.75rem" }}>Back</button>
                <button
                  onClick={finish}
                  disabled={saving}
                  className="btn-primary"
                  style={{ flex: 2, padding: "0.75rem", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Setting up..." : "🎉 Enter CampusConnect"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
