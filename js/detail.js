import { wallpapers, getWallpaper } from './wallpapers.js';
import { drawPattern, exportWallpaper, PALETTES, PATTERN_LABELS, DESKTOP_W, DESKTOP_H, MOBILE_W, MOBILE_H } from './engine.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const wp = getWallpaper(id);

if (!wp) {
  window.location.href = '../index.html';
}

// Render fullscreen canvas
const canvas = document.getElementById('wallpaperCanvas');
canvas.width = 1920;
canvas.height = 1080;
drawPattern(canvas.getContext('2d'), 1920, 1080, wp.pattern, wp.palette, wp.seed, wp.inverted);
document.title = `WLLPR — ${wp.name}`;

// Bar info
document.getElementById('barTitle').textContent = wp.name;
document.getElementById('metaRes').textContent = '3840×2160';
document.getElementById('metaPattern').textContent = PATTERN_LABELS[wp.pattern];
document.getElementById('metaPaletteName').textContent = PALETTES[wp.palette].name;

// Download dropdown toggle
const btnDownload = document.getElementById('btnDownload');
const dropdown = document.getElementById('downloadDropdown');

btnDownload.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

document.addEventListener('click', () => {
  dropdown.classList.remove('open');
});

document.getElementById('btnDownloadDesktop').addEventListener('click', () => {
  exportWallpaper(DESKTOP_W, DESKTOP_H, wp.pattern, wp.palette, wp.seed, wp.inverted, `wllpr-${wp.id}-desktop.png`);
  dropdown.classList.remove('open');
});

document.getElementById('btnDownloadMobile').addEventListener('click', () => {
  exportWallpaper(MOBILE_W, MOBILE_H, wp.pattern, wp.palette, wp.seed, wp.inverted, `wllpr-${wp.id}-mobile.png`);
  dropdown.classList.remove('open');
});

// Set wallpaper
document.getElementById('btnSetWallpaper').addEventListener('click', async () => {
  try {
    if (!window.__TAURI__) {
      alert('Funcionalidade disponível apenas no app desktop.');
      return;
    }
    const btn = document.getElementById('btnSetWallpaper');
    btn.textContent = 'Aplicando...';
    btn.disabled = true;

    const c = document.createElement('canvas');
    c.width = DESKTOP_W;
    c.height = DESKTOP_H;
    drawPattern(c.getContext('2d'), DESKTOP_W, DESKTOP_H, wp.pattern, wp.palette, wp.seed, wp.inverted);
    const blob = await new Promise(resolve => c.toBlob(resolve, 'image/png'));
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = Array.from(new Uint8Array(arrayBuffer));
    await window.__TAURI__.core.invoke('set_wallpaper', {
      bytes,
      filename: `wllpr-${wp.id}.png`,
    });

    await new Promise(r => setTimeout(r, 5000));
    btn.textContent = 'Aplicado!';

    setTimeout(() => {
      btn.textContent = 'Definir Papel de Parede';
      btn.disabled = false;
    }, 2000);
  } catch (err) {
    alert('Erro: ' + err);
    const btn = document.getElementById('btnSetWallpaper');
    btn.textContent = 'Definir Papel de Parede';
    btn.disabled = false;
  }
});
