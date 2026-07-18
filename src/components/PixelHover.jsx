import { useRef, useEffect } from 'react'

const COLS = 14
const ROWS = 8

export default function PixelHover({ children, className = '' }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const stateRef = useRef({ active: false, time: 0, raf: null })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    function resize() {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const ctx = canvas.getContext('2d')

    function animate(time) {
      const s = stateRef.current
      if (!s.active && s.time === 0) { s.raf = null; return }

      const elapsed = time - s.time
      const duration = 500
      const progress = Math.max(0, Math.min(1, elapsed / duration))

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const pw = canvas.width / COLS
      const ph = canvas.height / ROWS
      const cx = COLS / 2
      const cy = ROWS / 2

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const dist = Math.abs(c - cx) + Math.abs(r - cy)
          const delay = dist * 18
          const p = Math.max(0, Math.min(1, (elapsed - delay) / duration))
          if (p > 0) {
            const ease = 1 - Math.pow(1 - p, 3)
            const scale = s.active ? ease : 1 - ease
            const alpha = s.active ? ease * 0.2 : (1 - ease) * 0.2
            const x = c * pw + pw * (1 - scale) / 2
            const y = r * ph + ph * (1 - scale) / 2
            ctx.globalAlpha = alpha
            ctx.fillStyle = c % 2 === r % 2 ? '#ff5a3c' : '#2f6df6'
            ctx.fillRect(x, y, pw * scale, ph * scale)
          }
        }
      }

      if (progress < 1) {
        s.raf = requestAnimationFrame(animate)
      } else {
        s.raf = null
      }
    }

    function onEnter() {
      stateRef.current.active = true
      stateRef.current.time = performance.now()
      if (!stateRef.current.raf) {
        stateRef.current.raf = requestAnimationFrame(animate)
      }
    }

    function onLeave() {
      stateRef.current.active = false
      stateRef.current.time = performance.now()
      if (!stateRef.current.raf) {
        stateRef.current.raf = requestAnimationFrame(animate)
      }
    }

    container.addEventListener('mouseenter', onEnter)
    container.addEventListener('mouseleave', onLeave)

    return () => {
      if (stateRef.current.raf) cancelAnimationFrame(stateRef.current.raf)
      ro.disconnect()
      container.removeEventListener('mouseenter', onEnter)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', zIndex: 2 }}
      />
    </div>
  )
}
