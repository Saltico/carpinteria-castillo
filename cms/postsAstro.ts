// cms/postsAstro.ts
// Astro content collection schema for blog posts — dual-file pattern.
// Referenced by src/content/config.ts

import { z } from 'astro/zod';

export const postAstro = {
  type: 'content' as const,
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
};
