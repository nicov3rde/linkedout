export default function Nav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'jargon', label: '🎙️ Jargon-ifier' },
    { id: 'headshot', label: '📸 Headshot Generator' },
    { id: 'certs', label: '🏆 Certifications' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0a66c2] rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <span className="font-bold text-xl text-[#0a66c2] tracking-tight">
              LinkedOut
            </span>
            <span className="text-xs text-gray-400 font-normal ml-1 hidden sm:block">
              — the professional parody
            </span>
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
