// scripts/generate-placeholders.mjs
// Genera las imÃ¡genes placeholder del demo de CarpinterÃ­a Castillo:
//   - src/assets/images/*.webp  â†’ hÃ©roes y galerÃ­a (optimizadas vÃ­a astro:assets)
//   - public/images/og-default-placeholder.avif â†’ imagen OG por defecto (spec)
//
// DiseÃ±o: fondos de tablones de madera con la paleta de marca y siluetas
// abstractas de mobiliario. Son ilustrativos (no simulan trabajos reales);
// el cliente los reemplaza por fotografÃ­as reales mÃ¡s adelante.
//
// Uso: node scripts/generate-placeholders.mjs

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'src', 'assets', 'images');
const PUBLIC_DIR = path.join(ROOT, 'public', 'images');

const PALETTE = {
  primary: '#8B5A2B',
  primaryDark: '#63401D',
  secondary: '#B08968',
  accent: '#D4A574',
  bg: '#FAF6F1',
  ink: '#2C1810',
  cream: '#FAF6F1',
};

// â”€â”€â”€ Color helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function clampChannel(v) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const f = (c) => clampChannel(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
  return `#${[(f(r), f(g), f(b))]
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Rampa de tonos de madera (variaciÃ³n determinista alrededor del base). */
function toneRamp(base, count, vary = 0.07) {
  const tones = [];
  for (let i = 0; i < count; i++) {
    const jitter = (((i * 53) % 11) / 11 - 0.5) * 2 * vary;
    tones.push(shade(base, jitter));
  }
  return tones;
}

// â”€â”€â”€ SVG helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function svgDoc(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

/** Tablones verticales u horizontales con juntas oscuras. */
function planks({ w, h, tones, count, vertical = true, gapOpacity = 0.2 }) {
  const parts = [];
  const step = (vertical ? w : h) / count;
  for (let i = 0; i < count; i++) {
    const pos = i * step;
    const tone = tones[i % tones.length];
    if (vertical) {
      parts.push(`<rect x="${pos.toFixed(1)}" y="0" width="${Math.ceil(step)}" height="${h}" fill="${tone}"/>`);
      if (i > 0) {
        parts.push(`<rect x="${(pos - 2).toFixed(1)}" y="0" width="3" height="${h}" fill="${PALETTE.ink}" opacity="${gapOpacity}"/>`);
      }
    } else {
      parts.push(`<rect x="0" y="${pos.toFixed(1)}" width="${w}" height="${Math.ceil(step)}" fill="${tone}"/>`);
      if (i > 0) {
        parts.push(`<rect x="0" y="${(pos - 2).toFixed(1)}" width="${w}" height="3" fill="${PALETTE.ink}" opacity="${gapOpacity}"/>`);
      }
    }
  }
  return parts.join('');
}

function defs() {
  return `
    <defs>
      <radialGradient id="highlight" cx="22%" cy="12%" r="75%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.14"/>
        <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="55%" stop-color="${PALETTE.ink}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${PALETTE.ink}" stop-opacity="0.38"/>
      </linearGradient>
    </defs>`;
}

// â”€â”€â”€ Siluetas de mobiliario (caja local 200Ã—200, fill sÃ³lido) â”€â”€â”€â”€â”€â”€â”€â”€

const SILHOUETTES = {
  wardrobe: `
    <rect x="10" y="14" width="180" height="10" rx="3"/>
    <rect x="20" y="24" width="160" height="150" rx="4"/>
    <rect x="98" y="24" width="4" height="150"/>
    <rect x="86" y="90" width="6" height="26" rx="3"/>
    <rect x="108" y="90" width="6" height="26" rx="3"/>
    <rect x="30" y="174" width="12" height="22"/>
    <rect x="158" y="174" width="12" height="22"/>`,
  door: `
    <rect x="60" y="10" width="80" height="180" rx="4"/>
    <rect x="72" y="26" width="56" height="74" rx="3"/>
    <rect x="72" y="112" width="56" height="64" rx="3"/>
    <circle cx="128" cy="104" r="5"/>`,
  table: `
    <rect x="20" y="60" width="160" height="14" rx="5"/>
    <rect x="34" y="74" width="132" height="10"/>
    <rect x="44" y="84" width="14" height="96"/>
    <rect x="142" y="84" width="14" height="96"/>
    <rect x="44" y="150" width="112" height="6"/>`,
  chair: `
    <rect x="122" y="20" width="14" height="116" rx="4"/>
    <polygon points="70,36 122,22 122,34 70,48"/>
    <rect x="54" y="120" width="86" height="12" rx="4"/>
    <rect x="60" y="132" width="12" height="54"/>
    <rect x="122" y="132" width="12" height="54"/>`,
  bookcase: `
    <rect x="40" y="16" width="120" height="176" rx="4"/>
    <rect x="46" y="64" width="108" height="6"/>
    <rect x="46" y="112" width="108" height="6"/>
    <rect x="46" y="160" width="108" height="6"/>
    <rect x="52" y="40" width="9" height="24"/>
    <rect x="63" y="46" width="10" height="18"/>
    <rect x="75" y="38" width="8" height="26"/>
    <rect x="85" y="42" width="12" height="22"/>
    <rect x="98" y="88" width="10" height="24"/>
    <rect x="110" y="94" width="8" height="18"/>
    <rect x="120" y="86" width="9" height="26"/>
    <rect x="62" y="146" width="40" height="7"/>
    <rect x="66" y="138" width="32" height="8"/>`,
  entryDoor: `
    <rect x="30" y="18" width="140" height="176" rx="4"/>
    <rect x="44" y="26" width="92" height="164" rx="3"/>
    <rect x="56" y="40" width="68" height="60" rx="3"/>
    <rect x="56" y="112" width="68" height="66" rx="3"/>
    <circle cx="124" cy="106" r="4"/>
    <rect x="146" y="26" width="16" height="164" rx="3"/>`,
};

function silhouette(name, x, y, scale, fill, opacity = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${fill}" opacity="${opacity}">${SILHOUETTES[name]}</g>`;
}

