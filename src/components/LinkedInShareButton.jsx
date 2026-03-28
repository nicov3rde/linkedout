import { useState } from 'react'

const LI_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

const SYSTEM_PROMPT = `You are a parody LinkedIn post generator. You write satirical, cringe-worthy LinkedIn posts that skewer the platform's most insufferable tropes.

STRICT FORMATTING RULES — follow exactly:
- Each sentence or distinct thought goes on its own line
- Leave a blank line between paragraphs (2+ line breaks)
- Hashtags go on their own line at the very end, after a blank line
- Never use em dashes (—) under any circumstances. Use a comma, period, or new line instead
- Vary sentence length: mix short punchy sentences with longer ones. Not every sentence should be the same rhythm
- Maximum 2-3 emojis per post, placed where they feel natural, not sprinkled randomly
- No quotation marks around the post itself

You will always return exactly 3 variants as a JSON object with this structure:
{
  "humbleBrag": "<post text>",
  "thoughtLeader": "<post text>",
  "motivational": "<post text>"
}

VARIANT PERSONALITIES — each must feel completely distinct:

humbleBrag: Grateful, reflective, slightly self-deprecating but clearly very proud. References personal growth, gratitude, and how far they've come. Feels like they're downplaying it but aren't. 1-2 emojis that feel sincere.

thoughtLeader: Dead serious. Big claims. Fake-but-specific metrics ("47% improvement", "3x faster"). Speaks as if sharing proprietary industry wisdom. No emojis. Very authoritative tone. Short declarative sentences mixed with dense insight sentences.

motivational: Speaks directly to the audience ("You can do this", "Don't wait"). Builds to a call to action at the end. Inspirational but hollow. 1-2 emojis. Ends with an energizing question or imperative.

Return ONLY the raw JSON object. No markdown, no explanation, no code fences.`

const CONTEXT_PROMPTS = {
  jargon: ({ transcript, jargonified, toneLabel, intensityLabel }) =>
    `Context: The user just used a parody AI "Jargon-ifier" tool. Tone setting: "${toneLabel}" at "${intensityLabel}" intensity. Their original plain-English text was: "${transcript}". The tool transformed it into: "${jargonified}". Write 3 LinkedIn post variants where they announce they are leveling up their professional communication with AI.`,

  cert: ({ task, name, description, badge }) =>
    `Context: The user just received the "${name}" ${badge} certification from the "LinkedOut Certification Authority" for completing this mundane task: "${task}". Official certification description: "${description}". Write 3 LinkedIn post variants where they treat this trivial accomplishment as a transformative career milestone.`,

  headshot: ({ description }) =>
    `Context: The user uploaded a photo of the following subject: "${description}". An AI (DALL-E 3) then generated a photorealistic professional LinkedIn headshot portrait of that subject in a navy business suit with studio lighting. Write 3 LinkedIn post variants where they proudly announce their "new headshot era" and "personal brand evolution" — completely unaware of (or unbothered by) how absurd it is that an AI rebuilt their appearance from scratch.`,
}

const VARIANT_TABS = [
  { key: 'humbleBrag', label: '🙏 Humble Brag' },
  { key: 'thoughtLeader', label: '📊 Thought Leader' },
  { key: 'motivational', label: '🔥 Motivational' },
]

export default function LinkedInShareButton({ type, data, label = 'Share to LinkedIn' }) {
  const [open, setOpen] = useState(false)
  const [posts, setPosts] = useState(null)
  const [activeVariant, setActiveVariant] = useState('humbleBrag')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setOpen(true)
    setLoading(true)
    setError('')
    setPosts(null)
    setActiveVariant('humbleBrag')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 1200,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: CONTEXT_PROMPTS[type](data) },
          ],
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `API error ${res.status}`)
      }

      const result = await res.json()
      const raw = result.choices[0].message.content.trim()
      const parsed = JSON.parse(raw)
      if (!parsed.humbleBrag || !parsed.thoughtLeader || !parsed.motivational) {
        throw new Error('Unexpected response format. Try again.')
      }
      setPosts(parsed)
    } catch (e) {
      setError(e.message.includes('JSON') ? 'Failed to parse response. Try again.' : e.message)
    } finally {
      setLoading(false)
    }
  }

  function updatePost(text) {
    setPosts(prev => ({ ...prev, [activeVariant]: text }))
  }

  function shareToLinkedIn() {
    const text = posts[activeVariant]
    const url = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(posts[activeVariant])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function close() {
    setOpen(false)
    setCopied(false)
  }

  const activePost = posts?.[activeVariant] ?? ''

  return (
    <>
      <button
        onClick={generate}
        className="flex items-center justify-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer no-print"
      >
        {LI_ICON}
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a66c2] to-[#004182] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold">
                {LI_ICON}
                Share to LinkedIn™
              </div>
              <button
                onClick={close}
                className="text-blue-200 hover:text-white text-xl leading-none cursor-pointer transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center gap-3 py-10 text-gray-500">
                  <div className="w-8 h-8 border-[3px] border-[#0a66c2] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Generating 3 post options…</p>
                </div>
              ) : error ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                  <button
                    onClick={generate}
                    className="w-full bg-[#0a66c2] text-white py-2 rounded-full text-sm font-semibold hover:bg-[#004182] cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              ) : posts ? (
                <>
                  {/* Variant tabs */}
                  <div className="flex gap-1.5 mb-4 bg-gray-100 p-1 rounded-xl">
                    {VARIANT_TABS.map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => { setActiveVariant(tab.key); setCopied(false) }}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          activeVariant === tab.key
                            ? 'bg-white text-[#0a66c2] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Editable post */}
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                    Preview &amp; Edit
                  </p>
                  <textarea
                    key={activeVariant}
                    value={activePost}
                    onChange={e => updatePost(e.target.value)}
                    rows={9}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none focus:border-[#0a66c2] resize-none"
                  />
                  <div className="flex items-center justify-between mt-1 mb-4">
                    <span className="text-xs text-gray-400 italic">Edit freely before posting</span>
                    <span className={`text-xs font-medium ${activePost.length > 3000 ? 'text-red-500' : 'text-gray-400'}`}>
                      {activePost.length} / 3000
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={shareToLinkedIn}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer"
                    >
                      {LI_ICON}
                      Open LinkedIn
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 px-5 rounded-full text-sm font-semibold transition-colors cursor-pointer min-w-[100px]"
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-300 text-center mt-3">
                    LinkedOut is not affiliated with LinkedIn. This post is satirical.
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
