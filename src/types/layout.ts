// src/types/layout.ts

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: 'linkedin' | 'instagram' | 'facebook' | 'whatsapp' | 'twitter' | 'github';
  url: string;
  label?: string;
}

export interface FooterProps {
  columns: FooterColumn[];
  legal: FooterLink[];
  brand: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  schedule?: string;
  social?: SocialLink[];
  logoUrl?: string;
  logoAlt?: string;
  siteUrl?: string;
}

export interface BaseLayoutProps {
  title: string;
  description: string;
  canonical?: string;
  showTopBar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}
