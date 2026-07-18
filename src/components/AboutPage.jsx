import { Code2, Globe, Shield, Cpu } from 'lucide-react'

const VALUES = [
  { icon: Shield, title: '100% Private', desc: 'Zero data collection. Zero servers. Zero accounts. Everything runs in your browser tab and stays there.' },
  { icon: Cpu, title: 'Client-Side Only', desc: 'Built entirely with browser APIs — Canvas, MediaRecorder, getUserMedia, getDisplayMedia. No backend, no database, no cloud.' },
  { icon: Globe, title: 'Open Source', desc: 'MIT licensed. Fork it, modify it, self-host it. The code is yours to do with as you please.' },
  { icon: Code2, title: 'Community Driven', desc: 'Built in the open, for the open. Contributions, issues, and feature requests are always welcome.' },
]

export default function AboutPage() {
  return (
    <div className="recorder-page">
      <div className="section-head" style={{ marginBottom: 60 }}>
        <div className="section-tag">About OpenWebScreen</div>
        <h2>Screen recording, reimagined for the browser</h2>
        <p>No installers. No sign-up forms. No \"upgrade to pro.\" Just a canvas, a camera feed, and a few thousand lines of open-source React.</p>
      </div>

      <div className="about-card">
        <h3>Why another screen recorder?</h3>
        <p>Because every existing option either requires installing native software, uploads your data to the cloud, or hides basic features behind a subscription. OpenWebScreen exists to prove that professional-quality screen recording can happen entirely in the browser — for free, forever.</p>
      </div>

      <div className="about-card">
        <h3>How it works</h3>
        <p>When you share your screen, the browser gives us a video stream. We draw each frame onto a <code>&lt;canvas&gt;</code>, apply zoom, blur, backgrounds, webcam overlay, and ripple effects in real time, then capture the composited canvas with <code>MediaRecorder</code>. The result is a polished video file — all without a single byte leaving your machine.</p>
      </div>

      <div className="about-grid">
        {VALUES.map((v) => {
          const Icon = v.icon
          return (
            <div className="about-value-card" key={v.title}>
              <div className="fp-icon-wrap"><Icon size={20} strokeWidth={1.5} /></div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
