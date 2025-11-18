import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Login() {
  const [email, setEmail] = useState("admin@school.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-950 to-slate-900 text-white p-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
        <div className="text-center">
          <img src="/flame-icon.svg" alt="logo" className="w-12 h-12 mx-auto mb-2"/>
          <div className="text-lg font-semibold">School Monitor Admin</div>
          <div className="text-sm text-blue-300/70">Sign in to continue</div>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-lg bg-white/10"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded-lg bg-white/10"/>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}
