import { useState } from 'react'
import SessionLog from '../components/SessionLog'
import BraillePanel from '../components/BraillePanel'
import PrintExport from '../components/PrintExport'

const History = () => {
  const [selectedCapture, setSelectedCapture] = useState(null)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Session History</h1>
        <p className="text-gray-400 text-sm mt-1">
          All whiteboard captures — click any row to view Braille output
        </p>
      </div>

      <SessionLog onSelectCapture={setSelectedCapture} />

      {selectedCapture && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Selected Capture
            </h2>
            <button
              onClick={() => setSelectedCapture(null)}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Clear
            </button>
          </div>

          <BraillePanel capture={selectedCapture} />

          <PrintExport capture={selectedCapture} />
        </div>
      )}
    </div>
  )
}

export default History