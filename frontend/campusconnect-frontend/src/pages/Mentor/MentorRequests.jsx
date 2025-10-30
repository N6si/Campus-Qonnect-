import React, { useEffect, useState } from "react";
import API from "../../lib/api";
import Card from "../../components/Card";

export default function MentorRequests() {
  const [requests, setRequests] = useState([]);

  const fetch = async () => {
    try {
      const res = await API.get("/mentor/requests");
      setRequests(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, []);

  const accept = async (id) => {
    try {
      await API.post("/mentor/accept", { request_id: id });
      fetch();
    } catch (err) { alert("Error accepting"); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-2">Mentor Requests</h2>

      {requests.length === 0 && <Card>No requests</Card>}

      <div className="space-y-3">
        {requests.map(r => (
          <Card key={r.id} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{r.student_name}</div>
              <div className="text-sm text-slate-500 mt-1">{r.message}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>accept(r.id)} className="btn bg-emerald-500 text-white px-3 py-1 rounded">Accept</button>
              <button onClick={()=>alert('Reject action not implemented')} className="btn bg-rose-100 text-rose-700 px-3 py-1 rounded">Reject</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
