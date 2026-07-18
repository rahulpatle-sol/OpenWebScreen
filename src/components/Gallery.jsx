import { Download, Trash2, Film } from 'lucide-react'

function fmtSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

function fmtDate(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Gallery({ recordings, onClear }) {
  if (!recordings || recordings.length === 0) {
    return (
      <div className="gallery-empty">
        <Film size={24} strokeWidth={1.2} />
        <p>No recordings yet</p>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="gallery-head">
        <h2>Recording History ({recordings.length})</h2>
        <button className="btn-ghost" onClick={onClear} style={{ fontSize: 13, padding: '8px 14px' }}>
          <Trash2 size={13} /> Clear All
        </button>
      </div>
      <div className="gallery-grid">
        {[...recordings].reverse().map((r, i) => {
          const url = URL.createObjectURL(r.blob)
          return (
            <div className="gallery-card" key={r.date + '-' + i}>
              <video src={url} className="gallery-thumb" muted preload="metadata" />
              <div className="gallery-info">
                <span className="gallery-size">{fmtSize(r.size)} · {r.format?.toUpperCase()}</span>
                <span className="gallery-date">{fmtDate(r.date)}</span>
              </div>
              <div className="gallery-actions">
                <a className="gallery-btn" href={url} download={`recording-${r.date}.${r.format || 'webm'}`}>
                  <Download size={14} />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
