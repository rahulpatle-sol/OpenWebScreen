<div align="center">

<img src="https://raw.githubusercontent.com/solana-labs/branding/master/solana-logo-black.svg" width="0" height="0" alt=""/>

# 🎥 OpenWebScreen

### The zero-install, zero-signup, zero-data-leak screen recorder — built entirely for your browser.

<br/>

![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-particles-000000?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-9945FF?style=for-the-badge)

![Stars](https://img.shields.io/github/stars/rahulpatle-sol/OpenWebScreen?style=social)
![Forks](https://img.shields.io/github/forks/rahulpatle-sol/OpenWebScreen?style=social)
![Issues](https://img.shields.io/github/issues/rahulpatle-sol/OpenWebScreen?color=14F195)
![Last Commit](https://img.shields.io/github/last-commit/rahulpatle-sol/OpenWebScreen?color=9945FF)

<br/>

```
   ██████╗ ██████╗ ███████╗███╗   ██╗██╗    ██╗███████╗██████╗ ███████╗ ██████╗██████╗ ███████╗███████╗███╗   ██╗
  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║██║    ██║██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝████╗  ██║
  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║██║ █╗ ██║█████╗  ██████╔╝███████╗██║     ██████╔╝█████╗  █████╗  ██╔██╗ ██║
  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║██║███╗██║██╔══╝  ██╔══██╗╚════██║██║     ██╔══██╗██╔══╝  ██╔══╝  ██║╚██╗██║
  ╚██████╔╝██║     ███████╗██║ ╚████║╚███╔███╔╝███████╗██████╔╝███████║╚██████╗██║  ██║███████╗███████╗██║ ╚████║
   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝ ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝
```

**Cinematic auto-zoom · Bézier cursor smoothing · Motion blur · Webcam PIP — all 100% client-side.**

<br/>

[✨ Features](#-features) · [🎬 Demo](#-demo) · [🚀 Quick Start](#-quick-start) · [🏗️ Tech Stack](#️-tech-stack) · [🧪 Testing](#-testing) · [📁 Structure](#-project-structure) · [🤝 Contributing](#-contributing)

</div>

<br/>

<div align="center">

### 🔒 No install · No signup · No servers · No data ever leaves your device

</div>

---

## 🎬 Demo

<div align="center">

> 🖼️ *Drop a GIF or MP4 of the Studio in action here — e.g. `docs/demo.gif`*
>
> ```markdown
> ![OpenWebScreen Demo](docs/demo.gif)
> ```

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🎬 Studio

| | |
|---|---|
| 🎯 | **Auto-Zoom on Clicks** — smoothly zooms into the clicked region |
| 🖱️ | **Bézier Cursor Smoothing** — buttery cubic-Bézier interpolation, no jitter |
| 🌫️ | **Motion Blur** — directional blur on fast pans & zooms |
| 🎥 | **Webcam PIP Overlay** — draggable picture-in-picture bubble |
| 🖼️ | **Custom Backgrounds** — gradients, color wheel, or your own image |
| ✂️ | **Trim Editor** — cut dead air before exporting |
| 🎨 | **Click Ripple** — visual ripple baked into the recording |
| 🖥️ | **Cross-App Cursor Tracking** — frame-differencing, works across windows |
| 🎤 | **Mic + Live Level Meter** | 
| ⏱️ | **3-2-1 Countdown** before recording starts |
| ⌨️ | **Shortcuts** — `Space` `P` `Z` `B` |
| ⬇️ | **Export** — WebM (VP9/VP8) or MP4, fully local |

</td>
<td width="50%" valign="top">

### 🏠 Home Experience

| | |
|---|---|
| 🖥️ | **Smooth Mouse Tilt** — hero mockup follows cursor (GSAP `quickTo`) |
| 🎞️ | **Animated Entrance** — staggered fade-in on load |
| 🎴 | **Pixel Hover Cards** — canvas pixel-grid wave on hover, 9 feature cards |
| 🌌 | **3D Particle Background** — Three.js field with mouse parallax |
| 🌗 | **Dark Mode** — persisted via `localStorage` |
| 🧭 | **SPA Navigation** — Home · Features · Studio · Gallery · About |
| 📸 | **Recording Gallery** — history grid, play overlay, duration + size |

</td>
</tr>
</table>

---

## 🚀 Quick Start

```bash
# clone
git clone https://github.com/rahulpatle-sol/OpenWebScreen.git
cd OpenWebScreen

# install
npm install

# dev server → localhost:5173
npm run dev

# production build
npm run build

# preview production build
npm run preview
```

<div align="center">

**That's it. No API keys, no accounts, no backend to spin up.**

</div>

---

## 🎮 Keyboard Shortcuts

<div align="center">

| Key | Action |
|:---:|--------|
| `Space` | ⏯️ Start / Stop recording |
| `P` | ⏸️ Pause / Resume |
| `Z` | 🎯 Toggle auto-zoom |
| `B` | 🌫️ Toggle motion blur |

</div>

---

## 🏗️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP_3-88CE02?style=flat-square&logo=greensock&logoColor=black)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![Lucide](https://img.shields.io/badge/lucide--react-icons-F97316?style=flat-square)

</div>

```
Frontend    React 19 · Vite 6 · CSS (no framework)
Icons       lucide-react
Animation   GSAP 3 (ScrollTrigger, quickTo, ticker)
3D          Three.js (particle background)
Fonts       Fraunces (display) · Inter (body)
Testing     Playwright (22 E2E tests)
Backend     None. Zero. Nada — everything runs in your browser.
```

### 🧠 Architecture

- 🖼️ **Canvas compositing** — zoom, blur, backgrounds, webcam & ripples on one `<canvas>`
- 🎙️ **MediaRecorder API** — captures the composited canvas stream + audio tracks
- ⚡ **Cached backdrop** — gradient + shadow re-rendered only when settings change
- 🕵️ **Frame-differencing cursor** — lightweight fallback for tracking cursor in other windows
- 🧭 **SPA routing** — state-driven view switching, no React Router
- 🚫 **No backend** — everything runs client-side, nothing is ever uploaded

---

## 🧪 Testing

```bash
npm run test                  # headless, CI-ready
npx playwright test --ui      # interactive UI mode
```

<div align="center">

**✅ 22 Playwright E2E tests** covering home page · hero tilt · navigation · feature cards · pixel hover · studio controls · settings · webcam/mic · shortcuts · gallery · privacy/terms pages.

</div>

---

## 📁 Project Structure

```
src/
├── App.jsx                 # Root SPA — home / studio / editor / gallery / about / legal
├── main.jsx                # React entry
├── index.css                # All styles
└── components/
    ├── Hero3D.jsx           # Hero with smooth mouse-tilt mockup window
    ├── Features.jsx         # 9 feature cards with pixel hover grid
    ├── PixelHover.jsx        # Canvas pixel grid wave animation on hover
    ├── FeaturesPage.jsx      # Dedicated features page with detail
    ├── AboutPage.jsx         # About page with team values
    ├── Gallery.jsx           # Recording history grid — play + download
    ├── ThreeBackground.jsx   # Three.js particle field background
    ├── Recorder.jsx          # Core studio — compositing, zoom, blur, webcam, mic, export
    └── Editor.jsx             # Video playback + trim start/end
```

---

## ⚖️ Pages

| Route | Content |
|-------|---------|
| `/` | Hero tilt mockup, feature cards, dark mode, 3D particles |
| `/features` | Full feature list with descriptions |
| `/studio` | Screen recorder with all controls |
| `/gallery` | Recording history with thumbnails |
| `/about` | Project story and team values |
| `/privacy` | Privacy policy (no data collection, ever) |
| `/terms` | Terms of service |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# fork it, then:
git checkout -b feature/your-idea
git commit -m "feat: your idea"
git push origin feature/your-idea
# → open a Pull Request
```

Please open an issue first for major changes so we can discuss direction. Good first issues are tagged `good-first-issue`.

---

## 🗺️ Roadmap

- [ ] 🎞️ GIF export
- [ ] 🌐 Multi-monitor recording picker
- [ ] 🧩 Custom transition presets
- [ ] 🔊 System audio capture toggle
- [ ] 🌍 i18n support

---

## ⭐ Star History

<div align="center">

<a href="https://star-history.com/#rahulpatle-sol/OpenWebScreen&Date">
  <img src="https://api.star-history.com/svg?repos=rahulpatle-sol/OpenWebScreen&type=Date" alt="Star History Chart" width="600"/>
</a>

</div>

---

## 📄 License

**MIT** — use it, fork it, ship it, make it yours.

<div align="center">

<br/>

### Built with ❤️ for the open-source community

**No data leaves your machine · Everything runs client-side**

<br/>

![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)
![Open Source](https://img.shields.io/badge/Open%20Source-💜-9945FF?style=flat-square)

⭐ **If this saved you a paid screen recorder subscription, drop a star!** ⭐

</div>