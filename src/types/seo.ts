// src/types/seo.ts

export interface MetaTagsProps {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary_large_image' | 'summary';
  hreflang?: Record<string, string>;
  noindex?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  defaultLocale: string;
  phone?: string;
  email?: string;
  logoPath?: string;
}
