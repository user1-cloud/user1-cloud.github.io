import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import expressiveCode from 'astro-expressive-code';

import tailwindcss from '@tailwindcss/vite';

import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkMark } from 'remark-mark-highlight';

import compress from 'astro-compress';
import { remarkMermaid } from './src/plugins/remark-mermaid';
import { GITHUB_USERNAME } from './src/consts';

export default defineConfig({
  site: `https://${GITHUB_USERNAME}.github.io`,
  base: '/',
  outDir: './dist',

  integrations: [
    expressiveCode(),
    mdx(),
    sitemap(),
    compress(),
  ],

  markdown: {
    remarkPlugins: [
        remarkGfm,
        remarkEmoji,
        remarkMath,
        remarkMark,
        remarkMermaid,
      ],
      rehypePlugins: [
      [rehypeKatex, { output: 'html' }],
      rehypeSlug,
      rehypeAutolinkHeadings,
    ],
    syntaxHighlight: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});