// src/content/config.ts
// Content collections schema — references dual-file pattern from cms/
import { defineCollection } from 'astro:content';
import { postAstro } from '../../cms/postsAstro';
import { pageAstro } from '../../cms/pagesAstro';

const posts = defineCollection(postAstro);
const pages = defineCollection(pageAstro);

export const collections = { posts, pages };
