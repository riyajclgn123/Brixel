const BraillePanel = ({ capture }) => {
  if (!capture) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed border-gray-700 rounded-xl">
        <p className="text-gray-500 text-sm">No capture selected</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 space-y-6">
      <div>
        <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
          Extracted Text
        </span>
        <p className="mt-3 text-white text-base leading-relaxed whitespace-pre-wrap">
          {capture.raw_text || 'No text extracted'}
        </p>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
          Braille Unicode
        </span>
        <p className="mt-3 text-white text-2xl leading-loose font-mono tracking-widest whitespace-pre-wrap">
          {capture.braille_unicode || '⠀'}
        </p>
      </div>

      {capture.is_assignment && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-4 py-3">
          <p className="text-amber-400 text-sm font-semibold">
            Assignment detected on this capture
          </p>
        </div>
      )}

      <div className="flex gap-3 text-xs text-gray-500">
        <span>Subject: {capture.subject_guess || 'Unknown'}</span>
        <span>•</span>
        <span>
          Confidence: {capture.confidence
            ? `${Math.round(capture.confidence * 100)}%`
            : 'N/A'}
        </span>
        <span>•</span>
        <span>
          {new Date(capture.captured_at).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}

export default BraillePanel