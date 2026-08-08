import { drawPattern, drawClockOverlay, exportWallpaper, PALETTES, PATTERNS, PATTERN_LABELS, DESKTOP_W, DESKTOP_H, MOBILE_W, MOBILE_H } from './engine.js';
import { initI18n, t } from './i18n.js';

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
  btn.title = t('patternLabels')[i];
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
  const colors = pal.colors;
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

// Apply as wallpaper
document.getElementById('btnApply').addEventListener('click', async () => {
  try {
    if (!window.__TAURI__) {
      alert(t('errorOnlyDesktop'));
      return;
    }
    const btn = document.getElementById('btnApply');
    const span = btn.querySelector('span') || btn;
    span.textContent = t('applying');
    btn.disabled = true;

    const c = document.createElement('canvas');
    c.width = DESKTOP_W;
    c.height = DESKTOP_H;
    drawPattern(c.getContext('2d'), DESKTOP_W, DESKTOP_H, currentPattern, currentPalette, seed, inverted);
    const blob = await new Promise(resolve => c.toBlob(resolve, 'image/png'));
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = Array.from(new Uint8Array(arrayBuffer));
    await window.__TAURI__.core.invoke('set_wallpaper', {
      bytes,
      filename: `wllpr-custom-${seed}.png`,
    });

    await new Promise(r => setTimeout(r, 5000));
    span.textContent = t('applied');
    setTimeout(() => {
      span.textContent = t('setWallpaper');
      btn.disabled = false;
    }, 2000);
  } catch (err) {
    alert(t('error') + err);
    const btn = document.getElementById('btnApply');
    const span = btn.querySelector('span') || btn;
    span.textContent = t('setWallpaper');
    btn.disabled = false;
  }
});

render();
initI18n();
