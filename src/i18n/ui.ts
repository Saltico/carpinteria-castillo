// src/i18n/ui.ts
// Locale types, per-locale route map and UI chrome strings (nav, footer, a11y).
// Content de páginas vive en ./content.ts (derivado de site-spec.json).

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const localeLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

/** Rutas por locale (site-spec.json → pages). es = default sin prefijo, en = /en/…
 * Sin slash final en las rutas: coincide con `trailingSlash: 'never'` y con el
 * formato de URLs del sitemap (raíz `/` es la única con slash). */
export const routePaths = {
  home: { es: '/', en: '/en' },
  services: { es: '/servicios', en: '/en/services' },
  projects: { es: '/proyectos', en: '/en/projects' },
  contact: { es: '/contacto', en: '/en/contact' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routePaths;

// Base path prefix for GitHub Pages subpath hosting (Astro's `base` config).
// Empty string when no base (root domain), '/carpinteria-castillo' for project pages.
const _base = import.meta.env.BASE_URL;
const _basePrefix = !_base || _base === '/' ? '' : _base.replace(/\/$/, '');

/** Resuelve la ruta de una página en el locale dado (con ancla opcional).
 *  Incluye el prefijo del base path (Astro `base` config) para que los
 *  enlaces funcionen correctamente en GitHub Project Pages. */
export function localePath(key: RouteKey, locale: Locale, hash?: string): string {
  const path = routePaths[key][locale];
  const fullPath = _basePrefix + (hash ? `${path}#${hash}` : path);
  return fullPath;
}

/** Alternativas de idioma (LanguageSwitcher + hreflang). */
export function localeAlternates(
  key: RouteKey
): { code: Locale; label: string; url: string }[] {
  return locales.map((code) => ({
    code,
    label: localeLabels[code],
    url: localePath(key, code),
  }));
}

export interface UiStrings {
  skipToContent: string;
  mainNav: string;
  menuTitle: string;
  openMenu: string;
  closeMenu: string;
  languageSelector: string;
  themeToLight: string;
  themeToDark: string;
  nav: { home: string; services: string; projects: string; contact: string };
  channels: { email: string; phone: string; whatsapp: string };
  footer: {
    tagline: string;
    siteTitle: string;
    servicesTitle: string;
    contactTitle: string;
    copyright: string;
    servicesLinks: { label: string; routeKey: RouteKey; hash: string }[];
  };
  notFound: {
    heading: string;
    description: string;
    backHome: string;
  };
}

export const ui: Record<Locale, UiStrings> = {
  es: {
    skipToContent: 'Saltar al contenido principal',
    mainNav: 'Navegación principal',
    menuTitle: 'Menú',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    languageSelector: 'Selector de idioma',
    themeToLight: 'Cambiar a modo claro',
    themeToDark: 'Cambiar a modo oscuro',
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      projects: 'Proyectos',
      contact: 'Contacto',
    },
    channels: {
      email: 'Correo electrónico',
      phone: 'Teléfono',
      whatsapp: 'WhatsApp',
    },
    footer: {
      tagline: 'Muebles a medida con alma de madera',
      siteTitle: 'Sitio',
      servicesTitle: 'Servicios',
      contactTitle: 'Contacto',
      copyright: 'Todos los derechos reservados.',
      servicesLinks: [
        { label: 'Muebles a medida', routeKey: 'services', hash: 'muebles-a-medida' },
        { label: 'Puertas', routeKey: 'services', hash: 'puertas' },
        { label: 'Restauración', routeKey: 'services', hash: 'restauracion' },
      ],
    },
    notFound: {
      // Sin `title`: el 404 usa site.defaultTitle/defaultDescription (spec)
      // como metadatos; este bloque es solo copy visible de la página.
      heading: 'Página no encontrada',
      description:
        'La página que buscas no existe, cambió de nombre o no está disponible en este momento.',
      backHome: 'Volver al inicio',
    },
  },
  en: {
    skipToContent: 'Skip to main content',
    mainNav: 'Main navigation',
    menuTitle: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    languageSelector: 'Language selector',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    nav: {
      home: 'Home',
      services: 'Services',
      projects: 'Projects',
      contact: 'Contact',
    },
    channels: {
      email: 'Email',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
    },
    footer: {
      tagline: 'Custom furniture with the soul of wood',
      siteTitle: 'Site',
      servicesTitle: 'Services',
      contactTitle: 'Contact',
      copyright: 'All rights reserved.',
      servicesLinks: [
        { label: 'Custom Furniture', routeKey: 'services', hash: 'custom-furniture' },
        { label: 'Doors', routeKey: 'services', hash: 'doors' },
        { label: 'Restoration', routeKey: 'services', hash: 'restoration' },
      ],
    },
    notFound: {
      heading: 'Page Not Found',
      description:
        'The page you are looking for does not exist, has changed its name, or is temporarily unavailable.',
      backHome: 'Back to homepage',
    },
  },
};
