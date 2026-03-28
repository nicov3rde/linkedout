import { useState } from 'react'
import Nav from './components/Nav'
import Jargonifier from './components/Jargonifier'
import HeadshotGenerator from './components/HeadshotGenerator'
import Certifications from './components/Certifications'
import Login from './components/Login'

export default function App() {
  const [activeTab, setActiveTab] = useState('jargon')
  const [user, setUser] = useState(null)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-[#004182] to-[#0a66c2] text-white py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name}</h1>
        <p className="text-blue-200 text-sm">
          {user.title ? user.title : "Helping professionals sound like they're doing more than they are since 2026."}
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'jargon' && <Jargonifier />}
        {activeTab === 'headshot' && <HeadshotGenerator />}
        {activeTab === 'certs' && <Certifications />}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-200 bg-white mt-8">
        LinkedOut™ · Not affiliated with LinkedIn · © 2026 · All buzzwords reserved
      </footer>
    </div>
  )
}
