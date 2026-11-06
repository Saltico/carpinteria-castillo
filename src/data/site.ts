// src/data/site.ts
// Fuente única de datos compartidos del sitio (marca, contacto, navegación).
// El contacto SIEMPRE se lee de variables de entorno (PUBLIC_CONTACT_*),
// nunca hardcodeado. En Fase 2 (Keystatic) puede sobreponerse vía colecciones.

import type { NavItem } from '@/types/navigation';
import type { FooterColumn, FooterLink, SocialLink } from '@/types/layout';
import { ui, localePath, type Locale } from '@/i18n/ui';

// ─── Site root (FULL URL including base path, no trailing slash) ─────
// Astro's `site` config = domain only (e.g. https://saltico.github.io).
// `base` config = subpath (e.g. /carpinteria-castillo). Combined = siteRoot.
// Used by getSiteUrl(), schemas, and canonical URLs.
const _siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://example.com';
const _base = import.meta.env.BASE_URL;
export const siteRoot: string =
  !_base || _base === '/'
    ? _siteUrl.replace(/\/$/, '')
    : new URL(_base, _siteUrl).toString().replace(/\/$/, '');

// ─── Marca (site-spec.json → brand) ──────────────────────────────────
const _logoBase = !_base || _base === '/' ? '' : _base.replace(/\/$/, '');
export const siteBrand = {
  name: 'Carpintería Castillo',
  logoUrl: `${_logoBase}/logo.svg`,
  logoDarkUrl: `${_logoBase}/logo-dark.svg`,
  siteUrl: siteRoot,
};

// ─── Idioma (site-spec.json → site.language / features.i18n) ─────────
export const siteLanguage = import.meta.env.PUBLIC_SITE_LANG ?? 'es';

// ─── Metadatos por defecto (site-spec.json → site.defaultTitle /
//     site.defaultDescription, spec aprobado 2026-11-06) ──────────────
// Copy genérico aprobado dentro de rango (title 50–60 / description
// 140–160) y único frente a las 9 páginas del build. Usado por el 404
// (noindex); no es copy de página — no inventar variantes.
export const siteDefaults = {
  title: 'Carpintería Castillo | Muebles a medida, puertas y más',
  description:
    'Carpintería artesanal: muebles a medida, puertas de madera maciza y restauración profesional. Calidad, diseño y calidez en cada proyecto que realizamos.',
};

// ─── Contacto (site-spec.json → site.contact, vía .env) ──────────────
export const siteContact = {
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? '',
  phone: import.meta.env.PUBLIC_CONTACT_PHONE ?? '',
  whatsappUrl: import.meta.env.PUBLIC_WHATSAPP_URL ?? '',
  mapsEmbedUrl: import.meta.env.PUBLIC_MAPS_EMBED_URL ?? '',
};

// ─── TopBar por locale ───────────────────────────────────────────────
export interface TopbarData {
  phone: string;
  email: string;
  social: SocialLink[];
  links: Array<{ label: string; url: string }>;
}

export function getTopbarData(locale: Locale): TopbarData {
  const social: SocialLink[] = siteContact.whatsappUrl
    ? [{ platform: 'whatsapp', url: siteContact.whatsappUrl, label: 'WhatsApp' }]
    : [];
  return { phone: siteContact.phone, email: siteContact.email, social, links: [] };
}

// ─── Navegación por locale ───────────────────────────────────────────
export function getNavigation(locale: Locale): NavItem[] {
  const labels = ui[locale].nav;
  return [
    { label: labels.home, url: localePath('home', locale) },
    { label: labels.services, url: localePath('services', locale) },
    { label: labels.projects, url: localePath('projects', locale) },
    { label: labels.contact, url: localePath('contact', locale) },
  ];
}

// ─── Footer por locale ───────────────────────────────────────────────
export interface FooterData {
  columns: FooterColumn[];
  legal: FooterLink[];
}

export function getFooterData(locale: Locale): FooterData {
  const t = ui[locale].footer;
  const nav = ui[locale].nav;
  const columns: FooterColumn[] = [
    {
      title: t.servicesTitle,
      links: t.servicesLinks.map(({ label, routeKey, hash }) => ({
        label,
        url: localePath(routeKey, locale, hash),
      })),
    },
    {
      title: t.siteTitle,
      links: [
        { label: nav.home, url: localePath('home', locale) },
        { label: nav.services, url: localePath('services', locale) },
        { label: nav.projects, url: localePath('projects', locale) },
        { label: nav.contact, url: localePath('contact', locale) },
      ],
    },
  ];
  // El spec no define páginas legales: sin enlaces legales.
  return { columns, legal: [] };
}
