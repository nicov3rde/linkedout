import { useState } from 'react'

const LI_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

export default function LinkedInShareButton({ text, label = 'Share to LinkedIn' }) {
  const [open, setOpen] = useState(false)
  const [post, setPost] = useState('')
  const [copied, setCopied] = useState(false)

  function openModal() {
    setPost(text ?? '')
    setOpen(true)
  }

  function shareToLinkedIn() {
    const url = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(post)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(post)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function close() {
    setOpen(false)
    setCopied(false)
  }

  return (
    <>
      <button
        onClick={openModal}
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
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                Preview &amp; Edit Before Sharing
              </p>
              <textarea
                value={post}
                onChange={e => setPost(e.target.value)}
                rows={9}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none focus:border-[#0a66c2] resize-none"
              />
              <div className="flex items-center justify-between mt-1 mb-4">
                <span className="text-xs text-gray-400 italic">Edit freely before posting</span>
                <span className={`text-xs font-medium ${post.length > 3000 ? 'text-red-500' : 'text-gray-400'}`}>
                  {post.length} / 3000
                </span>
              </div>

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
            </div>
          </div>
        </div>
      )}
    </>
  )
}
