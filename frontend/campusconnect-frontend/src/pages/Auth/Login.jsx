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
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.detail || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #e0e7ff 0%, #fce7f3 50%, #f1f5f9 100%)",
      }}
    >
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden z-10 gap-6 shadow-2xl">
        
        {/* Left Side */}
        <div
          className="hidden md:flex flex-col items-center justify-center p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(244,114,182,0.15))",
          }}
        >
          <div className="w-32 h-32 rounded-xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white mb-4">
            CC
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">
            Welcome to CampusConnect
          </h2>
          <p className="mt-3 text-sm text-slate-600 text-center">
            Find mentors, share moments, and grow together.
          </p>
          <div className="mt-6 text-sm bg-white px-3 py-2 rounded shadow">
            Community for students & teachers
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 flex flex-col justify-center rounded-3xl shadow-lg">
          <h3 className="text-2xl font-bold mb-1 text-slate-900">
            Sign in
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Use your CampusConnect account to continue
          </p>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="text-sm text-rose-600 bg-rose-100 p-2 rounded">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="your username"
                type="text"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  type={showPw ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl p-3 pr-12 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-3 text-sm text-indigo-600"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="form-checkbox" />
                Remember me
              </label>
              <Link to="#" className="text-indigo-600">
                Forgot?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="text-sm text-slate-500 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-medium">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
