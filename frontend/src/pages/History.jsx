import { useState } from 'react'
import SessionLog from '../components/SessionLog'
import BraillePanel from '../components/BraillePanel'

export default function History() {
  const [selectedCapture, setSelectedCapture] = useState(null)

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #020817 0%, #0a1628 40%, #020817 100%)", paddingTop: "64px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "fixed", top: "30%", right: "20%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(15,214,160,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "32px", position: "relative" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "3px", height: "24px", background: "linear-gradient(180deg, #0fd6a0, #0891b2)", borderRadius: "2px" }} />
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px", lineHeight: 1 }}>Session History</h1>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginLeft: "13px" }}>
            All whiteboard captures — click any row to view Braille output
          </p>
        </div>

        {/* Table */}
        <SessionLog onSelectCapture={setSelectedCapture} />

        {/* Selected capture panel */}
        {selectedCapture && (
          <div style={{ marginTop: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Selected Capture</span>
              <button
                onClick={() => setSelectedCapture(null)}
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.6)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.25)"}
              >
                ✕ Clear
              </button>
            </div>
            <BraillePanel capture={selectedCapture} />
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}
