export default function Nav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'jargon', label: '🎙️ Jargon-ifier' },
    { id: 'headshot', label: '📸 Headshot Generator' },
    { id: 'certs', label: '🏆 Certifications' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-18 py-2">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div style={{
              width: 52, height: 52, borderRadius: 10,
              background: '#0A66C2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                color: '#fff', fontFamily: 'Inter, sans-serif',
                fontSize: 24, fontWeight: 900, lineHeight: 1,
              }}>
                out
              </span>
            </div>
            {/* Wordmark + tagline */}
            <div className="flex flex-col justify-center">
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
                <span className="text-gray-900">Linked</span>
                <span style={{ color: '#0A66C2' }}>Out</span>
              </span>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af',
                lineHeight: 1, marginTop: 3,
              }}>
                confidence through semantics
              </span>
            </div>
          </div>
          <nav className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0a66c2] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
