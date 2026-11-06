# Astro Static Template

A reusable, SEO-optimized static website template built with Astro, Tailwind CSS v4, and Keystatic CMS.

## Features

- **🚀 Static-first**: Blazing fast performance with Astro's static site generation
- **🎨 Tailwind CSS v4**: CSS-first configuration with design tokens
- **📝 Keystatic CMS**: Edit content locally with markdown + MDX support
- **🔍 SEO Optimized**: Built-in SEO components, structured data, sitemap
- **📊 Analytics**: Google Tag Manager + GA4 with consent mode
- **🎯 WordPress Ready**: Optional headless CMS integration

## Quick Start

```bash
npm install
npm run dev
```

Then visit:
- **Site**: http://localhost:4321
- **CMS Editor**: http://localhost:4321/keystatic (dev mode only)

## Project Structure

```
├── public/              # Static assets
│   ├── fonts/          # Self-hosted fonts
│   └── og-default.jpg  # Default Open Graph image
├── src/
│   ├── assets/         # Images, icons, logos
│   ├── components/     # Reusable components
│   │   ├── layout/     # Header, Footer, Navigation
│   │   ├── seo/        # MetaTags, JsonLd, Breadcrumbs
│   │   ├── analytics/  # GTM, ConsentBanner
│   │   └── ui/         # Container, Button, Icon, etc.
│   ├── content/        # Content collections (Keystatic)
│   │   ├── config.ts   # Collection schemas
│   │   ├── posts/      # Blog posts
│   │   └── pages/      # Editable pages
│   ├── data/           # Site configuration
│   │   └── site.ts     # Brand, contact, nav, footer
│   ├── layouts/        # BaseLayout, PostLayout
│   ├── lib/            # Utilities
│   │   ├── seo.ts      # Schema.org builders
│   │   ├── analytics.ts # GTM helpers
│   │   └── wordpress-api.ts # Optional WP integration
│   ├── pages/          # Routes
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   ├── styles/         # Global styles
│   │   ├── tokens.css  # Design tokens (Tailwind v4)
│   │   └── base.css    # Base styles
│   └── types/          # TypeScript types
├── keystatic.config.ts # CMS configuration
├── astro.config.mjs    # Astro configuration
├── package.json
├── tsconfig.json
└── .env.example
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Variables:
- `PUBLIC_SITE_URL`: Canonical site URL (default: https://example.com)
- `PUBLIC_GTM_ID`: Google Tag Manager ID (optional)
- `PUBLIC_GA_ID`: Google Analytics 4 ID (optional)
- `WP_API_URL`: WordPress API URL (optional, for headless integration)

## Development

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build for production
npm run preview      # Preview production build
```

## Content Management

### Using Keystatic (Default)

Edit content at `/keystatic` (dev mode only). Content is stored as markdown in `src/content/`.

Collections:
- **Posts**: Blog articles with title, description, publish date, draft flag
- **Pages**: Editable pages with title, description, noindex flag

### Migrating to WordPress

1. Set `WP_API_URL` in `.env`
2. Update blog routes to use `fetchPosts()` from `src/lib/wordpress-api.ts`
3. Map WordPress fields to your view model

See `src/lib/wordpress-api.ts` for the client implementation.

## SEO

Built-in SEO features:
- Auto-generated canonical URLs
- Open Graph meta tags
- Twitter Cards
- JSON-LD structured data (Organization, WebSite, Article)
- Sitemap (auto-generated, excludes legal pages)
- robots.txt

Configure in `src/lib/seo.ts` and `src/data/site.ts`.

## Analytics

Conditional loading: analytics scripts only load when IDs are provided in `.env`.

Includes:
- Google Tag Manager
- Google Analytics 4
- Consent Mode v2 support
- Event tracking for clicks, downloads, outbound links

## Styling

Tailwind CSS v4 with CSS-first configuration:
- Design tokens in `src/styles/tokens.css`
- Custom properties for colors, spacing, typography
- Dark mode support via `[data-theme="dark"]`
- No magic numbers - all values come from tokens

## Deployment

Build static files:
```bash
npm run build
```

Deploy `dist/` folder to:
- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- Any static hosting

## License

MIT
