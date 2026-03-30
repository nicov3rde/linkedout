import { useState, useRef, useEffect } from 'react'
import Dashboard from './Dashboard'
import LinkedInShareButton from './LinkedInShareButton'
import RegenButton from './RegenButton'

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

const TONE_STYLES = [
  {
    id: 'exec',
    label: '👔 Executive',
    desc: 'Strategic alignment & stakeholder value',
    buzzwords: ['leverage', 'synergy', 'stakeholder', 'strategic alignment', 'fiscal narrative', 'core competency', 'value proposition', 'deliverables', 'KPI', 'ROI'],
    prompts: [
      'Rewrite this as a mild executive memo with 1-2 business buzzwords. Keep it mostly normal.',
      'Rewrite this in classic corporate executive speak. Reference stakeholders, strategy, and value.',
      'Rewrite this as a C-suite LinkedIn post dripping in strategic alignment, synergy, and stakeholder value.',
      'Rewrite this as a completely unhinged Fortune 500 executive who has replaced all human thought with buzzwords. Pure shareholder-value-maximizing gibberish. Write in mixed case with normal punctuation — just make the content extremely over the top and dramatic.',
    ],
  },
  {
    id: 'techbro',
    label: '🚀 Tech Bro',
    desc: 'Disruption, 10x, scale at all costs',
    buzzwords: ['disrupt', 'scale', '10x', 'ship it', 'move fast', 'growth hacking', 'pivot', 'ecosystem', 'paradigm shift', 'north star metric'],
    prompts: [
      'Rewrite this with light startup energy. Maybe one or two tech buzzwords.',
      'Rewrite this as a tech startup founder on LinkedIn. Mention disruption, scaling, or shipping.',
      'Rewrite this as a Silicon Valley tech bro who wants to 10x everything, disrupt industries, and move fast and break things.',
      'Rewrite this as a completely deranged tech bro who wants to disrupt death itself, 10x the universe, and ship an MVP before thinking. Pure hyper-growth lunacy. Write in mixed case with normal punctuation — just make the content extremely over the top and dramatic.',
    ],
  },
  {
    id: 'wellness',
    label: '🧘 Wellness Guru',
    desc: 'Authentic journey & purpose-driven passion',
    buzzwords: ['authentic', 'journey', 'purpose-driven', 'whole self', 'gratitude', 'mindful', 'intentional', 'vulnerability', 'growth mindset', 'aligned'],
    prompts: [
      'Rewrite this with a slightly warm, positive tone. Maybe mention being intentional.',
      'Rewrite this as a LinkedIn wellness influencer sharing their authentic journey with gratitude and purpose.',
      'Rewrite this as a professional wellness guru who brings their whole self to work, leads with vulnerability, and is deeply, insufferably grateful.',
      'Rewrite this as a completely unhinged wellness influencer who has turned every mundane event into a spiritual awakening and wants you to journal about it. Write in mixed case with normal punctuation — just make the content extremely over the top and dramatic.',
    ],
  },
  {
    id: 'hustle',
    label: '💪 Hustle Culture',
    desc: '5am grind, blessed, no days off',
    buzzwords: ['grind', 'blessed', 'grateful', 'no days off', 'outwork', 'discipline', 'results', 'earned it', 'early mornings', 'refuse to quit'],
    prompts: [
      'Rewrite this with a hint of motivated, positive energy. Keep it grounded.',
      'Rewrite this as a hustle-culture LinkedIn post. Mention the grind, discipline, or being grateful.',
      'Rewrite this as an obsessive hustle-culture poster who wakes up at 4am, never rests, and wants you to know they earned everything through pure grind.',
      'Rewrite this as a completely unhinged hustle maximalist who has not slept in 3 years, considers blinking a waste of time, and will die before taking a day off. Unhinged motivational energy. Write in mixed case with normal punctuation — just make the content extremely over the top and dramatic.',
    ],
  },
]

const INTENSITY_LABELS = ['Mild', 'Classic', 'Overdrive', 'Unhinged']

