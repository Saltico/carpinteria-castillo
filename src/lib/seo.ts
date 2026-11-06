// src/lib/seo.ts
// Schema.org builders + getSiteUrl() + localBusinessSchema

import type { SiteConfig } from '@/types/seo';
import { siteBrand, siteContact, siteLanguage, siteRoot } from '@/data/site';

// OG image por defecto (site-spec.json â†’ seo.defaultImage)
export const DEFAULT_OG_IMAGE = '/images/og-default-placeholder.avif';

const DEFAULT_CONFIG: SiteConfig = {
  siteUrl: siteRoot,
  siteName: siteBrand.name,
  defaultLocale: siteLanguage,
  phone: siteContact.phone || undefined,
  email: siteContact.email || undefined,
  logoPath: siteBrand.logoUrl,
};

export function getSiteConfig(): SiteConfig {
  return DEFAULT_CONFIG;
}

/**
 * Build a full URL from a route path (e.g. '/', '/en', '/servicios').
 * Paths are resolved relative to siteRoot (site + base).
 * If the path already includes the base prefix (e.g. from Astro.url.pathname),
 * it is resolved directly against the domain to avoid duplication.
 */
export function getSiteUrl(path = ''): string {
  const base = import.meta.env.BASE_URL;
  const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://example.com';
  const basePrefix = !base || base === '/' ? '' : base.replace(/\/$/, '');

  // If path already starts with the base (e.g. Astro.url.pathname), resolve
  // directly against the bare domain — avoids double-prefixing.
  if (basePrefix && path.startsWith(basePrefix)) {
    return new URL(path, siteUrl).toString();
  }

  // Otherwise, prepend base to the path and resolve against the domain.
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(basePrefix + normalizedPath, siteUrl).toString();
}

export function organizationSchema(): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: getSiteUrl(config.logoPath ?? '/logo.svg'),
    contactPoint: {
      '@type': 'ContactPoint',
      ...(config.phone && { telephone: config.phone }),
      contactType: 'customer service',
      ...(config.email && { email: config.email }),
      availableLanguage: ['Spanish', 'English'],
    },
  };
}

export function websiteSchema(searchUrl?: string): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

/**
 * LocalBusiness (HomeAndConstructionBusiness) para CarpinterÃ­a Castillo.
 * Solo incluye datos reales del spec/env: sin direcciÃ³n, geo u horarios
 * inventados (site-spec.json â†’ site.contact sin address).
 */
export function localBusinessSchema(options?: {
  name?: string;
  address?: string;
  openingHours?: string;
  mapsEmbedUrl?: string;
}): Record<string, unknown> {
  const config = getSiteConfig();
  const name = options?.name ?? config.siteName;

  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name,
    url: config.siteUrl,
    logo: getSiteUrl(config.logoPath ?? '/logo.svg'),
    image: getSiteUrl(DEFAULT_OG_IMAGE),
    ...(config.phone && { telephone: config.phone }),
    ...(config.email && { email: config.email }),
    ...(options?.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: options.address,
      },
    }),
    ...(options?.openingHours && { openingHours: options.openingHours }),
    ...(options?.mapsEmbedUrl && {
      hasMap: options.mapsEmbedUrl,
    }),
  };
}

export function breadcrumbSchema(items: { label: string; url?: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url ? getSiteUrl(item.url) : undefined,
    })),
  };
}

export function articleSchema(
  headline: string,
  description: string,
  url: string,
  datePublished: string,
  image?: string
): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    datePublished,
    image: image ?? getSiteUrl(DEFAULT_OG_IMAGE),
    author: {
      '@type': 'Organization',
      name: config.siteName,
    },
    publisher: organizationSchema(),
  };
}

export function blogPostingSchema(
  headline: string,
  description: string,
  url: string,
  datePublished: string,
  image?: string
): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url,
    datePublished,
    image: image ?? getSiteUrl(DEFAULT_OG_IMAGE),
    author: {
      '@type': 'Organization',
      name: config.siteName,
    },
    publisher: organizationSchema(),
  };
}

export function combineSchemas(...schemas: Record<string, unknown>[]): Record<string, unknown>[] {
  return schemas;
}
