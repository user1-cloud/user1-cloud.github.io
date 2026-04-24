// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import expressiveCode from 'astro-expressive-code';

import vue from '@astrojs/vue';

const USERNAME = 'user1-cloud';

// https://astro.build/config
export default defineConfig({
    site: 'https://${USERNAME}.github.io',
    integrations: [expressiveCode(),mdx(), sitemap(), vue()],
    fonts: [
        {
            provider: fontProviders.local(),
            name: 'Atkinson',
            cssVariable: '--font-atkinson',
            fallbacks: ['sans-serif'],
            options: {
                variants: [
                    {
                        src: ['./src/assets/fonts/atkinson-regular.woff'],
                        weight: 400,
                        style: 'normal',
                        display: 'swap',
                    },
                    {
                        src: ['./src/assets/fonts/atkinson-bold.woff'],
                        weight: 700,
                        style: 'normal',
                        display: 'swap',
                    },
                ],
            },
        },
    ],

    markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [
        [rehypeKatex, { output: 'mathml' }],
        [  
            rehypeMermaid,  
            {  
            strategy: 'img-svg',  
            dark: true,  
            }  
        ],   
        ],
        syntaxHighlight: {
        // type: 'shiki',
        excludeLangs: ['math', 'mermaid']
        }
    }
});