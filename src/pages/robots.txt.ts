// src/pages/robots.txt.ts
// Dynamic robots.txt — sitemap URL respects site + base config (GitHub Pages subpath).

import type { APIRoute } from 'astro';

export const GET: APIRoute = (context) => {
  const siteUrl = (context.site?.toString() ?? 'https://example.com').replace(/\/$/, '');
  const base = import.meta.env.BASE_URL;
  const basePrefix = !base || base === '/' ? '' : base.replace(/\/$/, '');
  const sitemapUrl = `${siteUrl}${basePrefix}/sitemap-index.xml`;

  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /keystatic/',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
