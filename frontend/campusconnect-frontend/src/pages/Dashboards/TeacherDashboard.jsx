import React, { useContext } from "react";
import MentorRequests from "../Mentor/MentorRequests";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

export default function TeacherDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-light to-bg-dark">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-8 text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold mb-2">Welcome, Professor {user?.username}! 👋</h1>
            <p className="text-primary-100">Your mentorship dashboard</p>
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
                  <h2 className="text-xl font-semibold text-primary-900">Mentor Actions</h2>
                  <p className="text-sm text-primary-600">Manage your teaching activities</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors">
                    My Mentees
                  </button>
                  <button className="btn-primary">
                    New Session
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-primary-50 hover:bg-primary-100 cursor-pointer transition-colors">
                  <div className="text-primary-600 mb-2">📚</div>
                  <h3 className="font-medium text-primary-900">My Courses</h3>
                </div>
                <div className="p-4 rounded-xl bg-primary-50 hover:bg-primary-100 cursor-pointer transition-colors">
                  <div className="text-primary-600 mb-2">👥</div>
                  <h3 className="font-medium text-primary-900">Students</h3>
                </div>
                <div className="p-4 rounded-xl bg-primary-50 hover:bg-primary-100 cursor-pointer transition-colors">
                  <div className="text-primary-600 mb-2">📅</div>
                  <h3 className="font-medium text-primary-900">Schedule</h3>
                </div>
              </div>
            </div>

            {/* Mentor Requests Section */}
            <div className="card backdrop-blur-sm bg-card-glass border border-white/10">
              <h2 className="text-xl font-semibold text-primary-900 mb-6">Mentorship Requests</h2>
              <MentorRequests />
            </div>
          </main>

          <aside className="lg:col-span-1 space-y-6">
            {/* Insights Card */}
            <div className="card backdrop-blur-sm bg-card-glass border border-white/10">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Teaching Insights</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary-50">
                  <div className="text-sm font-medium text-primary-900">Active Mentees</div>
                  <div className="text-primary-600">12 Students</div>
                </div>
                <div className="p-3 rounded-lg bg-primary-50">
                  <div className="text-sm font-medium text-primary-900">Next Session</div>
                  <div className="text-primary-600">Web Development - 2:00 PM</div>
                </div>
                <div className="p-3 rounded-lg bg-primary-50">
                  <div className="text-sm font-medium text-primary-900">Pending Reviews</div>
                  <div className="text-primary-600">3 assignments</div>
                </div>
              </div>
            </div>
            
            {/* Activity Stats */}
            <div className="card backdrop-blur-sm bg-card-glass border border-white/10">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Monthly Activity</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-700">Sessions Completed</span>
                    <span className="text-primary-900">24/30</span>
                  </div>
                  <div className="h-2 bg-primary-100 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-700">Student Engagement</span>
                    <span className="text-primary-900">85%</span>
                  </div>
                  <div className="h-2 bg-primary-100 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full w-[85%]"></div>
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
