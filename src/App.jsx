import { useState, useEffect } from 'react'
import Hero3D from './components/Hero3D.jsx'
import Features from './components/Features.jsx'
import Recorder from './components/Recorder.jsx'
import Editor from './components/Editor.jsx'
import Gallery from './components/Gallery.jsx'
import { Moon, Sun, History } from 'lucide-react'

export default function App() {
  const [view, setView] = useState('home')
  const [editBlob, setEditBlob] = useState(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ows-dark') === 'true')
  const [recordings, setRecordings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ows-recordings') || '[]') }
    catch { return [] }
  })
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('ows-toured'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('ows-dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('ows-recordings', JSON.stringify(recordings.map(r => ({ ...r, blob: null }))))
  }, [recordings])

  function handleRecording(data) {
    setRecordings(prev => {
      const next = [...prev, data]
      localStorage.setItem('ows-recordings', JSON.stringify(next.map(r => ({ ...r, blob: null }))))
      return next
    })
  }

  function clearHistory() {
    setRecordings([])
  }

  function dismissOnboarding() {
    setShowOnboarding(false)
    localStorage.setItem('ows-toured', 'true')
  }

  const navRight = view === 'home' ? (
    <>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setView('studio') }}>Studio</a>
      </div>
      <button className="nav-cta" onClick={() => setView('studio')}>Start Recording</button>
    </>
  ) : (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      {view === 'studio' && (
        <button className="nav-icon-btn" onClick={() => setView('gallery')} title="Recording History">
          <History size={17} />
        </button>
      )}
      <button className="nav-cta" onClick={() => { setView('home'); setEditBlob(null) }}>← Home</button>
    </div>
  )

  return (
    <div className="app">
      <div className="mesh-bg" />
      <div className="grain" />

      {showOnboarding && (
        <div className="onboarding-overlay" onClick={dismissOnboarding}>
          <div className="onboarding-card" onClick={e => e.stopPropagation()}>
            <h2>Welcome to OpenWebScreen 🎥</h2>
            <ul>
              <li><strong>Share Screen</strong> — pick a window or tab</li>
              <li><strong>Record</strong> — auto-zoom follows your cursor</li>
              <li><strong>P</strong> to pause, <strong>Z</strong> for zoom, <strong>B</strong> for blur</li>
              <li><strong>Edit</strong> — trim start/end after recording</li>
              <li>100% local — nothing ever leaves your device</li>
            </ul>
            <button className="btn-primary" onClick={dismissOnboarding} style={{ marginTop: 20, width: '100%' }}>
              Got it!
            </button>
          </div>
        </div>
      )}

      <nav className="nav">
        <div className="brand">
          <span className="brand-dot" />
          OpenWebScreen
        </div>
        {navRight}
        <button className="nav-icon-btn" onClick={() => setDarkMode(d => !d)} title="Toggle Dark Mode" style={{ marginLeft: view === 'home' ? 16 : 0 }}>
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </nav>

      {view === 'home' && (
        <>
          <div className="hero">
            <Hero3D onLaunch={() => setView('studio')} />
          </div>
          <Features />
          <footer className="footer">
            <p>OpenWebScreen — built with React · runs 100% in your browser · no data ever leaves your device</p>
            <div style={{ marginTop: 8, display: 'flex', gap: 16, justifyContent: 'center', fontSize: 13 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setView('privacy') }}>Privacy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setView('terms') }}>Terms</a>
            </div>
          </footer>
        </>
      )}

      {view === 'studio' && (
        <Recorder
          onEdit={(blob) => { setEditBlob(blob); setView('editor') }}
          onRecordingComplete={handleRecording}
        />
      )}

      {view === 'editor' && editBlob && (
        <Editor blob={editBlob} onBack={() => setView('studio')} />
      )}

      {view === 'gallery' && (
        <div className="recorder-page">
          <div className="recorder-head">
            <h1>Recording History</h1>
            <button className="nav-cta" onClick={() => setView('studio')}>← Back to Studio</button>
          </div>
          <Gallery recordings={recordings} onClear={clearHistory} />
        </div>
      )}

      {view === 'privacy' && (
        <div className="recorder-page">
          <div className="recorder-head">
            <h1>Privacy Policy</h1>
            <button className="nav-cta" onClick={() => setView('home')}>← Home</button>
          </div>
          <div className="legal-text">
            <p><strong>OpenWebScreen does not collect, store, or transmit any data.</strong></p>
            <p>All screen recording, audio processing, and video compositing happens entirely in your browser using client-side JavaScript. No data is ever sent to a server, third-party service, or cloud storage.</p>
            <p>When you share your screen, the video stream is processed locally on your machine. The final recording exists only as a blob in your browser's memory until you choose to download it. Downloading saves the file to your device — no copy is retained by us.</p>
            <p>We use no cookies, analytics, tracking pixels, or fingerprinting of any kind.</p>
          </div>
        </div>
      )}

      {view === 'terms' && (
        <div className="recorder-page">
          <div className="recorder-head">
            <h1>Terms of Service</h1>
            <button className="nav-cta" onClick={() => setView('home')}>← Home</button>
          </div>
          <div className="legal-text">
            <p>OpenWebScreen is provided as-is, without warranty of any kind. Use at your own risk.</p>
            <p>You are solely responsible for the content you record. Do not use this tool to record copyrighted, private, or malicious content without proper authorization.</p>
            <p>This project is open-source under the MIT license. You may fork, modify, and distribute it freely.</p>
          </div>
        </div>
      )}
    </div>
  )
}
