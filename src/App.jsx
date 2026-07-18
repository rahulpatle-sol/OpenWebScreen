import { useState } from 'react'
import Hero3D from './components/Hero3D.jsx'
import Features from './components/Features.jsx'
import Recorder from './components/Recorder.jsx'
import Editor from './components/Editor.jsx'

export default function App() {
  const [view, setView] = useState('home')
  const [editBlob, setEditBlob] = useState(null)

  return (
    <div className="app">
      <div className="mesh-bg" />
      <div className="grain" />

      <nav className="nav">
        <div className="brand">
          <span className="brand-dot" />
          Lumen
        </div>
        {view === 'home' ? (
          <>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setView('studio') }}>Studio</a>
            </div>
            <button className="nav-cta" onClick={() => setView('studio')}>Start Recording</button>
          </>
        ) : (
          <button className="nav-cta" onClick={() => { setView('home'); setEditBlob(null) }}>← Home</button>
        )}
      </nav>

      {view === 'home' && (
        <>
          <div className="hero">
            <Hero3D onLaunch={() => setView('studio')} />
          </div>
          <Features />
          <footer className="footer">
            Lumen — built with React · runs 100% in your browser · no data ever leaves your device
          </footer>
        </>
      )}

      {view === 'studio' && (
        <Recorder
          onEdit={(blob) => { setEditBlob(blob); setView('editor') }}
        />
      )}

      {view === 'editor' && editBlob && (
        <Editor blob={editBlob} onBack={() => setView('studio')} />
      )}
    </div>
  )
}
