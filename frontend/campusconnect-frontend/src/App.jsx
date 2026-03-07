import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";
import TeacherDashboard from "./pages/Dashboards/TeacherDashboard";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import Feed from "./pages/Feed/Feed";
import Profile from "./pages/Profile/Profile";
import MentorRequests from "./pages/Mentor/MentorRequests";
import AIAssistant from "./pages/AI/AIAssistant";
import Messages from "./pages/Messages/Messages";
import Onboarding from "./pages/Onboarding/Onboarding";
import Layout from "./components/Layout";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user, loading } = useContext(AuthContext);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding for new users who haven't set up profile yet
  useEffect(() => {
    if (user) {
      const dismissed = localStorage.getItem(`onboarding_done_${user.username}`);
      if (!dismissed && !user.major && !user.bio) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    localStorage.setItem(`onboarding_done_${user.username}`, "true");
    setShowOnboarding(false);
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>
        Loading…
      </div>
    );

  return (
    <Layout>
      {/* Onboarding overlay for new users */}
      {user && showOnboarding && (
        <Onboarding user={user} onComplete={handleOnboardingComplete} />
      )}

      <div className="min-h-screen text-slate-800">
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard — role based */}
          <Route
            path="/dashboard"
            element={
              user ? (
                user.role === "student" ? <StudentDashboard /> :
                user.role === "teacher" ? <TeacherDashboard /> :
                user.role === "admin" ? <AdminDashboard /> :
                <div style={{ padding: "2rem", color: "var(--text-primary)" }}>Unknown Role</div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Protected routes */}
          <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/mentor/requests" element={user ? <MentorRequests /> : <Navigate to="/login" replace />} />
          <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" replace />} />
          <Route path="/ai-assistant" element={user ? <AIAssistant /> : <Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", color: "var(--text-muted)", fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800 }}>
              404 — page not found
            </div>
          } />
        </Routes>
      </div>
    </Layout>
  );
}
