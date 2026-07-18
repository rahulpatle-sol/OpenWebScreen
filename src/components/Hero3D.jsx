import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero3D({ onLaunch }) {
  const stageRef = useRef(null)
  const containerRef = useRef(null)
  const h1Ref = useRef(null)
  const pRef = useRef(null)
  const actionsRef = useRef(null)
  const stageOuterRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(h1Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo(pRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo(actionsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(stageOuterRef.current, { y: 60, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1 }, '-=0.3')

    return () => tl.kill()
  }, [])

  function handleMove(e) {
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, { rotateY: x * 10, rotateX: -y * 10, scale: 1.01, duration: 0.3, ease: 'power2.out' })
  }

  function handleLeave() {
    const el = stageRef.current
    if (!el) return
    gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: 'power2.out' })
  }

  return (
    <div ref={containerRef}>
      <div className="eyebrow">✦ 100% free · no signup · runs in your browser</div>
      <h1 ref={h1Ref}>
        Record smooth <em>cinematic</em> demos, right from the browser.
      </h1>
      <p ref={pRef}>
        Auto-zoom on clicks, buttery cursor animations, and real-time tracking —
        no install, no account, no upload. Everything renders on your machine.
      </p>
      <div className="hero-actions" ref={actionsRef}>
        <button className="btn-primary" onClick={onLaunch}>Start Recording →</button>
        <a className="btn-ghost" href="#features">See features</a>
      </div>

      <div ref={stageOuterRef} className="stage" onMouseMove={handleMove} onMouseLeave={handleLeave}>
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
    </div>
  )
}
