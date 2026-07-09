# AI Wallpaper Generator

A desktop application built with [Tauri](https://tauri.app/) (Rust) and vanilla web technologies (HTML/JS/CSS) that generates stunning, infinite procedural wallpapers on the fly using mathematics and HTML5 Canvas.

## Features

- **Procedural Generation**: Every wallpaper is uniquely generated using random seeds and complex algorithms.
- **11 Generator Algorithms**: 
  - *Nature*: Flowing Hills, Smooth Waves, Sand Dunes, Mountains, Arcs, Scrawl.
  - *Experimental*: Retro Synthwave, Cosmic Nebula, Crystal Shards, Lava Lamp, Circuit Board.
- **14 Built-In Palettes**: Ranging from Charcoal and Stone to Toxic Glow and Neon Horizon.
- **Light & Dark Modes**: Every palette and algorithm reacts seamlessly to inverted color schemes.
- **Internationalization (i18n)**: Fully translated interface for the top 10 most spoken languages (English, Portuguese, Spanish, French, Mandarin, Hindi, Arabic, Bengali, Russian, Urdu).
- **Responsive Exporting**: Render and save 4K resolution desktop wallpapers (3840x2160) or mobile-optimized wallpapers (1290x2796) straight to your file system.

## How it Works

The core of the rendering pipeline is powered entirely by vanilla JavaScript (`engine.js`). Using seeded random number generators (Mulberry32) and procedural noise functions (Fractional Brownian Motion), the engine paints complex gradients, geometric grids, and particle-like effects onto a standard Canvas API context. 

Because it is purely mathematical, it uses zero external image assets, is incredibly lightweight, and can instantly scale graphics from a tiny UI thumbnail up to ultra-high 4K resolutions without pixelation.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Rust & Cargo](https://rustup.rs/) (for Tauri)

### Installation
1. Clone the repository
2. Run \`npm install\` to install frontend dependencies
3. Run \`npm run tauri dev\` to start the desktop app locally
4. To build a distributable executable for your OS, run \`npm run tauri build\`

## Contributing
Contributions are always welcome. To add a new procedural wallpaper generator:
1. Create a new `drawFunction` in `dist/js/engine.js`.
2. Append your style to the `PATTERNS` array and register it in `drawPattern`.
3. Add the localized titles to the `i18n.js` dictionary.
4. Add preset combinations to `wallpapers.js`.
