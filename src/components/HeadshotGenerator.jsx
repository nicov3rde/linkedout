import { useState, useRef } from 'react'

const FILTERS = [
  {
    name: 'Executive',
    description: 'High contrast, de-saturated. Pure C-suite energy.',
    css: 'contrast(1.15) saturate(0.85) brightness(1.05)',
    frame: 'border-4 border-[#0a66c2]',
  },
  {
    name: 'Thought Leader',
    description: 'Warm tones, soft glow. Very TED Talk.',
    css: 'contrast(1.1) saturate(1.1) brightness(1.08) sepia(0.15)',
    frame: 'border-4 border-amber-400',
  },
  {
    name: 'Disruptor',
    description: 'Cool, sharp, slightly dramatic.',
    css: 'contrast(1.2) saturate(0.7) brightness(1.0) hue-rotate(10deg)',
    frame: 'border-4 border-purple-500',
  },
  {
    name: 'Founder Mode',
    description: 'B&W but not fully — artsy but approachable.',
    css: 'grayscale(0.8) contrast(1.25) brightness(1.05)',
    frame: 'border-4 border-gray-700',
  },
]

export default function HeadshotGenerator() {
  const [imageSrc, setImageSrc] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState(0)
  const fileInputRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImageSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImageSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const filter = FILTERS[selectedFilter]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1">AI Headshot Generator™</h2>
        <p className="text-sm text-gray-500 mb-6">
          Upload any photo. We'll make you look like you belong on a Forbes 30 Under 30 list.
        </p>

        {/* Upload zone */}
        {!imageSrc && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#0a66c2] hover:bg-blue-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <div className="text-5xl mb-3">📸</div>
            <p className="text-gray-600 font-medium">Drop a photo here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — any photo will do</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        )}

        {/* Before / After */}
        {imageSrc && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Before */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Before
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 aspect-square">
                  <img
                    src={imageSrc}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* After */}
              <div>
                <div className="text-xs font-semibold text-[#0a66c2] uppercase tracking-wider mb-2">
                  After (LinkedIn-ready ✨)
                </div>
                <div className={`rounded-xl overflow-hidden ${filter.frame} aspect-square relative`}>
                  <img
                    src={imageSrc}
                    alt="Enhanced"
                    className="w-full h-full object-cover"
                    style={{ filter: filter.css }}
                  />
                  {/* AI Enhanced badge */}
                  <div className="absolute bottom-2 right-2 bg-[#0a66c2] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <span>✓</span> AI Enhanced
                  </div>
                  {/* Open to Work ring (satirical) */}
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    #OpenToWork
                  </div>
                </div>
              </div>
            </div>

            {/* Filter selector */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Choose your vibe:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FILTERS.map((f, i) => (
                  <button
                    key={f.name}
                    onClick={() => setSelectedFilter(i)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedFilter === i
                        ? 'border-[#0a66c2] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-800">{f.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{f.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => { setImageSrc(null); setSelectedFilter(0) }}
                className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ← Upload a different photo
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tips card */}
      <div className="mt-4 bg-blue-50 rounded-xl border border-blue-100 p-4">
        <p className="text-xs text-blue-700 font-medium">
          💡 Pro Tip: The "Executive" filter has been shown to increase LinkedIn connection requests by 0% but makes you feel 40% more important.
        </p>
      </div>
    </div>
  )
}
