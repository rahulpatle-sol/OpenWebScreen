import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Monitor, Circle, Square, Pause, Play, Camera, CameraOff,
  Mic, MicOff, Download, Scissors, Zap, RotateCcw,
} from 'lucide-react'

const BG_PRESETS = [
  { id: 'none', label: 'None' },
  { id: 'sunset', from: '#ff9966', to: '#ff5e62' },
  { id: 'ocean', from: '#2f6df6', to: '#6ea8ff' },
  { id: 'mint', from: '#43e97b', to: '#38f9d7' },
  { id: 'dusk', from: '#232526', to: '#414345' },
]

const FORMATS = [
  { id: 'webm-vp9', mime: 'video/webm;codecs=vp9', ext: 'webm', label: 'WebM (VP9) — best quality' },
  { id: 'webm-vp8', mime: 'video/webm;codecs=vp8', ext: 'webm', label: 'WebM (VP8) — most compatible' },
  { id: 'mp4', mime: 'video/mp4;codecs=avc1.42E01E', ext: 'mp4', label: 'MP4 (H.264)' },
]

function lerp(a, b, t) { return a + (b - a) * t }

const QUALITY_MAP = {
  high: { bits: 8_000_000, fps: 30, label: 'High (recommended)' },
  medium: { bits: 3_500_000, fps: 24, label: 'Medium' },
  low: { bits: 1_200_000, fps: 20, label: 'Low (fast)' },
}

