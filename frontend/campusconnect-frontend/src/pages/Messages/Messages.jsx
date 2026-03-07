import React, { useState, useEffect, useRef, useContext } from "react";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Send, Search, MessageSquare, Plus } from "lucide-react";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function getInitials(name) {
  return (name || "?").slice(0, 2).toUpperCase();
}

const ROLE_COLORS = {
  teacher: "var(--blue)",
  mentor: "var(--purple)",
  student: "var(--accent)",
  admin: "var(--green)",
};

export default function Messages() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [polling, setPolling] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
      // Poll every 3 seconds for new messages
      const interval = setInterval(() => fetchMessages(activeChat), 3000);
      setPolling(interval);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await API.get("/api/messages/conversations");
      setConversations(res.data || []);
    } catch {}
  };

  const fetchAllUsers = async () => {
    try {
      const res = await API.get("/api/users/all");
      setAllUsers(res.data || []);
    } catch {}
  };

  const fetchMessages = async (username) => {
    try {
      const res = await API.get(`/api/messages/${username}`);
      setMessages(res.data || []);
      // Refresh conversations to update unread count
      fetchConversations();
    } catch {}
  };

  const openChat = (username) => {
    setActiveChat(username);
    setShowNewChat(false);
    setSearch("");
    inputRef.current?.focus();
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    // Optimistically add message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      from_username: user.username,
      to_username: activeChat,
      content,
      created_at: new Date().toISOString(),
      read: false,
    }]);
    try {
      await API.post("/api/messages/send", { to_username: activeChat, content });
      fetchConversations();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = (username) => {
    // Add to conversations if not already there
    if (!conversations.find(c => c.username === username)) {
      setConversations(prev => [{ username, last_message: "", last_time: "", unread: 0 }, ...prev]);
    }
    openChat(username);
  };

  const filteredConvos = conversations.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) &&
    !conversations.find(c => c.username === u.username)
  );

  const activeChatUser = allUsers.find(u => u.username === activeChat);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <Sidebar user={user} />

        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", overflow: "hidden", display: "grid", gridTemplateColumns: "300px 1fr", height: "calc(100vh - 140px)", minHeight: "500px" }}>

            {/* LEFT — Conversations */}
            <div style={{ borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)", margin: 0 }}>Messages</h2>
                  <button
                    onClick={() => setShowNewChat(!showNewChat)}
                    style={{ width: "28px", height: "28px", borderRadius: "0.375rem", background: showNewChat ? "var(--accent-soft)" : "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: showNewChat ? "var(--accent)" : "var(--text-muted)" }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <Search size={13} style={{ position: "absolute", left: "0.625rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search chats..."
                    style={{ width: "100%", padding: "0.5rem 0.625rem 0.5rem 2rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.5rem", color: "var(--text-primary)", fontSize: "0.8rem", outline: "none", fontFamily: "DM Sans, sans-serif", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* New Chat search */}
              {showNewChat && (
                <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--accent)", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase" }}>Start new chat</div>
                  <input
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search users..."
                    autoFocus
                    style={{ width: "100%", padding: "0.5rem 0.625rem", background: "var(--bg-card)", border: "1px solid var(--accent)", borderRadius: "0.5rem", color: "var(--text-primary)", fontSize: "0.8rem", outline: "none", fontFamily: "DM Sans, sans-serif", boxSizing: "border-box", marginBottom: "0.5rem" }}
                  />
                  {userSearch && (
                    <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                      {filteredUsers.length === 0 ? (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.5rem" }}>No users found</div>
                      ) : filteredUsers.map(u => (
                        <button key={u.username} onClick={() => startNewChat(u.username)}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", borderRadius: "0.375rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-primary)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <div style={{ width: "28px", height: "28px", borderRadius: "9999px", background: `${ROLE_COLORS[u.role] || "var(--accent)"}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: ROLE_COLORS[u.role] || "var(--accent)", flexShrink: 0 }}>
                            {getInitials(u.username)}
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{u.username}</div>
                            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{u.role}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Conversation list + All Users */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                {/* Active conversations first */}
                {filteredConvos.length > 0 && (
                  <>
                    <div style={{ padding: "0.5rem 1.25rem 0.25rem", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Recent
                    </div>
                    {filteredConvos.map(c => {
                      const isActive = activeChat === c.username;
                      const chatUser = allUsers.find(u => u.username === c.username);
                      return (
                        <button key={c.username} onClick={() => openChat(c.username)}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", background: isActive ? "var(--accent-soft)" : "transparent", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "DM Sans, sans-serif" }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-secondary)"; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                        >
                          <div style={{ width: "38px", height: "38px", borderRadius: "9999px", background: `${ROLE_COLORS[chatUser?.role] || "var(--accent)"}20`, border: `1px solid ${ROLE_COLORS[chatUser?.role] || "var(--accent)"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: ROLE_COLORS[chatUser?.role] || "var(--accent)", flexShrink: 0 }}>
                            {getInitials(c.username)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: isActive ? "var(--accent)" : "var(--text-primary)" }}>{c.username}</span>
                              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{timeAgo(c.last_time)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.1rem" }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" }}>
                                {c.last_message || "Start a conversation"}
                              </span>
                              {c.unread > 0 && (
                                <span style={{ minWidth: "18px", height: "18px", borderRadius: "9999px", background: "var(--accent)", color: "#0a0c14", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", flexShrink: 0 }}>
                                  {c.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}

                {/* All other users */}
                {allUsers.filter(u => !conversations.find(c => c.username === u.username) && u.username.toLowerCase().includes(search.toLowerCase())).length > 0 && (
                  <>
                    <div style={{ padding: "0.5rem 1.25rem 0.25rem", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      All Users
                    </div>
                    {allUsers
                      .filter(u => !conversations.find(c => c.username === u.username) && u.username.toLowerCase().includes(search.toLowerCase()))
                      .map(u => {
                        const isActive = activeChat === u.username;
                        return (
                          <button key={u.username} onClick={() => openChat(u.username)}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", background: isActive ? "var(--accent-soft)" : "transparent", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "DM Sans, sans-serif" }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-secondary)"; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                          >
                            <div style={{ width: "38px", height: "38px", borderRadius: "9999px", background: `${ROLE_COLORS[u.role] || "var(--accent)"}20`, border: `1px solid ${ROLE_COLORS[u.role] || "var(--accent)"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: ROLE_COLORS[u.role] || "var(--accent)", flexShrink: 0 }}>
                              {getInitials(u.username)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: isActive ? "var(--accent)" : "var(--text-primary)" }}>{u.username}</div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                                {u.role}{u.expertise ? ` • ${u.expertise}` : ""}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </>
                )}

                {filteredConvos.length === 0 && allUsers.filter(u => u.username.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                    <MessageSquare size={28} style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.4 }} />
                    No users found
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Chat */}
            {activeChat ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Chat header */}
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9999px", background: `${ROLE_COLORS[activeChatUser?.role] || "var(--accent)"}20`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: ROLE_COLORS[activeChatUser?.role] || "var(--accent)" }}>
                    {getInitials(activeChat)}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>{activeChat}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                      {activeChatUser?.role || "User"}{activeChatUser?.expertise ? ` • ${activeChatUser.expertise}` : ""}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      <MessageSquare size={32} style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.3 }} />
                      Say hi to {activeChat}! 👋
                    </div>
                  )}
                  {messages.map((msg, i) => {
                    const isMe = msg.from_username === user.username;
                    const showTime = i === 0 || (new Date(msg.created_at) - new Date(messages[i-1]?.created_at)) > 300000;
                    return (
                      <React.Fragment key={msg.id}>
                        {showTime && (
                          <div style={{ textAlign: "center", fontSize: "0.65rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                          <div style={{
                            maxWidth: "65%", padding: "0.625rem 0.875rem",
                            borderRadius: isMe ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                            background: isMe ? "var(--accent)" : "var(--bg-secondary)",
                            border: isMe ? "none" : "1px solid var(--border)",
                            color: isMe ? "#0a0c14" : "var(--text-primary)",
                            fontSize: "0.875rem", lineHeight: 1.5, wordBreak: "break-word",
                          }}>
                            {msg.content}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={`Message ${activeChat}...`}
                    className="form-input"
                    style={{ flex: 1, resize: "none", minHeight: "42px", maxHeight: "100px" }}
                    rows={1}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    style={{
                      width: "42px", height: "42px", borderRadius: "0.625rem", flexShrink: 0,
                      background: input.trim() ? "var(--accent)" : "var(--bg-secondary)",
                      border: "1px solid var(--border)", cursor: input.trim() ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: input.trim() ? "#0a0c14" : "var(--text-muted)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", color: "var(--text-muted)" }}>
                <MessageSquare size={48} style={{ opacity: 0.2 }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Your Messages</div>
                  <div style={{ fontSize: "0.875rem" }}>Select a chat or start a new one</div>
                </div>
                <button onClick={() => setShowNewChat(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Plus size={14} /> New Message
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
