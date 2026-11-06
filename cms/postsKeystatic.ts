// cms/postsKeystatic.ts
// Keystatic schema for blog posts — dual-file pattern.
// Referenced by keystatic.config.ts

import { fields } from '@keystatic/core';

export const postKeystatic = {
  label: 'Blog Posts',
  slugField: 'title',
  path: 'src/content/posts/*',
  format: { contentField: 'body' } as const,
  schema: {
    title: fields.text({ label: 'Title', validation: { length: { min: 1 } } }),
    description: fields.text({ label: 'Meta description', validation: { length: { min: 0, max: 160 } } }),
    pubDate: fields.date({ label: 'Publish date' }),
    draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
    ogImage: fields.text({ label: 'OG image path', validation: { length: { min: 0 } } }),
    body: fields.mdx({ label: 'Content' }),
  },
};
