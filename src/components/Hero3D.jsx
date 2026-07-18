import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function Hero3D({ onLaunch }) {
  const wrapRef = useRef(null)
  const mockRef = useRef(null)

  useEffect(() => {
    const mock = mockRef.current
    if (!mock) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo('h1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo('.hero-desc', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo('.hero-actions', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(mock, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.2')

    const rotY = gsap.quickTo(mock, 'rotationY', { duration: 1.2, ease: 'power2.out' })
    const rotX = gsap.quickTo(mock, 'rotationX', { duration: 1.2, ease: 'power2.out' })

    gsap.set(mock, { transformPerspective: 1200 })

    function move(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      rotY(x * 7)
      rotX(-y * 5)
    }
    function leave() { rotY(0); rotX(0) }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)
    return () => { tl.kill(); window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave) }
  }, [])

  return (
    <div ref={wrapRef} className="hero-simple">
      <div className="hero-simple-inner">
        <div className="eyebrow">✦ 100% free · no signup · runs in your browser</div>
        <h1>Record smooth <em>cinematic</em> demos.</h1>
        <p className="hero-desc">
          Auto-zoom on clicks, cursor animations, real-time tracking —<br />
          no install, no account, no upload. Everything local.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={onLaunch}>Start Recording →</button>
          <a className="btn-ghost" href="#features">See features</a>
        </div>
      </div>

      <div ref={mockRef} className="hero-mock">
        <div className="mock-bar">
          <span /><span /><span />
          <span className="mock-title">OpenWebScreen — Screen Recording</span>
        </div>
        <div className="mock-body">
          <div className="mock-sidebar" />
          <div className="mock-main">
            <div className="mock-row short" />
            <div className="mock-row" />
            <div className="mock-row" />
            <div className="mock-row highlight" />
            <div className="mock-row short" />
          </div>
        </div>
      </div>
    </div>
  )
}
