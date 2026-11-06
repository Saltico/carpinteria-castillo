// cms/pagesAstro.ts
// Astro content collection schema for CMS-managed pages — dual-file pattern.
// Referenced by src/content/config.ts

import { z } from 'astro/zod';

export const pageAstro = {
  type: 'content' as const,
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    noindex: z.boolean().default(false),
  }),
};
