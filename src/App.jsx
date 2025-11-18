import { Outlet } from "react-router-dom";

// Not used as a route directly; kept as a simple wrapper if needed
export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Outlet />
    </div>
  );
}
