import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.username || !formData.password) {
      setError("Please provide a username and password.");
      return;
    }

    setLoading(true);
    try {
      // only send fields backend expects
      await signup({ username: formData.username, password: formData.password, role: formData.role, bio: "", year: null, major: "", expertise: "" });
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="auth-blob a"></div>
      <div className="auth-blob b"></div>

      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden z-10 gap-6">
        <div className="hidden md:flex flex-col items-center justify-center p-10" style={{ background: 'linear-gradient(135deg, rgba(244,114,182,0.06), rgba(99,102,241,0.06))' }}>
          <div className="w-28 h-28 rounded-xl bg-white/60 flex items-center justify-center text-3xl font-bold text-indigo-700 mb-4">CC</div>
          <h2 className="text-2xl font-bold text-slate-800">Join CampusConnect</h2>
          <p className="mt-2 text-slate-700 text-center">Create your account to find mentors, share posts, and join the campus community.</p>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
          <p className="text-sm text-slate-500 mb-6">Sign up as a Student, Teacher or Admin to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-rose-600 bg-rose-50 p-2 rounded">{error}</div>}
            {message && <div className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded">{message}</div>}

            <div>
              <label className="block text-sm text-slate-600">Username</label>
              <input name="username" value={formData.username} onChange={handleChange} className="w-full border border-white/20 rounded-xl p-3 bg-white/60" placeholder="Choose a username" required />
            </div>

            <div>
              <label className="block text-sm text-slate-600">Email (optional)</label>
              <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full border border-white/20 rounded-xl p-3 bg-white/60" placeholder="you@university.edu" />
            </div>

            <div>
              <label className="block text-sm text-slate-600">Password</label>
              <input name="password" value={formData.password} onChange={handleChange} type="password" className="w-full border border-white/20 rounded-xl p-3 bg-white/60" placeholder="Create a password" required />
            </div>

            <div>
              <label className="block text-sm text-slate-600">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full border border-white/20 rounded-xl p-3 bg-white/60">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="text-sm text-slate-500 mt-5 text-center">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
