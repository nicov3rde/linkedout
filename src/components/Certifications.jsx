import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import LinkedInShareButton from './LinkedInShareButton'
import RegenButton from './RegenButton'

const CREDENTIAL_ID = () => 'LO-' + Math.random().toString(36).slice(2, 8).toUpperCase()

const CornerFlourish = ({ rotate = 0 }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none"
    style={{ transform: `rotate(${rotate}deg)` }}>
    <path d="M4 4 L4 20 M4 4 L20 4" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 12 Q12 4 20 12 Q12 20 4 12Z" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
    <circle cx="4" cy="4" r="2" fill="#C9A84C"/>
    <path d="M14 4 Q18 8 14 12 Q10 8 14 4Z" fill="#C9A84C" opacity="0.5"/>
    <path d="M4 14 Q8 18 4 22 Q0 18 4 14Z" fill="#C9A84C" opacity="0.5"/>
  </svg>
)

const Signature = () => (
  <svg width="160" height="40" viewBox="0 0 160 40" fill="none">
    <path
      d="M10 28 C20 10, 30 35, 40 20 C50 5, 55 32, 65 22 C75 12, 80 30, 95 18 C108 8, 112 28, 125 20 C135 14, 140 26, 150 22"
      stroke="#2a2a2a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
    <path
      d="M30 22 C32 30, 36 32, 38 28"
      stroke="#2a2a2a" strokeWidth="1.4" strokeLinecap="round" fill="none"
    />
  </svg>
)

const GoldSeal = () => (
  <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
    {/* Starburst */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16
      const rad = (angle * Math.PI) / 180
      const x1 = 45 + 32 * Math.cos(rad)
      const y1 = 45 + 32 * Math.sin(rad)
      const x2 = 45 + 38 * Math.cos(rad)
      const y2 = 45 + 38 * Math.sin(rad)
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="2"/>
    })}
    <circle cx="45" cy="45" r="28" fill="#C9A84C"/>
    <circle cx="45" cy="45" r="24" fill="#B8860B"/>
    <circle cx="45" cy="45" r="20" fill="#C9A84C"/>
    <text x="45" y="40" textAnchor="middle" fill="#7B4F00" fontSize="7" fontWeight="bold" fontFamily="Georgia, serif">LINKED</text>
    <text x="45" y="50" textAnchor="middle" fill="#7B4F00" fontSize="12">🏅</text>
    <text x="45" y="62" textAnchor="middle" fill="#7B4F00" fontSize="6" fontWeight="bold" fontFamily="Georgia, serif">CERTIFIED</text>
  </svg>
)

