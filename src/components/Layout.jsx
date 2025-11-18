import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Menu, LayoutDashboard, Monitor, Users, UserCheck, Settings, LogOut } from "lucide-react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Layout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } catch {}
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItem = (to, icon, label) => (
    <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? "bg-blue-500/20 text-white" : "text-blue-200 hover:bg-white/5"}`}>
      {icon}
      <span className="hidden md:inline-block">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-blue-50 grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-white/5 bg-slate-900/60 backdrop-blur-xl">
        <div className="p-5 flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8"/>
          <div>
            <div className="font-semibold">School Monitor</div>
            <div className="text-xs text-blue-300/70">Admin Console</div>
          </div>
        </div>
        <nav className="px-3 flex flex-col gap-2">
          {navItem("/", <LayoutDashboard size={18} />, "Dashboard")}
          {navItem("/live", <Monitor size={18} />, "Live Monitoring")}
          {navItem("/students", <Users size={18} />, "Students Behavior")}
          {navItem("/teachers", <UserCheck size={18} />, "Teachers Performance")}
          {navItem("/settings", <Settings size={18} />, "Settings")}
        </nav>
        <div className="mt-auto p-4 hidden md:block">
          <button onClick={logout} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <LogOut size={16}/> Logout
          </button>
        </div>
      </aside>
      <main className="relative">
        <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-950/50 border-b border-white/5 flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3 text-blue-200">
            <Menu size={18} className="md:hidden"/>
            <span className="text-sm">Admin Panel</span>
          </div>
          <button onClick={logout} className="md:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm">
            <LogOut size={16}/> Logout
          </button>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
