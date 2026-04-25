import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const BADGE = {
  math:          "bg-blue-500/10 text-blue-400 border-blue-500/30",
  assignment:    "bg-amber-500/10 text-amber-400 border-amber-500/30",
  diagram:       "bg-purple-500/10 text-purple-400 border-purple-500/30",
  lecture_notes: "bg-[#0fd6a0]/10 text-[#0fd6a0] border-[#0fd6a0]/30",
  mixed:         "bg-white/5 text-gray-400 border-white/10",
};

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Text-to-Speech ──
function speakText(text) {
  if (!text || !window.speechSynthesis) return;

  window.speechSynthesis.cancel(); // stop any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate   = 0.9;
  utterance.pitch  = 1;
  utterance.volume = 1;

  // Try to pick a clear voice (works on Chrome/Edge/Safari)
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.includes("Google US English") ||
    v.name.includes("Samantha") ||
    v.name.includes("Karen") ||
    v.lang === "en-US"
  );
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

export default function LiveFeed({ onSelect, selected }) {
  const [captures, setCaptures] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [speaking, setSpeaking] = useState(false);

  // Speak with visual feedback
  const handleSpeak = useCallback((text) => {
    if (!text) return;
    setSpeaking(true);
    speakText(text);
    // Reset icon after estimated duration
    const duration = Math.max(2000, text.length * 60);
    setTimeout(() => setSpeaking(false), duration);
  }, []);

  // ── Initial load ──
  useEffect(() => {
    supabase
      .from("captures")
      .select("*")
      .order("captured_at", { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (data) {
          setCaptures(data);
          if (data.length > 0) onSelect?.(data[0]);
        }
        if (error) console.error("[Supabase]", error);
        setLoading(false);
      });
  }, []);

  // ── Real-time subscription — auto-speak on new capture ──
  useEffect(() => {
    const channel = supabase
      .channel("captures-live")
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "captures",
      }, (payload) => {
        setCaptures(prev => [payload.new, ...prev]);
        onSelect?.(payload.new);
        // 🔊 Auto-speak new capture
        handleSpeak(payload.new.raw_text);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [handleSpeak]);

  // ── Loading ──
  if (loading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="card p-3 animate-pulse">
          <div className="w-full h-20 bg-white/5 rounded-lg mb-2" />
          <div className="h-3 bg-white/5 rounded w-2/3 mb-1.5" />
          <div className="h-3 bg-white/5 rounded w-full" />
        </div>
      ))}
    </div>
  );

  // ── Empty ──
  if (captures.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-14 h-14 rounded-full border border-white/10
                      flex items-center justify-center text-2xl">👁</div>
      <p className="text-gray-500 text-sm font-medium">Waiting for captures...</p>
      <div className="flex items-center gap-1.5 text-[#0fd6a0] text-xs font-jetbrains">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0fd6a0] animate-pulse" />
        Live monitoring active
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2.5">
      {captures.map((c) => {
        const isActive = selected?.id === c.id;
        const badgeClass = BADGE[c.content_type] || BADGE.mixed;

        return (
          <div
            key={c.id}
            onClick={() => onSelect?.(c)}
            className={`rounded-xl border p-3 cursor-pointer transition-all duration-150
              ${isActive
                ? "border-[#0fd6a0] bg-[#0fd6a0]/[0.08]"
                : "border-white/[0.07] bg-[#0b1120] hover:border-white/15 hover:bg-[#0b1120]"
              }`}
          >
            {/* Whiteboard thumbnail */}
            {c.image_url ? (
              <img
                src={c.image_url}
                alt="Whiteboard"
                className="w-full h-[88px] object-cover rounded-lg mb-2.5 bg-[#111827]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-[88px] rounded-lg mb-2.5 bg-[#111827]
                              flex items-center justify-center text-gray-700 text-xs">
                No image
              </div>
            )}

            {/* Badge + time */}
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[9px] font-bold uppercase tracking-wider
                               px-2 py-0.5 rounded-full border ${badgeClass}`}>
                {c.content_type || "notes"}
              </span>
              <span className="text-[10px] font-jetbrains text-gray-600">
                {fmtTime(c.captured_at)}
              </span>
            </div>

            {/* Text preview */}
            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
              {c.raw_text || "No text extracted"}
            </p>

            {/* 🔊 Read Aloud Button */}
            {c.raw_text && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // don't trigger card click
                  handleSpeak(c.raw_text);
                }}
                className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold
                           text-[#0fd6a0] bg-[#0fd6a0]/10 border border-[#0fd6a0]/20
                           rounded-md px-2 py-1 hover:bg-[#0fd6a0]/20 transition-colors"
              >
                {speaking ? "🔊 Speaking..." : "🔊 Read Aloud"}
              </button>
            )}

            {/* Assignment pill */}
            {c.is_assignment && (
              <div className="mt-2 text-[10px] font-semibold text-amber-400
                              bg-amber-500/10 border border-amber-500/20
                              rounded-md px-2 py-1 inline-block">
                ⚠ Assignment
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
