import { wallpapers, getFeatured, PATTERN_SECTIONS } from './wallpapers.js';
import { drawPattern, PALETTES, PATTERN_LABELS } from './engine.js';

const THUMB_W = 320;
const THUMB_H = 200;
const HERO_W = 1920;
const HERO_H = 820;

function renderToCanvas(wp, w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  drawPattern(c.getContext('2d'), w, h, wp.pattern, wp.palette, wp.seed, wp.inverted);
  return c;
}

const featured = getFeatured();

// Featured hero
const heroContainer = document.getElementById('featuredHero');
const heroCanvas = renderToCanvas(featured, HERO_W, HERO_H);
heroCanvas.style.width = '100%';
heroCanvas.style.height = '100%';
heroCanvas.style.objectFit = 'cover';
heroCanvas.style.display = 'block';
document.getElementById('featuredImg').replaceWith(heroCanvas);

document.getElementById('featuredTitle').textContent = featured.name;
document.getElementById('featuredMeta').textContent =
  `${PATTERN_LABELS[featured.pattern]} · ${PALETTES[featured.palette].name} · ${featured.inverted ? 'Claro' : 'Escuro'}`;
document.getElementById('featuredLink').href = `wallpaper/index.html?id=${featured.id}`;

// Pattern-grouped carousel sections
const sectionsContainer = document.getElementById('sectionsContainer');

PATTERN_SECTIONS.forEach(section => {
  const sectionWallpapers = wallpapers.filter(w => w.pattern === section.pattern);
  if (sectionWallpapers.length === 0) return;

  const sectionEl = document.createElement('div');
  sectionEl.className = 'section';

  // Header with arrows
  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    <div>
      <div class="section-title">${section.title}</div>
      <div class="section-subtitle">${section.subtitle}</div>
    </div>
    <div class="nav-arrows">
      <button class="nav-arrow scroll-left">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2L3 7l6 5"/></svg>
      </button>
      <button class="nav-arrow scroll-right">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 2l6 5-6 5"/></svg>
      </button>
    </div>
  `;
  sectionEl.appendChild(header);

  // Carousel
  const carousel = document.createElement('div');
  carousel.className = 'carousel section-carousel';

  sectionWallpapers.forEach(wp => {
    const card = document.createElement('div');
    card.className = 'carousel-card';

    const c = renderToCanvas(wp, THUMB_W, THUMB_H);
    c.style.width = '100%';
    c.style.height = '100%';
    card.appendChild(c);

    const overlay = document.createElement('div');
    overlay.className = 'wall-card-overlay';
    overlay.innerHTML = `
      <div class="wall-card-info">
        <div class="wall-card-name">${wp.name}</div>
        <div class="wall-card-res">${PALETTES[wp.palette].name} · ${wp.inverted ? 'Claro' : 'Escuro'}</div>
      </div>
    `;
    card.appendChild(overlay);

    card.addEventListener('click', () => {
      window.location.href = `wallpaper/index.html?id=${wp.id}`;
    });
    carousel.appendChild(card);
  });

  sectionEl.appendChild(carousel);
  sectionsContainer.appendChild(sectionEl);

  // Scroll arrows
  const scrollAmount = 300;
  header.querySelector('.scroll-left').onclick = () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };
  header.querySelector('.scroll-right').onclick = () => {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
});

// Hide loading overlay
requestAnimationFrame(() => {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.add('hidden');
});
