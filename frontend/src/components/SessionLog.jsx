import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TYPE_COLOR = {
  math:          "#60a5fa",
  assignment:    "#f59e0b",
  diagram:       "#a78bfa",
  lecture_notes: "#0fd6a0",
};

export default function SessionLog({ onSelectCapture }) {
  const [captures, setCaptures] = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchCaptures()
    const sub = supabase
      .channel('captures-log')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'captures' },
        (payload) => setCaptures(prev => [payload.new, ...prev]))
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [])

  const fetchCaptures = async () => {
    const { data, error } = await supabase
      .from('captures').select('*')
      .order('captured_at', { ascending: false }).limit(50)
    if (!error) setCaptures(data)
    setLoading(false)
  }

  const handleSelect = (capture) => {
    setSelected(capture.id)
    onSelectCapture(capture)
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
      <div style={{ width: "24px", height: "24px", border: "2px solid rgba(15,214,160,0.3)", borderTopColor: "#0fd6a0", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (captures.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", gap: "12px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "16px" }}>
      <div style={{ fontSize: "28px", opacity: 0.3 }}>📋</div>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>No captures yet</p>
    </div>
  )

  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 120px 1fr 90px 90px", padding: "10px 20px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["Time", "Subject", "Preview", "Assignment", "Confidence"].map(h => (
          <span key={h} style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }} className="custom-scroll">
        {captures.map((c, i) => {
          const isSelected = selected === c.id
          const accentColor = TYPE_COLOR[c.content_type] || "rgba(255,255,255,0.4)"
          const pct = c.confidence ? Math.round(c.confidence * 100) : null

          return (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              style={{
                display: "grid", gridTemplateColumns: "200px 120px 1fr 90px 90px",
                padding: "14px 20px", cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: isSelected
                  ? "rgba(15,214,160,0.06)"
                  : i % 2 === 0 ? "#060f1e" : "#070e1b",
                borderLeft: isSelected ? "2px solid #0fd6a0" : "2px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = i % 2 === 0 ? "#060f1e" : "#070e1b" }}
            >
              {/* Time */}
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace", alignSelf: "center" }}>
                {new Date(c.captured_at).toLocaleString()}
              </span>

              {/* Subject */}
              <div style={{ alignSelf: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, color: accentColor, background: `${accentColor}15`, border: `1px solid ${accentColor}30`, padding: "3px 8px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace" }}>
                  {c.subject_guess || "Unknown"}
                </span>
              </div>

              {/* Preview */}
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", alignSelf: "center", paddingRight: "16px" }}>
                {c.raw_text?.slice(0, 70) || "—"}
              </span>

              {/* Assignment */}
              <div style={{ alignSelf: "center" }}>
                {c.is_assignment
                  ? <span style={{ fontSize: "10px", fontWeight: 600, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", padding: "3px 8px", borderRadius: "6px" }}>⚠ Yes</span>
                  : <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace" }}>—</span>
                }
              </div>

              {/* Confidence */}
              <div style={{ alignSelf: "center" }}>
                {pct !== null ? (
                  <span style={{ fontSize: "12px", fontWeight: 600, color: pct >= 80 ? "#0fd6a0" : pct >= 50 ? "#f59e0b" : "#ef4444", fontFamily: "'JetBrains Mono', monospace" }}>
                    {pct}%
                  </span>
                ) : (
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace" }}>—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar{width:3px}
        .custom-scroll::-webkit-scrollbar-track{background:transparent}
        .custom-scroll::-webkit-scrollbar-thumb{background:rgba(15,214,160,0.2);border-radius:99px}
      `}</style>
    </div>
  )
}
