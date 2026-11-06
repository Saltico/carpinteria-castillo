// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { loadEnv } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Env resolution (module scope) ──────────────────────────────────────────
// IMPORTANTE: Astro NO soporta function-configs al estilo Vite
// (`defineConfig(async ({ mode }) => …)` se descarta en silencio en
// mergeConfig, perdiendo site/integrations/i18n). El env se resuelve aquí,
// a nivel de módulo: loadEnv lee .env en cualquier modo (`.env` es
// mode-agnostic); process.env (CI/CD) tiene prioridad.
const mode = process.argv.includes('dev') ? 'development' : 'production';
const fileEnv = loadEnv(mode, __dirname, '');
const env = { ...fileEnv, ...process.env };

// Canonical production domain — override per project via PUBLIC_SITE_URL
// (`||` en vez de `??` para atrapar también strings vacíos)
const SITE_URL = env.PUBLIC_SITE_URL || 'https://example.com';

// i18n routing (site-spec.json → features.i18n)
const defaultLocale = env.PUBLIC_SITE_LANG || 'es';
const locales = (env.PUBLIC_I18N_LOCALES || defaultLocale)
  .split(',')
  .map((l) => l.trim())
  .filter(Boolean);

// Keystatic CMS — enabled via env var (dev mode only; Fase 2)
const enableKeystatic = env.ASTRO_ENABLE_KEYSTATIC === 'true';

// Base path for GitHub Project Pages (repo name = subpath)
const BASE_PATH = env.PUBLIC_BASE_PATH || '/carpinteria-castillo';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'never',
  i18n: {
    defaultLocale,
    locales,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !['/thank-you', '/404', '/500', '/legal', '/privacy', '/cookies', '/keystatic']
          .some((p) => page.includes(p)),
    }),
    // Keystatic integration — only when ASTRO_ENABLE_KEYSTATIC=true
    // (top-level await: el import condicional no se ejecuta en builds estáticos)
    ...(enableKeystatic
      ? [
          (await import('@keystatic/astro')).default(),
        ]
      : []),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  },
});
