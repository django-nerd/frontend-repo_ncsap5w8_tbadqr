import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/stats/dashboard`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json()).then(setStats).catch(() => {});
    fetch(`${API_BASE}/notifications`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json()).then(setNotes).catch(() => {});
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats ? Object.entries(stats.counts).map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="text-xs uppercase text-blue-300/70">{k}</div>
            <div className="text-2xl font-bold">{v}</div>
          </div>
        )) : <div className="col-span-5 text-blue-300/70">Loading...</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="font-medium mb-3">Engagement Summary</div>
          <ul className="space-y-2">
            {stats?.engagementSummary?.map((item) => (
              <li key={item._id} className="flex items-center justify-between text-blue-200">
                <span>{item._id}</span>
                <span className="font-semibold">{(item.avgScore * 100).toFixed(0)}%</span>
              </li>
            )) || <li className="text-blue-300/70">No data</li>}
          </ul>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="font-medium mb-3">Notifications</div>
          <ul className="space-y-3">
            {notes.map(n => (
              <li key={n._id} className="rounded-lg p-3 bg-slate-900/60 border border-white/10">
                <div className="text-sm text-blue-300/80">{n.title}</div>
                <div className="text-blue-100">{n.message}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
