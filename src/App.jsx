import { useState, useEffect } from 'react'
import Hero3D from './components/Hero3D.jsx'
import Features from './components/Features.jsx'
import FeaturesPage from './components/FeaturesPage.jsx'
import Recorder from './components/Recorder.jsx'
import Editor from './components/Editor.jsx'
import Gallery from './components/Gallery.jsx'
import AboutPage from './components/AboutPage.jsx'
import { Moon, Sun, History, Menu, X } from 'lucide-react'

export default function App() {
  const [view, setView] = useState('home')
  const [editBlob, setEditBlob] = useState(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ows-dark') === 'true')
  const [recordings, setRecordings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ows-recordings') || '[]') }
    catch { return [] }
  })
  const [mobileNav, setMobileNav] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('ows-toured'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('ows-dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('ows-recordings', JSON.stringify(recordings.map(r => ({ ...r, blob: null }))))
  }, [recordings])

  function navigate(to) {
    setView(to)
    setMobileNav(false)
    setEditBlob(null)
  }

  function handleRecording(data) {
    setRecordings(prev => {
      const next = [...prev, data]
      localStorage.setItem('ows-recordings', JSON.stringify(next.map(r => ({ ...r, blob: null }))))
      return next
    })
  }

  function clearHistory() { setRecordings([]) }
  function dismissOnboarding() {
    setShowOnboarding(false)
    localStorage.setItem('ows-toured', 'true')
  }

  const isHome = view === 'home'
  const showBackBtn = !isHome

  const navLinks = (
    <>
      <a href="#" className={isHome ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate('home') }}>Home</a>
      <a href="#" className={view === 'features' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate('features') }}>Features</a>
      <a href="#" className={view === 'studio' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate('studio') }}>Studio</a>
      <a href="#" className={view === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate('about') }}>About</a>
    </>
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
        <div className="brand" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <span className="brand-dot" />
          OpenWebScreen
        </div>

        <div className="nav-links">
          {navLinks}
        </div>

        <div className="nav-right">
          {showBackBtn && (
            <button className="nav-icon-btn studio-btn" onClick={() => navigate('studio')} title="Go to Studio">
              <History size={16} />
            </button>
          )}
          <button className="nav-icon-btn" onClick={() => setDarkMode(d => !d)} title="Toggle Dark Mode">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMobileNav(m => !m)} title="Menu">
            {mobileNav ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {mobileNav && (
        <div className="mobile-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); setMobileNav(false) }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('features'); setMobileNav(false) }}>Features</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('studio'); setMobileNav(false) }}>Studio</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('about'); setMobileNav(false) }}>About</a>
          <hr />
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('privacy'); setMobileNav(false) }}>Privacy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('terms'); setMobileNav(false) }}>Terms</a>
        </div>
      )}

      {view === 'home' && (
        <>
          <div className="hero">
            <Hero3D onLaunch={() => navigate('studio')} />
          </div>
          <Features />
          <footer className="footer">
            <p>OpenWebScreen — built with React · runs 100% in your browser · no data ever leaves your device</p>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('about') }}>About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('features') }}>Features</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('privacy') }}>Privacy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('terms') }}>Terms</a>
            </div>
          </footer>
        </>
      )}

      {view === 'features' && <FeaturesPage />}
      {view === 'about' && <AboutPage />}

      {view === 'studio' && (
        <Recorder
          onEdit={(blob) => { setEditBlob(blob); setView('editor') }}
          onRecordingComplete={handleRecording}
        />
      )}

      {view === 'editor' && editBlob && (
        <Editor blob={editBlob} onBack={() => navigate('studio')} />
      )}

      {view === 'gallery' && (
        <div className="recorder-page">
          <div className="recorder-head">
            <h1>Recording History</h1>
            <button className="nav-cta" onClick={() => navigate('studio')}>← Back to Studio</button>
          </div>
          <Gallery recordings={recordings} onClear={clearHistory} />
        </div>
      )}

      {view === 'privacy' && (
        <div className="recorder-page">
          <div className="recorder-head">
            <h1>Privacy Policy</h1>
            <button className="nav-cta" onClick={() => navigate('home')}>← Home</button>
          </div>
          <div className="legal-page">
            <div className="legal-card">
              <h3>Privacy Policy</h3>
              <span className="legal-updated">Last updated: July 2026</span>
              <p><strong>OpenWebScreen does not collect, store, or transmit any personal data.</strong></p>
              <p>All screen recording, audio processing, and video compositing happens entirely in your browser using client-side JavaScript. No data is ever sent to a server, third-party service, or cloud storage.</p>
              <p>When you share your screen, the video stream is processed locally on your machine. The final recording exists only as a blob in your browser's memory until you choose to download it. Downloading saves the file to your device — no copy is retained by us.</p>
              <p>We use no cookies, analytics, tracking pixels, or fingerprinting of any kind. Your privacy is not a feature — it is the foundation of this project.</p>
            </div>
          </div>
        </div>
      )}

      {view === 'terms' && (
        <div className="recorder-page">
          <div className="recorder-head">
            <h1>Terms of Service</h1>
            <button className="nav-cta" onClick={() => navigate('home')}>← Home</button>
          </div>
          <div className="legal-page">
            <div className="legal-card">
              <h3>Terms of Service</h3>
              <span className="legal-updated">Last updated: July 2026</span>
              <p>OpenWebScreen is provided "as is" without warranty of any kind, either express or implied. Use at your own risk.</p>
              <p>You are solely responsible for the content you record using this tool. Do not use OpenWebScreen to record copyrighted material, private communications, or malicious content without proper authorization.</p>
              <p>This project is open-source under the MIT license. You are free to use, modify, distribute, and self-host the software for any purpose, subject to the terms of that license.</p>
              <p>No guarantees are made regarding uptime, functionality, or fitness for a particular purpose. This is a community project, not a commercial service.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
