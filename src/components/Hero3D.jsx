import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero3D({ onLaunch }) {
  const containerRef = useRef(null)
  const h1Ref = useRef(null)
  const pRef = useRef(null)
  const actionsRef = useRef(null)
  
  const laptopWrapRef = useRef(null)
  const lidRef = useRef(null)
  const videoRef = useRef(null)

  // Mouse tracking for free 3D rotation
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Entrance
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(h1Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo(pRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo(actionsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(laptopWrapRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.2')

    // Scroll animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (videoRef.current) {
            if (self.progress > 0.3) videoRef.current.play().catch(() => {})
            else videoRef.current.pause()
          }
        }
      }
    })
    scrollTl
      .to(lidRef.current, { rotateX: 0, ease: 'power2.out' }, 0)
      .to(laptopWrapRef.current, { rotateX: 20, rotateY: -10, scale: 1.1, ease: 'power1.inOut' }, 0)

    // Free mouse rotation - smooth ticker
    const ticker = gsap.ticker.add(() => {
      const el = laptopWrapRef.current
      if (!el) return
      current.current.x += (mouse.current.x - current.current.x) * 0.06
      current.current.y += (mouse.current.y - current.current.y) * 0.06
      el.style.transform = `rotateX(${20 + current.current.y * 12}deg) rotateY(${-10 + current.current.x * 18}deg)`
    })

    function move(e) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    function leave() { mouse.current.x = 0; mouse.current.y = 0 }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)

    return () => {
      tl.kill()
      scrollTl.kill()
      gsap.ticker.remove(ticker)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div ref={containerRef} className="hero3d-simple-container">
      <div className="hero3d-content">
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
      </div>

      <div className="laptop-stage">
        <div ref={laptopWrapRef} className="simple-laptop">
          <div ref={lidRef} className="simple-lid">
            <div className="simple-screen">
              <video 
                ref={videoRef}
                src="https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-lap-top-screen-close-up-34324-large.mp4" 
                loop muted playsInline className="simple-video"
              />
            </div>
          </div>
          <div className="simple-base">
            <div className="simple-trackpad" />
          </div>
        </div>
      </div>
    </div>
  )
}
