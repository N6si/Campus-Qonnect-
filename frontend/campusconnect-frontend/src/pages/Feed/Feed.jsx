import React, { useEffect, useState, useContext } from "react";
import API from "../../lib/api";
import Card from "../../components/Card";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import PostCard from "../../components/PostCard";

// Cleaned up demo data - no duplicates
const DEMO_MENTORS = [
  { id: 1, name: "Dr. Ananya Rao", title: "Associate Professor", spec: "AI & NLP", avatar: "https://i.pravatar.cc/120?img=32" },
  { id: 2, name: "Prof. Vikram Singh", title: "Senior Lecturer", spec: "Software Engineering", avatar: "https://i.pravatar.cc/120?img=12" },
  { id: 3, name: "Dr. Maria Chen", title: "Research Scientist", spec: "Robotics", avatar: "https://i.pravatar.cc/120?img=56" },
  { id: 4, name: "Dr. Liam O'Connor", title: "Visiting Professor", spec: "Data Science", avatar: "https://i.pravatar.cc/120?img=8" },
];

const DEMO_CLUBS = [
  { id: 1, name: "Coding Club", short: "Build projects and compete in hackathons.", logo: "https://picsum.photos/seed/coding/80" },
  { id: 2, name: "Music Club", short: "Jam sessions and open mics every week.", logo: "https://picsum.photos/seed/music/80" },
  { id: 3, name: "AI Innovators", short: "Research & workshops on AI topics.", logo: "https://picsum.photos/seed/ai/80" },
  { id: 4, name: "Design Studio", short: "UI/UX workshops and design sprints.", logo: "https://picsum.photos/seed/design/80" },
];

// Separate suggestions - different mentors not already shown above
const DEMO_SUGGESTIONS = [
  { id: 5, name: "Dr. Sarah Mitchell", note: "Machine Learning Expert", avatar: "https://i.pravatar.cc/100?img=45" },
  { id: 6, name: "Prof. James Wilson", note: "Blockchain & Web3", avatar: "https://i.pravatar.cc/100?img=33" },
  { id: 7, name: "Dr. Priya Sharma", note: "Cybersecurity Specialist", avatar: "https://i.pravatar.cc/100?img=28" },
];

function MentorCard({ m }) {
  return (
    <div className="group bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center gap-4 mb-4">
        <img src={m.avatar} alt={m.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-100" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 truncate">{m.name}</div>
          <div className="text-xs text-slate-500 truncate">{m.title}</div>
        </div>
      </div>
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-xs font-medium">
          {m.spec}
        </span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition">
          Request Mentor
        </button>
        <button className="px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 font-medium transition">
          View →
        </button>
      </div>
    </div>
  );
}

function ClubCard({ c }) {
  return (
    <div className="group bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center gap-4 mb-4">
        <img src={c.logo} alt={c.name} className="w-14 h-14 rounded-lg object-cover ring-2 ring-gray-100" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 truncate">{c.name}</div>
          <div className="text-xs text-slate-500 line-clamp-2">{c.short}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 text-sm px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition">
          Join
        </button>
        <button className="px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 font-medium transition">
          View →
        </button>
      </div>
    </div>
  );
}

function QuickActions() {
  const [activeAction, setActiveAction] = useState(null);

  const actions = [
    { id: 1, name: "Join Club", icon: "➕", gradient: "from-blue-500 to-cyan-500" },
    { id: 2, name: "Ask Mentor", icon: "💬", gradient: "from-purple-500 to-pink-500" },
    { id: 3, name: "View Feed", icon: "📜", gradient: "from-orange-500 to-red-500" },
    { id: 4, name: "Edit Profile", icon: "⚙️", gradient: "from-green-500 to-emerald-500" },
  ];

  const demoInfo = {
    1: (
      <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
        🎯 <strong>Join Club:</strong> Browse and join popular campus clubs such as Coding Club, AI Innovators, and Design Studio.  
        Get access to events, challenges, and community learning!
      </div>
    ),
    2: (
      <div className="mt-4 p-4 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-sm">
        💬 <strong>Ask Mentor:</strong> Reach out to experienced professors and mentors for project guidance,  
        academic help, or industry insights. Try connecting with <strong>Dr. Ananya Rao</strong> or <strong>Prof. Vikram Singh</strong>.
      </div>
    ),
    3: (
      <div className="mt-4 p-4 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
        📰 <strong>View Feed:</strong> Stay updated with campus announcements, recent posts, and trending student discussions.
      </div>
    ),
    4: (
      <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
        ⚙️ <strong>Edit Profile:</strong> Update your bio, interests, and academic details to get smarter mentor & club recommendations.
      </div>
    ),
  };

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((a) => (
          <button
            key={a.id}
            onClick={() => setActiveAction(activeAction === a.id ? null : a.id)}
            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl bg-gradient-to-br ${a.gradient} text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-sm font-semibold">{a.name}</span>
          </button>
        ))}
      </div>
      {activeAction && (
        <div className="animate-fadeIn">{demoInfo[activeAction]}</div>
      )}
    </div>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }
    try {
      await API.post("/posts", form);
      setForm({ title: "", content: "" });
      fetchPosts();
    } catch (err) {
      alert("Failed to post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex gap-8 p-6 lg:p-12 max-w-[2000px] mx-auto">
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main Content */}
        <div className="flex-1 max-w-[1400px] space-y-8">
          {/* Create Post Section */}
          <Card>
            <form onSubmit={submit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Create Post</h2>
              <input
                placeholder="Post Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
                required
              />
              <textarea
                placeholder="What's on your mind?"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition resize-none"
                rows="4"
                required
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Posting as <strong className="text-indigo-600">{user?.username || user?.name || "Guest"}</strong>
                </div>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Post
                </button>
              </div>
            </form>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Posts</h2>
            {posts.length > 0 ? (
              posts.map((p) => <PostCard key={p.id} post={p} />)
            ) : (
              <div className="text-center py-12 bg-white/70 backdrop-blur-md rounded-xl border border-gray-200">
                <p className="text-slate-500">No posts yet. Be the first to share something!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <section className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Quick Actions</h3>
            <QuickActions />
          </section>

          {/* Mentors Section */}
          <section className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-800">Available Mentors</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {DEMO_MENTORS.map((m) => (
                <MentorCard key={m.id} m={m} />
              ))}
            </div>
          </section>

          {/* Clubs Section */}
          <section className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-800">Active Clubs</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Browse All →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {DEMO_CLUBS.map((c) => (
                <ClubCard key={c.id} c={c} />
              ))}
            </div>
          </section>

          {/* Smart Suggestions */}
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md p-6 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✨</span>
              <h3 className="font-bold text-lg text-slate-800">Smart Suggestions</h3>
            </div>
            <p className="text-sm text-slate-600 mb-5">AI-powered mentor recommendations based on your interests</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEMO_SUGGESTIONS.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 bg-white/90 p-4 rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-sm truncate">{s.name}</div>
                    <div className="text-xs text-slate-500 truncate">{s.note}</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition whitespace-nowrap">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
