import { textToBraille } from '../utils/braille'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BraillePanel from '../components/BraillePanel'

const FILTERS = [
  { key: 'all',         label: 'All Captures', icon: '⬡' },
  { key: 'assignments', label: 'Assignments',   icon: '⚠' },
  { key: 'braille',     label: 'Has Braille',   icon: '⠿' },
]

export default function BrailleExport() {
  const [captures, setCaptures] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('all')
  const [loading, setLoading]   = useState(true)

  const selectedWithBraille = selected ? {
    ...selected,
    braille_unicode: selected.braille_unicode || textToBraille(selected.raw_text)
  } : null

  useEffect(() => { fetchCaptures() }, [])

  const fetchCaptures = async () => {
    const { data, error } = await supabase
      .from('captures').select('*')
      .order('captured_at', { ascending: false })
    if (!error) setCaptures(data)
    setLoading(false)
  }

  const filtered = captures.filter(c => {
    if (filter === 'assignments') return c.is_assignment === true
    if (filter === 'braille')     return !!(c.braille_unicode || c.raw_text)
    return true
  })

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #020817 0%, #0a1628 40%, #020817 100%)", paddingTop: "64px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "fixed", top: "40%", left: "20%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "32px", position: "relative" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "3px", height: "24px", background: "linear-gradient(180deg, #a78bfa, #0891b2)", borderRadius: "2px" }} />
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px", lineHeight: 1 }}>Braille Viewer</h1>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginLeft: "13px" }}>Select any capture to view and export its Braille output</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "8px 16px", borderRadius: "10px",
                fontSize: "12px", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                background: filter === f.key ? "rgba(15,214,160,0.1)" : "rgba(255,255,255,0.02)",
                color: filter === f.key ? "#0fd6a0" : "rgba(255,255,255,0.35)",
                border: filter === f.key ? "1px solid rgba(15,214,160,0.3)" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span style={{ fontSize: "11px" }}>{f.icon}</span>
              {f.label}
              <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "99px", background: filter === f.key ? "rgba(15,214,160,0.15)" : "rgba(255,255,255,0.05)", color: filter === f.key ? "#0fd6a0" : "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>
                {filter === f.key ? filtered.length : captures.filter(c => {
                  if (f.key === 'assignments') return c.is_assignment
                  if (f.key === 'braille') return !!(c.braille_unicode || c.raw_text)
                  return true
                }).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
            <div style={{ width: "24px", height: "24px", border: "2px solid rgba(15,214,160,0.3)", borderTopColor: "#0fd6a0", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "20px", alignItems: "start" }}>

            {/* LEFT: Capture list */}
            <div>
              <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Captures</span>
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>{filtered.length} results</span>
              </div>

              <div style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }} className="custom-scroll">
                {filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>No captures found</div>
                ) : filtered.map(c => {
                  const isSelected = selected?.id === c.id
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelected(c)}
                      style={{
                        padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
                        transition: "all 0.15s",
                        background: isSelected ? "rgba(15,214,160,0.06)" : "rgba(255,255,255,0.02)",
                        border: isSelected ? "1px solid rgba(15,214,160,0.25)" : "1px solid rgba(255,255,255,0.06)",
                        borderLeft: isSelected ? "3px solid #0fd6a0" : "3px solid transparent",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: isSelected ? "#0fd6a0" : "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px" }}>
                          {c.subject_guess || "Unknown"}
                        </span>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>
                          {new Date(c.captured_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: isSelected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.raw_text?.slice(0, 60) || "No text"}
                      </p>
                      {c.is_assignment && (
                        <span style={{ marginTop: "8px", display: "inline-block", fontSize: "10px", fontWeight: 600, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "2px 8px", borderRadius: "6px" }}>⚠ Assignment</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT: Output */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ marginBottom: "0px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Output</span>
              </div>
              <BraillePanel capture={selectedWithBraille} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        .custom-scroll::-webkit-scrollbar{width:3px}
        .custom-scroll::-webkit-scrollbar-track{background:transparent}
        .custom-scroll::-webkit-scrollbar-thumb{background:rgba(15,214,160,0.2);border-radius:99px}
      `}</style>
    </div>
  )
}
