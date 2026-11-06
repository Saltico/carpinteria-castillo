// cms/pagesKeystatic.ts
// Keystatic schema for CMS-managed pages — dual-file pattern.
// Referenced by keystatic.config.ts

import { fields } from '@keystatic/core';

export const pageKeystatic = {
  label: 'Pages',
  slugField: 'title',
  path: 'src/content/pages/*',
  format: { contentField: 'body' } as const,
  schema: {
    title: fields.text({ label: 'Title', validation: { length: { min: 1 } } }),
    description: fields.text({ label: 'Meta description', validation: { length: { min: 0, max: 160 } } }),
    noindex: fields.checkbox({ label: 'noindex', defaultValue: false }),
    body: fields.mdx({ label: 'Content' }),
  },
};
