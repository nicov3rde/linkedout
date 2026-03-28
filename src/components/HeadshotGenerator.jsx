import { useState, useRef } from 'react'
import LinkedInShareButton from './LinkedInShareButton'
import RegenButton from './RegenButton'

const IMAGE_MODELS = [
  { id: 'gpt-image-1', label: 'gpt-image-1', badge: '✦ New' },
  { id: 'dall-e-3',    label: 'DALL-E 3',    badge: null },
]

const BACKGROUNDS = [
  'exposed brick wall',
  'wooden bookshelf filled with books',
  'indoor plants and greenery',
  'modern office window with soft natural light',
]

const LOADING_STEPS = [
  'Analyzing your personal brand equity…',
  'Optimizing your personal brand…',
  'Synthesizing executive presence…',
  'Rendering thought leadership aura…',
  'Finalizing your professional destiny…',
]

export default function HeadshotGenerator() {
  const [imageSrc, setImageSrc] = useState(null)
  const [generatedSrc, setGeneratedSrc] = useState(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState('')
  const [imageModel, setImageModel] = useState('gpt-image-1')
  const fileInputRef = useRef(null)
  const stepTimerRef = useRef(null)

  function handleFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImageSrc(ev.target.result)
      setGeneratedSrc(null)
      setDescription('')
      setError('')
    }
    reader.readAsDataURL(file)
  }

  function handleInputChange(e) {
    handleFile(e.target.files?.[0])
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  function startStepCycle() {
    let step = 0
    setLoadingStep(0)
    stepTimerRef.current = setInterval(() => {
      step = (step + 1) % LOADING_STEPS.length
      setLoadingStep(step)
    }, 2800)
  }

  function stopStepCycle() {
    clearInterval(stepTimerRef.current)
  }

  async function generateHeadshot({ regen = false } = {}) {
    if (!imageSrc) return
    if (regen) {
      setRegenerating(true)
    } else {
      setLoading(true)
      setGeneratedSrc(null)
      setDescription('')
    }
    setError('')
    startStepCycle()

    try {
      // Strip the data URL prefix to get raw base64
      const base64 = imageSrc.split(',')[1]
      const mimeMatch = imageSrc.match(/^data:(image\/\w+);base64,/)
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'

      // Step 1: Vision — describe the subject
      const visionRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe the subject of this photo in vivid detail — species, physical features, coloring, expression, anything distinctive. Be specific. 2-4 sentences.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                  detail: 'low',
                },
              },
            ],
          }],
        }),
      })

      if (!visionRes.ok) {
        const err = await visionRes.json()
        throw new Error(err.error?.message || `Vision API error ${visionRes.status}`)
      }

      const visionData = await visionRes.json()
      const desc = visionData.choices[0].message.content.trim()
      setDescription(desc)

      // Step 2: generate the headshot
      const bg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
      const prompt = `A hyper-realistic professional LinkedIn headshot portrait. The subject has ${desc} Do not change the person's race, gender, age, or facial features. Dress them in a crisp navy blue business suit with a white dress shirt. Background is a natural ${bg}. Soft natural studio lighting from the left. Subject looking directly at camera with a confident slight smile. Shot on Canon 5D, 85mm lens, shallow depth of field. Photorealistic, 4K, professional photography.`

      const imgBody = imageModel === 'gpt-image-1'
        ? { model: 'gpt-image-1', prompt, size: '1024x1024', quality: 'high' }
        : { model: 'dall-e-3', prompt, n: 1, size: '1024x1024', quality: 'hd' }

      const imgRes = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imgBody),
      })

      if (!imgRes.ok) {
        const err = await imgRes.json()
        throw new Error(err.error?.message || `Image API error ${imgRes.status}`)
      }

      const imgData = await imgRes.json()
      if (imageModel === 'gpt-image-1') {
        setGeneratedSrc(`data:image/png;base64,${imgData.data[0].b64_json}`)
      } else {
        setGeneratedSrc(imgData.data[0].url)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      stopStepCycle()
      setLoading(false)
      setRegenerating(false)
    }
  }

  function reset() {
    setImageSrc(null)
    setGeneratedSrc(null)
    setDescription('')
    setError('')
    setLoading(false)
    stopStepCycle()
  }

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
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Photo uploaded — pre-generation state */}
        {imageSrc && !generatedSrc && !loading && (
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-200 aspect-square max-w-xs mx-auto mb-6">
              <img src={imageSrc} alt="Your photo" className="w-full h-full object-cover" />
            </div>

            {/* Model selector */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Image Model</p>
              <div className="flex gap-2">
                {IMAGE_MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setImageModel(m.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                      imageModel === m.id
                        ? 'border-[#0a66c2] bg-blue-50 text-[#0a66c2]'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {m.label}
                    {m.badge && (
                      <span className="text-xs bg-[#0a66c2] text-white px-1.5 py-0.5 rounded-full leading-none">
                        {m.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={generateHeadshot}
              className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer"
            >
              ✨ Generate My AI Headshot
            </button>
            <button
              onClick={reset}
              className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 cursor-pointer py-1"
            >
              ← Upload a different photo
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-10 h-10 border-[3px] border-[#0a66c2] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700">{LOADING_STEPS[loadingStep]}</p>
            <p className="text-xs text-gray-400">This takes 15-20 seconds</p>
          </div>
        )}

        {/* Before / After */}
        {imageSrc && generatedSrc && !loading && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Before */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Before
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 aspect-square">
                  <img src={imageSrc} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* After */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-[#0a66c2] uppercase tracking-wider">
                    After (LinkedIn-ready ✨)
                  </div>
                  <RegenButton
                    onClick={() => generateHeadshot({ regen: true })}
                    spinning={regenerating}
                  />
                </div>
                <div className="rounded-xl overflow-hidden border-4 border-[#0a66c2] aspect-square relative">
                  <img
                    src={generatedSrc}
                    alt="AI Headshot"
                    className={`w-full h-full object-cover transition-opacity ${regenerating ? 'opacity-40' : ''}`}
                  />
                  {regenerating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-[3px] border-[#0a66c2] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {!regenerating && (
                    <>
                      <div className="absolute bottom-2 right-2 bg-[#0a66c2] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span>✓</span> AI Enhanced
                      </div>
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        #OpenToWork
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Vision description */}
            {description && (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                  Our AI saw:
                </p>
                <p className="text-xs text-gray-600 italic leading-relaxed">"{description}"</p>
              </div>
            )}

            {/* Share + Reset */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={reset}
                className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ← Start over
              </button>
              <LinkedInShareButton
                type="headshot"
                data={{ description }}
              />
            </div>
          </>
        )}
      </div>

      {/* Tips card */}
      <div className="mt-4 bg-blue-50 rounded-xl border border-blue-100 p-4">
        <p className="text-xs text-blue-700 font-medium">
          💡 Pro Tip: DALL-E has been shown to put anyone in a business suit, including your cat, your houseplant, and this author's childhood stuffed animal.
        </p>
      </div>
    </div>
  )
}
