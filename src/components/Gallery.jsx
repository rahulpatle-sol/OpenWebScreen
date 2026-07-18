import { useRef, useEffect, useState } from 'react'
import { Download, Trash2, Film, Play, ExternalLink } from 'lucide-react'

function fmtSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

function fmtDate(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function fmtDuration(blob) {
  return new Promise((resolve) => {
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.onloadedmetadata = () => {
      const s = Math.floor(v.duration)
      const m = String(Math.floor(s / 60)).padStart(2, '0')
      const sec = String(s % 60).padStart(2, '0')
      resolve(`${m}:${sec}`)
    }
    v.onerror = () => resolve('--:--')
    v.src = URL.createObjectURL(blob)
  })
}

function GalleryCard({ blob, size, format, date }) {
  const [duration, setDuration] = useState('--:--')
  const [playing, setPlaying] = useState(false)
  const vidRef = useRef(null)
  const url = URL.createObjectURL(blob)

  useEffect(() => { fmtDuration(blob).then(setDuration) }, [blob])

  function togglePlay(e) {
    e.stopPropagation()
    const v = vidRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  return (
    <div className="gallery-card" onMouseLeave={() => { vidRef.current?.pause(); setPlaying(false) }}>
      <div className="gallery-thumb-wrap" onClick={togglePlay}>
        <video ref={vidRef} src={url} className="gallery-thumb" muted loop playsInline preload="metadata" />
        {!playing && (
          <div className="gallery-play-overlay">
            <Play size={20} fill="white" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="gallery-info">
        <span className="gallery-size"><strong>{duration}</strong> · {fmtSize(size)}</span>
        <span className="gallery-date">{fmtDate(date)}</span>
      </div>
      <div className="gallery-meta">
        <span className="gallery-badge">{format?.toUpperCase() || 'WEBM'}</span>
      </div>
      <div className="gallery-actions">
        <a className="gallery-btn" href={url} download={`recording-${date}.${format || 'webm'}`} title="Download">
          <Download size={14} />
        </a>
      </div>
    </div>
  )
}

export default function Gallery({ recordings, onClear }) {
  if (!recordings || recordings.length === 0) {
    return (
      <div className="gallery-empty">
        <div className="gallery-empty-icon"><Film size={32} strokeWidth={1.2} /></div>
        <p>Your recordings will appear here</p>
        <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Record your first screen capture to get started</span>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="gallery-head">
        <h2>Collection ({recordings.length})</h2>
        <button className="btn-ghost" onClick={onClear} style={{ fontSize: 13, padding: '8px 14px' }}>
          <Trash2 size={13} /> Clear All
        </button>
      </div>
      <div className="gallery-grid">
        {[...recordings].reverse().map((r, i) => (
          <GalleryCard key={r.date + '-' + i} {...r} />
        ))}
      </div>
    </div>
  )
}
