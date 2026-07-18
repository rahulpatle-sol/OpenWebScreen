import { Zap, MousePointer2, Waves, Camera, Image, Scissors, Pen, Keyboard, Download } from 'lucide-react'
import PixelHover from './PixelHover.jsx'

const FEATURES = [
  { icon: Zap, title: 'Auto-Zoom on Clicks', desc: 'Detects meaningful clicks and smoothly zooms into that region — not every click, just the ones that matter.' },
  { icon: MousePointer2, title: 'Bézier Cursor Smoothing', desc: 'Raw cursor jitter gets replaced with cubic-Bézier interpolated motion, frame by frame, in real time.' },
  { icon: Waves, title: 'Motion Blur', desc: 'Directional blur applied during fast pans and zooms for a cinematic, non-jarring feel.' },
  { icon: Camera, title: 'Webcam Overlay', desc: 'Drag-to-position picture-in-picture webcam bubble, resizable, with mirror toggle.' },
  { icon: Image, title: 'Custom Backgrounds', desc: 'Gradient, solid, or wallpaper backdrops with adjustable padding and corner radius.' },
  { icon: Scissors, title: 'Trim & Speed Control', desc: 'Cut dead air from the start/end and scrub through your recording before exporting.' },
  { icon: Pen, title: 'Annotation Tools', desc: 'Arrows, text callouts, and highlight boxes drawn directly onto the canvas.' },
  { icon: Keyboard, title: 'Keyboard Shortcuts', desc: 'Space to start/stop, Z to toggle zoom, B for blur — fully keyboard-driven workflow.' },
  { icon: Download, title: 'Instant Local Export', desc: 'WebM/MP4 export straight to your downloads folder. Nothing ever touches a server.' },
]

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="section-head">
        <div className="section-tag">Everything, included</div>
        <h2>All the polish, none of the price tag</h2>
        <p>Every feature runs client-side using native browser APIs — no backend, no watermark, no subscription.</p>
      </div>
      <div className="grid">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <PixelHover key={f.title} className="card">
              <div className="card-icon"><Icon size={20} strokeWidth={1.5} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </PixelHover>
          )
        })}
      </div>
    </section>
  )
}
