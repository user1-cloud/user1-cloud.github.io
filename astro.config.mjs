// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import expressiveCode from 'astro-expressive-code';
import vue from '@astrojs/vue';

const USERNAME = 'user1-cloud';

export default defineConfig({
    site: `https://${USERNAME}.github.io`,
    base: '/',
    outDir: './dist',

    // 只保留稳定不崩的插件
    integrations: [expressiveCode(), mdx(), sitemap(), vue()],

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

    // ✅ 最稳定：LaTeX正常 + Mermaid不崩溃
    markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [[rehypeKatex, { output: 'html' }]],
        syntaxHighlight: {
            type: 'shiki',
            excludeLangs: ['math']
        }
    }
});