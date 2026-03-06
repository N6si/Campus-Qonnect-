import React from "react";
import { User, Clock } from "lucide-react";

export default function PostCard({ post }) {
  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const initials = (post.author_username || "U").slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.875rem",
        padding: "1.25rem",
        transition: "border-color 0.2s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border-strong)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
        {/* Avatar */}
        <div style={{ width: "36px", height: "36px", borderRadius: "9999px", background: "var(--accent-soft)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--accent)" }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {post.author_username}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              <Clock size={11} />
              {timeAgo(post.created_at)}
            </div>
          </div>

          {/* Title */}
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
            {post.title}
          </h3>

          {/* Content */}
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            {post.content}
          </p>
        </div>
      </div>
    </div>
  );
}