function CertCard({ cert, task, onRegenerate, regenerating }) {
  const certRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const credId = useRef(CREDENTIAL_ID())

  async function downloadCert() {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFEF0',
      })
      const link = document.createElement('a')
      link.download = `linkedout-cert-${credId.current}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  function copyToClipboard() {
    const text = `I am proud to share that I have earned the ${cert.name} certification! ${cert.description} Issued by LinkedOut · 2026 ${cert.badge}`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="mt-6">
      {/* Physical Certificate */}
      <div style={{ position: 'relative' }}>
      {regenerating && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(255,254,240,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 4,
        }}>
          <div style={{
            width: 32, height: 32,
            border: '3px solid #C9A84C', borderTopColor: 'transparent',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      )}
      <div
        ref={certRef}
        style={{
          background: '#FFFEF0',
          border: '3px solid #C9A84C',
          boxShadow: 'inset 0 0 0 8px #FFFEF0, inset 0 0 0 11px #C9A84C',
          fontFamily: 'Georgia, serif',
          padding: '40px 48px',
          position: 'relative',
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
        className="cert-printable"
      >
        {/* Corner flourishes */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}><CornerFlourish rotate={0}/></div>
        <div style={{ position: 'absolute', top: 10, right: 10 }}><CornerFlourish rotate={90}/></div>
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}><CornerFlourish rotate={180}/></div>
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}><CornerFlourish rotate={270}/></div>

        {/* Logo seal */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0a66c2, #004182)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 3px #C9A84C, 0 0 0 6px #FFFEF0, 0 0 0 8px #C9A84C',
          fontSize: 32, marginBottom: 20,
        }}>
          <span style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>🔗</span>
        </div>

        {/* Header text */}
        <div style={{ color: '#8B6914', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6 }}>
          LinkedOut Certification Authority
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)' }}/>
          <span style={{ color: '#C9A84C', fontSize: 14 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)' }}/>
        </div>

        {/* Certificate of text */}
        <div style={{ color: '#a07820', fontSize: 13, letterSpacing: '0.15em', marginBottom: 8 }}>
          CERTIFICATE OF
        </div>

        {/* Main title */}
        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', lineHeight: 1.2, marginBottom: 20 }}>
          {cert.name}
        </div>

        {/* Badge */}
        <div style={{ fontSize: 48, marginBottom: 16 }}>{cert.badge}</div>

        {/* Body text */}
        <p style={{ fontSize: 14, color: '#3a3a3a', lineHeight: 1.7, maxWidth: 420, marginBottom: 6 }}>
          This certifies that the bearer has demonstrated exceptional proficiency in the field of{' '}
          <em>{cert.name.toLowerCase()}</em> and is hereby recognized as a qualified professional by the
          LinkedOut Certification Authority.
        </p>
        <p style={{ fontSize: 12, color: '#666', fontStyle: 'italic', marginBottom: 24 }}>
          "{cert.description}"
        </p>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)' }}/>
          <span style={{ color: '#C9A84C', fontSize: 10 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)' }}/>
        </div>

        {/* Signature row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', marginBottom: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <Signature />
            <div style={{ borderTop: '1px solid #555', paddingTop: 4, fontSize: 10, color: '#555', letterSpacing: '0.05em' }}>
              CHIEF SYNERGY OFFICER
            </div>
            <div style={{ fontSize: 9, color: '#888' }}>LinkedOut Corp.</div>
          </div>

          {/* Gold seal */}
          <div style={{ marginRight: -8, marginBottom: -8 }}>
            <GoldSeal />
          </div>
        </div>

        {/* Footer meta */}
        <div style={{ fontSize: 9, color: '#aaa', letterSpacing: '0.08em', marginTop: 8 }}>
          ISSUED: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
          {'  ·  '}CREDENTIAL ID: {credId.current}
          {'  ·  '}DOES NOT EXPIRE
        </div>
      </div>
      </div>{/* end relative wrapper */}

      {/* Action buttons — hidden when printing */}
      <div className="mt-4 no-print">
        <div className="flex gap-2 items-center">
          <button
            onClick={downloadCert}
            disabled={downloading}
            className="flex-1 bg-[#C9A84C] hover:bg-[#b8941f] text-white py-2 px-4 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
          >
            {downloading ? '⏳ Capturing…' : '⬇️ Download Certificate'}
          </button>
          <RegenButton onClick={onRegenerate} spinning={regenerating} />
          <LinkedInShareButton
            text={`I am proud to share that I have earned the ${cert.name} ${cert.badge} certification!\n\n${cert.description}\n\nIssued by LinkedOut Certification Authority · ${new Date().getFullYear()}\n\n#Certified #ProfessionalDevelopment #NeverStopLearning #GrowthMindset`}
            label="Share to LinkedIn™"
          />
        </div>
      </div>
    </div>
  )
}

export default function Certifications() {
  const [task, setTask] = useState('')
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState('')

  async function callCertApi(taskText, { regen = false } = {}) {
    if (!taskText.trim()) return
    if (regen) {
      setRegenerating(true)
    } else {
      setLoading(true)
      setCert(null)
    }
    setError('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `The user completed this mundane task: "${taskText}"

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
      const raw = data.choices[0].message.content.trim()
      const parsed = JSON.parse(raw)
      setCert(parsed)
    } catch (e) {
      setError(e.message.includes('JSON') ? 'Failed to parse response. Try again.' : e.message)
    } finally {
      setLoading(false)
      setRegenerating(false)
    }
  }

  function generateCert() { callCertApi(task) }
  function regenerateCert() { callCertApi(task, { regen: true }) }

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

        {cert && <CertCard cert={cert} task={task} onRegenerate={regenerateCert} regenerating={regenerating} />}
      </div>

      <div className="mt-4 bg-yellow-50 rounded-xl border border-yellow-100 p-4">
        <p className="text-xs text-yellow-700 font-medium">
          📜 LinkedOut has issued 0 certifications recognized by any real institution. All credentials carry the same weight as every other LinkedIn certification.
        </p>
      </div>
    </div>
  )
}
