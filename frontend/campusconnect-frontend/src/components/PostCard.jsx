import React from "react";

export default function PostCard({ post }) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-600">by {post.author_username}</div>
          <div className="font-semibold text-lg mt-1">{post.title}</div>
        </div>
        <div className="text-xs text-slate-400">{new Date(post.created_at).toLocaleString()}</div>
      </div>
      <div className="mt-3 text-slate-700">{post.content}</div>
    </div>
  );
}
