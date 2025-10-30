import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      await login(form); // handled in AuthContext
      // Navigate to dashboard (App will render role-specific view)
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.detail || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(246,248,255,1) 0%, rgba(251,250,255,1) 100%)' }}>
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden z-10 gap-6">
        {/* Illustration / left */}
        <div className="hidden md:flex flex-col items-center justify-center p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(244,114,182,0.06))' }}>
          <div className="w-32 h-32 rounded-xl bg-white/10 flex items-center justify-center text-3xl font-bold text-indigo-700 mb-4">CC</div>
          <h2 className="text-3xl font-extrabold">Welcome to CampusConnect</h2>
          <p className="mt-3 text-sm text-slate-700">Find mentors, share moments, and grow together.</p>
          <div className="mt-6 text-sm bg-white/10 px-3 py-2 rounded">Community for students & teachers</div>
        </div>

        {/* Form */}
        <div className="card p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-1 text-slate-800">Sign in</h3>
          <p className="text-sm muted mb-6">Use your CampusConnect account to continue</p>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-sm text-rose-600 bg-rose-50 p-2 rounded">{error}</div>}

            <div>
              <label className="block text-sm text-slate-600 mb-2">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-white/20 rounded-xl p-3 bg-white/60"
                placeholder="your username"
                type="text"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">Password</label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  type={showPw ? "text" : "password"}
                  className="w-full border border-white/20 rounded-xl p-3 pr-12 bg-white/60"
                  placeholder="Your password"
                  required
                />
                <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-3 top-3 text-sm text-slate-500">{showPw ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="form-checkbox"/> Remember me</label>
              <Link to="#" className="text-indigo-600">Forgot?</Link>
            </div>

            <button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="text-sm text-slate-500 mt-6 text-center">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
