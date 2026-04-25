const PrintExport = ({ capture }) => {
  if (!capture) return null

  const downloadBrf = () => {
    if (!capture.braille_brf) {
      alert('No BRF file available for this capture.')
      return
    }
    const blob = new Blob([capture.braille_brf], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brixel_${capture.id.slice(0, 8)}.brf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadText = () => {
    if (!capture.raw_text) return
    const blob = new Blob([capture.raw_text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brixel_text_${capture.id.slice(0, 8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Brixel Braille Export</title>
          <style>
            body { font-family: monospace; padding: 40px; }
            h2 { font-size: 18px; margin-bottom: 8px; }
            p { font-size: 14px; line-height: 2; margin-bottom: 24px; }
            .braille { font-size: 28px; letter-spacing: 4px; }
            .meta { color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h2>Brixel — Whiteboard Capture</h2>
          <p class="meta">
            Captured: ${new Date(capture.captured_at).toLocaleString()} |
            Subject: ${capture.subject_guess || 'Unknown'}
          </p>
          <h2>Extracted Text</h2>
          <p>${capture.raw_text || 'No text available'}</p>
          <h2>Braille Output</h2>
          <p class="braille">${capture.braille_unicode || ''}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={downloadBrf}
        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 
                   text-white text-sm font-semibold px-5 py-2.5 rounded-lg 
                   transition-colors duration-200"
      >
        Download .brf
      </button>

      <button
        onClick={downloadText}
        className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] 
                   text-white text-sm font-semibold px-5 py-2.5 rounded-lg 
                   border border-gray-700 transition-colors duration-200"
      >
        Download .txt
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] 
                   text-white text-sm font-semibold px-5 py-2.5 rounded-lg 
                   border border-gray-700 transition-colors duration-200"
      >
        Print Braille
      </button>
    </div>
  )
}

export default PrintExport 