import { useState } from "react";
import LiveFeed from "../components/LiveFeed";
import BraillePanel from "../components/BraillePanel";

function ConfidenceBar({ value = 0 }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0fd6a0] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-jetbrains text-gray-500 w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

const BADGE = {
  math:          "bg-blue-500/10 text-blue-400 border-blue-500/30",
  assignment:    "bg-amber-500/10 text-amber-400 border-amber-500/30",
  diagram:       "bg-purple-500/10 text-purple-400 border-purple-500/30",
  lecture_notes: "bg-[#0fd6a0]/10 text-[#0fd6a0] border-[#0fd6a0]/30",
  mixed:         "bg-white/5 text-gray-400 border-white/10",
};

export default function Dashboard() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-syne text-3xl font-bold tracking-tight text-white mb-1">
          Live Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Real-time whiteboard captures — read aloud to student via AirPods
        </p>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-[280px_1fr_300px] gap-6 items-start">

        {/* ── LEFT: live capture feed ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest
                        text-gray-600 mb-3">
            Live Feed
          </p>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
            <LiveFeed onSelect={setSelected} selected={selected} />
          </div>
        </div>

        {/* ── CENTER: selected capture detail ── */}
        <div className="min-w-0">
          {selected ? (
            <div className="flex flex-col gap-5 animate-fadeUp">

              {/* Assignment alert */}
              {selected.is_assignment && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl
                                bg-amber-500/10 border border-amber-500/30
                                text-amber-400 text-sm font-medium">
                  ⚠ Assignment detected — Gemini flagged this content
                </div>
              )}

              {/* Whiteboard image */}
              {selected.image_url ? (
                <img
                  src={selected.image_url}
                  alt="Whiteboard"
                  className="w-full max-h-[360px] object-contain rounded-2xl
                             border border-white/10 bg-[#0b1120]"
                />
              ) : (
                <div className="w-full h-48 rounded-2xl border border-white/[0.07]
                                bg-[#0b1120] flex items-center justify-center
                                text-gray-600 text-sm">
                  No image available
                </div>
              )}

              {/* Subject + badge + confidence */}
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-syne text-xl font-semibold text-white flex-1">
                  {selected.subject_guess || "Unknown subject"}
                </h2>
                <span className={`text-[10px] font-bold uppercase tracking-wide
                                  px-2.5 py-1 rounded-full border
                                  ${BADGE[selected.content_type] || BADGE.mixed}`}>
                  {selected.content_type || "unknown"}
                </span>
              </div>

              <div className="w-48">
                <p className="text-[10px] text-gray-700 mb-1.5 uppercase tracking-wide">
                  Extraction confidence
                </p>
                <ConfidenceBar value={selected.confidence} />
              </div>

              {/* Extracted text */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest
                              text-gray-600 mb-2">
                  Extracted Text
                </p>
                <div className="card p-4">
                  <pre className="text-sm text-gray-200 leading-relaxed
                                  whitespace-pre-wrap font-sans">
                    {selected.raw_text || "No text extracted"}
                  </pre>
                </div>
              </div>

              {/* Read aloud version */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest
                              text-gray-600 mb-2">
                  Read Aloud — Sent to AirPods
                </p>
                <div className="card p-4">
                  <p className="text-sm text-gray-400 leading-relaxed italic">
                    {selected.read_aloud || selected.raw_text || "—"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <p className="text-[11px] font-jetbrains text-gray-700">
                Captured {new Date(selected.captured_at).toLocaleString()} ·
                ID: {selected.id?.slice(0, 8)}
              </p>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center
                            h-[60vh] gap-4 text-center">
              <div className="w-16 h-16 rounded-full border border-white/10
                              flex items-center justify-center text-3xl">👁</div>
              <p className="font-syne text-lg font-medium text-gray-500">
                Waiting for whiteboard content
              </p>
              <p className="text-sm text-gray-700 max-w-xs leading-relaxed">
                Captures appear on the left as the Jetson Nano detects board changes.
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT: Braille panel ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest
                        text-gray-600 mb-3">
            Braille
          </p>
          <BraillePanel capture={selected} />
        </div>

      </div>
    </div>
  );
}
