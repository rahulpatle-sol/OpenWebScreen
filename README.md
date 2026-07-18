# Lumen — Free Browser Screen Recorder

React + Vite. No backend, no signup, no upload — everything runs and renders
locally in your browser tab.

## Run it (Bun)

```bash
bun install
bun run dev
```

Opens at `http://localhost:5173`.

## Run it (npm, if you don't have Bun)

```bash
npm install
npm run dev
```

## Build for production

```bash
bun run build     # or: npm run build
```

Output goes to `dist/` — deploy it anywhere static (Vercel, Netlify, GitHub Pages).

## What's inside

- `src/App.jsx` — landing page ↔ studio view switcher
- `src/components/Hero3D.jsx` — mouse-tilt 3D hero mockup (pure CSS 3D transforms, no three.js — keeps it light)
- `src/components/Features.jsx` — feature grid
- `src/components/Recorder.jsx` — the actual engine:
  - `getDisplayMedia()` for screen capture
  - a `<canvas>` render loop that composites: background, padding, rounded corners,
    drop shadow, auto-zoom, motion-blur trail, webcam bubble
  - `canvas.captureStream()` + `MediaRecorder` to record the *composited* canvas
    (so effects are baked into the export)
  - `Blob` + `URL.createObjectURL` for a pure client-side download — nothing ever
    touches a server

## Honest note on cursor tracking

Browsers do **not** expose the real OS-level mouse position when you're
recording another window or your full screen (security restriction — no site
can silently know where your cursor is on your whole desktop). So:

- **Auto-zoom** follows your mouse accurately when you record **this browser
  tab** ("Chrome Tab" in the share picker).
- For full-screen / other-app recordings, click anywhere on the canvas while
  recording to set a **manual zoom-to-point** — same smooth Bézier-eased
  zoom-in, just triggered by click instead of live cursor position.
- The screen capture itself can still bake in the OS cursor (browser asks for
  this via the share picker), you just can't get its live *coordinates* in JS
  for anything outside the tab.

## Keyboard shortcuts

- `Space` — start / stop recording
- `Z` — toggle auto-zoom
- `B` — toggle motion blur
- Click the canvas — manual zoom-to-point
- Drag the webcam bubble — reposition it

## Stack

React 18, Vite 6. No UI kit, no three.js, no state library — kept deliberately
small so it stays fast on Bun.
