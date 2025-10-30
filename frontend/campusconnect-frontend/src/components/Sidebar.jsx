import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Rss,
  User,
  Users,
} from "lucide-react"; // make sure lucide-react is installed: npm i lucide-react

export default function Sidebar({ className = "", user }) {
  const location = useLocation();

  const links = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Feed", path: "/feed", icon: <Rss size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
    { name: "Mentor Requests", path: "/mentor/requests", icon: <Users size={18} /> },
  ];

  return (
    <aside
      className={`hidden md:block lg:col-span-1 space-y-6 ${className}`}
    >
      {/* User Info Card */}
      <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-4 transition hover:shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-semibold text-lg">
            {(user?.username || user?.name || "U")[0]}
          </div>
          <div>
            <div className="text-sm font-semibold text-indigo-900">
              {user?.username || user?.name || "User"}
            </div>
            <div className="text-xs text-indigo-500">
              {user?.role || "Student"}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-indigo-600 italic">
          CampusConnect · Student Life
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-indigo-800 hover:bg-indigo-100 hover:shadow-sm"
              }`}
            >
              <span className="text-indigo-600">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
