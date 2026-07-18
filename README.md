<div align="center">
  <br/>
  <h1>🎥 OpenWebScreen</h1>
  <p><strong>Free · Open Source · Browser-Based Screen Recorder</strong></p>
  <p>Record smooth, cinematic demos — auto-zoom, cursor tracking, motion blur, webcam overlay.<br/>No install. No signup. No data ever leaves your device.</p>
  <br/>
  <p>
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#testing">Testing</a> •
    <a href="#project-structure">Structure</a>
  </p>
  <br/>
</div>

---

## ✨ Features

### Studio
| Feature | Description |
|---------|-------------|
| 🎯 **Auto-Zoom on Clicks** | Detects clicks and smoothly zooms into that region |
| 🖱️ **Bézier Cursor Smoothing** | Replaces raw cursor jitter with cubic-Bézier interpolation |
| 🌫️ **Motion Blur** | Directional blur during fast pans and zooms |
| 🎥 **Webcam PIP Overlay** | Draggable picture-in-picture webcam bubble |
| 🖼️ **Backgrounds** | Gradient presets, custom color (color wheel), or custom image upload |
| ✂️ **Trim Editor** | Cut dead air and trim start/end before exporting |
| 🎨 **Click Ripple** | Visual ripple at click position, baked into recording |
| 🖥️ **Cross-App Cursor Detection** | Frame-differencing cursor tracking for other windows |
| 🎤 **Mic with Level Meter** | Built-in microphone support with real-time audio meter |
| ⏱️ **3-2-1 Countdown** | Countdown before recording starts |
| ⌨️ **Shortcuts** | `Space` · `P` · `Z` · `B` |
| ⬇️ **Export** | WebM (VP9/VP8) or MP4 — all local |

### Home Page
| Feature | Description |
|---------|-------------|
| 🖥️ **Smooth Mouse Tilt** | Hero mockup window follows cursor with GSAP quickTo |
| 🎞️ **Animated Entrance** | Text + mockup stagger fade-in on load |
| 🎴 **Pixel Hover Cards** | 9 feature cards with canvas pixel grid wave on hover |
| 🌌 **3D Particle Background** | Three.js particle field with mouse parallax |
| 📱 **Dark Mode** | Toggle with persistence in localStorage |
| 🧭 **SPA Navigation** | Home · Features · Studio · Gallery · About pages |
| 📸 **Recording Gallery** | History grid with play overlay, duration, size |

## 🚀 Quick Start

```bash
git clone https://github.com/rahulpatle-sol/OpenWebScreen.git
cd OpenWebScreen
npm install
npm run dev        # dev server at localhost:5173
npm run build      # production build
npm run preview    # preview production build
npm run test       # 22 Playwright E2E tests
```

## 🧪 Testing

```bash
npm run test          # headless (CI)
npx playwright test --ui   # interactive UI mode
```

**22 tests** — home page, hero tilt, navigation, feature cards, pixel hover, studio controls, settings, webcam/mic, keyboard shortcuts, gallery, privacy/terms pages.

## 🏗️ Tech Stack

```
Frontend   React 19 · Vite 6 · CSS (no framework)
Icons      lucide-react
Animations GSAP 3 (ScrollTrigger, quickTo, ticker)
3D         Three.js (particle background)
Fonts      Fraunces (display) · Inter (body)
Testing    Playwright
```

### Architecture

- **Canvas compositing** — zoom, blur, backgrounds, webcam, and ripples on a single `<canvas>`
- **MediaRecorder API** — captures composited canvas stream + audio tracks
- **Cached backdrop** — background gradient + shadow rendered once per settings change
- **Frame-differencing cursor** — lightweight fallback for cursor in other windows
- **SPA routing** — state-driven view switching (no React Router)
- **No backend** — everything runs client-side, no data upload

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / Stop recording |
| `P` | Pause / Resume |
| `Z` | Toggle auto-zoom |
| `B` | Toggle motion blur |

## 📁 Project Structure

```
src/
├── App.jsx                 # Root SPA — home / studio / editor / gallery / about / legal
├── main.jsx                # React entry
├── index.css               # All styles
└── components/
    ├── Hero3D.jsx          # Hero with smooth mouse-tilt mockup window
    ├── Features.jsx        # 9 feature cards with pixel hover grid
    ├── PixelHover.jsx      # Canvas pixel grid wave animation on hover
    ├── FeaturesPage.jsx    # Dedicated features page with detail
    ├── AboutPage.jsx       # About page with value cards
    ├── Gallery.jsx         # Recording history grid with play + download
    ├── ThreeBackground.jsx # Three.js particle field background
    ├── Recorder.jsx        # Core studio — canvas compositing, zoom, blur, webcam, mic, export
    └── Editor.jsx          # Video playback + trim start/end
```

## ⚖️ Pages

| Route | Content |
|-------|---------|
| Home | Hero tilt mockup, feature cards, dark mode, Three.js particles |
| Features | Full feature list with descriptions |
| Studio | Screen recorder with all controls |
| Gallery | Recording history with thumbnails |
| About | Project story and team values |
| Privacy | Privacy policy (no data collection) |
| Terms | Terms of service |

## 📄 License

MIT — use it, fork it, ship it.

---

<div align="center">
  <p>Built with ❤️ for the open-source community</p>
  <p><sub>No data leaves your machine · Everything runs client-side</sub></p>
</div>
