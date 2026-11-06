// @ts-check
// Keystatic CMS configuration — modern API with defineConfig
// Manages editable content: blog posts, pages, and site settings.

import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Site Editor',
    },
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { length: { min: 1 } } }),
        description: fields.text({ label: 'Meta description', validation: { length: { min: 0, max: 160 } } }),
        pubDate: fields.date({ label: 'Publish date' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        ogImage: fields.text({ label: 'OG image path', validation: { length: { min: 0 } } }),
        body: fields.mdx({ label: 'Content' }),
      },
    }),
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { length: { min: 1 } } }),
        description: fields.text({ label: 'Meta description', validation: { length: { min: 0, max: 160 } } }),
        noindex: fields.checkbox({ label: 'noindex', defaultValue: false }),
        body: fields.mdx({ label: 'Content' }),
      },
    }),
    siteSettings: collection({
      label: 'Site Settings',
      slugField: 'key',
      path: 'src/content/settings/*',
      schema: {
        key: fields.text({ label: 'Key', validation: { length: { min: 1 } } }),
        label: fields.text({ label: 'Label' }),
        value: fields.text({ label: 'Value' }),
        description: fields.text({ label: 'Description' }),
      },
    }),
  },
});
