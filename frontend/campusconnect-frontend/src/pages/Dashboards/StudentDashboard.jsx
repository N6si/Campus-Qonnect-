import React, { useContext } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";

export default function Overview() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex gap-8 p-6 lg:p-12 max-w-[2000px] mx-auto mt-4">
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main Content */}
        <div className="flex-1 max-w-[1400px] space-y-8">
          {/* Hero / Welcome Section */}
          <div className="relative mb-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white overflow-hidden shadow-md">
            <div className="relative z-10">
              <h1 className="text-3xl font-extrabold mb-2">
                Welcome back, {user?.username || user?.name || "Learner"} 👋
              </h1>
              <p className="text-indigo-100">
                Here’s your quick summary and recent updates
              </p>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-purple-400/30 to-transparent"></div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Posts", value: 24, icon: "📝" },
              { label: "Clubs Joined", value: 3, icon: "🎯" },
              { label: "Mentors Connected", value: 2, icon: "🤝" },
              { label: "Badges Earned", value: 5, icon: "🏅" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {item.value}
                    </div>
                    <div className="text-sm text-slate-600">{item.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Recent Activity
            </h2>
            <ul className="space-y-3 text-slate-600 text-sm">
              <li>✅ Joined <strong>AI Innovators Club</strong></li>
              <li>💬 Connected with <strong>Dr. Ananya Rao</strong></li>
              <li>📜 Created a post titled <strong>“My AI Journey”</strong></li>
              <li>🏅 Earned the <strong>Active Member</strong> badge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
