import { Zap, MousePointer2, Waves, Camera, Image, Scissors, Pen, Keyboard, Download } from 'lucide-react'

const ALL_FEATURES = [
  {
    icon: Zap, title: 'Auto-Zoom on Clicks',
    desc: 'Detects meaningful clicks and smoothly zooms into that region — not every click, just the ones that matter. Uses Bézier easing for buttery motion.',
    detail: 'Click anywhere on the canvas preview during recording and watch the viewport glide to that exact point. Combined with the motion blur engine, each zoom transition looks like a professional cinematographer operated the camera.',
  },
  {
    icon: MousePointer2, title: 'Bézier Cursor Smoothing',
    desc: 'Raw cursor jitter gets replaced with cubic-Bézier interpolated motion, frame by frame, in real time.',
    detail: 'No more shaky cursors in your tutorials. Every mouse movement is analyzed and re-sampled along a smooth curve, making your on-screen pointer look like it was recorded with expensive tracking hardware.',
  },
  {
    icon: Waves, title: 'Motion Blur',
    desc: 'Directional blur applied during fast pans and zooms for a cinematic, non-jarring feel.',
    detail: 'By blending a ghost trail of the previous frame with the current one, fast movements gain natural motion blur. The result: recordings that feel smooth and organic instead of stuttery.',
  },
  {
    icon: Camera, title: 'Webcam Overlay',
    desc: 'Drag-to-position picture-in-picture webcam bubble, resizable, with mirror toggle.',
    detail: 'Position your webcam feed anywhere on the canvas. The circular mask keeps it clean, and you can drag it to any corner during recording. Works seamlessly with any USB or built-in camera.',
  },
  {
    icon: Image, title: 'Custom Backgrounds',
    desc: 'Gradient, solid, or wallpaper backdrops with adjustable padding and corner radius.',
    detail: 'Pick from five preset gradients or go clean with a solid surface. Adjust the padding to give your content breathing room, and round the corners for a polished, app-like look.',
  },
  {
    icon: Scissors, title: 'Trim & Speed Control',
    desc: 'Cut dead air from the start/end and scrub through your recording before exporting.',
    detail: 'After recording, open the built-in editor to set trim in/out points. Scrub frame-by-frame with the timeline slider, then download only the segment you need.',
  },
  {
    icon: Pen, title: 'Click Ripple Effect',
    desc: 'Every click on the canvas produces a subtle white ripple that bakes into the recording.',
    detail: 'Your viewers will never wonder "where did they click?" — each mouse press generates an expanding ring that fades over 700ms. Subtle, professional, and incredibly useful for tutorials.',
  },
  {
    icon: Keyboard, title: 'Keyboard Shortcuts',
    desc: 'Space to start/stop, P to pause, Z for zoom, B for blur — fully keyboard-driven workflow.',
    detail: 'Never touch your mouse during recording. Every major action has a keyboard shortcut, and pressed keys are displayed live on the recording via the keystroke overlay.',
  },
  {
    icon: Download, title: 'Instant Local Export',
    desc: 'WebM/MP4 export straight to your downloads folder. Nothing ever touches a server.',
    detail: 'Choose between VP9 (best quality/compression), VP8 (most compatible), or MP4 (H.264). Adjust quality presets from High to Low to balance file size vs quality. One click — file is on your machine.',
  },
]

export default function FeaturesPage() {
  return (
    <div className="recorder-page">
      <div className="section-head" style={{ marginBottom: 60 }}>
        <div className="section-tag">Everything, included</div>
        <h2>No feature gates. No upsells. No limits.</h2>
        <p>Every feature listed here works today, in your browser, for free. We don\'t hold back good stuff for a paid plan — because there is no paid plan.</p>
      </div>

      <div className="features-page-grid">
        {ALL_FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <div className="fp-card" key={f.title}>
              <div className="fp-icon-wrap">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <div className="fp-body">
                <h3>{f.title}</h3>
                <p className="fp-desc">{f.desc}</p>
                <p className="fp-detail">{f.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
