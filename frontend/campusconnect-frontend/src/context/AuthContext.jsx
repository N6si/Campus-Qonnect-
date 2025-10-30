import { createContext, useState, useEffect } from "react";
import API from "../lib/api";
import axios from "axios";

// Create Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token/user from localStorage on mount and parse token payload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        const u = { username: payload.sub || payload.username || payload.email, role: payload.role };
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login: call backend /login, store token and parse payload for user
  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", { username, password });
      const token = res.data?.access_token || res.data?.token || null;
      if (!token) throw new Error("No token received");
      localStorage.setItem("token", token);

      const payload = parseJwt(token);
      const u = { username: payload?.sub || payload?.username, role: payload?.role };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      return u;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup: call backend /signup
  const signup = async ({ username, password, role, bio, year, major, expertise }) => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/signup", { username, password, role, bio, year, major, expertise });
      return res.data;
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Helper: parse JWT payload (no verification) to extract claims
  function parseJwt(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (err) { return null; }
  }

  // Context Value
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
