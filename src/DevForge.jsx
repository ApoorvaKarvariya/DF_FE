import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeCtx = createContext();
const AuthCtx = createContext();

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function useApi() {
  const { token } = useContext(AuthCtx);
  const call = async (path, opts = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers || {}),
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
  return call;
}

// ─── Design Tokens (CSS-in-JS vars) ──────────────────────────────────────────
function GlobalStyles({ dark }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg:       ${dark ? "#0a0b10" : "#f4f5fa"};
        --bg2:      ${dark ? "#12141f" : "#ffffff"};
        --bg3:      ${dark ? "#1a1d2e" : "#eef0f8"};
        --border:   ${dark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)"};
        --text:     ${dark ? "#e8eaf0" : "#1a1b2e"};
        --muted:    ${dark ? "#7b7f9e" : "#6b7093"};
        --primary:  #6366f1;
        --primary2: #818cf8;
        --cyan:     #22d3ee;
        --green:    #10b981;
        --amber:    #f59e0b;
        --red:      #ef4444;
        --card-shadow: ${dark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(99,102,241,0.08)"};
        --glow: ${dark ? "0 0 32px rgba(99,102,241,0.35)" : "0 0 24px rgba(99,102,241,0.15)"};
      }

      body {
        background: var(--bg);
        color: var(--text);
        font-family: 'Space Grotesk', sans-serif;
        min-height: 100vh;
        transition: background 0.3s, color 0.3s;
      }

      .mono { font-family: 'JetBrains Mono', monospace; }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }

      /* Animations */
      @keyframes pulse-ring {
        0%   { transform: scale(0.95); opacity: 0.8; }
        70%  { transform: scale(1.15); opacity: 0; }
        100% { transform: scale(0.95); opacity: 0; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-8px); }
      }
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.3; }
      }

      .fade-in { animation: fadeIn 0.4s ease both; }

      .card {
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: var(--card-shadow);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .card:hover { transform: translateY(-2px); box-shadow: var(--glow); }

      .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--cyan));
        color: white;
        border: none;
        border-radius: 10px;
        padding: 10px 22px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.1s;
      }
      .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      .btn-primary:active { transform: translateY(0); }
      .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      .btn-ghost {
        background: transparent;
        color: var(--muted);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 10px 22px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-ghost:hover { color: var(--text); border-color: var(--primary); background: rgba(99,102,241,0.06); }

      .input {
        background: var(--bg3);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 10px 14px;
        color: var(--text);
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        width: 100%;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
      .input::placeholder { color: var(--muted); }

      .select {
        background: var(--bg3);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 10px 14px;
        color: var(--text);
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        width: 100%;
        outline: none;
        cursor: pointer;
        appearance: none;
      }
      .select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }

      .badge {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 3px 10px; border-radius: 100px;
        font-size: 11px; font-weight: 600;
      }
      .badge-easy   { background: rgba(16,185,129,0.15); color: #10b981; }
      .badge-medium { background: rgba(245,158,11,0.15); color: #f59e0b; }
      .badge-hard   { background: rgba(239,68,68,0.15);  color: #ef4444; }
      .badge-purple { background: rgba(99,102,241,0.15); color: #818cf8; }
      .badge-cyan   { background: rgba(34,211,238,0.15); color: #22d3ee; }

      .spinner {
        width: 20px; height: 20px;
        border: 2px solid var(--border);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      textarea.input { resize: vertical; min-height: 100px; }

      .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .tag {
        background: rgba(99,102,241,0.1);
        color: var(--primary2);
        border: 1px solid rgba(99,102,241,0.2);
        border-radius: 6px;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 500;
      }

      /* ─── Responsive grids ────────────────────────────────────────────── */
      .g-2   { display: grid; grid-template-columns: 1fr 1fr; }
      .g-3   { display: grid; grid-template-columns: 1fr 1fr 1fr; }
      .g-4   { display: grid; grid-template-columns: repeat(4, 1fr); }
      .g-5   { display: grid; grid-template-columns: repeat(5, 1fr); }
      .g-21  { display: grid; grid-template-columns: 2fr 1fr; }
      .g-12  { display: grid; grid-template-columns: 1fr 2fr; }
      .g-sb1 { display: grid; grid-template-columns: 240px 1fr; }
      .g-sb2 { display: grid; grid-template-columns: 320px 1fr; }
      .g-sb3 { display: grid; grid-template-columns: 280px 1fr; }

      /* ─── Layout ──────────────────────────────────────────────────────── */
      .app-shell { display: flex; }
      .main-content { margin-left: 220px; flex: 1; min-width: 0; min-height: 100vh; background: var(--bg); }
      .page-wrap { padding: 32px 40px; max-width: 1100px; }
      .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 28px; }

      .mobile-topbar { display: none; }
      .sidebar-overlay { display: none; }

      /* Tablet */
      @media (max-width: 900px) {
        .g-sb1, .g-sb2, .g-sb3, .g-21, .g-12 { grid-template-columns: 1fr; }
        .g-5, .g-4 { grid-template-columns: repeat(2, 1fr); }
      }

      /* Mobile: collapse sidebar into an off-canvas drawer with hamburger topbar */
      @media (max-width: 768px) {
        .app-shell { display: block; }

        .sidebar {
          transform: translateX(-100%);
          transition: transform 0.25s ease;
          box-shadow: none;
        }
        .sidebar.open {
          transform: translateX(0);
          box-shadow: 0 0 32px rgba(0,0,0,0.4);
        }

        .sidebar-overlay {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 99;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .sidebar-overlay.open { opacity: 1; pointer-events: auto; }

        .mobile-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg2);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .main-content { margin-left: 0; }
        .page-wrap { padding: 20px 16px; max-width: 100%; }
        .page-header { flex-direction: column; align-items: stretch; }
        .page-header h1 { font-size: 21px; }
      }

      /* Small phones */
      @media (max-width: 480px) {
        .g-2, .g-3, .g-4, .g-5 { grid-template-columns: 1fr; }
        .page-wrap { padding: 16px 12px; }
      }
    `}</style>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color }) => {
  const s = { width: size, height: size, stroke: color || "currentColor", fill: "none", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    dashboard: <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    brain:     <svg viewBox="0 0 24 24" style={s}><path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5a2 2 0 0 1 2 2v.5h.5a3 3 0 0 1 0 6H17a5 5 0 0 1-10 0H6.5a3 3 0 0 1 0-6h.5V4.5a2 2 0 0 1 2-2z"/></svg>,
    code:      <svg viewBox="0 0 24 24" style={s}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    chart:     <svg viewBox="0 0 24 24" style={s}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    file:      <svg viewBox="0 0 24 24" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    map:       <svg viewBox="0 0 24 24" style={s}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
    github:    <svg viewBox="0 0 24 24" style={s}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
    user:      <svg viewBox="0 0 24 24" style={s}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    sun:       <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon:      <svg viewBox="0 0 24 24" style={s}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    logout:    <svg viewBox="0 0 24 24" style={s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    star:      <svg viewBox="0 0 24 24" style={s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    zap:       <svg viewBox="0 0 24 24" style={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    trophy:    <svg viewBox="0 0 24 24" style={s}><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4a2 2 0 0 0-2 2v2c0 1.7 1.12 3.2 2.73 3.7L6 12c.65 2.08 2.48 3.64 4.67 3.95"/><path d="M17 4h3a2 2 0 0 1 2 2v2c0 1.7-1.12 3.2-2.73 3.7L18 12c-.65 2.08-2.48 3.64-4.67 3.95"/><rect x="7" y="2" width="10" height="12" rx="2"/></svg>,
    target:    <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    upload:    <svg viewBox="0 0 24 24" style={s}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    play:      <svg viewBox="0 0 24 24" style={s}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    check:     <svg viewBox="0 0 24 24" style={s}><polyline points="20 6 9 17 4 12"/></svg>,
    x:         <svg viewBox="0 0 24 24" style={s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    bookmark:  <svg viewBox="0 0 24 24" style={s}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
    refresh:   <svg viewBox="0 0 24 24" style={s}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    plus:      <svg viewBox="0 0 24 24" style={s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    arrow_right:<svg viewBox="0 0 24 24" style={s}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    calendar:  <svg viewBox="0 0 24 24" style={s}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    mic:       <svg viewBox="0 0 24 24" style={s}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    pause:     <svg viewBox="0 0 24 24" style={s}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    lc:        <svg viewBox="0 0 24 24" style={s}><path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.823-.662l-4.344-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.341-4.341"/><path d="m9.062 4.9 2.676-2.607c.466-.467 1.111-.662 1.823-.662s1.357.195 1.823.662l4.344 4.363c.467.467.702 1.15.702 1.863s-.235 1.357-.702 1.824l-4.341 4.341"/></svg>,
  };
  return icons[name] || null;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color = "var(--primary)", accent }) {
  return (
    <div className="card fade-in" style={{ padding: "20px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 0 0 80px", background: `${color}12` }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>{value ?? "—"}</p>
          {sub && <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{ color, opacity: 0.8 }}><Icon name={icon} size={22} color={color} /></div>
      </div>
    </div>
  );
}

// ─── Sidebar Nav ─────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, dark, setDark, onLogout, mobileOpen, closeMobile }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "interviews", label: "Mock Interviews", icon: "brain" },
    { id: "questions", label: "Question Bank", icon: "bookmark" },
    { id: "analytics", label: "Analytics", icon: "chart" },
    { id: "resume", label: "Resume", icon: "file" },
    { id: "roadmap", label: "Roadmap", icon: "map" },
    { id: "code", label: "Code Runner", icon: "code" },
    { id: "leetcode", label: "LeetCode", icon: "lc" },
    { id: "github", label: "GitHub", icon: "github" },
    { id: "profile", label: "Profile", icon: "user" },
  ];

  return (
    <>
    <div className={`sidebar-overlay${mobileOpen ? " open" : ""}`} onClick={closeMobile} />
    <aside className={`sidebar${mobileOpen ? " open" : ""}`} style={{
      width: 220, minHeight: "100vh", background: "var(--bg2)",
      borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, zIndex: 100, padding: "20px 0",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(99,102,241,0.5)",
          }}>
            <Icon name="zap" size={18} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>DevForge</p>
            <p style={{ fontSize: 10, color: "var(--cyan)", fontFamily: "'JetBrains Mono',monospace" }}>v1.0</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {nav.map(({ id, label, icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => { setPage(id); closeMobile && closeMobile(); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "9px 12px", borderRadius: 10, marginBottom: 2, border: "none",
              background: active ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.1))" : "transparent",
              color: active ? "var(--primary2)" : "var(--muted)",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, fontWeight: active ? 600 : 400,
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
            }}>
              <Icon name={icon} size={16} color={active ? "var(--primary2)" : undefined} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div style={{ padding: "16px 10px", borderTop: "1px solid var(--border)", display: "flex", gap: 6 }}>
        <button onClick={() => setDark(!dark)} className="btn-ghost" style={{ flex: 1, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12 }}>
          <Icon name={dark ? "sun" : "moon"} size={14} />
          {dark ? "Light" : "Dark"}
        </button>
        <button onClick={onLogout} className="btn-ghost" style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="logout" size={14} />
        </button>
      </div>
    </aside>
    </>
  );
}

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
function Page({ title, sub, actions, children }) {
  return (
    <div className="fade-in page-wrap">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{title}</h1>
          {sub && <p style={{ color: "var(--muted)", fontSize: 14 }}>{sub}</p>}
        </div>
        {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function Loader() {
  return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>;
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ fullName: "", email: "", username: "", password: "", college: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    setLoading(true); setErr("");
    try {
      const url = mode === "login" ? `${API}/auth/login` : `${API}/auth/register`;
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const token = data.token || data.accessToken || data.jwt;
      if (!token) throw new Error("Login succeeded but no token was returned by the server");
      onAuth(token);
    } catch (e) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: 16, boxSizing: "border-box",
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.08) 0%, transparent 50%)",
    }}>
      <div className="card fade-in" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px", boxShadow: "0 0 24px rgba(99,102,241,0.4)",
            animation: "float 3s ease-in-out infinite",
          }}>
            <Icon name="zap" size={24} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>DevForge</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Your dev career, forged here.</p>
        </div>

        <div style={{ display: "flex", gap: 4, background: "var(--bg3)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "8px", border: "none", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600,
              background: mode === m ? "var(--bg2)" : "transparent",
              color: mode === m ? "var(--primary)" : "var(--muted)",
              boxShadow: mode === m ? "var(--card-shadow)" : "none",
              transition: "all 0.2s",
            }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "register" && (
            <>
              <input className="input" placeholder="Full name" value={form.fullName} onChange={set("fullName")} />
              <input className="input" placeholder="Username" value={form.username} onChange={set("username")} />
              <input className="input" placeholder="College (optional)" value={form.college} onChange={set("college")} />
            </>
          )}
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={set("email")} />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={set("password")} />

          {err && <p style={{ color: "var(--red)", fontSize: 13, textAlign: "center" }}>{err}</p>}

          <button className="btn-primary" onClick={submit} disabled={loading} style={{ width: "100%", padding: "12px", marginTop: 4 }}>
            {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><div className="spinner" style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />Processing...</span> : (mode === "login" ? "Sign In" : "Create Account")}
          </button>

        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    api("/dashboard").then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (!data) {
    return (
      <Page title="Dashboard" sub="Couldn't load your data">
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--muted)" }}>Couldn't reach the server. Please refresh or check your connection.</p>
        </div>
      </Page>
    );
  }

  const readiness = data?.readinessScore ?? 0;
  const angle = (readiness / 100) * 251.2;

  return (
    <Page
      title={`Hey, ${data?.fullName?.split(" ")[0]} 👋`}
      sub={`Target: ${data?.targetCompany || "Not set"} · ${data?.readinessLevel || ""}`}
    >
      {/* Study Plan Modal */}
      {showPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16, boxSizing: "border-box" }} onClick={() => setShowPlan(false)}>
          <div className="card fade-in" style={{ width: "100%", maxWidth: 560, maxHeight: "80vh", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 16 }}>📋 Your 7-Day Study Plan</p>
              <button onClick={() => setShowPlan(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><Icon name="x" size={18} /></button>
            </div>
            <div style={{ padding: "20px 24px", overflowY: "auto" }}>
              <pre style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13.5, lineHeight: 1.9, color: "var(--muted)", whiteSpace: "pre-wrap" }}>{data?.studyPlan}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Readiness Orb + Stats grid */}
      <div className="g-sb1" style={{ gap: 20, marginBottom: 20 }}>
        {/* Readiness Orb — signature element, click to see study plan */}
        <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gridRow: "span 2", cursor: "pointer" }}
          onClick={() => setShowPlan(true)}
          title="Click to see your study plan"
        >
          <p style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>AI Readiness</p>
          <div style={{ position: "relative", width: 140, height: 140, marginBottom: 16 }}>
            <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.3)", animation: "pulse-ring 2s ease-out infinite" }} />
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.2)", animation: "pulse-ring 2s ease-out infinite 0.4s" }} />
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none"
                stroke="url(#grad)" strokeWidth="8"
                strokeDasharray={`${angle} 251.2`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 30, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", background: "linear-gradient(135deg,#6366f1,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{readiness}</span>
              <span style={{ fontSize: 10, color: "var(--muted)" }}>/ 100</span>
            </div>
          </div>
          <p style={{ color: "var(--primary2)", fontWeight: 600, fontSize: 13, textAlign: "center" }}>{data?.readinessLevel}</p>
          <p style={{ color: "var(--cyan)", fontSize: 11, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="arrow_right" size={12} color="var(--cyan)" /> Click for study plan
          </p>
        </div>

        {/* Top stats */}
        <div className="g-3" style={{ gap: 12 }}>
          <StatCard label="LC Acceptance" value={data?.leetcodeAcceptanceRate != null ? `${data.leetcodeAcceptanceRate}%` : null} sub="Accepted submissions" icon="trophy" color="var(--amber)" />
          <StatCard label="LC Rating" value={data?.leetcodeRating} sub={data?.leetcodeRank} icon="zap" color="var(--cyan)" />
          <StatCard label="ATS Score" value={data?.atsScore ? `${data.atsScore}%` : null} sub="Resume strength" icon="file" color="var(--green)" />
        </div>

        <div className="g-3" style={{ gap: 12 }}>
          <StatCard label="Streak" value={`${data?.currentStreak ?? 0}d`} sub={`LC streak: ${data?.leetcodeStreak ?? 0}d`} icon="zap" color="#f472b6" />
          <StatCard label="Interviews" value={`${data?.completedInterviews}/${data?.totalInterviews}`} sub={`Avg score: ${data?.averageInterviewScore?.toFixed(1) ?? "—"}`} icon="brain" color="var(--primary)" />
          <StatCard label="Saved Qs" value={data?.totalSavedQuestions} sub="Question bank" icon="bookmark" color="var(--cyan)" />
        </div>
      </div>

      {/* Weak Topics */}
      {data?.weakTopics?.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="target" size={16} color="var(--amber)" />
            Weak Areas to Improve
          </p>
          <div className="tag-row">
            {data.weakTopics.map(t => <span key={t} className="badge badge-medium">{t}</span>)}
          </div>
        </div>
      )}
    </Page>
  );
}

// ─── Mock Interviews ──────────────────────────────────────────────────────────
function Interviews() {
  const api = useApi();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ targetCompany: "", category: "DSA", difficulty: "MEDIUM", mode: "TEXT" });
  const [active, setActive] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // ── Webcam + speech-to-text state ──────────────────────────────────────────
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const [camError, setCamError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [speechSupported] = useState(() => "webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  useEffect(() => {
    api("/interviews").then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  const [startError, setStartError] = useState("");

  const startInterview = async () => {
    setStartError("");
    try {
      const res = await api("/interviews/start", { method: "POST", body: JSON.stringify({ targetCompany: form.targetCompany, category: form.category, difficulty: form.difficulty }) });
      setActive({ ...res, mode: form.mode });
      setModal(false);
      setFeedback(null);
      setAnswer("");
      setInterimText("");
    } catch (err) {
      setStartError(err.message || "Couldn't start the interview. Please try again.");
    }
  };

  // ── Start webcam when entering a VIDEO-mode interview ──────────────────────
  useEffect(() => {
    if (active?.mode === "VIDEO" && !feedback) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
          setCamError("");
        })
        .catch(() => setCamError("Camera access denied. Please allow camera permission and refresh."));
    }
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      recognitionRef.current?.stop();
    };
  }, [active, feedback]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setCamError("Speech-to-text isn't supported in this browser. Try Chrome."); return; }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalTranscript = answer ? answer + " " : "";
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t + " ";
        else interim += t;
      }
      setAnswer(finalTranscript.trim());
      setInterimText(interim);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const [submitError, setSubmitError] = useState("");

  const submitAnswer = async () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await api("/interviews/submit", { method: "POST", body: JSON.stringify({ interviewId: active.id, question: active.aiGeneratedQuestion, userAnswer: answer }) });
      setFeedback(res);
    } catch (err) {
      setSubmitError(err.message || "AI review failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (active) {
    return (
      <Page title="Mock Interview" sub={`${active.targetCompany || "Practice"} · ${active.category} · ${active.difficulty}${active.mode === "VIDEO" ? " · Video Mode" : ""}`}
        actions={<button className="btn-ghost" onClick={() => { setActive(null); setFeedback(null); setAnswer(""); recognitionRef.current?.stop(); }}>← Back</button>}
      >
        <div className="card fade-in" style={{ padding: 28, marginBottom: 16 }}>
          <p style={{ color: "var(--cyan)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Question</p>
          <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6 }}>{active.aiGeneratedQuestion}</p>
        </div>

        {!feedback ? (
          active.mode === "VIDEO" ? (
            <div className="g-sb2" style={{ gap: 16 }}>
              {/* Webcam preview */}
              <div className="card" style={{ padding: 16 }}>
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#000", aspectRatio: "4/3" }}>
                  <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
                  {isRecording && (
                    <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: 20 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", animation: "pulse 1.2s infinite" }} />
                      <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>REC</span>
                    </div>
                  )}
                </div>
                {camError && <p style={{ color: "var(--red)", fontSize: 12, marginTop: 10 }}>{camError}</p>}
                <button
                  className={isRecording ? "btn-ghost" : "btn-primary"}
                  onClick={toggleRecording}
                  disabled={!speechSupported}
                  style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <Icon name={isRecording ? "pause" : "mic"} size={14} />
                  {isRecording ? "Stop & Keep Answer" : "Start Speaking"}
                </button>
                {!speechSupported && <p style={{ color: "var(--amber)", fontSize: 11, marginTop: 8 }}>Speech-to-text works best in Chrome/Edge.</p>}
              </div>

              {/* Live transcript / editable answer */}
              <div className="card" style={{ padding: 28 }}>
                <p style={{ fontWeight: 600, marginBottom: 12 }}>Your Answer {isRecording && <span style={{ color: "var(--primary2)", fontWeight: 400, fontSize: 12 }}>(listening...)</span>}</p>
                <textarea
                  className="input"
                  style={{ minHeight: 160, marginBottom: 16 }}
                  placeholder="Click 'Start Speaking' and answer out loud — your words will appear here. You can also type/edit directly."
                  value={answer + (interimText ? " " + interimText : "")}
                  onChange={e => setAnswer(e.target.value)}
                />
                <button className="btn-primary" onClick={submitAnswer} disabled={submitting || !answer.trim()}>
                  {submitting ? "Evaluating with AI..." : "Submit for AI Review"}
                </button>
                {submitError && <p style={{ color: "var(--red)", fontSize: 12.5, marginTop: 10 }}>{submitError}</p>}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 28 }}>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Your Answer</p>
              <textarea className="input" style={{ minHeight: 160, marginBottom: 16 }} placeholder="Type your answer here..." value={answer} onChange={e => setAnswer(e.target.value)} />
              <button className="btn-primary" onClick={submitAnswer} disabled={submitting || !answer.trim()}>
                {submitting ? "Evaluating with AI..." : "Submit for AI Review"}
              </button>
              {submitError && <p style={{ color: "var(--red)", fontSize: 12.5, marginTop: 10 }}>{submitError}</p>}
            </div>
          )
        ) : (
          <div className="g-2" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 24, borderColor: "rgba(99,102,241,0.4)", gridColumn: "span 2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: feedback.score >= 70 ? "var(--green)" : "var(--amber)" }}>{feedback.score}</div>
                <div>
                  <p style={{ fontWeight: 600 }}>AI Score</p>
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>{feedback.feedback}</p>
                </div>
              </div>
            </div>
            {[
              { label: "Strengths", value: feedback.strengths, color: "var(--green)" },
              { label: "Improvements", value: feedback.improvements, color: "var(--amber)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ padding: 20 }}>
                <p style={{ color, fontWeight: 600, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>{value}</p>
              </div>
            ))}
            <div className="card" style={{ padding: 20, gridColumn: "span 2" }}>
              <p style={{ color: "var(--primary2)", fontWeight: 600, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ideal Answer</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)" }}>{feedback.idealAnswer}</p>
            </div>
          </div>
        )}
      </Page>
    );
  }

  return (
    <Page title="Mock Interviews" sub="AI-powered interview practice"
      actions={<button className="btn-primary" onClick={() => setModal(true)}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="plus" size={14} />New Interview</span></button>}
    >
      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16, boxSizing: "border-box" }} onClick={() => setModal(false)}>
          <div className="card fade-in" style={{ width: "100%", maxWidth: 400, padding: 28 }} onClick={e => e.stopPropagation()}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Start Interview</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <input className="input" placeholder="Target Company (e.g. Google)" value={form.targetCompany} onChange={e => setForm({ ...form, targetCompany: e.target.value })} />
              <select className="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {["DSA", "SYSTEM_DESIGN", "HR", "CS_FUNDAMENTALS", "BEHAVIORAL"].map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="select" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                {["EASY", "MEDIUM", "HARD"].map(d => <option key={d}>{d}</option>)}
              </select>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { v: "TEXT", label: "📝 Text Answer" },
                  { v: "VIDEO", label: "🎥 Video + Voice" },
                ].map(({ v, label }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm({ ...form, mode: v })}
                    className={form.mode === v ? "btn-primary" : "btn-ghost"}
                    style={{ flex: 1, fontSize: 12.5, padding: "8px 6px" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {startError && <p style={{ color: "var(--red)", fontSize: 12.5 }}>{startError}</p>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-primary" onClick={startInterview} style={{ flex: 1 }}>Start</button>
              <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {list.map(iv => (
          <div key={iv.id} className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }} onClick={() => setActive(iv)}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{iv.targetCompany || "Practice"}</span>
                <span className={`badge badge-${iv.difficulty?.toLowerCase()}`}>{iv.difficulty}</span>
                <span className="badge badge-purple">{iv.category?.replace("_", " ")}</span>
              </div>
              {iv.aiGeneratedQuestion && <p style={{ color: "var(--muted)", fontSize: 13 }}>{iv.aiGeneratedQuestion.slice(0, 80)}...</p>}
            </div>
            {iv.aiScore && <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: iv.aiScore >= 70 ? "var(--green)" : "var(--amber)" }}>{iv.aiScore}</p>
              <p style={{ fontSize: 10, color: "var(--muted)" }}>score</p>
            </div>}
            <span style={{ color: iv.status === "COMPLETED" ? "var(--green)" : "var(--amber)", fontSize: 12, fontWeight: 600 }}>{iv.status}</span>
          </div>
        ))}
        {list.length === 0 && (
          <div className="card" style={{ padding: 48, textAlign: "center" }}>
            <Icon name="brain" size={40} color="var(--muted)" />
            <p style={{ color: "var(--muted)", marginTop: 12 }}>No interviews yet. Start your first one!</p>
          </div>
        )}
      </div>
    </Page>
  );
}

// ─── Question Bank ────────────────────────────────────────────────────────────
function Questions() {
  const api = useApi();
  const [qs, setQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ difficulty: "", category: "", search: "" });

  useEffect(() => {
    api("/questions").then(setQs).catch(() => setQs([])).finally(() => setLoading(false));
  }, []);

  const toggle = async (id) => {
    try { await api(`/questions/${id}/save`, { method: "POST" }); } catch {}
    setQs(qs.map(q => q.id === id ? { ...q, isSaved: !q.isSaved } : q));
  };

  const filtered = qs.filter(q =>
    (!filter.difficulty || q.difficulty === filter.difficulty) &&
    (!filter.category || q.category === filter.category) &&
    (!filter.search || q.title.toLowerCase().includes(filter.search.toLowerCase()))
  );

  if (loading) return <Loader />;

  return (
    <Page title="Question Bank" sub="Browse and save interview questions">
      <div className="g-3" style={{ gap: 10, marginBottom: 20 }}>
        <input className="input" placeholder="🔍  Search questions..." value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} />
        <select className="select" value={filter.difficulty} onChange={e => setFilter({ ...filter, difficulty: e.target.value })}>
          <option value="">All Difficulties</option>
          {["EASY", "MEDIUM", "HARD"].map(d => <option key={d}>{d}</option>)}
        </select>
        <select className="select" value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
          <option value="">All Categories</option>
          {["DSA", "SYSTEM_DESIGN", "HR", "CS_FUNDAMENTALS", "BEHAVIORAL"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map(q => (
          <div key={q.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{q.title}</span>
                <span className={`badge badge-${q.difficulty?.toLowerCase()}`}>{q.difficulty}</span>
                <span className="badge badge-cyan">{q.category?.replace("_", " ")}</span>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--muted)" }}>
                <span>{q.company}</span>
                <span>·</span>
                <span>{q.topic}</span>
                <span>·</span>
                <span>Freq: <strong style={{ color: "var(--text)" }}>{q.frequency}%</strong></span>
              </div>
            </div>
            <button onClick={() => toggle(q.id)} style={{ background: "none", border: "none", cursor: "pointer", color: q.isSaved ? "var(--amber)" : "var(--muted)", transition: "color 0.2s" }}>
              <Icon name="bookmark" size={18} color={q.isSaved ? "var(--amber)" : undefined} />
            </button>
          </div>
        ))}
      </div>
    </Page>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function Analytics() {
  const api = useApi();
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [catData, setCatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api("/analytics/summary").catch(() => null),
      api("/analytics/score-trend").catch(() => []),
      api("/analytics/category-accuracy").catch(() => []),
    ]).then(([s, t, c]) => { setSummary(s); setTrend(t); setCatData(c); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!canvasRef.current || trend.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const scores = trend.map(d => d.score || 0);
    const maxS = Math.max(...scores, 100), minS = Math.min(...scores, 0);
    const pts = trend.map((d, i) => ({
      x: 40 + i * ((W - 60) / (trend.length - 1)),
      y: H - 30 - ((d.score - minS) / (maxS - minS + 1)) * (H - 50),
    }));

    // gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(99,102,241,0.35)");
    grad.addColorStop(1, "rgba(99,102,241,0)");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H - 30);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H - 30);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#6366f1";
      ctx.fill();
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // labels
    ctx.fillStyle = "rgba(123,127,158,0.8)";
    ctx.font = "11px Space Grotesk";
    ctx.textAlign = "center";
    trend.forEach((d, i) => ctx.fillText(d.week, pts[i].x, H - 8));
  }, [trend]);

  if (loading) return <Loader />;

  return (
    <Page title="Analytics" sub="Track your interview performance over time">
      <div className="g-4" style={{ gap: 14, marginBottom: 20 }}>
        <StatCard label="Sessions" value={summary?.totalSessions} icon="brain" color="var(--primary)" />
        <StatCard label="Avg Score" value={summary?.avgScore?.toFixed(1)} icon="chart" color="var(--cyan)" />
        <StatCard label="Improvement" value={summary?.improvement} icon="zap" color="var(--green)" />
        <StatCard label="Top Category" value={summary?.topCategory} icon="trophy" color="var(--amber)" />
      </div>

      <div className="g-21" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 16 }}>Score Trend</p>
          <canvas ref={canvasRef} width={580} height={200} style={{ width: "100%", height: 200 }} />
        </div>

        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 16 }}>Category Accuracy</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {catData.map(({ category, accuracy }) => (
              <div key={category}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                  <span>{category}</span>
                  <span className="mono" style={{ color: accuracy >= 75 ? "var(--green)" : "var(--amber)" }}>{accuracy}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: "var(--border)" }}>
                  <div style={{ height: "100%", borderRadius: 4, width: `${accuracy}%`, background: `linear-gradient(90deg, var(--primary), var(--cyan))`, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

// ─── Resume ───────────────────────────────────────────────────────────────────
function Resume() {
  const api = useApi();
  const { token } = useContext(AuthCtx);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/resume/analysis")
      .then(setAnalysis)
      .catch(() => setAnalysis(null))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API}/resume/upload`, {
        method: "POST",
        body: form,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text());
      setAnalysis(await res.json());
    } catch (err) {
      setError(err.message || "Resume upload failed. Please try again.");
    } finally { setUploading(false); }
  };

  if (loading) return <Loader />;

  const score = analysis?.atsScore ?? 0;

  return (
    <Page title="Resume Analyzer" sub="AI-powered ATS scoring and feedback">
      <div className="g-12" style={{ gap: 20 }}>
        {/* Score + Upload */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 28, textAlign: "center" }}>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none"
                  stroke={score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8" strokeDasharray={`${(score / 100) * 251.2} 251.2`} strokeLinecap="round"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{score}</span>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>ATS score</span>
              </div>
            </div>
            <p style={{ color: score >= 80 ? "var(--green)" : "var(--amber)", fontWeight: 600 }}>
              {score >= 80 ? "Strong Resume" : score >= 60 ? "Needs Improvement" : "Weak Resume"}
            </p>
          </div>

          <label className="card" style={{ padding: 24, textAlign: "center", cursor: "pointer", borderStyle: "dashed", borderColor: "var(--primary)", transition: "all 0.2s" }}>
            {uploading ? <div style={{ display: "flex", justifyContent: "center" }}><div className="spinner" /></div> : (
              <>
                <Icon name="upload" size={28} color="var(--primary)" />
                <p style={{ fontWeight: 600, marginTop: 10, marginBottom: 4 }}>Upload Resume</p>
                <p style={{ color: "var(--muted)", fontSize: 12 }}>PDF format • Max 5MB</p>
              </>
            )}
            <input type="file" accept=".pdf" onChange={handleUpload} style={{ display: "none" }} />
          </label>
          {error && <p style={{ color: "var(--red)", fontSize: 12.5, textAlign: "center" }}>{error}</p>}
        </div>

        {/* Analysis */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>Extracted Skills</p>
            <div className="tag-row">
              {(analysis?.extractedSkills || []).map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>
          {[
            { label: "Strengths", value: analysis?.strengths, color: "var(--green)" },
            { label: "Weaknesses", value: analysis?.weaknesses, color: "var(--red)" },
            { label: "Suggestions", value: analysis?.suggestions, color: "var(--cyan)" },
            { label: "Overall Feedback", value: analysis?.overallFeedback, color: "var(--primary2)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: 18 }}>
              <p style={{ color, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--muted)" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────
function Roadmap() {
  const api = useApi();
  const [company, setCompany] = useState("Google");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

const generate = async () => {
    setLoading(true);
    try {
      const res = await api("/roadmap/generate", { method: "POST", body: JSON.stringify({ company }) });
      const weeks = res?.roadmap?.weeks || [];
      const transformed = {
        company: res?.roadmap?.company || company,
        estimatedDuration: `${weeks.length} weeks`,
        difficulty: "Hard",
        phases: weeks.map(w => ({
          phase: `Week ${w.week}`,
          focus: w.title,
          topics: w.topics || [],
          resources: (w.resources || []).join(", "),
          priority: w.week <= 2 ? "HIGH" : "MEDIUM",
        })),
        tips: res?.roadmap?.tips || [],
      };
      setData(transformed);
    } catch (err) {
      setData({
        company,
        phases: [
          { phase: "Month 1", focus: "Data Structures & Algorithms", topics: ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & Graphs"], resources: "LeetCode Easy & Medium problems", priority: "HIGH" },
          { phase: "Month 2", focus: "Advanced Algorithms", topics: ["Dynamic Programming", "Backtracking", "Greedy", "Bit Manipulation"], resources: "LeetCode Medium & Hard, CSES Problem Set", priority: "HIGH" },
          { phase: "Month 3", focus: "System Design", topics: ["Scalability", "Databases", "Caching", "Load Balancing", "Microservices"], resources: "System Design Primer, Designing Data-Intensive Applications", priority: "HIGH" },
          { phase: "Month 4", focus: "Behavioral & Soft Skills", topics: ["STAR Method", "Leadership Principles", "Communication", "Conflict Resolution"], resources: "Company-specific values, Mock interviews", priority: "MEDIUM" },
        ],
        estimatedDuration: "4 months",
        difficulty: "Hard",
      });
    } finally { setLoading(false); }
  };

  return (
    <Page title="Career Roadmap" sub="AI-generated study plan for your target company">
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input className="input" placeholder="Company name (e.g. Amazon, Meta)" value={company} onChange={e => setCompany(e.target.value)} style={{ maxWidth: 300 }} />
        <button className="btn-primary" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>
      </div>

      {data && (
        <div className="fade-in">
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <span className="badge badge-purple">🎯 {data.company}</span>
            <span className="badge badge-cyan">⏱ {data.estimatedDuration}</span>
            <span className={`badge badge-${data.difficulty === "Hard" ? "hard" : "medium"}`}>⚡ {data.difficulty}</span>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, var(--primary), var(--cyan))", borderRadius: 1, zIndex: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {(data.phases || []).map((phase, i) => (
                <div key={i} className="fade-in" style={{ display: "flex", gap: 20, paddingBottom: 24, animationDelay: `${i * 0.1}s` }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,var(--primary),var(--cyan))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0, boxShadow: "0 0 12px rgba(99,102,241,0.4)" }}>{i + 1}</div>
                  </div>
                  <div className="card" style={{ flex: 1, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{phase.phase}</p>
                        <p style={{ fontWeight: 700, fontSize: 16 }}>{phase.focus}</p>
                      </div>
                      <span className={`badge badge-${phase.priority === "HIGH" ? "hard" : "medium"}`}>{phase.priority}</span>
                    </div>
                    <div className="tag-row" style={{ marginBottom: 10 }}>
                      {(phase.topics || []).map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    {phase.resources && <p style={{ fontSize: 12, color: "var(--muted)" }}>📚 {phase.resources}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}

// ─── Code Runner ──────────────────────────────────────────────────────────────
function CodeRunner() {
  const api = useApi();
  const [lang, setLang] = useState("java");
  const [code, setCode] = useState(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, DevForge!");\n    }\n}`);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const langs = ["java", "python", "javascript", "cpp", "go"];

  const templates = {
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, DevForge!");\n    }\n}`,
    python: `def main():\n    print("Hello, DevForge!")\n\nif __name__ == "__main__":\n    main()`,
    javascript: `function main() {\n    console.log("Hello, DevForge!");\n}\n\nmain();`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, DevForge!" << endl;\n    return 0;\n}`,
    go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, DevForge!")\n}`,
  };

  const run = async () => {
    setRunning(true);
    try {
      const res = await api("/code/run", { method: "POST", body: JSON.stringify({ language: lang, code }) });
      setOutput(res);
    } catch (err) {
      setOutput({ stdout: "", stderr: "Could not reach backend. Is the server running?", exitCode: 1 });
    } finally { setRunning(false); }
  };

  return (
    <Page title="Code Runner" sub="Execute code in multiple languages"
      actions={<button className="btn-primary" onClick={run} disabled={running} style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="play" size={14} />{running ? "Running..." : "Run Code"}</button>}
    >
      <div className="g-2" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
            {langs.map(l => (
              <button key={l} onClick={() => { setLang(l); setCode(templates[l] || ""); }} style={{
                padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                background: lang === l ? "var(--primary)" : "var(--bg3)",
                color: lang === l ? "white" : "var(--muted)",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
              }}>{l}</button>
            ))}
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{ width: "100%", minHeight: 360, padding: 16, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5, lineHeight: 1.7, resize: "vertical" }}
          />
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Output</span>
            {output?.executionTime && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>⏱ {output.executionTime}</span>}
          </div>
          <div style={{ padding: 16, minHeight: 360, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.7 }}>
            {running ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)" }}>
                <div className="spinner" /> Running...
              </div>
            ) : output ? (
              <>
                {output.stdout && <pre style={{ color: "var(--green)", whiteSpace: "pre-wrap" }}>{output.stdout}</pre>}
                {output.stderr && <pre style={{ color: "var(--red)", whiteSpace: "pre-wrap" }}>{output.stderr}</pre>}
                {!output.stdout && !output.stderr && <span style={{ color: "var(--muted)" }}>No output</span>}
                <p style={{ marginTop: 12, fontSize: 11, color: "var(--muted)" }}>Exit code: {output.exitCode ?? 0}</p>
              </>
            ) : <span style={{ color: "var(--muted)" }}>Run your code to see output here.</span>}
          </div>
        </div>
      </div>
    </Page>
  );
}

// ─── LeetCode ─────────────────────────────────────────────────────────────────
function LeetCode() {
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api("/leetcode/me")
      .then(d => { setData(d); setError(""); })
      .catch(e => setError(e.message || "Couldn't load LeetCode stats. Connect your handle in Profile first."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const sync = async () => {
    setSyncLoading(true);
    try { await api("/leetcode/sync", { method: "POST" }); load(); } catch {}
    finally { setSyncLoading(false); }
  };

  if (loading) return <Loader />;

  if (error || !data) {
    return (
      <Page title="LeetCode" sub="Problem solving stats">
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--muted)" }}>{error || "No LeetCode data yet."}</p>
        </div>
      </Page>
    );
  }

  const bars = [
    { label: "Easy", solved: data?.easySolved, total: data?.easyTotal, color: "var(--green)", cls: "badge-easy" },
    { label: "Medium", solved: data?.mediumSolved, total: data?.mediumTotal, color: "var(--amber)", cls: "badge-medium" },
    { label: "Hard", solved: data?.hardSolved, total: data?.hardTotal, color: "var(--red)", cls: "badge-hard" },
  ];

  return (
    <Page title="LeetCode" sub="Problem solving stats"
      actions={<button className="btn-ghost" onClick={sync} disabled={syncLoading} style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="refresh" size={14} />{syncLoading ? "Syncing..." : "Sync"}</button>}
    >
      <div className="g-5" style={{ gap: 14, marginBottom: 20 }}>
        <StatCard label="Total Solved" value={data?.totalSolved} icon="check" color="var(--primary)" />
        <StatCard label="Global Rank" value={data?.ranking?.toLocaleString()} icon="trophy" color="var(--amber)" />
        <StatCard label="Acceptance" value={`${data?.acceptanceRate ?? 0}%`} icon="chart" color="var(--cyan)" />
        <StatCard label="Streak" value={`${data?.streak ?? 0}d`} icon="zap" color="#f472b6" />
        <StatCard label="Active Days" value={data?.totalActiveDays} icon="calendar" color="var(--green)" />
      </div>

      <div className="card" style={{ padding: 28 }}>
        <p style={{ fontWeight: 600, marginBottom: 20 }}>Problem Breakdown</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {bars.map(({ label, solved, total, color, cls }) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className={`badge ${cls}`}>{label}</span>
                <span className="mono" style={{ fontSize: 13, color }}>
                  {solved} <span style={{ color: "var(--muted)" }}>/ {total}</span>
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "var(--border)" }}>
                <div style={{ height: "100%", borderRadius: 4, width: `${total ? (solved / total) * 100 : 0}%`, background: color, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

// ─── GitHub ───────────────────────────────────────────────────────────────────
function GitHub() {
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [err, setErr] = useState("");
  const [noHandle, setNoHandle] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchData = () => {
    setLoading(true);
    api("/github/me")
      .then(d => { setData(d); setNoHandle(false); })
      .catch(e => {
        const msg = e?.message || "";
        if (msg.includes("404") || msg.includes("handle") || msg.includes("not found") || msg.includes("connect")) {
          setNoHandle(true);
        } else {
          // backend not running — show connect UI anyway
          setNoHandle(true);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const connectHandle = async () => {
    if (!handle.trim()) return;
    setConnecting(true); setErr("");
    try {
      await api("/users/connect-handle", {
        method: "POST",
        body: JSON.stringify({ handle: handle.trim(), platform: "GITHUB" }),
      });
      await api("/github/sync", { method: "POST" });
      fetchData();
    } catch (e) {
      setErr("Could not connect handle. Check username and try again.");
    } finally { setConnecting(false); }
  };

  const sync = async () => {
    setSyncing(true);
    try { await api("/github/sync", { method: "POST" }); fetchData(); }
    catch {}
    finally { setSyncing(false); }
  };

  if (loading) return <Loader />;

  // ── No handle connected yet ───────────────────────────────────────────────
  if (noHandle) {
    return (
      <Page title="GitHub" sub="Repository and contribution insights">
        <div className="card fade-in" style={{ padding: 48, maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Icon name="github" size={30} color="var(--primary)" />
          </div>
          <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Connect your GitHub</p>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Enter your GitHub username to pull your repos, contributions, and stats.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              className="input"
              placeholder="e.g. torvalds"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && connectHandle()}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={connectHandle} disabled={connecting || !handle.trim()} style={{ whiteSpace: "nowrap" }}>
              {connecting ? "Connecting..." : "Connect"}
            </button>
          </div>
          {err && <p style={{ color: "var(--red)", fontSize: 13 }}>{err}</p>}
          <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 12 }}>
            💡 You can also set this in <strong>Profile → Edit → GitHub Handle</strong>
          </p>
        </div>
      </Page>
    );
  }

  // ── Connected — show data ─────────────────────────────────────────────────
  return (
    <Page title="GitHub" sub={`@${data?.username || data?.githubHandle || "connected"}`}
      actions={
        <button className="btn-ghost" onClick={sync} disabled={syncing} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="refresh" size={14} />{syncing ? "Syncing..." : "Sync"}
        </button>
      }
    >
      <div className="g-4" style={{ gap: 14, marginBottom: 20 }}>
        <StatCard label="Repos" value={data?.publicRepos ?? data?.githubRepos} icon="code" color="var(--primary)" />
        <StatCard label="Contributions" value={data?.totalContributions ?? data?.githubContributions} icon="zap" color="var(--green)" />
        <StatCard label="Followers" value={data?.followers} icon="user" color="var(--cyan)" />
        <StatCard label="GH Score" value={data?.githubScore} icon="star" color="var(--amber)" />
      </div>

      {/* Top language badge */}
      {(data?.topLanguage || data?.githubTopLanguage) && (
        <div className="card" style={{ padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="code" size={16} color="var(--cyan)" />
          <span style={{ color: "var(--muted)", fontSize: 13 }}>Top Language:</span>
          <span className="tag" style={{ fontSize: 13 }}>{data?.topLanguage || data?.githubTopLanguage}</span>
          {data?.bio && <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 8 }}>· {data.bio}</span>}
        </div>
      )}

      <div className="card" style={{ padding: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 16 }}>Recent Repositories</p>
        {(!data?.recentRepos || data.recentRepos.length === 0) ? (
          <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
            No repositories found. Try syncing again.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.recentRepos.map((repo, i) => (
              <div key={repo.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < data.recentRepos.length - 1 ? "1px solid var(--border)" : "none" }}>
                <Icon name="code" size={16} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{repo.name}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>{repo.description || `Updated ${repo.updatedAt || "recently"}`}</p>
                </div>
                {repo.lang && <span className="tag">{repo.lang}</span>}
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--muted)" }}>
                  <span>⭐ {repo.stars ?? repo.stargazersCount ?? 0}</span>
                  <span>🍴 {repo.forks ?? repo.forksCount ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function Profile() {
  const api = useApi();
  const { token } = useContext(AuthCtx);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploadingPic, setUploadingPic] = useState(false);
  const [picError, setPicError] = useState("");
  const [picVersion, setPicVersion] = useState(0);

  const load = () => {
    setLoading(true);
    api("/users/me")
      .then(p => { setProfile(p); setForm(p); })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await api("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          fullName: form.fullName, bio: form.bio, college: form.college, targetCompany: form.targetCompany,
        }),
      });
      if (form.leetcodeHandle && form.leetcodeHandle !== profile?.leetcodeHandle) {
        await api("/users/connect-handle", { method: "POST", body: JSON.stringify({ platform: "LEETCODE", handle: form.leetcodeHandle }) });
      }
      if (form.githubHandle && form.githubHandle !== profile?.githubHandle) {
        await api("/users/connect-handle", { method: "POST", body: JSON.stringify({ platform: "GITHUB", handle: form.githubHandle }) });
      }
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      load();
    } catch (err) {
      setSaveError(err.message || "Couldn't save changes. Please try again.");
    } finally { setSaving(false); }
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setPicError("Image must be under 3MB"); return; }
    setUploadingPic(true);
    setPicError("");
    const form2 = new FormData();
    form2.append("file", file);
    try {
      const res = await fetch(`${API}/users/me/profile-picture`, {
        method: "POST", body: form2,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text());
      setPicVersion(v => v + 1);
      load();
    } catch (err) {
      setPicError(err.message || "Upload failed. Please try a different image.");
    } finally { setUploadingPic(false); }
  };

  const removePic = async () => {
    setUploadingPic(true);
    try {
      await api("/users/me/profile-picture", { method: "DELETE" });
      setPicVersion(v => v + 1);
      load();
    } catch (err) {
      setPicError(err.message || "Couldn't remove picture.");
    } finally { setUploadingPic(false); }
  };

  if (loading) return <Loader />;

  if (!profile) {
    return (
      <Page title="Profile" sub="Couldn't load profile">
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--muted)" }}>Couldn't reach the server. Please refresh.</p>
        </div>
      </Page>
    );
  }

  const fields = [
    ["fullName", "Full Name", "span 1"],
    ["username", "Username", "span 1"],
    ["college", "College", "span 1"],
    ["targetCompany", "Target Company", "span 1"],
    ["bio", "Bio", "span 2"],
    ["email", "Email", "span 1"],
    ["leetcodeHandle", "LeetCode Handle", "span 1"],
    ["githubHandle", "GitHub Handle", "span 1"],
  ];

  const displayRows = [
    ["Email", profile?.email],
    ["College", profile?.college || "—"],
    ["Target Company", profile?.targetCompany || "Not set"],
    ["LeetCode", profile?.leetcodeHandle
      ? `${profile.leetcodeHandle}${profile.leetcodeRating ? ` (${profile.leetcodeRating})` : ""}`
      : "Not connected"],
    ["GitHub", profile?.githubHandle || "Not connected"],
    ["Current Streak", `${profile?.currentStreak || 0} days`],
    ["Readiness Score", `${profile?.readinessScore || 0}/100`],
  ];

  return (
    <Page title="Profile" sub="Manage your account and connected handles"
      actions={editing
        ? <>
            <button className="btn-primary" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="btn-ghost" onClick={() => { setEditing(false); setForm(profile); setSaveError(""); }}>Cancel</button>
          </>
        : <>
            {saved && <span style={{ color: "var(--green)", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><Icon name="check" size={14} color="var(--green)" /> Saved!</span>}
            <button className="btn-ghost" onClick={() => setEditing(true)}>Edit Profile</button>
          </>
      }
    >
      {saveError && <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 12 }}>{saveError}</p>}
      <div className="g-sb3" style={{ gap: 20 }}>

        {/* Avatar card */}
        <div className="card" style={{ padding: 28, textAlign: "center" }}>
          <label style={{ display: "block", cursor: uploadingPic ? "wait" : "pointer", position: "relative", width: 80, height: 80, margin: "0 auto 16px" }}>
            {profile?.hasProfilePicture ? (
              <img
                src={`${API}/users/${profile.username}/profile-picture?v=${picVersion}`}
                alt="Profile"
                style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
              />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "white", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
                {(profile?.fullName || "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg2)" }}>
              {uploadingPic ? <div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : <Icon name="upload" size={12} color="white" />}
            </div>
            <input type="file" accept="image/*" onChange={handlePicUpload} style={{ display: "none" }} disabled={uploadingPic} />
          </label>
          {profile?.hasProfilePicture && (
            <button className="btn-ghost" onClick={removePic} disabled={uploadingPic} style={{ fontSize: 11, padding: "4px 10px", marginBottom: 10 }}>
              Remove photo
            </button>
          )}
          {picError && <p style={{ color: "var(--red)", fontSize: 11.5, marginBottom: 8 }}>{picError}</p>}

          <p style={{ fontSize: 18, fontWeight: 700 }}>{profile?.fullName}</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>@{profile?.username}</p>
          {profile?.college && <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>{profile.college}</p>}
          {profile?.bio && <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>{profile.bio}</p>}

          <div style={{ marginTop: 16, padding: "12px 0", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>Target</span>
            <span style={{ fontWeight: 600, color: "var(--primary2)" }}>{profile?.targetCompany || "Not set"}</span>
          </div>

          {/* Platform connection status */}
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "LeetCode", key: "leetcodeHandle", color: "#f59e0b" },
              { label: "GitHub", key: "githubHandle", color: "#10b981" },
            ].map(({ label, key, color }) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0" }}>
                <span style={{ color: "var(--muted)" }}>{label}</span>
                <span style={{ color: profile?.[key] ? color : "var(--muted)", fontWeight: profile?.[key] ? 600 : 400 }}>
                  {profile?.[key] ? `✓ ${profile[key]}` : "Not set"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit form / view */}
        <div className="card" style={{ padding: 28 }}>
          <p style={{ fontWeight: 600, marginBottom: 20 }}>Account Details</p>
          <div className="g-2" style={{ gap: 14 }}>
            {editing ? (
              fields.map(([key, label, col]) => (
                <div key={key} style={{ gridColumn: col }}>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                  {key === "bio"
                    ? <textarea className="input" value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ minHeight: 72 }} />
                    : <input className="input" value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        disabled={key === "username" || key === "email"}
                        placeholder={key === "githubHandle" ? "e.g. torvalds" : key === "leetcodeHandle" ? "e.g. neal_wu" : ""}
                      />
                  }
                </div>
              ))
            ) : (
              displayRows.map(([label, val]) => (
                <div key={label} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</p>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{val}</p>
                </div>
              ))
            )}
          </div>

          {editing && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(34,211,238,0.06)", borderRadius: 8, border: "1px solid rgba(34,211,238,0.15)" }}>
              <p style={{ fontSize: 12, color: "var(--cyan)" }}>
                💡 After saving your GitHub/LeetCode handle, go to that page and click <strong>Sync</strong> to fetch your latest stats.
              </p>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [token, setTokenState] = useState(() => localStorage.getItem("devforge_token"));
  const [page, setPage] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const setToken = (t) => {
    if (t) localStorage.setItem("devforge_token", t);
    else localStorage.removeItem("devforge_token");
    setTokenState(t);
  };

  const pages = {
    dashboard: <Dashboard />,
    interviews: <Interviews />,
    questions: <Questions />,
    analytics: <Analytics />,
    resume: <Resume />,
    roadmap: <Roadmap />,
    code: <CodeRunner />,
    leetcode: <LeetCode />,
    github: <GitHub />,
    profile: <Profile />,
  };

  if (!token) {
    return (
      <ThemeCtx.Provider value={{ dark, setDark }}>
        <AuthCtx.Provider value={{ token: null }}>
          <GlobalStyles dark={dark} />
          <AuthPage onAuth={setToken} />
        </AuthCtx.Provider>
      </ThemeCtx.Provider>
    );
  }

  return (
    <ThemeCtx.Provider value={{ dark, setDark }}>
      <AuthCtx.Provider value={{ token }}>
        <GlobalStyles dark={dark} />
        <div className="app-shell">
          <Sidebar
            page={page}
            setPage={setPage}
            dark={dark}
            setDark={setDark}
            onLogout={() => setToken(null)}
            mobileOpen={mobileNavOpen}
            closeMobile={() => setMobileNavOpen(false)}
          />
          <main className="main-content">
            <div className="mobile-topbar">
              <button
                className="btn-ghost"
                aria-label="Open menu"
                onClick={() => setMobileNavOpen(true)}
                style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <p style={{ fontSize: 15, fontWeight: 700 }}>DevForge</p>
            </div>
            {pages[page] || <Dashboard />}
          </main>
        </div>
      </AuthCtx.Provider>
    </ThemeCtx.Provider>
  );
}