export default function Jargonifier() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [jargonified, setJargonified] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ buzzwordCount: 0, synergyScore: 0, jargonLevel: 0 })
  const [regenerating, setRegenerating] = useState(false)
  const [toneStyle, setToneStyle] = useState('exec')
  const [intensity, setIntensity] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const recognitionRef = useRef(null)
  const interimRef = useRef('')
  const toneStyleRef = useRef(toneStyle)
  const intensityRef = useRef(intensity)

  useEffect(() => { toneStyleRef.current = toneStyle }, [toneStyle])
  useEffect(() => { intensityRef.current = intensity }, [intensity])

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

  async function jargonify(text, { regen = false } = {}) {
    if (!text.trim()) return
    if (regen) {
      setRegenerating(true)
    } else {
      setLoading(true)
    }
    setError('')
    try {
      const style = TONE_STYLES.find(s => s.id === toneStyleRef.current)
      const toneInstruction = style.prompts[intensityRef.current]

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 512,
          messages: [
            {
              role: 'system',
              content: `You are a LinkedIn jargon generator. Take exactly what the user said and rewrite it as a LinkedIn post using corporate buzzwords — but keep it directly related to what they actually said. Do not sanitize, avoid, or generalize the topic. If they said something wild, make it wild in corporate speak.

Rules:
- Stay true to the literal meaning of what was said
- Use corporate jargon but keep the original action recognizable and funny
- Do not switch to vague stakeholder language to avoid the topic
- Short and punchy, 2-4 sentences max
- Mixed case, no all caps
- No em dashes
- Return ONLY the rewritten text, no explanation`,
            },
            {
              role: 'user',
              content: `Tone style: ${toneInstruction}

Text to rewrite: "${text}"`,
            },
          ],
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
      setRegenerating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Jargon-ifier™</h2>
        <p className="text-sm text-gray-500 mb-6">
          Speak your plain thoughts. Watch them transform into peak professional gibberish.
        </p>

        {/* Tone Style Selector */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tone Style</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TONE_STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setToneStyle(s.id)}
                className={`flex flex-col items-start px-3 py-2 rounded-lg border text-left transition-all cursor-pointer ${
                  toneStyle === s.id
                    ? 'border-[#0a66c2] bg-blue-50 text-[#0a66c2]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-semibold">{s.label}</span>
                <span className="text-xs text-gray-400 leading-tight mt-0.5">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Intensity</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              intensity === 0 ? 'bg-green-100 text-green-700' :
              intensity === 1 ? 'bg-yellow-100 text-yellow-700' :
              intensity === 2 ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {INTENSITY_LABELS[intensity]}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={intensity}
            onChange={e => setIntensity(Number(e.target.value))}
            className="w-full accent-[#0a66c2] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            {INTENSITY_LABELS.map(l => <span key={l}>{l}</span>)}
          </div>
        </div>

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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  What You Said
                </div>
                {!isEditing && transcript && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-semibold text-[#0a66c2] hover:text-[#004182] hover:underline cursor-pointer"
                  >
                    Edit Text
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="flex flex-col flex-1">
                  <textarea
                    className="flex-1 w-full bg-white border border-[#0a66c2] rounded-lg p-3 text-sm text-gray-700 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-[#0a66c2] shadow-sm resize-y"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                  <div className="flex justify-end mt-3 gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 cursor-pointer rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false)
                        jargonify(transcript)
                      }}
                      className="bg-[#0a66c2] text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-[#004182] transition-colors cursor-pointer shadow-sm"
                    >
                      Update & Jargonify
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 min-h-[120px] flex-1">
                  {transcript || <span className="text-gray-400 italic">Transcript will appear here…</span>}
                </div>
              )}
            </div>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-[#0a66c2] uppercase tracking-wider">
                  LinkedIn Version ✨
                </div>
                {jargonified && !loading && (
                  <RegenButton
                    onClick={() => jargonify(transcript, { regen: true })}
                    spinning={regenerating}
                    disabled={isListening}
                  />
                )}
              </div>
              <div className="relative flex-1 bg-blue-50 border border-[#0a66c2] border-opacity-30 rounded-lg p-4 text-sm text-gray-800 min-h-[120px]">
                {loading ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-4 h-4 border-2 border-[#0a66c2] border-t-transparent rounded-full animate-spin" />
                    Jargonifying…
                  </div>
                ) : jargonified ? (
                  <span className={regenerating ? 'opacity-40' : ''}>{jargonified}</span>
                ) : (
                  <span className="text-gray-400 italic">Jargonified text will appear here…</span>
                )}
                {regenerating && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                    <div className="w-5 h-5 border-2 border-[#0a66c2] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Share to LinkedIn — shown after jargonification */}
        {jargonified && !loading && (
          <div className="mt-4 flex justify-end">
            <LinkedInShareButton text={jargonified} />
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
