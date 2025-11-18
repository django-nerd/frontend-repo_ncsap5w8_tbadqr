import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function LiveMonitoring() {
  const [cams, setCams] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/cameras`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json()).then(setCams).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Live Monitoring</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cams.map((c) => (
          <div key={c._id} className="rounded-xl overflow-hidden border border-white/10 bg-slate-900/60">
            <div className="p-3 text-sm text-blue-200/80">{c.name}</div>
            <div className="aspect-video bg-black/60">
              <img src={c.stream_url} alt={c.name} className="w-full h-full object-cover"/>
            </div>
          </div>
        ))}
        {cams.length === 0 && (
          <div className="text-blue-300/70">No cameras yet. Add some in Settings, or run seed in backend.</div>
        )}
      </div>
    </div>
  );
}