export default function Recorder({ onEdit, onRecordingComplete }) {
  const videoRef = useRef(null)
  const camVideoRef = useRef(null)
  const canvasRef = useRef(null)
  const trailCanvasRef = useRef(null)
  const backdropCanvasRef = useRef(null)   // cached bg + shadow, rebuilt only when settings change
  const backdropKeyRef = useRef('')
  const rafRef = useRef(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const camStreamRef = useRef(null)
  const micStreamRef = useRef(null)
  const timerRef = useRef(null)
  const zoomTargetRef = useRef({ x: 0.5, y: 0.5, scale: 1 })
  const zoomCurrentRef = useRef({ x: 0.5, y: 0.5, scale: 1 })
  const zoomUntilRef = useRef(0)
  const lastMouseRef = useRef({ x: 0.5, y: 0.5 })
  const camPosRef = useRef({ x: 24, y: 24 })
  const draggingCamRef = useRef(false)
  const frameCountRef = useRef(0)
  const lastDomMouseRef = useRef(0)
  const tempCanvasRef = useRef(null)
  const zoomIntensityRef = useRef(null)
  const ripplesRef = useRef([])
  const micAnalyserRef = useRef(null)
  const micLevelRef = useRef(0)
  const pressedKeysRef = useRef(new Set())
  const keyHistoryRef = useRef([])

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [hasStream, setHasStream] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [downloadSize, setDownloadSize] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState(null)

  const [autoZoom, setAutoZoom] = useState(true)
  const [motionBlur, setMotionBlur] = useState(true)
  const [webcamOn, setWebcamOn] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [bgPreset, setBgPreset] = useState('sunset')
  const [customColor, setCustomColor] = useState('#ff6b6b')
  const [customImage, setCustomImage] = useState(null)
  const [padding, setPadding] = useState(48)
  const [cornerRadius, setCornerRadius] = useState(16)
  const [zoomIntensity, setZoomIntensity] = useState(1.6)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [countdown, setCountdown] = useState(null)
  const [performanceMode, setPerformanceMode] = useState(false)
  const [qualityPreset, setQualityPreset] = useState('high')

  zoomIntensityRef.current = zoomIntensity

  useEffect(() => { zoomIntensityRef.current = zoomIntensity }, [zoomIntensity])

  const supportedFormats = FORMATS.filter(f => MediaRecorder.isTypeSupported(f.mime))
  const [formatId, setFormatId] = useState(supportedFormats[0]?.id || 'webm-vp9')

  // ---------------- build cached backdrop (bg gradient + soft shadow) ----------------
  function ensureBackdrop(outW, outH, vw, vh, pad, radius, preset, cColor, cImg) {
    const key = `${outW}x${outH}-${pad}-${radius}-${preset}-${cColor}-${cImg ? cImg.slice(-50) : ''}`
    if (backdropKeyRef.current === key && backdropCanvasRef.current) return backdropCanvasRef.current
    let bc = backdropCanvasRef.current
    if (!bc) { bc = document.createElement('canvas'); backdropCanvasRef.current = bc }
    bc.width = outW
    bc.height = outH
    const bctx = bc.getContext('2d')
    bctx.clearRect(0, 0, outW, outH)

    const p = BG_PRESETS.find(b => b.id === preset)
    if (preset === 'custom-color') {
      bctx.fillStyle = cColor
      bctx.fillRect(0, 0, outW, outH)
    } else if (preset === 'custom-image' && cImg) {
      const img = new Image()
      img.onload = () => {
        const sx = outW / img.width, sy = outH / img.height, s = Math.max(sx, sy)
        const ow = img.width * s, oh = img.height * s
        bctx.drawImage(img, (outW - ow) / 2, (outH - oh) / 2, ow, oh)
      }
      img.src = cImg
      // draw immediately if already loaded via cache
      bctx.fillStyle = '#1a1a2e'
      bctx.fillRect(0, 0, outW, outH)
    } else if (p && p.id !== 'none') {
      const grad = bctx.createLinearGradient(0, 0, outW, outH)
      grad.addColorStop(0, p.from)
      grad.addColorStop(1, p.to)
      bctx.fillStyle = grad
      bctx.fillRect(0, 0, outW, outH)
    }

    if (pad > 4) {
      bctx.save()
      bctx.filter = 'blur(24px)'
      bctx.fillStyle = 'rgba(0,0,0,0.45)'
      roundRectPath(bctx, pad, pad + 6, vw, vh, radius)
      bctx.fill()
      bctx.restore()
    }
    backdropKeyRef.current = key
    return bc
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  // ---------------- lightweight cursor detection from video frames ----------------
  // Scans the screen-capture video at ~8% resolution every few frames to find the
  // brightest pixel (cursor white tip). Used as a fallback when the mouse leaves
  // the Lumen page so auto-zoom still follows the cursor in other apps.
  function findCursorInFrame(video, vw, vh) {
    let tc = tempCanvasRef.current
    if (!tc) {
      tc = document.createElement('canvas')
      tempCanvasRef.current = tc
    }
    const scale = 0.08
    const tw = Math.max(8, Math.floor(vw * scale))
    const th = Math.max(8, Math.floor(vh * scale))
    tc.width = tw
    tc.height = th
    const tctx = tc.getContext('2d')
    tctx.drawImage(video, 0, 0, tw, th)
    const data = tctx.getImageData(0, 0, tw, th).data

    let best = 180, bestX = -1, bestY = -1
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const i = (y * tw + x) * 4
        const b = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114
        if (b > best) { best = b; bestX = x; bestY = y }
      }
    }

    if (bestX >= 0) return { x: bestX / tw, y: bestY / th }
    return null
  }

  // ---------------- draw loop ----------------
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(draw)
      return
    }
    const ctx = canvas.getContext('2d')
    const vw = video.videoWidth
    const vh = video.videoHeight
    if (!vw || !vh) { rafRef.current = requestAnimationFrame(draw); return }

    const pad = padding
    const outW = vw + pad * 2
    const outH = vh + pad * 2
    if (canvas.width !== outW || canvas.height !== outH) {
      canvas.width = outW
      canvas.height = outH
    }

    // snapshot last fully-composited frame BEFORE we overwrite the canvas,
    // used for the motion-blur ghost trail
    if (motionBlur && !performanceMode) {
      const trail = trailCanvasRef.current
      if (trail.width !== outW || trail.height !== outH) { trail.width = outW; trail.height = outH }
      trail.getContext('2d').drawImage(canvas, 0, 0)
    }

    // cheap: cached backdrop (background + shadow), only rebuilt on settings change
    const backdrop = ensureBackdrop(outW, outH, vw, vh, pad, cornerRadius, bgPreset, customColor, customImage)
    ctx.clearRect(0, 0, outW, outH)
    ctx.drawImage(backdrop, 0, 0)

    // ease zoom target -> current
    const z = zoomCurrentRef.current
    const t = zoomTargetRef.current
    const now = performance.now()
    const active = autoZoom && now < zoomUntilRef.current
    const targetScale = active ? t.scale : 1
    const targetX = active ? t.x : 0.5
    const targetY = active ? t.y : 0.5
    z.scale = lerp(z.scale, targetScale, 0.08)
    z.x = lerp(z.x, targetX, 0.08)
    z.y = lerp(z.y, targetY, 0.08)

    ctx.save()
    roundRectPath(ctx, pad, pad, vw, vh, cornerRadius)
    ctx.clip()

    if (motionBlur) {
      ctx.globalAlpha = 0.22
      ctx.drawImage(trailCanvasRef.current, 0, 0)
      ctx.globalAlpha = 1
    }

    ctx.save()
    ctx.translate(pad + vw * z.x, pad + vh * z.y)
    ctx.scale(z.scale, z.scale)
    ctx.translate(-(pad + vw * z.x), -(pad + vh * z.y))
    ctx.drawImage(video, pad, pad, vw, vh)
    ctx.restore()
    ctx.restore()

    if (webcamOn && camVideoRef.current && camVideoRef.current.readyState >= 2) {
      const camSize = 160
      const cx = camPosRef.current.x
      const cy = camPosRef.current.y
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx + camSize / 2, cy + camSize / 2, camSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fillStyle = '#000'
      ctx.fill()
      ctx.clip()
      ctx.drawImage(camVideoRef.current, cx, cy, camSize, camSize)
      ctx.restore()
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(cx + camSize / 2, cy + camSize / 2, camSize / 2, 0, Math.PI * 2)
      ctx.stroke()
    }

    // ---------------- click ripple effect ----------------
    const ripples = ripplesRef.current
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i]
      const age = now - r.time
      if (age > 700) { ripples.splice(i, 1); continue }
      const p = age / 700
      const radius = p * 80
      ctx.save()
      ctx.beginPath()
      ctx.arc(r.x * outW, r.y * outH, radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255,255,255,${1 - p})`
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(r.x * outW, r.y * outH, radius * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${(1 - p) * 0.2})`
      ctx.fill()
      ctx.restore()
    }

    // ---------------- video cursor tracking (fallback when mouse outside page) ----------------
    frameCountRef.current++
    if (frameCountRef.current % 3 === 0 && autoZoom) {
      const now = performance.now()
      if (now - lastDomMouseRef.current > 2000) {
        const pos = findCursorInFrame(video, vw, vh)
        if (pos) {
          const outW = vw + pad * 2
          const outH = vh + pad * 2
          const cx = (pad + pos.x * vw) / outW
          const cy = (pad + pos.y * vh) / outH
          if (Math.hypot(cx - zoomTargetRef.current.x, cy - zoomTargetRef.current.y) > 0.02) {
            zoomTargetRef.current = { x: cx, y: cy, scale: zoomIntensityRef.current }
            zoomUntilRef.current = now + 1400
          }
        }
      }
    }

    // ---------------- mic level sampling ----------------
    if (micAnalyserRef.current) {
      const data = new Uint8Array(micAnalyserRef.current.frequencyBinCount)
      micAnalyserRef.current.getByteTimeDomainData(data)
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        const v = data[i] - 128
        sum += v * v
      }
      micLevelRef.current = Math.min(1, Math.sqrt(sum / data.length) / 128 * 3)
    }

    // ---------------- keystroke overlay ----------------
    const keys = keyHistoryRef.current
    const cutoff = now - 2000
    let firstAlive = 0
    while (firstAlive < keys.length && keys[firstAlive].time < cutoff) { firstAlive++ }
    if (firstAlive > 0) keys.splice(0, firstAlive)
    if (keys.length > 0) {
      const barH = 40
      const barY = outH - barH - 8
      ctx.save()
      ctx.globalAlpha = 0.7
      ctx.fillStyle = '#1a1a1a'
      roundRectPath(ctx, pad + 4, barY, vw - 8, barH, 8)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 15px Inter, sans-serif'
      ctx.textAlign = 'center'
      const visible = keys.filter(k => now - k.time < 1600)
      const step = (vw - 16) / Math.min(visible.length + 1, 10)
      visible.slice(-10).forEach((k, i) => {
        const x = pad + 8 + step * (i + 1)
        const age = (now - k.time) / 1600
        ctx.globalAlpha = 1 - age * 0.6
        ctx.fillText(k.key, x, barY + 26)
      })
      ctx.restore()
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [autoZoom, motionBlur, webcamOn, bgPreset, customColor, customImage, padding, cornerRadius, performanceMode])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  // ---------------- cursor -> zoom target (deadzone stops jitter) ----------------
  useEffect(() => {
    function onMove(e) {
      if (!autoZoom) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return
      const last = lastMouseRef.current
      const dist = Math.hypot(nx - last.x, ny - last.y)
      if (dist < 0.015) return
      lastMouseRef.current = { x: nx, y: ny }
      zoomTargetRef.current = { x: nx, y: ny, scale: zoomIntensity }
      zoomUntilRef.current = performance.now() + 1400
      lastDomMouseRef.current = performance.now()
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [autoZoom, zoomIntensity])

  function handleCanvasClick(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width
    const ny = (e.clientY - rect.top) / rect.height
    zoomTargetRef.current = { x: nx, y: ny, scale: zoomIntensity }
    zoomUntilRef.current = performance.now() + 2200
    ripplesRef.current.push({ x: nx, y: ny, time: performance.now() })
  }

  function handleCanvasMouseDown(e) {
    if (!webcamOn) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    const { x, y } = camPosRef.current
    if (mx > x && mx < x + 160 && my > y && my < y + 160) {
      draggingCamRef.current = { offX: mx - x, offY: my - y }
    }
  }
  function handleCanvasMouseMove(e) {
    if (!draggingCamRef.current) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    camPosRef.current = { x: mx - draggingCamRef.current.offX, y: my - draggingCamRef.current.offY }
  }
  function handleCanvasMouseUp() { draggingCamRef.current = false }

  function showToast(message, type = 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  async function startCapture() {
    setIsLoading(true)
    setToast(null)
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30, cursor: 'always' },
        audio: true,
      })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setHasStream(true)
      stream.getVideoTracks()[0].addEventListener('ended', stopEverything)
    } catch (err) {
      if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
        showToast(err.message || 'Failed to share screen')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleWebcam() {
    if (webcamOn) {
      camStreamRef.current?.getTracks().forEach(t => t.stop())
      camStreamRef.current = null
      setWebcamOn(false)
      return
    }
    setIsLoading(true)
    try {
      const cam = await navigator.mediaDevices.getUserMedia({ video: true })
      camStreamRef.current = cam
      camVideoRef.current.srcObject = cam
      await camVideoRef.current.play()
      setWebcamOn(true)
    } catch (err) {
      showToast(err.message || 'Failed to access webcam')
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleMic() {
    if (micOn) {
      if (micAnalyserRef.current) {
        micAnalyserRef.current.disconnect()
        micAnalyserRef.current = null
      }
      micStreamRef.current?.getTracks().forEach(t => t.stop())
      micStreamRef.current = null
      setMicOn(false)
      micLevelRef.current = 0
      return
    }
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = mic
      const audioCtx = new AudioContext()
      const src = audioCtx.createMediaStreamSource(mic)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      micAnalyserRef.current = analyser
      setMicOn(true)
    } catch (err) {
      showToast(err.message || 'Failed to access microphone')
    }
  }

  function beginRecording() {
    const q = QUALITY_MAP[qualityPreset] || QUALITY_MAP.high
    const canvasStream = canvasRef.current.captureStream(q.fps)
    const audioTracks = []
    if (streamRef.current) audioTracks.push(...streamRef.current.getAudioTracks())
    if (micStreamRef.current) audioTracks.push(...micStreamRef.current.getAudioTracks())
    audioTracks.forEach(t => canvasStream.addTrack(t))

    chunksRef.current = []
    const fmt = FORMATS.find(f => f.id === formatId) || supportedFormats[0]
    const recorder = new MediaRecorder(canvasStream, { mimeType: fmt.mime, videoBitsPerSecond: q.bits })
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: fmt.mime.split(';')[0] })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setDownloadSize(blob.size)
      setRecordedBlob(blob)
      if (onRecordingComplete) {
        onRecordingComplete({ blob, size: blob.size, format: fmt.ext, date: Date.now() })
      }
    }
    recorder.start(250)
    recorderRef.current = recorder
    setIsRecording(true)
    setIsPaused(false)
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
  }

  function startRecording() {
    setCountdown(3)
    let c = 3
    const iv = setInterval(() => {
      c--
      if (c > 0) { setCountdown(c) }
      else {
        clearInterval(iv)
        setCountdown(null)
        beginRecording()
      }
    }, 800)
  }

  function togglePause() {
    if (!recorderRef.current) return
    if (isPaused) {
      recorderRef.current.resume()
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      recorderRef.current.pause()
      clearInterval(timerRef.current)
    }
    setIsPaused(p => !p)
  }

  function resetSettings() {
    setBgPreset('sunset')
    setPadding(48)
    setCornerRadius(16)
    setZoomIntensity(1.6)
    setAutoZoom(true)
    setMotionBlur(true)
    setPerformanceMode(false)
    setQualityPreset('high')
    showToast('Settings reset to defaults', 'success')
  }

  function stopRecording() {
    recorderRef.current?.stop()
    clearInterval(timerRef.current)
    setIsRecording(false)
    setIsPaused(false)
  }

  function stopEverything() {
    stopRecording()
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setHasStream(false)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.code === 'Space' && hasStream) {
        e.preventDefault()
        isRecording ? stopRecording() : startRecording()
      } else if (e.key.toLowerCase() === 'p' && isRecording) {
        togglePause()
      } else if (e.key.toLowerCase() === 'z') {
        setAutoZoom(z => !z)
      } else if (e.key.toLowerCase() === 'b') {
        setMotionBlur(b => !b)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasStream, isRecording])

  // ---------------- keystroke overlay (record pressed keys) ----------------
  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key
      if (key === ' ' || key === 'Space') return
      if (pressedKeysRef.current.has(key)) return
      pressedKeysRef.current.add(key)
      const now = performance.now()
      keyHistoryRef.current.push({ key, time: now })
    }
    function onKeyUp(e) {
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key
      pressedKeysRef.current.delete(key)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => () => {
    clearInterval(timerRef.current)
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    camStreamRef.current?.getTracks().forEach(t => t.stop())
    micStreamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  function fmt(s) {
    const m = String(Math.floor(s / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${m}:${sec}`
  }

  const currentFormat = FORMATS.find(f => f.id === formatId) || supportedFormats[0]

  return (
    <div className="recorder-page">
      <div className="recorder-head">
        <h1>Recording Studio</h1>
        <span className="pill">No signup · local only</span>
      </div>

      <div className="studio">
        <div
          className="studio-stage"
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
        >
          {!hasStream && !isLoading && (
            <div className="stage-empty">
              <div className="ring"><Monitor size={26} strokeWidth={1.5} /></div>
              <div>Click "Share Screen" to begin</div>
            </div>
          )}
          {isLoading && (
            <div className="stage-empty">
              <div className="spinner" />
              <div>Please select a screen or window...</div>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: hasStream ? 'block' : 'none' }} />
          {isRecording && (
            <div className="rec-badge">
              <span className="rec-dot" />
              {isPaused ? 'PAUSED' : 'REC'} · {fmt(elapsed)}
            </div>
          )}
          {countdown && (
            <div className="countdown-overlay">
              <span className="countdown-num">{countdown}</span>
            </div>
          )}
          <video ref={videoRef} style={{ display: 'none' }} muted playsInline />
          <video ref={camVideoRef} style={{ display: 'none' }} muted playsInline />
          <canvas ref={trailCanvasRef} style={{ display: 'none' }} />
        </div>

        <div className="controls-bar">
          <div className="controls-left">
            {!hasStream ? (
              <button className="record-btn" onClick={startCapture}>
                <Monitor size={16} /> Share Screen
              </button>
            ) : !isRecording ? (
              <button className="record-btn" onClick={startRecording}>
                <Circle size={14} fill="currentColor" /> Start Recording
              </button>
            ) : (
              <>
                <button className="record-btn active" onClick={stopRecording}>
                  <Square size={14} fill="currentColor" /> Stop
                </button>
                <button className="icon-btn" onClick={togglePause} title="Pause/Resume">
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
              </>
            )}
            <button className="icon-btn" onClick={toggleWebcam} title="Toggle Webcam">
              {webcamOn ? <Camera size={16} /> : <CameraOff size={16} />}
            </button>
            <button className="icon-btn" onClick={toggleMic} title="Toggle Microphone">
              {micOn ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
            {micOn && (
              <div className="mic-level">
                <div className="mic-level-bar" style={{ scale: `1 ${micLevelRef.current}`, transformOrigin: 'bottom' }} />
              </div>
            )}
          </div>
          <div className="controls-right">
            <label className="toggle">
              <span>Auto-Zoom (Z)</span>
              <span className={`switch ${autoZoom ? 'on' : ''}`} onClick={() => setAutoZoom(a => !a)}>
                <span className="switch-knob" />
              </span>
            </label>
            <label className="toggle">
              <span>Motion Blur (B)</span>
              <span className={`switch ${motionBlur ? 'on' : ''}`} onClick={() => setMotionBlur(b => !b)}>
                <span className="switch-knob" />
              </span>
            </label>
          </div>
        </div>

        <div className="settings-panel">
          <div className="setting-group">
            <label>Background</label>
            <div className="color-row">
              {BG_PRESETS.map(p => (
                <span
                  key={p.id}
                  className={`swatch ${bgPreset === p.id ? 'active' : ''}`}
                  style={{ background: p.id === 'none' ? '#eee' : `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                  onClick={() => setBgPreset(p.id)}
                  title={p.id}
                />
              ))}
              <input type="color" value={customColor}
                onChange={e => { setCustomColor(e.target.value); setBgPreset('custom-color') }}
                className={`swatch-color ${bgPreset === 'custom-color' ? 'active' : ''}`}
                title="Custom Color" />
              <label className={`swatch-img ${bgPreset === 'custom-image' ? 'active' : ''}`}>
                <input type="file" accept="image/*" hidden
                  onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => { setCustomImage(ev.target.result); setBgPreset('custom-image') }; r.readAsDataURL(f) }}} />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              </label>
            </div>
          </div>
          <div className="setting-group">
            <label>Padding: {padding}px</label>
            <input className="slider" type="range" min="0" max="120" value={padding}
              onChange={e => setPadding(+e.target.value)} />
          </div>
          <div className="setting-group">
            <label>Corner Radius: {cornerRadius}px</label>
            <input className="slider" type="range" min="0" max="40" value={cornerRadius}
              onChange={e => setCornerRadius(+e.target.value)} />
          </div>
          <div className="setting-group">
            <label>Zoom Intensity: {zoomIntensity.toFixed(1)}x</label>
            <input className="slider" type="range" min="1.1" max="2.5" step="0.1" value={zoomIntensity}
              onChange={e => setZoomIntensity(+e.target.value)} />
          </div>
          <div className="setting-group">
            <label>Export Format</label>
            <select className="select" value={formatId} disabled={isRecording}
              onChange={e => setFormatId(e.target.value)}>
              {supportedFormats.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
          <div className="setting-group">
            <label>Quality</label>
            <select className="select" value={qualityPreset}
              onChange={e => setQualityPreset(e.target.value)}>
              {Object.entries(QUALITY_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div className="setting-group">
            <label className="toggle" style={{ justifyContent: 'space-between', width: '100%' }}>
              <span>Performance Mode</span>
              <span className={`switch ${performanceMode ? 'on' : ''}`} onClick={() => setPerformanceMode(p => !p)}>
                <span className="switch-knob" />
              </span>
            </label>
            {performanceMode && <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 6 }}>Disables motion blur, pixel effects &amp; tracking for smooth recording on low-end PCs</p>}
          </div>
          <div className="setting-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn-ghost" onClick={resetSettings} style={{ fontSize: 13, padding: '10px 18px', width: '100%' }}>
              <RotateCcw size={13} /> Reset to Defaults
            </button>
          </div>
        </div>

        {downloadUrl && (
          <div className="download-bar">
            <span>Recording ready — {(downloadSize / 1024 / 1024).toFixed(1)} MB · {currentFormat.ext.toUpperCase()}</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="download-btn" onClick={() => onEdit(recordedBlob)}>
                <Scissors size={15} /> Edit
              </button>
              <a className="download-btn" href={downloadUrl} download={`recording-${Date.now()}.${currentFormat.ext}`}>
                <Download size={15} /> Download
              </a>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.message}
        </div>
      )}

      <div className="hint-row">
        <span className="hint">Space — start/stop</span>
        <span className="hint">P — pause/resume</span>
        <span className="hint">Z — toggle zoom</span>
        <span className="hint">B — toggle blur</span>
        <span className="hint">Click canvas — zoom-to-point</span>
        <span className="hint">Keystrokes shown live on video</span>
      </div>
    </div>
  )
}