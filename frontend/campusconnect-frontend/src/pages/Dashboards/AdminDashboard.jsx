import React, { useEffect, useState, useContext } from "react";
import API from "../../lib/api";
import Card from "../../components/Card";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) { console.error(err); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-light to-bg-dark">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-8 text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold mb-2">Admin Dashboard 🛡️</h1>
            <p className="text-primary-100">Monitor and manage your platform</p>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary-400/30 to-transparent"></div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar user={user} />

          <main className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="card backdrop-blur-sm bg-card-glass border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-primary-900">Platform Overview</h2>
                  <p className="text-sm text-primary-600">Key metrics and actions</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors">
                    Manage Users
                  </button>
                  <button className="btn-primary">
                    Export CSV
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors">
                  <div className="text-primary-600 mb-2 text-lg">👥</div>
                  <h3 className="font-medium text-primary-900 mb-1">Total Users</h3>
                  <div className="text-2xl font-bold text-primary-700">{stats?.users_count ?? "—"}</div>
                </div>
                <div className="p-6 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors">
                  <div className="text-primary-600 mb-2 text-lg">📝</div>
                  <h3 className="font-medium text-primary-900 mb-1">Posts</h3>
                  <div className="text-2xl font-bold text-primary-700">{stats?.posts_count ?? "—"}</div>
                </div>
                <div className="p-6 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors">
                  <div className="text-primary-600 mb-2 text-lg">🤝</div>
                  <h3 className="font-medium text-primary-900 mb-1">Mentor Requests</h3>
                  <div className="text-2xl font-bold text-primary-700">{stats?.mentor_requests ?? "—"}</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card backdrop-blur-sm bg-card-glass border border-white/10">
              <h2 className="text-xl font-semibold text-primary-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-primary-900">New User Signups</h3>
                      <p className="text-sm text-primary-600">Last 24 hours</p>
                    </div>
                    <div className="text-xl font-bold text-primary-700">+12</div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-primary-900">Active Sessions</h3>
                      <p className="text-sm text-primary-600">Current</p>
                    </div>
                    <div className="text-xl font-bold text-primary-700">8</div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className="lg:col-span-1 space-y-6">
            {/* Admin Tools */}
            <div className="card backdrop-blur-sm bg-card-glass border border-white/10">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Quick Tools</h3>
              <div className="space-y-3">
                <button className="w-full p-3 rounded-lg bg-primary-50 hover:bg-primary-100 text-left transition-colors">
                  <div className="text-sm font-medium text-primary-900">User Management</div>
                  <div className="text-xs text-primary-600">Manage accounts and roles</div>
                </button>
                <button className="w-full p-3 rounded-lg bg-primary-50 hover:bg-primary-100 text-left transition-colors">
                  <div className="text-sm font-medium text-primary-900">Content Moderation</div>
                  <div className="text-xs text-primary-600">Review flagged content</div>
                </button>
                <button className="w-full p-3 rounded-lg bg-primary-50 hover:bg-primary-100 text-left transition-colors">
                  <div className="text-sm font-medium text-primary-900">System Settings</div>
                  <div className="text-xs text-primary-600">Configure platform options</div>
                </button>
              </div>
            </div>
            
            {/* System Status */}
            <div className="card backdrop-blur-sm bg-card-glass border border-white/10">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-700">Server Load</span>
                    <span className="text-primary-900">28%</span>
                  </div>
                  <div className="h-2 bg-primary-100 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full w-[28%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-700">Storage Used</span>
                    <span className="text-primary-900">42%</span>
                  </div>
                  <div className="h-2 bg-primary-100 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full w-[42%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
