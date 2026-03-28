import { useState, useRef, useEffect } from 'react'
import Dashboard from './Dashboard'

const BUZZWORDS = [
  'synergy', 'leverage', 'pivot', 'disrupt', 'scalable', 'bandwidth',
  'circle back', 'deep dive', 'move the needle', 'paradigm', 'ecosystem',
  'holistic', 'actionable', 'value-add', 'thought leader', 'mission-critical',
  'stakeholder', 'deliverable', 'ROI', 'KPI', 'agile', 'ideate', 'optics',
  'best-in-class', 'low-hanging fruit', 'boil the ocean', 'drill down',
  'net-net', 'take offline', 'verticals', 'cadence', 'robust', 'seamless',
]

function countBuzzwords(text) {
  const lower = text.toLowerCase()
  return BUZZWORDS.filter(w => lower.includes(w)).length
}

function calcSynergyScore(text) {
  const words = text.split(/\s+/).length
  const buzzCount = countBuzzwords(text)
  const density = words > 0 ? buzzCount / words : 0
  return Math.min(100, Math.round(density * 500 + buzzCount * 3))
}

function calcJargonLevel(text) {
  const score = calcSynergyScore(text)
  return Math.min(100, score + 10)
}

export default function Jargonifier() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [jargonified, setJargonified] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ buzzwordCount: 0, synergyScore: 0, jargonLevel: 0 })
  const recognitionRef = useRef(null)
  const interimRef = useRef('')

  useEffect(() => {
    return () => recognitionRef.current?.stop()
  }, [])

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }
    setError('')
    setTranscript('')
    setJargonified('')
    interimRef.current = ''

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (e) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript
        } else {
          interim += e.results[i][0].transcript
        }
      }
      if (final) interimRef.current += final
      setTranscript(interimRef.current + interim)
    }

    recognition.onerror = (e) => {
      if (e.error !== 'aborted') setError(`Mic error: ${e.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (interimRef.current.trim()) {
        jargonify(interimRef.current)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setIsListening(false)
    // jargonify fires in onend to avoid double-calling
  }

  async function jargonify(text) {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (!apiKey) throw new Error('Missing VITE_OPENAI_API_KEY in .env')

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 512,
          messages: [{
            role: 'user',
            content: `Rewrite the following plain English statement as peak LinkedIn corporate jargon. Use buzzwords like "leverage", "synergy", "pivot", "disrupt", "move the needle", "circle back", "deep dive", "holistic approach", "thought leadership", etc. Make it absurdly over-the-top but still coherent. Keep it to 2-3 sentences max.

Plain English: "${text}"

Return ONLY the rewritten jargon version, no explanation.`,
          }],
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const result = data.choices[0].message.content.trim()
      setJargonified(result)
      setStats({
        buzzwordCount: countBuzzwords(result),
        synergyScore: calcSynergyScore(result),
        jargonLevel: calcJargonLevel(result),
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Jargon-ifier™</h2>
        <p className="text-sm text-gray-500 mb-6">
          Speak your plain thoughts. Watch them transform into peak professional gibberish.
        </p>

        {/* Mic controls */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all shadow-lg cursor-pointer ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-[#0a66c2] hover:bg-[#004182]'
            }`}
          >
            {isListening ? '⏹️' : '🎙️'}
          </button>
          <p className="text-sm text-gray-500">
            {isListening ? 'Listening… click to stop & jargonify' : 'Click to start speaking'}
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Side-by-side */}
        {(transcript || jargonified) && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                What You Said
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 min-h-[100px]">
                {transcript || <span className="text-gray-400 italic">Transcript will appear here…</span>}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0a66c2] uppercase tracking-wider mb-2">
                LinkedIn Version ✨
              </div>
              <div className="bg-blue-50 border border-[#0a66c2] border-opacity-30 rounded-lg p-4 text-sm text-gray-800 min-h-[100px]">
                {loading ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-4 h-4 border-2 border-[#0a66c2] border-t-transparent rounded-full animate-spin" />
                    Jargonifying…
                  </div>
                ) : jargonified ? (
                  jargonified
                ) : (
                  <span className="text-gray-400 italic">Jargonified text will appear here…</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual input fallback */}
        {!isListening && !transcript && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Or type it manually:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="I made a to-do list today…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0a66c2]"
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setTranscript(e.target.value)
                    jargonify(e.target.value)
                    e.target.value = ''
                  }
                }}
              />
              <button
                className="bg-[#0a66c2] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#004182] cursor-pointer"
                onClick={e => {
                  const input = e.target.previousSibling
                  if (input.value.trim()) {
                    setTranscript(input.value)
                    jargonify(input.value)
                    input.value = ''
                  }
                }}
              >
                Jargonify
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard */}
      <Dashboard stats={stats} />
    </div>
  )
}