// â”€â”€â”€ Composiciones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function heroMain({ w = 1920, h = 1080 } = {}) {
  const body = `
    ${defs()}
    ${planks({ w, h, tones: toneRamp(PALETTE.secondary, 10), count: 10 })}
    <rect width="${w}" height="${h}" fill="url(#highlight)"/>
    ${silhouette('chair', 200, h - 470, 2.35, PALETTE.ink, 0.3)}
    ${silhouette('table', 520, h - 470, 2.35, PALETTE.ink, 0.3)}
    ${silhouette('wardrobe', 880, h - 500, 2.5, PALETTE.ink, 0.3)}
    ${silhouette('bookcase', 1300, h - 470, 2.35, PALETTE.ink, 0.3)}
    ${silhouette('chair', 1560, h - 470, 2.35, PALETTE.ink, 0.3)}
    <rect width="${w}" height="${h}" fill="url(#vignette)"/>`;
  return svgDoc(w, h, body);
}

function heroServices({ w = 1920, h = 800 } = {}) {
  const icon = {
    cabinet: '<rect x="5" y="4" width="14" height="16" rx="1.5" fill="none"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="10.2" y1="11" x2="10.2" y2="13.5"/><line x1="13.8" y1="11" x2="13.8" y2="13.5"/><line x1="8" y1="20" x2="8" y2="22"/><line x1="16" y1="20" x2="16" y2="22"/>',
    door: '<rect x="6" y="3" width="12" height="18" rx="1" fill="none"/><line x1="6" y1="15.5" x2="18" y2="15.5"/><rect x="8.75" y="5.75" width="6.5" height="7" rx="0.75" fill="none"/><circle cx="15.6" cy="13.9" r="1"/>',
    restore: '<path d="M8 18.93 A 8 8 0 0 1 8 5.07" fill="none"/><polyline points="6.5 8.47 8 5.07 4.3 4.67" fill="none"/><path d="M16 5.07 A 8 8 0 0 1 16 18.93" fill="none"/><polyline points="19.7 19.33 16 18.93 17.5 15.53" fill="none"/>',
  };
  const iconSvg = (name, x, y, scale) =>
    `<g transform="translate(${x} ${y}) scale(${scale})" stroke="${PALETTE.cream}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.26" fill="none">${icon[name]}</g>`;
  const s = 9;
  const body = `
    ${defs()}
    ${planks({ w, h, tones: toneRamp(PALETTE.primary, 12, 0.09), count: 12 })}
    <rect width="${w}" height="${h}" fill="url(#highlight)"/>
    ${iconSvg('cabinet', 480 - (24 * s) / 2, (h - 24 * s) / 2, s)}
    ${iconSvg('door', 960 - (24 * s) / 2, (h - 24 * s) / 2, s)}
    ${iconSvg('restore', 1440 - (24 * s) / 2, (h - 24 * s) / 2, s)}
    <rect width="${w}" height="${h}" fill="url(#vignette)"/>`;
  return svgDoc(w, h, body);
}

