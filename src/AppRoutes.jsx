import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import LiveMonitoring from "./components/LiveMonitoring";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Settings from "./components/Settings";
import Login from "./components/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route element={<Layout/>}>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/live" element={<LiveMonitoring/>} />
        <Route path="/students" element={<Students/>} />
        <Route path="/teachers" element={<Teachers/>} />
        <Route path="/settings" element={<Settings/>} />
      </Route>
    </Routes>
  );
}
