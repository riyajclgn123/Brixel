import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SessionLog = ({ onSelectCapture }) => {
  const [captures, setCaptures] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchCaptures()

    const subscription = supabase
      .channel('captures-log')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'captures'
      }, (payload) => {
        setCaptures(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  const fetchCaptures = async () => {
    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .order('captured_at', { ascending: false })
      .limit(50)

    if (!error) setCaptures(data)
    setLoading(false)
  }

  const handleSelect = (capture) => {
    setSelected(capture.id)
    onSelectCapture(capture)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent 
                        rounded-full animate-spin" />
      </div>
    )
  }

  if (captures.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed 
                      border-gray-700 rounded-xl">
        <p className="text-gray-500 text-sm">No captures yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0f172a] border-b border-gray-800">
            <th className="text-left px-4 py-3 text-gray-400 font-semibold">Time</th>
            <th className="text-left px-4 py-3 text-gray-400 font-semibold">Subject</th>
            <th className="text-left px-4 py-3 text-gray-400 font-semibold">Preview</th>
            <th className="text-left px-4 py-3 text-gray-400 font-semibold">Assignment</th>
            <th className="text-left px-4 py-3 text-gray-400 font-semibold">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {captures.map((capture) => (
            <tr
              key={capture.id}
              onClick={() => handleSelect(capture)}
              className={`border-b border-gray-800 cursor-pointer transition-colors duration-150
                ${selected === capture.id
                  ? 'bg-teal-900/30'
                  : 'hover:bg-[#1e293b]'
                }`}
            >
              <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                {new Date(capture.captured_at).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <span className="bg-[#1e293b] text-teal-400 text-xs px-2 py-1 rounded-md">
                  {capture.subject_guess || 'Unknown'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-300 max-w-xs truncate">
                {capture.raw_text?.slice(0, 60) || '—'}
              </td>
              <td className="px-4 py-3">
                {capture.is_assignment ? (
                  <span className="bg-amber-900/40 text-amber-400 text-xs 
                                   px-2 py-1 rounded-md">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-600 text-xs">No</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-300">
                {capture.confidence
                  ? `${Math.round(capture.confidence * 100)}%`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SessionLog