function heroProjects({ w = 1920, h = 800 } = {}) {
  const frame = (x, y, rw, rh, rot) =>
    `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" rx="10" fill="none" stroke="${PALETTE.cream}" stroke-width="10" opacity="0.22" transform="rotate(${rot} ${x + rw / 2} ${y + rh / 2})"/>`;
  const body = `
    ${defs()}
    ${planks({ w, h, tones: toneRamp(PALETTE.secondary, 8), count: 8, vertical: false })}
    <rect width="${w}" height="${h}" fill="url(#highlight)"/>
    ${frame(560, 250, 240, 185, -5)}
    ${frame(850, 320, 260, 200, 3)}
    ${frame(1160, 260, 230, 180, -2)}
    <rect width="${w}" height="${h}" fill="url(#vignette)"/>`;
  return svgDoc(w, h, body);
}

function heroContact({ w = 1920, h = 800 } = {}) {
  const envelope = `
    <g transform="translate(840 280) scale(10)" stroke="${PALETTE.cream}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.2">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <polyline points="3 7 12 13 21 7"/>
    </g>`;
  const body = `
    ${defs()}
    <rect width="${w}" height="${h}" fill="${PALETTE.primary}"/>
    <rect width="${w}" height="${h}" fill="${PALETTE.primaryDark}" opacity="0.35"/>
    <circle cx="1420" cy="180" r="300" fill="${PALETTE.accent}" opacity="0.12"/>
    <circle cx="260" cy="720" r="260" fill="${PALETTE.cream}" opacity="0.06"/>
    <circle cx="960" cy="400" r="420" fill="${PALETTE.accent}" opacity="0.06"/>
    ${envelope}
    <rect width="${w}" height="${h}" fill="url(#vignette)"/>`;
  return svgDoc(w, h, body);
}

function galleryPlaceholder({ name, base, silhouetteFill, w = 900, h = 675 } = {}) {
  const s = 2.6;
  const box = 200 * s;
  const x = (w - box) / 2;
  const y = (h - box) / 2 - 10;
  const body = `
    ${defs()}
    ${planks({ w, h, tones: toneRamp(base, 6), count: 6 })}
    <rect width="${w}" height="${h}" fill="url(#highlight)"/>
    ${silhouette(name, x, y, s, silhouetteFill, 0.88)}
    <rect width="${w}" height="${h}" fill="url(#vignette)"/>`;
  return svgDoc(w, h, body);
}

