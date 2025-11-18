import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Settings() {
  const tokenRef = useRef(localStorage.getItem("token"));
  const [cams, setCams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ classroom_id: "", name: "", stream_url: "" });
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState({});

  const fetchAll = async () => {
    const [camsRes, clsRes] = await Promise.all([
      fetch(`${API_BASE}/cameras`, { headers: { Authorization: `Bearer ${tokenRef.current}` } }),
      fetch(`${API_BASE}/classrooms`, { headers: { Authorization: `Bearer ${tokenRef.current}` } }),
    ]);
    setCams(await camsRes.json());
    const cls = await clsRes.json();
    setClasses(cls);
    if (cls.length && !selectedClass) {
      setSelectedClass(cls[0]._id);
      setTimetable(cls[0].timetable || {});
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const addCamera = async () => {
    await fetch(`${API_BASE}/cameras`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body: JSON.stringify(form),
    });
    setForm({ classroom_id: "", name: "", stream_url: "" });
    fetchAll();
  };

  const saveTimetable = async () => {
    if (!selectedClass) return;
    await fetch(`${API_BASE}/classrooms/${selectedClass}/timetable`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body: JSON.stringify(timetable),
    });
    fetchAll();
  };

  const updateDay = (day, value) => {
    const list = value.split(",").map(v => v.trim()).filter(Boolean);
    setTimetable({ ...timetable, [day]: list });
  };

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="font-medium mb-3">Add CCTV Camera</div>
          <div className="grid gap-3">
            <input value={form.classroom_id} onChange={e=>setForm({ ...form, classroom_id: e.target.value })} placeholder="Classroom ID" className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder:text-blue-300/60"/>
            <input value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} placeholder="Camera name" className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder:text-blue-300/60"/>
            <input value={form.stream_url} onChange={e=>setForm({ ...form, stream_url: e.target.value })} placeholder="Stream/Image URL" className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder:text-blue-300/60"/>
            <button onClick={addCamera} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Add Camera</button>
          </div>
          <div className="mt-4 text-sm text-blue-300/70">Tip: Use an image URL for demo, or RTSP/HTTP stream if available.</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="font-medium mb-3">Current Cameras</div>
          <ul className="space-y-2 max-h-64 overflow-auto">
            {cams.map(c => (
              <li key={c._id} className="rounded-lg bg-slate-900/60 p-3">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-blue-300/70">Classroom: {c.classroom_id}</div>
                <div className="text-xs text-blue-300/60 truncate">{c.stream_url}</div>
              </li>
            ))}
            {cams.length === 0 && <li className="text-blue-300/70">No cameras</li>}
          </ul>
        </div>
      </div>

      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
        <div className="font-medium mb-3">Class Timetable & Schedule</div>
        <div className="flex flex-wrap gap-3 items-center mb-3">
          <select value={selectedClass} onChange={e=>{
            const id = e.target.value; setSelectedClass(id);
            const cls = classes.find(c=>c._id===id); setTimetable(cls?.timetable||{});
          }} className="px-3 py-2 rounded-lg bg-white/10">
            {classes.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
          <button onClick={saveTimetable} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Save</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Mon","Tue","Wed","Thu","Fri"].map(day => (
            <div key={day} className="rounded-lg bg-slate-900/60 p-3">
              <div className="text-sm text-blue-300/80 mb-2">{day}</div>
              <input value={(timetable[day]||[]).join(", ")}
                     onChange={e=>updateDay(day, e.target.value)}
                     placeholder="Comma separated periods"
                     className="px-3 py-2 rounded-lg bg-white/10 w-full"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
