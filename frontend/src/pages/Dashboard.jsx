import { useState } from "react";
import LiveFeed from "../components/LiveFeed";
import BraillePanel from "../components/BraillePanel";

function ConfidenceBar({ value = 0 }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? "#0fd6a0" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: "99px", transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 8px ${color}66` }} />
      </div>
      <span style={{ fontSize: "11px", color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, minWidth: "36px", textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

const TYPE_CONFIG = {
  math:          { color: "#60a5fa", border: "rgba(96,165,250,0.2)",  icon: "∑"  },
  assignment:    { color: "#f59e0b", border: "rgba(245,158,11,0.2)",  icon: "📋" },
  diagram:       { color: "#a78bfa", border: "rgba(167,139,250,0.2)", icon: "◈"  },
  lecture_notes: { color: "#0fd6a0", border: "rgba(15,214,160,0.2)",  icon: "✦"  },
  mixed:         { color: "#9ca3af", border: "rgba(156,163,175,0.15)",icon: "⬡"  },
};

function StatPill({ label, value, accent = "#0fd6a0" }) {
  return (
    <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "3px" }}>
      <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
      <span style={{ fontSize: "18px", fontWeight: 700, color: accent, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const [selected, setSelected] = useState(null);
  const cfg = TYPE_CONFIG[selected?.content_type] || TYPE_CONFIG.mixed;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #020817 0%, #0a1628 40%, #020817 100%)", paddingTop: "64px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "fixed", top: "20%", left: "30%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(15,214,160,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "32px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "3px", height: "24px", background: "linear-gradient(180deg, #0fd6a0, #0891b2)", borderRadius: "2px" }} />
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px", lineHeight: 1 }}>Live Dashboard</h1>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginLeft: "13px" }}>Real-time whiteboard capture → AI extraction → AirPod delivery</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <StatPill label="Mode" value="Live" accent="#0fd6a0" />
            <StatPill label="Output" value="BRF" accent="#a78bfa" />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 320px", gap: "20px", alignItems: "start" }}>

          {/* LEFT */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Captures</span>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "9px", color: "#0fd6a0", fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0fd6a0", boxShadow: "0 0 6px #0fd6a0", animation: "blink 2s infinite" }} />
                streaming
              </div>
            </div>
            <div style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto", paddingRight: "4px" }} className="custom-scroll">
              <LiveFeed onSelect={setSelected} selected={selected} />
            </div>
          </div>

          {/* CENTER */}
          <div style={{ minWidth: 0 }}>
            {selected ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {selected.is_assignment && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
                    <span>⚠</span>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#f59e0b" }}>Assignment Detected</div>
                      <div style={{ fontSize: "11px", color: "rgba(245,158,11,0.6)", marginTop: "1px" }}>Gemini flagged this capture</div>
                    </div>
                  </div>
                )}

                <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "#060f1e", position: "relative" }}>
                  {selected.image_url
                    ? <img src={selected.image_url} alt="Whiteboard" style={{ width: "100%", maxHeight: "340px", objectFit: "contain", display: "block" }} />
                    : <div style={{ height: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}><div style={{ fontSize: "36px", opacity: 0.2 }}>👁</div><span style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)" }}>No image available</span></div>
                  }
                  <div style={{ position: "absolute", top: "12px", right: "12px", padding: "4px 10px", borderRadius: "6px", background: "rgba(2,8,23,0.8)", backdropFilter: "blur(8px)", border: `1px solid ${cfg.border}`, fontSize: "10px", fontWeight: 700, color: cfg.color, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: "6px" }}>
                    {cfg.icon} {selected.content_type || "unknown"}
                  </div>
                </div>

                <div style={{ padding: "16px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "1.5px", marginBottom: "4px", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>Subject</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{selected.subject_guess || "Unknown"}</div>
                  </div>
                  <div style={{ width: "160px" }}>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "1.5px", marginBottom: "6px", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>Confidence</div>
                    <ConfidenceBar value={selected.confidence} />
                  </div>
                </div>

                <div style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Extracted Text</span>
                    <span style={{ fontSize: "9px", color: "#0fd6a0", fontFamily: "'JetBrains Mono', monospace" }}>{selected.raw_text?.length || 0} chars</span>
                  </div>
                  <div style={{ padding: "16px", background: "#060f1e" }}>
                    <pre style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: "1.7", whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{selected.raw_text || "No text extracted"}</pre>
                  </div>
                </div>

                <div style={{ borderRadius: "14px", border: "1px solid rgba(15,214,160,0.12)", overflow: "hidden", background: "rgba(15,214,160,0.03)" }}>
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(15,214,160,0.08)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>🎧</span>
                    <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "rgba(15,214,160,0.6)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Read Aloud — AirPods</span>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <p style={{ fontSize: "13px", color: "rgba(15,214,160,0.7)", fontStyle: "italic", lineHeight: "1.6", margin: 0 }}>{selected.read_aloud || selected.raw_text || "—"}</p>
                  </div>
                </div>

                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace", display: "flex", gap: "16px", paddingBottom: "8px" }}>
                  <span>⏱ {new Date(selected.captured_at).toLocaleString()}</span>
                  <span>· ID: {selected.id?.slice(0, 8)}</span>
                </div>
              </div>
            ) : (
              <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "rgba(15,214,160,0.04)", border: "1px solid rgba(15,214,160,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>👁</div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: "rgba(255,255,255,0.2)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "8px" }}>Awaiting capture</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.12)", maxWidth: "260px", lineHeight: "1.6" }}>Jetson Nano is monitoring the whiteboard. Captures appear automatically.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: "#0fd6a0", fontFamily: "'JetBrains Mono', monospace", padding: "8px 16px", borderRadius: "99px", background: "rgba(15,214,160,0.06)", border: "1px solid rgba(15,214,160,0.15)" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0fd6a0", boxShadow: "0 0 6px #0fd6a0", animation: "blink 2s infinite" }} />
                  Pipeline active
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            <div style={{ marginBottom: "12px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Braille Output</span>
            </div>
            <BraillePanel capture={selected} />
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes blink { 0%,100%{opacity:1;box-shadow:0 0 6px #0fd6a0}50%{opacity:.4;box-shadow:0 0 2px #0fd6a0} }
        .custom-scroll::-webkit-scrollbar{width:3px}
        .custom-scroll::-webkit-scrollbar-track{background:transparent}
        .custom-scroll::-webkit-scrollbar-thumb{background:rgba(15,214,160,0.2);border-radius:99px}
        .custom-scroll::-webkit-scrollbar-thumb:hover{background:rgba(15,214,160,0.4)}
      `}</style>
    </div>
  );
}
