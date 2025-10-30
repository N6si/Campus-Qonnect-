import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/Card";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="p-6">No profile</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">{user.name?.slice(0,1)}</div>
          <div className="text-left">
            <div className="text-2xl font-semibold">{user.name}</div>
            <div className="text-sm text-slate-500">{user.email}</div>
            <div className="mt-2 inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-sm">Role: {user.role}</div>
            <div className="mt-3 text-sm text-slate-600">{user.bio || "No bio yet."}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
