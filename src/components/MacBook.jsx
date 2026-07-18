import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function getScreenMesh(scene) {
  let found = null
  let fallback = null
  scene.traverse((child) => {
    if (!child.isMesh) return
    fallback ??= child
    const name = child.name.toLowerCase()
    if (
      name.includes('screen') || name.includes('display') ||
      name.includes('panel')   || name.includes('monitor') ||
      name.includes('lcd')     || name.includes('glass') ||
      name.includes('c-screen')
    ) found = child
  })
  return found || fallback
}

export default function MacBook({ modelState }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/mac.glb')
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  const screenMesh = useMemo(() => getScreenMesh(clonedScene), [clonedScene])

  // ── Animated canvas texture (screen-recording demo) ──
  const canvasTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1280; c.height = 720
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = 'srgb'
    return t
  }, [])

  // ── Replace screen material ──
  useEffect(() => {
    if (!screenMesh) {
      console.warn('[MacBook] No screen mesh found — video texture not applied')
      return
    }
    const prev = screenMesh.material
    screenMesh.material = new THREE.MeshStandardMaterial({
      map: canvasTex,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.0,
      emissiveMap: canvasTex,
      metalness: 0.0,
      roughness: 0.35,
    })
    screenMesh.material.needsUpdate = true
    return () => { screenMesh.material = prev; canvasTex.dispose() }
  }, [screenMesh, canvasTex])

  const time = useRef(0)
  const smooth = useRef({ x: 0, y: 0 })

  useFrame((_, dt) => {
    time.current += dt
    const t = time.current
    const c = canvasTex.image
    const ctx = c.getContext('2d')
    const w = c.width, h = c.height

    // ── Paint demo frame ──
    ctx.clearRect(0, 0, w, h)

    // bg
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#0e0e14'); g.addColorStop(1, '#060609')
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)

    // REC dot
    const pulse = 0.5 + Math.sin(t * 4) * 0.3
    ctx.fillStyle = `rgba(255,50,50,${pulse})`
    ctx.beginPath(); ctx.arc(40, 40, 7, 0, Math.PI * 2); ctx.fill()

    ctx.fillStyle = '#fff'
    ctx.font = '600 18px monospace'
    ctx.textBaseline = 'middle'
    const mm = String(Math.floor(t / 60)).padStart(2, '0')
    const ss = String(Math.floor(t % 60)).padStart(2, '0')
    ctx.fillText(`${mm}:${ss}`, 62, 40)

    // window frame
    const wx = 56, wy = 76, ww = w - 112, wh = h - 140
    ctx.fillStyle = '#13141c'
    thisRR(ctx, wx, wy, ww, wh, 12)
    ctx.fill()

    // title bar
    ctx.fillStyle = '#1a1b24'
    thisRR(ctx, wx, wy, ww, 38, 12)
    ctx.fill()
    ctx.fillRect(wx, wy + 26, ww, 12)
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = ['#ff5f56', '#ffbd2e', '#27c93f'][i]
      ctx.beginPath(); ctx.arc(wx + 24 + i * 26, wy + 19, 5, 0, Math.PI * 2); ctx.fill()
    }

    // nav
    ctx.fillStyle = '#22232e'; ctx.fillRect(wx + 14, wy + 52, ww - 28, 40)
    ctx.fillStyle = '#2a2b36'; thisRR(ctx, wx + 24, wy + 60, 64, 24, 6); ctx.fill()
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'
    ctx.font = '600 12px system-ui'; ctx.fillText('Record', wx + 56, wy + 72)

    // body
    ctx.fillStyle = '#181923'; ctx.fillRect(wx + 14, wy + 104, ww - 28, wh - 118)
    // code lines
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i === 2 ? '#3b82f6' : '#2a2b36'
      const lw = 100 + Math.sin(t * 0.6 + i) * 40
      thisRR(ctx, wx + 32 + Math.sin(t * 0.3 + i) * 8, wy + 122 + i * 26, lw, 8, 4)
      ctx.fill()
    }
    // highlight
    const hx = wx + 36 + Math.sin(t * 1.4) * 60
    const hy = wy + 124 + Math.sin(t * 1.6) * 10
    ctx.fillStyle = 'rgba(59,130,246,0.12)'
    thisRR(ctx, hx - 36, hy - 14, 72, 28, 6); ctx.fill()
    ctx.strokeStyle = `rgba(59,130,246,${0.25 + Math.sin(t*2)*0.15})`
    ctx.lineWidth = 1.5; ctx.stroke()

    // cursor
    const cx = wx + 50 + Math.sin(t * 1.7) * 80
    const cy = hy + Math.sin(t * 2.1) * 16
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill()

    canvasTex.needsUpdate = true

    // ── Apply scroll state + mouse tilt to model ──
    if (!groupRef.current) return
    const s = modelState.current
    smooth.current.x += (s.mouseX - smooth.current.x) * 0.04
    smooth.current.y += (s.mouseY - smooth.current.y) * 0.04

    groupRef.current.position.copy(s.pos)
    groupRef.current.rotation.x = s.rot.x + smooth.current.y * 0.08
    groupRef.current.rotation.y = s.rot.y + smooth.current.x * 0.12
    groupRef.current.rotation.z = s.rot.z
  })

  return <primitive ref={groupRef} object={clonedScene} />
}

function thisRR(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

useGLTF.preload('/mac.glb')
