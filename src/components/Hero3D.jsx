import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function Hero3D({ onLaunch }) {
  const wrapRef = useRef(null)
  const mockRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const cur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo('h1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo('.hero-desc', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo('.hero-actions', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(mockRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.2')

    const ticker = gsap.ticker.add(() => {
      const el = mockRef.current
      if (!el) return
      cur.current.x += (mouse.current.x - cur.current.x) * 0.05
      cur.current.y += (mouse.current.y - cur.current.y) * 0.05
      el.style.transform = `perspective(1200px) rotateY(${cur.current.x * 8}deg) rotateX(${-cur.current.y * 6}deg)`
    })

    function move(e) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    function leave() { mouse.current.x = 0; mouse.current.y = 0 }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)
    return () => { tl.kill(); gsap.ticker.remove(ticker); window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave) }
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
