import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Students() {
  const [query, setQuery] = useState("");
  const [classroom, setClassroom] = useState("");
  const [results, setResults] = useState([]);
  const [report, setReport] = useState(null);
  const tokenRef = useRef(localStorage.getItem("token"));

  useEffect(() => {
    // prefetch classrooms
    fetch(`${API_BASE}/classrooms`, { headers: { Authorization: `Bearer ${tokenRef.current}` }})
      .then(r => r.json()).then(() => {}).catch(() => {});
  }, []);

  const search = async () => {
    const url = new URL(`${API_BASE}/students`);
    if (query) url.searchParams.set("name", query);
    if (classroom) url.searchParams.set("classroom_id", classroom);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
    const data = await res.json();
    setResults(data);
  };

  const loadReport = async (id) => {
    const res = await fetch(`${API_BASE}/students/${id}/report`, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
    const data = await res.json();
    setReport(data);
  };

  const printPDF = () => {
    window.print();
  };

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Students Behavior</h1>
      <div className="flex flex-wrap gap-3">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name" className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder:text-blue-300/60"/>
        <input value={classroom} onChange={e=>setClassroom(e.target.value)} placeholder="Classroom ID" className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder:text-blue-300/60"/>
        <button onClick={search} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Search</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="font-medium mb-3">Results</div>
          <ul className="space-y-2">
            {results.map(s => (
              <li key={s._id}>
                <button onClick={() => loadReport(s._id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">
                  {s.first_name} {s.last_name} <span className="text-blue-300/70 text-sm">({s.classroom_id})</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="text-blue-300/70">No results</li>}
          </ul>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 print:bg-white print:text-black">
          {report ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Engagement Report</div>
                <button onClick={printPDF} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">Print PDF</button>
              </div>
              <div className="text-blue-200 mb-2">{report.student.first_name} {report.student.last_name}</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg bg-slate-900/60 p-3">Total Events: <span className="font-semibold">{report.totalEvents}</span></div>
                <div className="rounded-lg bg-slate-900/60 p-3">Average Score: <span className="font-semibold">{report.averageScore ? (report.averageScore*100).toFixed(0)+"%" : "N/A"}</span></div>
              </div>
              <div className="font-medium mb-2">Breakdown</div>
              <ul className="space-y-1 mb-3">
                {Object.entries(report.breakdown).map(([k,v]) => (
                  <li key={k} className="flex items-center justify-between"><span>{k}</span><span className="font-semibold">{v}</span></li>
                ))}
              </ul>
              <div className="font-medium mb-2">Recent Events</div>
              <div className="max-h-64 overflow-auto space-y-2">
                {report.events.slice(0,20).map((e, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-900/60 p-2 text-sm">
                    <div className="text-blue-300/70">{e.event_type}</div>
                    {e.notes && <div className="text-blue-100">{e.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="text-blue-300/70">Select a student to view report</div>}
        </div>
      </div>
    </div>
  );
}
