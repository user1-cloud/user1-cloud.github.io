# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server at http://localhost:4321
pnpm run build        # Build to dist/
pnpm run preview      # Preview production build locally
```

## Architecture

This is a static personal blog built with **Astro** (v6), deployed to GitHub Pages via the workflow in `.github/workflows/deploy.yml` on push to `master`.

### Content model

Blog posts live in `src/content/blog/` as `.md`/`.mdx` files, organized in subdirectories. The collection schema (`src/content.config.ts`) defines frontmatter: `title`, `description`, `pubDate` (required), plus `dir1` and `dir2` for hierarchical categorization. `dir1`/`dir2` default to the first/second segment of the file path if not set explicitly.

### Routing

- `/` — `src/pages/index.astro` (landing page)
- `/about/` — `src/pages/about.astro` (imports and renders `README.md` directly)
- `/blog/` — `src/pages/blog/index.astro` (blog listing with hierarchical directory view)
- `/blog/[slug]/` — `src/pages/blog/[...slug].astro` (individual post, catch-all route)
- `/rss.xml` — `src/pages/rss.xml.js`

### Layout pattern

All pages share a single layout: `src/layouts/BlogPost.astro`. It provides the HTML shell (`<BaseHead>`, `<Header>`, `<Footer>`), a two-column layout with a collapsible right sidebar (table of contents + description), and inlines sidebar toggle logic that persists state to `localStorage` (key: `blog-sidebar-collapsed`, defaults to collapsed).

### Key components

- **BlogList.astro** (`src/components/`) — Renders the blog index. Supports `sort="time"` (flat, reverse chronological) and `sort="dir"` (two-level hierarchy via `dirOrder` prop that specifies dir1/dir2 ordering).
- **BlogCard.astro** — Individual post card with image, title, description excerpt, and date. Accepts `level` prop (3 or 4) to control heading tag.
- **BoidsBackground.astro** — Animated background particle effect (boids flocking).
- **Icon.astro** — SVG icon component, imports SVGs from `src/assets/icons/`.
- **MiniBrowser.astro** / **Plot3D.astro** / **Bilibili.astro** — Specialized content components used within blog posts.

### Client scripts

- `src/scripts/toc.ts` — Builds the table of contents from `.prose > h2, .prose > h3` headings, highlights the active heading on scroll with smooth sidebar scrolling.
- `src/scripts/fade-in-on-scroll.ts` — Adds `visible` class to elements with `fade-*-on-scroll` classes when they intersect the viewport.

### Styling

- `src/styles/global.scss` — Global styles (dark theme, custom CSS variables, Tailwind directives, typography, link-underline mixin, scroll animations).
- `src/styles/blog-post.scss` — Layout styles for the two-column blog post layout and sidebar toggle button.
- Tailwind CSS v4 via `@tailwindcss/vite`.

### Markdown plugins

Remark: `remark-gfm`, `remark-emoji`, `remark-math`, `remark-mark` (text highlighting). Rehype: `rehype-katex` (math rendering, HTML output), `rehype-slug`, `rehype-autolink-headings`. Code blocks use `astro-expressive-code`. Syntax highlighting via Shiki is disabled in favor of expressive-code.

### Site config

Site URL and base path are in `astro.config.mjs`. The username `user1-cloud` is hardcoded there for the `site` field (`https://user1-cloud.github.io`). Global constants (`SITE_TITLE`, `SITE_DESCRIPTION`) are in `src/consts.ts`.
