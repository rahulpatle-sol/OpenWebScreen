import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ThreeBackground({ mouse }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 20

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const count = 400
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30

      const c = new THREE.Color().setHSL(0.04 + Math.random() * 0.06, 0.7, 0.5 + Math.random() * 0.3)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = 0.02 + Math.random() * 0.06
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const mouseTarget = { x: 0, y: 0 }
    let raf

    function animate(time) {
      mouseTarget.x += (mouse.current.x - mouseTarget.x) * 0.02
      mouseTarget.y += (-mouse.current.y - mouseTarget.y) * 0.02

      points.rotation.x += (mouseTarget.y * 0.2 - points.rotation.x) * 0.01
      points.rotation.y += (mouseTarget.x * 0.3 - points.rotation.y) * 0.01

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    function resize() {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)

    sceneRef.current = { points, scene, camera, renderer }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [mouse])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        opacity: 0.7,
      }}
    />
  )
}
