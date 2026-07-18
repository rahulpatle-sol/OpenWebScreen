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
    <a href="#testing">Testing</a>
  </p>
  <br/>
</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Auto-Zoom on Clicks** | Detects meaningful clicks and smoothly zooms into that region |
| 🖱️ **Bézier Cursor Smoothing** | Replaces raw cursor jitter with cubic-Bézier interpolated motion |
| 🌫️ **Motion Blur** | Directional blur applied during fast pans and zooms for a cinematic feel |
| 🎥 **Webcam Overlay** | Drag-to-position picture-in-picture webcam bubble, resizable |
| 🖼️ **Custom Backgrounds** | Gradient, solid, or none — adjustable padding and corner radius |
| ✂️ **Trim & Speed Control** | Cut dead air and scrub through your recording before exporting |
| 🎨 **Click Ripple Effect** | Visual ripple at click position, baked into the recording |
| 🖥️ **Cross-App Cursor Tracking** | Detects cursor from video frames when recording other applications |
| 🎤 **Mic with Level Indicator** | Built-in microphone support with real-time audio level meter |
| ⏱️ **3-2-1 Countdown** | Professional countdown before recording starts |
| ⌨️ **Keyboard Shortcuts** | `Space` to start/stop · `P` to pause · `Z` for zoom · `B` for blur |
| ⬇️ **Instant Local Export** | WebM/MP4 export straight to your downloads — nothing touches a server |

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/rahulpatle-sol/OpenWebScreen.git
cd OpenWebScreen

# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Preview
npm run preview

# Test
npm run test
```

## 🧪 Testing

Playwright end-to-end tests cover the full UI:

```bash
npm run test        # headless
npm run test:ui     # interactive UI mode
```

**20 tests** — home page, navigation, feature cards, studio controls, settings, keyboard shortcuts, and more.

## 🏗️ Tech Stack

```
Frontend   React 18 · Vite 6 · CSS (no framework)
Icons      lucide-react · react-icons
Fonts      Fraunces (display) · Inter (body)
Testing    Playwright
```

Architecture highlights:
- **Canvas-based compositing** — real-time zoom, blur, backgrounds, webcam, and ripples all render on a single `<canvas>` 
- **MediaRecorder API** — captures the composited canvas stream with audio
- **Cached backdrop** — background gradient + shadow rendered once, reused every frame
- **Frame-differencing cursor detection** — lightweight fallback for tracking cursor in other windows

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
├── App.jsx                 # Root — home / studio / editor views
├── main.jsx                # React entry
├── index.css               # All styles (~680 lines)
└── components/
    ├── Hero3D.jsx          # Hero with tilt 3D mock-window
    ├── Features.jsx        # 9 feature cards with pixel hover
    ├── PixelHover.jsx      # Canvas-based pixel grid wave on hover
    ├── Recorder.jsx        # Core recorder (canvas, zoom, blur, webcam, mic, export)
    └── Editor.jsx          # Video playback + trim markers
```

## 📄 License

MIT — use it, fork it, ship it.

---

<div align="center">
  <p>Built with ❤️ for the open-source community</p>
  <p><sub>No data leaves your machine · Everything runs client-side</sub></p>
</div>
