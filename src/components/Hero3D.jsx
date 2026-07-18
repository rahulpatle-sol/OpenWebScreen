import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, useProgress, Html } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import MacBook from './MacBook.jsx'
import CanvasErrorBoundary from './CanvasErrorBoundary.jsx'

gsap.registerPlugin(ScrollTrigger)

function Loader() {
  const { progress } = useProgress()
  if (progress === 100) return null
  return (
    <Html center>
      <div className="hero3d-loader">
        <div className="hero3d-loader-bar" style={{ width: `${Math.round(progress)}%` }} />
        <span>{Math.round(progress)}%</span>
      </div>
    </Html>
  )
}

export default function Hero3D({ onLaunch }) {
  const containerRef = useRef(null)
  const h1Ref = useRef(null)
  const pRef = useRef(null)
  const actionsRef = useRef(null)

  // Shared state between GSAP and R3F
  const modelState = useRef({
    pos: new THREE.Vector3(0, 0, 0),
    rot: new THREE.Euler(0.15, 0, 0),
    mouseX: 0,
    mouseY: 0,
  })

  // ── Entrance animation (DOM text) ──
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(h1Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo(pRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo(actionsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
    return () => tl.kill()
  }, [])

  // ── ScrollTrigger: animate the 3D model ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })
      tl.to(modelState.current.pos, { z: -2.2, y: -0.5, ease: 'power1.inOut' }, 0)
        .to(modelState.current.rot, { y: Math.PI * 0.4, ease: 'power1.inOut' }, 0)
        .to(modelState.current.rot, { x: -0.05, ease: 'power1.inOut' }, 0)
      return () => tl.kill()
    })

    return () => mm.revert()
  }, [])

  // ── Mouse tilt tracking ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function move(e) {
      const r = el.getBoundingClientRect()
      modelState.current.mouseX = (e.clientX - r.left) / r.width - 0.5
      modelState.current.mouseY = (e.clientY - r.top) / r.height - 0.5
    }
    function leave() { modelState.current.mouseX = 0; modelState.current.mouseY = 0 }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [])

  return (
    <div ref={containerRef} className="hero3d">
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

      <div className="hero3d-canvas-wrap">
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0.15, 5.2], fov: 38 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, outputColorSpace: 'srgb' }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={['#0a0a0f']} />

            <ambientLight intensity={0.35} />
            <directionalLight position={[6, 5, 7]} intensity={1.4} />
            <directionalLight position={[-3, 2, -4]} intensity={0.4} />
            <spotLight position={[0, -3, 5]} intensity={0.3} angle={0.4} penumbra={0.6} />

            <MacBook modelState={modelState} />

            <ContactShadows position={[0, -0.55, 0]} scale={7} blur={3} opacity={0.25} far={3.5} />
            <Environment preset="city" />
            <Loader />
          </Canvas>
        </CanvasErrorBoundary>
      </div>
    </div>
  )
}
