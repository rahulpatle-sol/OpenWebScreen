const FEATURES = [
  { icon: '🎯', title: 'Auto-Zoom on Clicks', desc: 'Detects meaningful clicks and smoothly zooms into that region — not every click, just the ones that matter.' },
  { icon: '🖱️', title: 'Bézier Cursor Smoothing', desc: 'Raw cursor jitter gets replaced with cubic-Bézier interpolated motion, frame by frame, in real time.' },
  { icon: '🌫️', title: 'Motion Blur', desc: 'Directional blur applied during fast pans and zooms for a cinematic, non-jarring feel.' },
  { icon: '🎥', title: 'Webcam Overlay', desc: 'Drag-to-position picture-in-picture webcam bubble, resizable, with mirror toggle.' },
  { icon: '🖼️', title: 'Custom Backgrounds', desc: 'Gradient, solid, or wallpaper backdrops with adjustable padding and corner radius.' },
  { icon: '✂️', title: 'Trim & Speed Control', desc: 'Cut dead air from the start/end and scrub through your recording before exporting.' },
  { icon: '🎨', title: 'Annotation Tools', desc: 'Arrows, text callouts, and highlight boxes drawn directly onto the canvas.' },
  { icon: '⌨️', title: 'Keyboard Shortcuts', desc: 'Space to start/stop, Z to toggle zoom, B for blur — fully keyboard-driven workflow.' },
  { icon: '⬇️', title: 'Instant Local Export', desc: 'WebM/MP4 export straight to your downloads folder. Nothing ever touches a server.' },
]

import PixelHover from './PixelHover.jsx'

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="section-head">
        <div className="section-tag">Everything, included</div>
        <h2>All the polish, none of the price tag</h2>
        <p>Every feature runs client-side using native browser APIs — no backend, no watermark, no subscription.</p>
      </div>
      <div className="grid">
        {FEATURES.map((f) => (
          <PixelHover key={f.title} className="card">
            <div className="card-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </PixelHover>
        ))}
      </div>
    </section>
  )
}
