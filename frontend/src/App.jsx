import { useState } from "react";
import { LogOut, LayoutDashboard, UploadCloud, MessageSquare, ShieldAlert } from 'lucide-react';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SupportBot from "./components/SupportBot";
import UploadDocs from "./components/UploadDocs";
import { RaiseComplaint, ComplaintsDashboard } from "./components/Complaints";

export default function App() {
  const [screen, setScreen] = useState("login"); // login, dashboard, company, user
  const [role, setRole] = useState(null); // company, user

  function login(selectedRole) {
    setRole(selectedRole);
    setScreen("dashboard");
  }

  function logout() {
    setRole(null);
    setScreen("login");
  }

  if (screen === "login") return <Login onLogin={login} />;
  
  if (screen === "dashboard") {
    return <Dashboard role={role} onStart={() => setScreen(role)} onLogout={logout} />;
  }

  if (screen === "company") return <CompanyPortal logout={logout} />;
  
  return <UserPortal logout={logout} />;
}

function Sidebar({ title, items, page, setPage, logout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
        <span>Careflow</span>
      </div>
      
      <div style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
        {title}
      </div>

      <nav className="sidebar-nav">
        {items.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? "active" : ""}`}
            onClick={() => setPage(id)}
          >
            {icon} {label}
          </button>
        ))}
      </nav>

      <button className="nav-item" onClick={logout} style={{ color: '#ef4444', marginTop: 'auto' }}>
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
}

function CompanyPortal({ logout }) {
  const [page, setPage] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "upload", label: "Upload Docs", icon: <UploadCloud size={20} /> },
    { id: "bot", label: "Support Bot", icon: <MessageSquare size={20} /> },
    { id: "complaints", label: "Complaints", icon: <ShieldAlert size={20} /> },
  ];

  return (
    <div className="app-container">
      <Sidebar title="Company Portal" logout={logout} page={page} setPage={setPage} items={menuItems} />
      <main className="main-content">
        {page === "dashboard" && (
          <div>
            <h1>Company Overview</h1>
            <p className="subtitle">Manage your AI support infrastructure.</p>
            <div className="grid-2">
               <div className="glass-panel">
                  <h3>Knowledge Base</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Ensure your AI bot has the latest policies and manuals.</p>
                  <button className="btn-ghost" onClick={() => setPage('upload')}>Manage Documents</button>
               </div>
               <div className="glass-panel">
                  <h3>Escalations</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Review AI-classified complaints from users.</p>
                  <button className="btn-ghost" onClick={() => setPage('complaints')}>View Tickets</button>
               </div>
            </div>
          </div>
        )}
        {page === "upload" && <UploadDocs />}
        {page === "bot" && <SupportBot title="Company Support Bot" />}
        {page === "complaints" && <ComplaintsDashboard />}
      </main>
    </div>
  );
}

function UserPortal({ logout }) {
  const [page, setPage] = useState("support");

  const menuItems = [
    { id: "support", label: "Support Bot", icon: <MessageSquare size={20} /> },
    { id: "complaint", label: "Raise Complaint", icon: <ShieldAlert size={20} /> },
  ];

  return (
    <div className="app-container">
      <Sidebar title="User Portal" logout={logout} page={page} setPage={setPage} items={menuItems} />
      <main className="main-content">
        {page === "support" && <SupportBot title="User Support Assistant" />}
        {page === "complaint" && <RaiseComplaint />}
      </main>
    </div>
  );
}
