import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import expressiveCode from 'astro-expressive-code';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkMark } from 'remark-mark-highlight';

import compress from 'astro-compress';

const USERNAME = 'user1-cloud';

export default defineConfig({
  site: `https://${USERNAME}.github.io`,
  base: '/',
  outDir: './dist',

  integrations: [
    expressiveCode(),
    mdx(),
    sitemap(),
    vue(),
    compress(),
  ],

  fonts: [{
    provider: fontProviders.local(),
    name: 'Atkinson',
    cssVariable: '--font-atkinson',
    fallbacks: ['sans-serif'],
    options: {
      variants: [
        { src: ['./src/assets/fonts/atkinson-regular.woff'], weight: 400, style: 'normal' },
        { src: ['./src/assets/fonts/atkinson-bold.woff'], weight: 700, style: 'normal' },
      ],
    },
  }],

  markdown: {
    remarkPlugins: [
        remarkGfm,
        remarkEmoji,
        remarkMath,
        remarkMark,
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