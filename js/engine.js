const DESKTOP_W = 3840, DESKTOP_H = 2160;
const MOBILE_W = 1290, MOBILE_H = 2796;

const PALETTES = [
  { name: 'Charcoal', colors: ['#000000','#141414','#2a2a2a','#404040','#595959','#737373','#8c8c8c','#b3b3b3','#d9d9d9','#ffffff'] },
  { name: 'Stone',    colors: ['#1a1714','#2c2825','#3e3a35','#534e47','#6b655c','#857d72','#9f9688','#b8b0a3','#d1c9bd','#ece6dc'] },
  { name: 'Blue',     colors: ['#01052b','#04137a','#0825c7','#0d39ff','#1552ff','#2f73ff','#58a3ff','#7dc3ff','#aedfff','#edf8ff'] },
  { name: 'Sunrise',  colors: ['#031c35','#05284a','#063862','#0b4b7a','#ff5b40','#ff7240','#ff9438','#ffb33f','#ffd064','#fff0c8'] },
  { name: 'Fire',     colors: ['#1a0000','#450000','#7a0000','#b30000','#e63900','#ff6a00','#ff9500','#ffb700','#ffd166','#fff1c2'] },
  { name: 'Purple',   colors: ['#100014','#22002e','#3f005a','#5c0085','#7a00b3','#9b1fff','#b84dff','#cf88ff','#e4c2ff','#f7ebff'] },
  { name: 'Toxic Glow', colors: ['#050807','#0c1410','#14221a','#1e3325','#2a4d2e','#3f6b2f','#5f8a2c','#86b326','#b9e83f','#f6ffe0'] },
  { name: 'Arctic Winter', colors: ['#081018','#112131','#1d3348','#33516a','#55768f','#7d9eb5','#a7c2d3','#cfe0ea','#e8f0f5','#ffffff']},
  { name: 'Neon Horizon', colors: ['#13051a','#290d3a','#3c1259','#3b2285','#2b42b0','#1d6cd4','#2ca1e8','#59cef2','#94f2f7','#e0fbfd'] },
  { name: 'Solar Flare', colors: ['#1f0505','#3a0d0d','#611111','#871c26','#ab3037','#cb4f41','#e6744a','#f79d5c','#fcc579','#fdf2a6'] },
  { name: 'Deep Forest', colors: ['#051214','#0b2426','#123a39','#18524c','#226b5d','#32856c','#49a07a','#68ba89','#91d49d','#c3ebd0'] },
  { name: 'Cosmic Blush Nebula', colors: ['#120414','#260824','#3f0f3d','#5c1a5c','#7a2a7a','#a33a86','#c85b98','#e98fb6','#ffd0dd','#fff1f6'] },
  { name: 'Ocean Depths', colors: ['#020c1b','#0a1628','#0f2847','#0d3b6e','#0e5a8a','#1a7fa0','#30a5b8','#5eccc5','#96ead8','#d4fff2'] },
  { name: 'Blood Moon', colors: ['#000000','#0f0000','#1f0000','#330000','#4d0000','#6b0000','#880000','#a50000','#c40000','#e60000'] },
];

const PATTERNS = ['flowing-hills', 'smooth-wave', 'sand-dunes', 'mountains', 'concentric-arcs', 'desert-dunes'];
const PATTERN_LABELS = ['Colinas', 'Onda', 'Dunas', 'Montanhas', 'Arcos', 'Deserto'];

let _seed = 0;

function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function noise(x) {
  const ix = Math.floor(x);
  const fx = x - ix;
  const t = fx * fx * (3 - 2 * fx);
  const seedA = Math.sin(ix * 127.1 + _seed * 0.01) * 43758.5453;
  const seedB = Math.sin((ix + 1) * 127.1 + _seed * 0.01) * 43758.5453;
  const a = seedA - Math.floor(seedA);
  const b = seedB - Math.floor(seedB);
  return a + (b - a) * t;
}

function fbm(x, octaves = 4) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise(x * freq);
    amp *= 0.5;
    freq *= 2.1;
  }
  return val;
}

