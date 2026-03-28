import { useState, useRef } from 'react'

function CertCard({ cert, task }) {
  const cardRef = useRef(null)

  function copyToClipboard() {
    const text = `I am proud to share that I have earned the ${cert.name} certification! ${cert.description} Issued by LinkedOut · 2026 ${cert.badge}`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="mt-6" ref={cardRef}>
      {/* LinkedIn-style cert card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
        {/* Card header */}
        <div className="bg-gradient-to-r from-[#0a66c2] to-[#004182] p-4 flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-4xl shadow">
            {cert.badge}
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-tight">{cert.name}</div>
            <div className="text-blue-200 text-xs mt-0.5">Issued by LinkedOut · 2026</div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">{cert.description}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Credential ID: LO-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                </span>
                <span>·</span>
                <span>Does not expire</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-2 italic">You completed: "{task}"</div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-[#0a66c2] text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-[#004182] transition-colors cursor-pointer"
              >
                Share to LinkedIn™
              </button>
              <button
                className="border border-gray-300 text-gray-600 py-2 px-4 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  const el = document.createElement('a')
                  el.href = '#'
                  el.click()
                }}
              >
                Add to profile
              </button>
            </div>
            <p className="text-xs text-gray-300 text-center mt-2">(copies text to clipboard — LinkedIn button is aspirational)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Certifications() {
  const [task, setTask] = useState('')
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generateCert() {
    if (!task.trim()) return
    setLoading(true)
    setError('')
    setCert(null)
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY in .env')

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `The user completed this mundane task: "${task}"

Generate a ridiculous professional certification for it. Respond with ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "name": "The absurd certification name (e.g. 'Advanced Hydration Management Specialist')",
  "description": "One corporate sentence describing what this certifies (make it absurdly over-the-top)",
  "badge": "A single relevant emoji"
}`,
          }],
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const raw = data.content[0].text.trim()
      const parsed = JSON.parse(raw)
      setCert(parsed)
    } catch (e) {
      setError(e.message.includes('JSON') ? 'Failed to parse response. Try again.' : e.message)
    } finally {
      setLoading(false)
    }
  }

  const EXAMPLES = [
    'I washed the dishes',
    'I made a to-do list',
    'I took out the trash',
    'I replied to an email',
    'I drank 8 glasses of water',
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Useless Certifications™</h2>
        <p className="text-sm text-gray-500 mb-6">
          Describe any mundane task. Receive a prestigious professional certification.
          Add it to your LinkedIn today.
        </p>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            What did you accomplish today?
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0a66c2] resize-none"
            rows={3}
            placeholder="e.g. I made my bed this morning…"
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.metaKey) generateCert()
            }}
          />

          {/* Example pills */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => setTask(ex)}
                className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-[#0a66c2] text-gray-500 px-3 py-1 rounded-full cursor-pointer transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={generateCert}
            disabled={loading || !task.trim()}
            className="w-full bg-[#0a66c2] text-white py-2.5 rounded-full font-semibold text-sm hover:bg-[#004182] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating your certification…
              </span>
            ) : (
              '🏆 Issue My Certification'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {cert && <CertCard cert={cert} task={task} />}
      </div>

      <div className="mt-4 bg-yellow-50 rounded-xl border border-yellow-100 p-4">
        <p className="text-xs text-yellow-700 font-medium">
          📜 LinkedOut has issued 0 certifications recognized by any real institution. All credentials carry the same weight as every other LinkedIn certification.
        </p>
      </div>
    </div>
  )
}
