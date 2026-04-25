import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BraillePanel from '../components/BraillePanel'
import PrintExport from '../components/PrintExport'

const BrailleExport = () => {
  const [captures, setCaptures] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCaptures()
  }, [])

  const fetchCaptures = async () => {
    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .order('captured_at', { ascending: false })

    if (!error) setCaptures(data)
    setLoading(false)
  }

  const filtered = captures.filter(c => {
    if (filter === 'assignments') return c.is_assignment === true
    if (filter === 'braille') return !!c.braille_unicode
    return true
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Braille Export</h1>
        <p className="text-gray-400 text-sm mt-1">
          Select any capture to view and export its Braille output
        </p>
      </div>

      <div className="flex gap-2">
        {['all', 'assignments', 'braille'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize 
                        transition-colors duration-200
              ${filter === f
                ? 'bg-teal-600 text-white'
                : 'bg-[#1e293b] text-gray-400 hover:text-white border border-gray-700'
              }`}
          >
            {f === 'all' ? 'All captures' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent 
                          rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Captures ({filtered.length})
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm py-8 text-center">
                  No captures found
                </p>
              ) : (
                filtered.map(capture => (
                  <div
                    key={capture.id}
                    onClick={() => setSelected(capture)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-150
                      ${selected?.id === capture.id
                        ? 'border-teal-500 bg-teal-900/20'
                        : 'border-gray-800 bg-[#0f172a] hover:border-gray-600'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-teal-400 text-xs font-semibold">
                        {capture.subject_guess || 'Unknown'}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(capture.captured_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm truncate">
                      {capture.raw_text?.slice(0, 80) || 'No text'}
                    </p>
                    {capture.is_assignment && (
                      <span className="mt-2 inline-block bg-amber-900/40 
                                       text-amber-400 text-xs px-2 py-0.5 rounded">
                        Assignment
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Output
            </h2>
            <BraillePanel capture={selected} />
            {selected && <PrintExport capture={selected} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default BrailleExport