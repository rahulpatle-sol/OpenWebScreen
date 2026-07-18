import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Moon, Sun, Menu, X } from 'lucide-react'

// Components
import Hero3D from './components/Hero3D.jsx'
import Features from './components/Features.jsx'
import FeaturesPage from './components/FeaturesPage.jsx'
import Recorder from './components/Recorder.jsx'
import Editor from './components/Editor.jsx'
import Gallery from './components/Gallery.jsx'
import AboutPage from './components/AboutPage.jsx'
import ThreeBackground from './components/ThreeBackground.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [view, setView] = useState('home')
  const [editBlob, setEditBlob] = useState(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ows-dark') === 'true')
  const [mobileNav, setMobileNav] = useState(false)
  const [recordings, setRecordings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ows-recordings') || '[]') }
    catch { return [] }
  })
  
  const lenisRef = useRef(null)

  // 1. Optimized Smooth Scroll
  useEffect(() => {
    if (view !== 'home') return
    
    lenisRef.current = new Lenis({ duration: 1.2, smoothWheel: true })
    
    function raf(time) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }
    const rAfId = requestAnimationFrame(raf)
    
    return () => {
      cancelAnimationFrame(rAfId)
      lenisRef.current?.destroy()
    }
  }, [view])

  // 2. State & Dark Mode Sync
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('ows-dark', darkMode)
    localStorage.setItem('ows-recordings', JSON.stringify(recordings.map(r => ({ ...r, blob: null }))))
  }, [darkMode, recordings])

  // 3. Navigation with Polish
  const navigate = (to) => {
    setMobileNav(false)
    setView(to)
    setEditBlob(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="mesh-bg" />
      {view === 'home' && <ThreeBackground />}

      {/* Persistent Navigation */}
      <nav className={`nav ${mobileNav ? 'nav-open' : ''}`}>
        <div className="brand" onClick={() => navigate('home')}>OpenWebScreen</div>

        <div className="nav-links">
          {['home', 'features', 'studio', 'gallery', 'about'].map(item => (
            <button key={item} className={view === item ? 'active' : ''} onClick={() => navigate(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="mobile-menu-btn" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileNav && (
          <div className="mobile-nav">
            {['home', 'features', 'studio', 'gallery', 'about'].map(item => (
              <button key={item} className={view === item ? 'active' : ''} onClick={() => navigate(item)}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
            <hr />
            <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />} {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Router */}
      <main className="content-wrapper">
        {view === 'home' && (
          <>
            <Hero3D onLaunch={() => navigate('studio')} />
            <Features />
          </>
        )}
        {view === 'features' && <FeaturesPage />}
        {view === 'studio' && (
          <Recorder 
            onEdit={(b) => { setEditBlob(b); setView('editor') }} 
            onRecordingComplete={(d) => setRecordings(prev => [...prev, d])} 
          />
        )}
        {view === 'editor' && <Editor blob={editBlob} onBack={() => navigate('studio')} />}
        {view === 'gallery' && <Gallery recordings={recordings} onClear={() => setRecordings([])} />}
        {view === 'about' && <AboutPage />}
      </main>
    </div>
  )
}