function lerpColor(c1, c2, t) {
  const r1 = parseInt(c1.slice(1,3),16), g1 = parseInt(c1.slice(3,5),16), b1 = parseInt(c1.slice(5,7),16);
  const r2 = parseInt(c2.slice(1,3),16), g2 = parseInt(c2.slice(3,5),16), b2 = parseInt(c2.slice(5,7),16);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

function getColor(palette, t, inv) {
  const colors = PALETTES[palette].colors;
  const ct = inv ? 1 - t : t;
  const idx = ct * (colors.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;
  if (i >= colors.length - 1) return colors[colors.length - 1];
  if (i < 0) return colors[0];
  return lerpColor(colors[i], colors[i+1], f);
}

function getBgColor(palette, inv) {
  const colors = PALETTES[palette].colors;
  return inv ? colors[colors.length - 1] : colors[0];
}

function drawPineTree(ctx, x, bottomY, width, height, rng) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x - width * 0.08, bottomY);
  ctx.lineTo(x - width * 0.08, bottomY - height * 0.15);
  ctx.lineTo(x + width * 0.08, bottomY - height * 0.15);
  ctx.lineTo(x + width * 0.08, bottomY);
  ctx.fill();

  const segments = 30;
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1);
    const segHeight = height * 1;
    const topY = bottomY - height + (segHeight * t * 0.45);
    const currBottomY = bottomY - height + (segHeight * (t + 0.22));
    const currWidth = width * (0.25 + t * 0.75);
    ctx.beginPath();
    ctx.moveTo(x, topY);
    const jitterL = (rng() - 0.5) * (width * 0.08);
    const jitterR = (rng() - 0.5) * (width * 0.08);
    ctx.lineTo(x - currWidth / 2 + jitterL, currBottomY);
    ctx.lineTo(x + currWidth / 2 + jitterR, currBottomY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawFlowingHills(ctx, w, h, pal, rng, inv) {
  const layers = 5;
  const isDesktop = w > h;
  for (let i = 0; i < layers; i++) {
    const t = (i + 1) / layers;
    const spacingFactor = isDesktop ? 0.40 : 0.33;
    const baseY = h * (0.5 + (i / layers) * spacingFactor);
    ctx.fillStyle = getColor(pal, t * 0.85 + 0.1, inv);
    ctx.beginPath();
    ctx.moveTo(0, h);
    let ridgePoints = [];
    const geometryStep = Math.max(4, Math.round(w / 120));
    for (let x = 0; x <= w + geometryStep; x += geometryStep) {
      const nx = x / w;
      let y;
      if (i < 2) {
        const mountainAmplitude = isDesktop ? 0.32 : 0.12;
        const mountainFreq = isDesktop ? 4.5 : 2.5;
        y = baseY + fbm(nx * mountainFreq + i * 4.5, 10) * h * mountainAmplitude - (isDesktop ? h * 0.12 : h * 0.05);
      } else {
        const hillAmplitude = isDesktop ? 0.16 : 0.06;
        const hillFreq = isDesktop ? 2.5 : 1.5;
        y = baseY + fbm(nx * hillFreq + i * 2.1, 8) * h * hillAmplitude - (isDesktop ? h * 0.01 : h * 0.02);
      }
      ridgePoints.push({ x, y });
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    if (i >= 1) {
      let baseTreeWidth, baseTreeHeight;
      if (isDesktop) {
        baseTreeWidth = h * (0.045 + i * 0.004);
        baseTreeHeight = baseTreeWidth * (1 + rng() * 0.2);
      } else {
        baseTreeWidth = w * (0.12 + i * 0.004);
        baseTreeHeight = baseTreeWidth * (1 + rng() * 0.2);
      }
      const stepX = baseTreeWidth * 0.35;
      for (let x = 0; x <= w; x += stepX) {
        const pct = x / w;
        const ptIndex = Math.floor(pct * (ridgePoints.length - 1));
        const pt = ridgePoints[ptIndex] || ridgePoints[ridgePoints.length - 1];
        const rowsDown = isDesktop
          ? (i === 1 ? 3 : 5 + (layers - i))
          : (i === 1 ? 1 : 2 + (layers - i));
        for (let row = 0; row < rowsDown; row++) {
          const yOffset = row * (baseTreeHeight * 0.22);
          const currentBottomY = pt.y + yOffset;
          if (currentBottomY > h + 20) continue;
          const scale = isDesktop ? (0.65 + rng() * 1.1) : (0.8 + rng() * 0.4);
          const currentWidth = baseTreeWidth * (isDesktop ? Math.min(scale, 1.1) : scale);
          const currentHeight = baseTreeHeight * scale;
          const currentX = x + (rng() - 0.5) * (stepX * 0.5);
          drawPineTree(ctx, currentX, currentBottomY, currentWidth, currentHeight, rng);
        }
      }
    }
  }
}

function drawSmoothWave(ctx, w, h, pal, rng, inv) {
  const layers = 8 + (rng() * 5 | 0);
  const centerX = w * (0.45 + rng() * 0.1);
  const baseY = h * (0.75 + rng() * 0.08);
  for (let i = layers; i >= 0; i--) {
    const t = i / layers;
    const spread = h * (0.8 + t * 1.8);
    const peakH = h * (0.05 + t * 0.3);
    const skew = rng() * 0.2 - 0.10;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, baseY + peakH * 0.5);
    const steps = 120;
    for (let s = 0; s <= steps; s++) {
      const st = s / steps;
      const x = st * w;
      const dist = (x - centerX) / spread;
      const bell = Math.exp(-dist * dist * 0.4);
      const asymmetry = 1 + skew * dist;
      const wave = bell * peakH * asymmetry;
      const micro = fbm((x / h) * 2 + i * 1.4, 3) * h * 0.008;
      const y = baseY - wave + micro;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = getColor(pal, 0.1 + (1 - t) * 0.8, inv);
    ctx.fill();
  }
}

function drawSandDunes(ctx, w, h, pal, rng, inv) {
  const layers = 7 + (rng() * 5 | 0);
  for (let i = 0; i < layers; i++) {
    const t = (i + 1) / layers;
    const baseY = h * (0.55 + t * 0.35);
    const freq = 0.5 + rng() * 0.8;
    const phase = rng() * 10;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const nx = x / h;
      const wave = Math.sin(nx * Math.PI * freq + phase) * h * 0.05;
      const n = fbm(nx * 0.8 + i * 2.1, 3) * h * 0.05;
      const y = baseY + wave + n;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = getColor(pal, t * 0.8 + 0.15, inv);
    ctx.fill();
  }
}

function drawMountains(ctx, w, h, pal, rng, inv) {
  const layers = 5 + (rng() * 3 | 0);
  for (let i = 0; i < layers; i++) {
    const t = (i + 1) / layers;
    const baseY = h * (0.55 + t * 0.35);
    const peakCount = 2 + (rng() * 2 | 0);
    const offset = rng() * 50;
    ctx.beginPath();
    ctx.moveTo(-2, h + 2);
    const peaks = [];
    for (let p = 0; p < peakCount; p++) {
      peaks.push({
        cx: w * (0.1 + rng() * 0.8),
        peakH: h * (0.1 + rng() * 0.15) * (1 - i * 0.08),
        width: h * (0.6 + rng() * 0.6),
      });
    }
    for (let x = -2; x <= w + 2; x += 2) {
      let y = baseY;
      for (const p of peaks) {
        const dist = Math.abs(x - p.cx);
        if (dist < p.width) {
          const rise = (1 - dist / p.width);
          const sharpness = 1.3 + rng() * 0.3;
          const peakY = Math.pow(rise, sharpness) * p.peakH;
          y = Math.min(y, baseY - peakY);
        }
      }
      const micro = fbm((x / h) * 1.5 + i * 2.3 + offset, 3) * h * 0.008;
      ctx.lineTo(x, y + micro);
    }
    ctx.lineTo(w + 2, h + 2);
    ctx.closePath();
    ctx.fillStyle = getColor(pal, t * 0.8 + 0.12, inv);
    ctx.fill();
  }
}

function drawConcentricArcs(ctx, w, h, pal, rng, inv) {
  const maxR = h * 1.0;
  const originX = w * (0.45 + rng() * 0.1);
  const originY = h * 1.5;
  const rings = 14 + (rng() * 6 | 0);
  for (let i = rings; i >= 0; i--) {
    const t = i / rings;
    const r = maxR * t;
    ctx.beginPath();
    ctx.arc(originX, originY, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = getColor(pal, 0.1 + (1 - t) * 0.8, inv);
    ctx.fill();
  }
}

function drawDesertDunes(ctx, w, h, pal, rng, inv) {
  for (let i = 0; i < 15; i++) {
    const t = i / 15;
    ctx.beginPath();
    let x = w * rng(), y = h * (0.5 + rng() * 0.5);
    ctx.moveTo(x, y);
    for (let j = 0; j < 10; j++) {
      x += (rng() - 0.5) * w * 1;
      y += (rng() - 0.4) * h * 0.2;
      const cp1y = h * (0.5 + rng() * 0.5);
      const cp2y = h * (0.5 + rng() * 0.5);
      ctx.bezierCurveTo(w * rng(), cp1y, w * rng(), cp2y, x, y);
    }
    ctx.strokeStyle = getColor(pal, t, inv);
    ctx.lineWidth = rng() * 3;
    ctx.stroke();
  }
}

export function drawClockOverlay(ctx, w, h, type, paletteIdx, inv) {
  const bg = getBgColor(paletteIdx, inv);
  const r = parseInt(bg.slice(1,3), 16), g = parseInt(bg.slice(3,5), 16), b = parseInt(bg.slice(5,7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  ctx.fillStyle = brightness > 125 ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const time = `${hours}:${mins}`;
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`;

  if (type === 'desktop') {
    ctx.font = '300 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(dateStr, w / 2, h * 0.20);
    ctx.font = '600 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(time, w / 2, h * 0.30);
  } else if (type === 'mobile') {
    ctx.font = '500 7px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(dateStr.toUpperCase(), w / 2, h * 0.15);
    ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", Roboto';
    ctx.fillText(time, w / 2, h * 0.23);
  }
}

export function drawPattern(ctx, w, h, patternIdx, paletteIdx, s, inv = false) {
  _seed = s;
  const rng = mulberry32(s);
  ctx.fillStyle = getBgColor(paletteIdx, inv);
  ctx.fillRect(0, 0, w, h);

  switch(PATTERNS[patternIdx]) {
    case 'flowing-hills':   drawFlowingHills(ctx, w, h, paletteIdx, rng, inv); break;
    case 'smooth-wave':     drawSmoothWave(ctx, w, h, paletteIdx, rng, inv); break;
    case 'sand-dunes':      drawSandDunes(ctx, w, h, paletteIdx, rng, inv); break;
    case 'mountains':       drawMountains(ctx, w, h, paletteIdx, rng, inv); break;
    case 'concentric-arcs': drawConcentricArcs(ctx, w, h, paletteIdx, rng, inv); break;
    case 'desert-dunes':    drawDesertDunes(ctx, w, h, paletteIdx, rng, inv); break;
  }
}

export async function exportWallpaper(w, h, patternIdx, paletteIdx, s, inv, filename) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  drawPattern(c.getContext('2d'), w, h, patternIdx, paletteIdx, s, inv);

  const blob = await new Promise(resolve => c.toBlob(resolve, 'image/png'));
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = Array.from(new Uint8Array(arrayBuffer));

  if (window.__TAURI__) {
    await window.__TAURI__.core.invoke('save_wallpaper', { bytes, filename });
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export { PALETTES, PATTERNS, PATTERN_LABELS, DESKTOP_W, DESKTOP_H, MOBILE_W, MOBILE_H };
