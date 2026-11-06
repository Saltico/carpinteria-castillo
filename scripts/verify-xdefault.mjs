// scripts/verify-xdefault.mjs
// Verificación automatizada del hallazgo S-1 (ciclo QA 2/2, 2026-11-05):
// el `hreflang="x-default"` de cada página debe apuntar a su equivalente ES
// (locale por defecto), NO al canonical propio de las páginas /en/*.
//
// Uso: ejecutar tras `npm run build` (lee dist/ y .env). Sale con código 1
// ante cualquier discrepancia — pensado para gates de QA automatizados.
//
// Comprobaciones por página (las 9 del build: 4 ES + 4 EN + 404):
//   1. Exactamente UN tag x-default (sin duplicados).
//   2. x-default === URL del equivalente ES según el mapa de rutas.
//   3. Exactamente UN canonical, con la URL de ruta propia (conservado).
//   4. Alternates hreflang es/en conservados con sus URLs correctas
//      (solo páginas con i18n; el 404 no declara alternates de idioma).
//   5. En páginas ES, x-default === canonical propio (implícito en 2+3).

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

// Base URL canónica del build: PUBLIC_SITE_URL de .env (fallback del template).
let siteUrl = 'https://example.com';
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  const match = readFileSync(envPath, 'utf8').match(/^PUBLIC_SITE_URL=(.*)$/m);
  if (match && match[1].trim()) siteUrl = match[1].trim();
}
const abs = (path) => new URL(path, siteUrl).toString();

// Mapa de rutas → equivalentes por locale (espejo de src/i18n/ui.ts routePaths).
// xDefault = ruta ES equivalente (locale por defecto sin prefijo).
const ROUTES = [
  { file: 'index.html', route: '/', es: '/', en: '/en', hasI18n: true },
  { file: 'servicios/index.html', route: '/servicios', es: '/servicios', en: '/en/services', hasI18n: true },
  { file: 'proyectos/index.html', route: '/proyectos', es: '/proyectos', en: '/en/projects', hasI18n: true },
  { file: 'contacto/index.html', route: '/contacto', es: '/contacto', en: '/en/contact', hasI18n: true },
  { file: 'en/index.html', route: '/en', es: '/', en: '/en', hasI18n: true },
  { file: 'en/services/index.html', route: '/en/services', es: '/servicios', en: '/en/services', hasI18n: true },
  { file: 'en/projects/index.html', route: '/en/projects', es: '/proyectos', en: '/en/projects', hasI18n: true },
  { file: 'en/contact/index.html', route: '/en/contact', es: '/contacto', en: '/en/contact', hasI18n: true },
  { file: '404.html', route: '/404', es: '/404', en: null, hasI18n: false },
];

/** Extrae el valor de un atributo `name="value"` de un tag HTML. */
function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : null;
}

const failures = [];
const rows = [];

for (const page of ROUTES) {
  const filePath = join(dist, page.file);
  const label = `${page.route}  (${page.file})`;

  if (!existsSync(filePath)) {
    failures.push(`${label}: ARCHIVO INEXISTENTE en dist/`);
    rows.push({ label, xDefault: '(archivo inexistente)', expected: abs(page.es), ok: false });
    continue;
  }

  const html = readFileSync(filePath, 'utf8');
  const linkTags = html.match(/<link\b[^>]*>/g) ?? [];
  const links = linkTags.map((tag) => ({
    rel: attr(tag, 'rel'),
    hreflang: attr(tag, 'hreflang'),
    href: attr(tag, 'href'),
  }));

  const canonicals = links.filter((l) => l.rel === 'canonical');
  const xDefaults = links.filter((l) => l.rel === 'alternate' && l.hreflang === 'x-default');
  const esAlt = links.filter((l) => l.rel === 'alternate' && l.hreflang === 'es');
  const enAlt = links.filter((l) => l.rel === 'alternate' && l.hreflang === 'en');

  const expectedXDefault = abs(page.es);
  const xDefaultHref = xDefaults[0]?.href ?? '(ausente)';
  let ok = true;

  // 1. Un único x-default, sin duplicados
  if (xDefaults.length !== 1) {
    ok = false;
    failures.push(`${label}: se esperaba 1 tag x-default, hay ${xDefaults.length}`);
  }
  // 2. x-default apunta al equivalente ES
  if (xDefaults.length === 1 && xDefaultHref !== expectedXDefault) {
    ok = false;
    failures.push(`${label}: x-default="${xDefaultHref}" ≠ equivalente ES "${expectedXDefault}"`);
  }
  // 3. Un único canonical con la URL de la ruta propia (conservado)
  if (canonicals.length !== 1) {
    ok = false;
    failures.push(`${label}: se esperaba 1 canonical, hay ${canonicals.length}`);
  } else if (canonicals[0].href !== abs(page.route)) {
    ok = false;
    failures.push(`${label}: canonical="${canonicals[0].href}" ≠ "${abs(page.route)}"`);
  }
  // 4. Alternates de idioma conservados (páginas i18n) o ausentes (404)
  if (page.hasI18n) {
    if (esAlt.length !== 1 || esAlt[0].href !== abs(page.es)) {
      ok = false;
      failures.push(`${label}: alternate es inválido (${esAlt.map((l) => l.href).join(', ') || 'ausente'})`);
    }
    if (enAlt.length !== 1 || enAlt[0].href !== abs(page.en)) {
      ok = false;
      failures.push(`${label}: alternate en inválido (${enAlt.map((l) => l.href).join(', ') || 'ausente'})`);
    }
  } else if (esAlt.length > 0 || enAlt.length > 0) {
    ok = false;
    failures.push(`${label}: el 404 no debe declarar alternates de idioma`);
  }

  rows.push({ label, xDefault: xDefaultHref, expected: expectedXDefault, ok });
}

// ─── Reporte ────────────────────────────────────────────────────────────────
const width = Math.max(...rows.map((r) => r.label.length)) + 2;
console.log(`\nVerificación S-1 (QA 2/2) — x-default → equivalente ES`);
console.log(`Base URL del build (PUBLIC_SITE_URL): ${siteUrl}`);
console.log(`${'PÁGINA'.padEnd(width)}  x-default emitido                    x-default esperado (ES)      RESULTADO`);
console.log('-'.repeat(width + 100));
for (const r of rows) {
  console.log(
    `${r.label.padEnd(width)}  ${r.xDefault.padEnd(37)}  ${r.expected.padEnd(28)}  ${r.ok ? 'PASS' : 'FAIL'}`
  );
}
console.log('-'.repeat(width + 100));

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} discrepancia(s):\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
} else {
  console.log(`\n✓ ${rows.length}/${rows.length} páginas verificadas — cero discrepancias: cada x-default apunta a su equivalente ES.`);
  process.exit(0);
}
