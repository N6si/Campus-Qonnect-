import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";
import TeacherDashboard from "./pages/Dashboards/TeacherDashboard";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import Feed from "./pages/Feed/Feed";
import Profile from "./pages/Profile/Profile";
import MentorRequests from "./pages/Mentor/MentorRequests";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );

  return (
    <Layout>
      <div className="min-h-screen text-slate-800">
        

        <Routes>
          {/* Root Redirect */}
          <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard (Role-based) */}
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === "student" ? (
                <StudentDashboard />
              ) : user.role === "teacher" ? (
                <TeacherDashboard />
              ) : user.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <div className="p-6">Unknown Role</div>
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Other Protected Routes */}
        <Route
          path="/feed"
          element={user ? <Feed /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/mentor/requests"
          element={user ? <MentorRequests /> : <Navigate to="/login" replace />}
        />

        {/* 404 Fallback */}
        <Route path="*" element={<div className="p-6">404 — page not found</div>} />
      </Routes>
      </div>
    </Layout>
  );
}
