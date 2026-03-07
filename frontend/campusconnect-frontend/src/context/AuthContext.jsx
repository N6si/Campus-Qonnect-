import { createContext, useState, useEffect } from "react";
import API from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetProfile = async (baseUser) => {
    try {
      const res = await API.get("/api/profile");
      const profile = res.data;
      const fullUser = {
        ...baseUser,
        bio: profile.bio,
        year: profile.year,
        major: profile.major,
        expertise: profile.expertise,
        email: profile.email,
        interests: profile.interests || [],
        goal: profile.goal,
      };
      setUser(fullUser);
      localStorage.setItem("user", JSON.stringify(fullUser));
      return fullUser;
    } catch (err) {
      setUser(baseUser);
      localStorage.setItem("user", JSON.stringify(baseUser));
      return baseUser;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        const baseUser = {
          username: payload.sub || payload.username || payload.email,
          role: payload.role,
        };
        fetchAndSetProfile(baseUser).finally(() => setLoading(false));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const res = await API.post("/login", { username, password });
      const token = res.data?.access_token || res.data?.token || null;
      if (!token) throw new Error("No token received");
      localStorage.setItem("token", token);
      const payload = parseJwt(token);
      const baseUser = {
        username: payload?.sub || payload?.username,
        role: payload?.role,
      };
      const fullUser = await fetchAndSetProfile(baseUser);
      return fullUser;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ username, password, role, bio, year, major, expertise }) => {
    setLoading(true);
    try {
      const res = await API.post("/signup", { username, password, role, bio, year, major, expertise });
      return res.data;
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const payload = parseJwt(token);
    if (!payload) return;
    const baseUser = {
      username: payload.sub || payload.username || payload.email,
      role: payload.role,
    };
    return await fetchAndSetProfile(baseUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  function parseJwt(token) {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (err) {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
