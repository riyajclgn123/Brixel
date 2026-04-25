import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/",        label: "Dashboard",      icon: "⬡" },
  { to: "/history", label: "History",        icon: "◈" },
  { to: "/braille", label: "Braille Viewer", icon: "⠿" },
];

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: "64px",
      background: "linear-gradient(90deg, #020817 0%, #0a1628 50%, #020817 100%)",
      borderBottom: "1px solid rgba(15,214,160,0.12)",
      display: "flex", alignItems: "center", padding: "0 32px",
      backdropFilter: "blur(20px)",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "linear-gradient(180deg, transparent, #0fd6a0, transparent)" }} />

      {/* Logo — clicks to dashboard */}
      <div
        onClick={() => navigate("/")}
        style={{ display: "flex", alignItems: "center", gap: "12px", marginRight: "48px", cursor: "pointer" }}
      >
        <div style={{ position: "relative", width: "32px", height: "32px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #0fd6a0 0%, #0891b2 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", color: "#020817", boxShadow: "0 0 20px rgba(15,214,160,0.4)" }}>⠿</div>
          <div style={{ position: "absolute", inset: "-2px", borderRadius: "10px", border: "1px solid rgba(15,214,160,0.3)", pointerEvents: "none" }} />
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", letterSpacing: "-0.3px", lineHeight: 1 }}>VisionBoard</div>
          <div style={{ fontSize: "9px", color: "#0fd6a0", letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px", textTransform: "uppercase" }}>by Brixel</div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 16px", borderRadius: "8px",
              fontSize: "13px", fontWeight: 500,
              textDecoration: "none", transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
              background: isActive ? "rgba(15,214,160,0.08)" : "transparent",
              color: isActive ? "#0fd6a0" : "rgba(255,255,255,0.45)",
              border: isActive ? "1px solid rgba(15,214,160,0.2)" : "1px solid transparent",
            })}
          >
            <span style={{ fontSize: "12px", opacity: 0.7 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "6px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
          <span>JETSON</span>
          <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)" }} />
          <span>GEMINI</span>
          <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)" }} />
          <span>SUPABASE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "8px", background: "rgba(15,214,160,0.08)", border: "1px solid rgba(15,214,160,0.25)", fontSize: "11px", fontWeight: 700, color: "#0fd6a0", letterSpacing: "1.5px", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0fd6a0", boxShadow: "0 0 8px #0fd6a0", animation: "blink 2s infinite" }} />
          Live
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=DM+Sans:wght@500&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:.4} }
      `}</style>
    </nav>
  );
}
