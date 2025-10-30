import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold shadow-lg">
                CC
              </div>
              <div className="text-primary-900 font-semibold">CampusConnect</div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className="text-primary-700 hover:text-primary-900 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
              >
                Dashboard
              </Link>
              <Link 
                to="/feed" 
                className="text-primary-700 hover:text-primary-900 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
              >
                Feed
              </Link>
              <Link 
                to="/profile" 
                className="text-primary-700 hover:text-primary-900 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
              >
                Profile
              </Link>
              {user?.role === "teacher" && (
                <Link 
                  to="/mentor/requests" 
                  className="text-primary-700 hover:text-primary-900 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
                >
                  Mentor Requests
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block relative">
              <input 
                placeholder="Search mentors, clubs..." 
                className="w-72 px-4 py-2 rounded-xl border border-white/50 bg-white/80 
                         focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20
                         transition-all duration-300 placeholder-primary-300"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400">
                🔍
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-primary-50">
                  <div className="relative">
                    <img 
                      src={user.avatar || "https://ui-avatars.com/api/?name=" + user.username} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    <div className="status-online"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary-900">{user.username || user.name}</div>
                    <div className="text-xs text-primary-600">{user.role}</div>
                  </div>
                </div>
                <button 
                  onClick={logout} 
                  className="btn-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-primary-700 hover:text-primary-900 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-primary"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
