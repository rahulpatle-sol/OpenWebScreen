import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Download, ArrowLeft, Scissors } from 'lucide-react'

export default function Editor({ blob, onBack }) {
  const videoRef = useRef(null)
  const [url, setUrl] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)

  useEffect(() => {
    const u = URL.createObjectURL(blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [blob])

  function onLoaded() {
    const v = videoRef.current
    if (!v) return
    setDuration(v.duration)
    setTrimEnd(v.duration)
  }

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  function handleSeek(e) {
    const v = videoRef.current
    if (!v) return
    v.currentTime = +e.target.value
    setCurrentTime(v.currentTime)
  }

  function handleTrimStart(e) {
    const val = +e.target.value
    setTrimStart(val)
    if (videoRef.current) videoRef.current.currentTime = val
  }

  function handleTrimEnd(e) {
    const val = +e.target.value
    setTrimEnd(val)
    if (videoRef.current) videoRef.current.currentTime = val
  }

  function fmt(t) {
    const m = String(Math.floor(t / 60)).padStart(2, '0')
    const s = String(Math.floor(t % 60)).padStart(2, '0')
    return `${m}:${s}`
  }

  function downloadOriginal() {
    const a = document.createElement('a')
    a.href = url
    a.download = `recording-${Date.now()}.webm`
    a.click()
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="recorder-page">
      <div className="recorder-head">
        <h1>Edit Recording</h1>
        <button className="nav-cta" onClick={onBack}>← Back to Studio</button>
      </div>

      <div className="studio">
        <div className="studio-stage" style={{ cursor: 'pointer' }} onClick={togglePlay}>
          {url && (
            <video
              ref={videoRef}
              src={url}
              onLoadedMetadata={onLoaded}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onEnded={() => setPlaying(false)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              controls={false}
            />
          )}
          {!playing && (
            <div className="stage-empty" style={{ position: 'absolute', inset: 0 }}>
              <div className="ring"><Play size={26} strokeWidth={1.5} fill="rgba(255,255,255,0.4)" /></div>
            </div>
          )}
        </div>

        <div className="controls-bar" style={{ flexDirection: 'column', gap: 12 }}>
          <input
            className="slider"
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={currentTime}
            onChange={handleSeek}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 13, color: 'var(--ink-soft)', fontVariantNumeric: 'tabular-nums' }}>
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="controls-bar" style={{ justifyContent: 'center', gap: 12 }}>
          <button className="icon-btn" onClick={togglePlay} title="Play/Pause">
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="download-btn" onClick={downloadOriginal}>
            <Download size={15} /> Download Full
          </button>
        </div>

        <div className="settings-panel">
          <div className="setting-group">
            <label>Trim Start: {fmt(trimStart)}</label>
            <input className="slider" type="range" min="0" max={duration || 0} step="0.01"
              value={trimStart} onChange={handleTrimStart} />
          </div>
          <div className="setting-group">
            <label>Trim End: {fmt(trimEnd)}</label>
            <input className="slider" type="range" min="0" max={duration || 0} step="0.01"
              value={trimEnd} onChange={handleTrimEnd} />
          </div>
        </div>
      </div>

      <div className="hint-row">
        <span className="hint">Click video to play/pause</span>
        <span className="hint">Drag trim markers to cut start/end</span>
      </div>
    </div>
  )
}
