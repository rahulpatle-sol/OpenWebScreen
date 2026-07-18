import { useRef } from 'react'

export default function Hero3D({ onLaunch }) {
  const stageRef = useRef(null)

  function handleMove(e) {
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.01)`
  }

  function handleLeave() {
    const el = stageRef.current
    if (!el) return
    el.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <>
      <div className="eyebrow">✦ 100% free · no signup · runs in your browser</div>
      <h1>
        Record smooth <em>cinematic</em> demos, right from the browser.
      </h1>
      <p>
        Auto-zoom on clicks, buttery cursor animations, and real-time tracking —
        no install, no account, no upload. Everything renders on your machine.
      </p>
      <div className="hero-actions">
        <button className="btn-primary" onClick={onLaunch}>Start Recording →</button>
        <a className="btn-ghost" href="#features">See features</a>
      </div>

      <div
        className="stage"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div className="stage-inner" ref={stageRef}>
          <div className="mock-window">
            <div className="mock-titlebar">
              <span className="mock-dot" style={{ background: '#ff5f57' }} />
              <span className="mock-dot" style={{ background: '#febc2e' }} />
              <span className="mock-dot" style={{ background: '#28c840' }} />
            </div>
            <div className="mock-canvas">
              <div className="floaty-card fc-1" />
              <div className="floaty-card fc-2" />
              <div className="fc-cursor" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
