import { drawPattern, drawClockOverlay, exportWallpaper, PALETTES, PATTERNS, PATTERN_LABELS, DESKTOP_W, DESKTOP_H, MOBILE_W, MOBILE_H } from './engine.js';

let currentPattern = 0;
let currentPalette = 0;
let seed = Math.random() * 10000 | 0;
let inverted = false;

function render() {
  const dCtx = document.getElementById('previewDesktop').getContext('2d');
  const mCtx = document.getElementById('previewMobile').getContext('2d');
  drawPattern(dCtx, 640, 360, currentPattern, currentPalette, seed, inverted);
  drawPattern(mCtx, 145, 314, currentPattern, currentPalette, seed, inverted);
  drawClockOverlay(dCtx, 640, 360, 'desktop', currentPalette, inverted);
  drawClockOverlay(mCtx, 145, 314, 'mobile', currentPalette, inverted);
}

// Pattern grid
const grid = document.getElementById('styleGrid');
PATTERNS.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.className = 'style-btn' + (i === currentPattern ? ' active' : '');
  btn.title = PATTERN_LABELS[i];
  const c = document.createElement('canvas');
  c.width = 120;
  c.height = 75;
  btn.appendChild(c);
  grid.appendChild(btn);
  drawPattern(c.getContext('2d'), 120, 75, i, 0, 42, false);
  btn.onclick = () => {
    currentPattern = i;
    grid.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  };
});

// Palette row
const row = document.getElementById('paletteRow');
PALETTES.forEach((pal, i) => {
  const swatch = document.createElement('button');
  swatch.className = 'palette-swatch' + (i === currentPalette ? ' active' : '');
  swatch.title = pal.name;
  swatch.style.background = pal.colors[Math.floor(pal.colors.length / 2)];
  row.appendChild(swatch);
  swatch.onclick = () => {
    currentPalette = i;
    row.querySelectorAll('.palette-swatch').forEach(b => b.classList.remove('active'));
    swatch.classList.add('active');
    render();
  };
});

// Mode toggle
document.getElementById('btnDark').onclick = () => {
  inverted = false;
  document.getElementById('btnDark').classList.add('active');
  document.getElementById('btnLight').classList.remove('active');
  render();
};

document.getElementById('btnLight').onclick = () => {
  inverted = true;
  document.getElementById('btnLight').classList.add('active');
  document.getElementById('btnDark').classList.remove('active');
  render();
};

// Shuffle
document.getElementById('btnShuffle').onclick = () => {
  seed = Math.random() * 100000 | 0;
  render();
};

// Download
document.getElementById('btnDesktop').onclick = () => {
  exportWallpaper(DESKTOP_W, DESKTOP_H, currentPattern, currentPalette, seed, inverted, 'wllpr-desktop-4k.png');
};

document.getElementById('btnMobile').onclick = () => {
  exportWallpaper(MOBILE_W, MOBILE_H, currentPattern, currentPalette, seed, inverted, 'wllpr-iphone.png');
};

render();