function ogImage({ w = 1200, h = 630 } = {}) {
  const lines = [];
  for (let i = 1; i < 10; i++) {
    lines.push(`<rect x="${i * 120}" y="0" width="3" height="${h}" fill="${PALETTE.ink}" opacity="0.05"/>`);
  }
  const body = `
    <rect width="${w}" height="${h}" fill="${PALETTE.bg}"/>
    ${lines.join('')}
    <rect x="96" y="155" width="320" height="320" rx="72" fill="${PALETTE.primary}"/>
    <path d="M 327.4 258.4 A 88 88 0 1 0 327.4 371.6" fill="none" stroke="${PALETTE.cream}" stroke-width="36" stroke-linecap="round"/>
    <path d="M 183.8 271 Q 172 315 183.8 359" fill="none" stroke="${PALETTE.accent}" stroke-width="36" stroke-linecap="round"/>
    <text x="480" y="316" font-family="Georgia, 'Times New Roman', serif" font-size="72" font-weight="bold" fill="${PALETTE.ink}">CarpinterÃ­a</text>
    <text x="480" y="400" font-family="Georgia, 'Times New Roman', serif" font-size="72" font-weight="bold" fill="${PALETTE.primary}">Castillo</text>
    <text x="482" y="478" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="#806A5C">Muebles a medida Â· Puertas Â· RestauraciÃ³n</text>
    <rect x="480" y="500" width="380" height="6" rx="3" fill="${PALETTE.accent}"/>`;
  return svgDoc(w, h, body);
}

// â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function render(svg, outPath, format = 'webp', quality = 82) {
  const buffer = Buffer.from(svg, 'utf-8');
  const pipeline = sharp(buffer);
  if (format === 'avif') {
    await pipeline.avif({ quality, effort: 4 }).toFile(outPath);
  } else {
    await pipeline.webp({ quality, effort: 5 }).toFile(outPath);
  }
  const { bytes } = await sharp(outPath).stats().then(() => ({})).catch(() => ({}));
  console.log(`  âœ“ ${path.relative(ROOT, outPath)}`);
}

async function main() {
  await mkdir(ASSETS_DIR, { recursive: true });
  await mkdir(PUBLIC_DIR, { recursive: true });

  console.log('Generando placeholders de CarpinterÃ­a Castilloâ€¦');

  await render(heroMain(), path.join(ASSETS_DIR, 'hero-placeholder.webp'));
  await render(heroServices(), path.join(ASSETS_DIR, 'services-hero-placeholder.webp'));
  await render(heroProjects(), path.join(ASSETS_DIR, 'projects-hero-placeholder.webp'));
  await render(heroContact(), path.join(ASSETS_DIR, 'contact-hero-placeholder.webp'));

  const gallery = [
    { key: 'closet', name: 'wardrobe', base: PALETTE.secondary, fill: PALETTE.ink },
    { key: 'door-oak', name: 'door', base: PALETTE.primary, fill: PALETTE.cream },
    { key: 'table', name: 'table', base: '#C49A6C', fill: PALETTE.ink },
    { key: 'chair', name: 'chair', base: '#7A4E24', fill: PALETTE.cream },
    { key: 'bookcase', name: 'bookcase', base: PALETTE.secondary, fill: PALETTE.ink },
    { key: 'entry-door', name: 'entryDoor', base: '#6E4A26', fill: PALETTE.cream },
  ];
  for (const item of gallery) {
    await render(
      galleryPlaceholder({ name: item.name, base: item.base, silhouetteFill: item.fill }),
      path.join(ASSETS_DIR, `project-placeholder-${item.key}.webp`),
      'webp',
      80
    );
  }

  // OG por defecto (site-spec.json â†’ seo.defaultImage)
  await render(ogImage(), path.join(PUBLIC_DIR, 'og-default-placeholder.avif'), 'avif', 60);

  console.log('Listo.');
}

main().catch((err) => {
  console.error('Error generando placeholders:', err);
  process.exit(1);
});
