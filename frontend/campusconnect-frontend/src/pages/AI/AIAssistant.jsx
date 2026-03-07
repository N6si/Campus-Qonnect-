import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Send, Bot, User, Trash2, Sparkles, BookOpen, Code, Calculator, Globe, Lightbulb } from "lucide-react";

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY;

const SUGGESTED_QUESTIONS = [
  { icon: <BookOpen size={14} />, text: "Explain machine learning in simple terms" },
  { icon: <Code size={14} />, text: "How does React useEffect work?" },
  { icon: <Calculator size={14} />, text: "Help me understand Big O notation" },
  { icon: <Globe size={14} />, text: "What is REST API and how does it work?" },
  { icon: <Lightbulb size={14} />, text: "Tips for a good software engineering project" },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.75rem 1rem" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: "7px", height: "7px", borderRadius: "9999px",
          background: "var(--accent)", opacity: 0.6,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

export default function AIAssistant() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.username || "there"}! 👋 I'm your AI Study Assistant.\n\nAsk me anything — concepts, code help, exam prep, project ideas, or anything academic. I'm here to help you learn! 🎓`,
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const question = text || input.trim();
    if (!question || loading) return;

    const userMsg = { role: "user", content: question };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "CampusConnect AI Assistant",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "system",
              content: `You are a helpful AI Study Assistant for CampusConnect, a college social platform. Help students with academic questions, coding problems, concepts, and learning. The student's name is ${user?.username || "Student"} and their role is ${user?.role || "student"}. Be concise, clear, and encouraging. Use examples when helpful. Keep responses educational.`
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: `Hi ${user?.username || "there"}! 👋 Chat cleared. What would you like to learn about?`,
    }]);
  };

  const renderMessage = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
        return (
          <pre key={i} style={{
            background: "var(--bg-primary)", border: "1px solid var(--border)",
            borderRadius: "0.5rem", padding: "0.875rem", marginTop: "0.5rem",
            fontSize: "0.75rem", color: "var(--accent)", overflowX: "auto",
            fontFamily: "monospace", lineHeight: 1.6,
          }}>
            {code}
          </pre>
        );
      }
      return (
        <span key={i} style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
          {part}
        </span>
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <Sidebar user={user} />

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Header */}
          <div className="hero-banner animate-fade-up">
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span className="tag">Powered by AI • 100% Free</span>
                </div>
                <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
                  AI Study Assistant ✨
                </h1>
                <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>
                  Ask anything — concepts, code, projects, exam prep
                </p>
              </div>
              <button onClick={clearChat} style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                <Trash2 size={13} /> Clear chat
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem", alignItems: "flex-start" }}>

            {/* Chat */}
            <div className="card" style={{ display: "flex", flexDirection: "column", height: "600px" }}>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", padding: "0.5rem 0", marginBottom: "1rem" }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "9999px", flexShrink: 0,
                      background: msg.role === "user" ? "var(--accent)" : "linear-gradient(135deg, #667eea, #764ba2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "0.7rem",
                    }}>
                      {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div style={{
                      maxWidth: "75%",
                      padding: "0.75rem 1rem",
                      borderRadius: msg.role === "user" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                      background: msg.role === "user" ? "var(--accent)" : "var(--bg-secondary)",
                      border: msg.role === "user" ? "none" : "1px solid var(--border)",
                      color: msg.role === "user" ? "#0a0c14" : "var(--text-primary)",
                      fontSize: "0.875rem",
                    }}>
                      {renderMessage(msg.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "9999px", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bot size={14} style={{ color: "#fff" }} />
                    </div>
                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "1rem 1rem 1rem 0.25rem" }}>
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
                  className="form-input"
                  style={{ flex: 1, resize: "none", minHeight: "44px", maxHeight: "120px" }}
                  rows={1}
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    width: "44px", height: "44px", borderRadius: "0.625rem", flexShrink: 0,
                    background: input.trim() && !loading ? "var(--accent)" : "var(--bg-secondary)",
                    border: "1px solid var(--border)", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: input.trim() && !loading ? "#0a0c14" : "var(--text-muted)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Suggestions sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Sparkles size={14} style={{ color: "var(--accent)" }} />
                  <h3 className="section-heading">Try asking</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q.text)}
                      disabled={loading}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "0.5rem",
                        padding: "0.625rem 0.75rem", borderRadius: "0.5rem",
                        background: "var(--bg-secondary)", border: "1px solid var(--border)",
                        color: "var(--text-secondary)", fontSize: "0.75rem", textAlign: "left",
                        cursor: "pointer", transition: "all 0.15s ease", fontFamily: "DM Sans, sans-serif",
                        lineHeight: 1.4,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "0.1rem" }}>{q.icon}</span>
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card" style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))", border: "1px solid rgba(102,126,234,0.2)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Powered by</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Bot size={20} style={{ color: "#667eea" }} />
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>Mistral 7B</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>via OpenRouter • Free</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.75rem", lineHeight: 1.5 }}>
                  Your conversations are private and used only to answer your questions.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
