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

- `/` — `src/pages/index.astro` (landing page with stats, charts, GitHub widgets)
- `/about/` — `src/pages/about.astro` (imports and renders `README.md` directly)
- `/blog/` — `src/pages/blog/index.astro` (blog listing with hierarchical directory view)
- `/blog/[slug]/` — `src/pages/blog/[...slug].astro` (individual post, catch-all route)
- `/blog/category/*/` — `src/pages/blog/category/[...slug].astro` (category filter)
- `/blog/tag/*/` — `src/pages/blog/tag/[tag].astro` (tag filter)
- `/blog/tags/` — `src/pages/blog/tags/index.astro` (tag cloud)
- `/rss.xml` — `src/pages/rss.xml.js`

### Layout pattern

All pages share a single layout: `src/layouts/BlogPost.astro`. It provides the HTML shell (`<HtmlHead>`, `<Header>`, `<Footer>`), a **three-column layout** with two collapsible sidebars:

- **Left sidebar** (`SidebarShell` + `SidebarLeft`) — Directory tree / tag tree + search button + theme switcher. Persists collapsed state via `localStorage` (key: `left-sidebar-state`, defaults to collapsed). On mobile, renders as an overlay with backdrop.
- **Right sidebar** (`SidebarShell` + `SidebarRight`) — Table of contents + post description. Persists collapsed state via `localStorage` (key: `blog-sidebar-collapsed`, defaults to collapsed).

Both sidebars share `SidebarShell.astro` for the collapsible panel chrome and initial localStorage sync.

### Component directory structure

```
src/components/
├── layout/     # HtmlHead, SidebarShell, Footer, Header, SidebarLeft, SidebarRight
├── blog/       # BlogCard, BlogList, FormattedDate, JsonLd, SearchModal
├── ui/         # HeaderLink, Icon, SocialLinks
├── widgets/    # Bilibili, MiniBrowser, Plot3D
└── github/     # GitHubContributions, GitHubLanguages, GitHubRepoStats, MonthlyChart
```

### Key components

- **BlogList.astro** — Renders the blog index. Supports `sort="time"` (flat, reverse chronological) and `sort="dir"` (two-level hierarchy via `dirOrder` prop).
- **BlogCard.astro** — Individual post card with image, title, description excerpt, and date. Accepts `level` prop (3 or 4) to control heading tag.
- **SearchModal.astro** — Client-side fuzzy search dialog (Fuse.js), triggered by Ctrl+K. Passes search data via `define:vars`.
- **Icon.astro** — SVG icon component, imports SVGs from `src/assets/icons/`.
- **MiniBrowser.astro** / **Plot3D.astro** / **Bilibili.astro** — Specialized content components used within blog posts.
- **GitHubContributions.astro** / **GitHubLanguages.astro** / **GitHubRepoStats.astro** / **MonthlyChart.astro** — GitHub stats widgets on the homepage.

### Data layer (`src/lib/`)

- **blogData.ts** — `getSidebarData()` for sidebar post lists, `getSearchData()` for search index.
- **blogStats.ts** — `computeSiteStats()` returns aggregate stats (article count, tags, categories, word count, monthly breakdown).
- **repoStats.ts** — `getRepoLanguages()` runs `git ls-files` to count lines per language.
- **utils.ts** — `resolveDirs()` helper for mapping post paths to dir1/dir2.

### Constants (`src/consts.ts`)

Centralized site configuration: `SITE_TITLE`, `SITE_DESCRIPTION`, social URLs, `DIR1_ORDER`/`DIR2_ORDER`, theme values, language extension mapping (`EXT_MAP`), and `fmtNum()` utility.

### Client scripts

- `src/scripts/toc.ts` — Builds the table of contents from `.prose > h2, .prose > h3` headings, highlights the active heading on scroll with smooth sidebar scrolling.
- `src/scripts/fade-in-on-scroll.ts` — Adds `visible` class to elements with `fade-*-on-scroll` classes when they intersect the viewport.
- `src/scripts/search.ts` — Client-side fuzzy search with Fuse.js, keyboard navigation, and result highlighting.
- `src/scripts/mermaid.ts` — Lazy-loads Mermaid from CDN and renders `pre.mermaid` elements. Guards initialization behind `hasDiagrams()` check.
- `src/scripts/sidebar-tree.ts` — Left sidebar tree accordion, mode switching (directory/tag), and position indicator.
- `src/scripts/sidebar-collapse.ts` — Right sidebar collapse button click handler (localStorage persistence).
- `src/scripts/theme.ts` — Theme switcher dropdown logic (6 themes, localStorage persistence).

### Styling

- `src/styles/global.scss` — Global styles (CSS custom variables, Tailwind directives, typography, link-underline mixin, scroll animations).
- `src/styles/blog-post.scss` — Three-column layout styles for the blog post layout.
- `src/styles/sidebar-shared.scss` — Shared sidebar panel structure, collapse button, and collapsed state styles.
- `src/styles/sidebar-tree.scss` — Left sidebar: tree view, toolbar, theme dropdown, mobile overlay.
- `src/styles/sidebar-toc.scss` — Right sidebar: TOC area, description area, position indicator, right button positioning.
- `src/styles/themes/` — 6 theme files (3 dark, 3 light). Theme is applied via `data-theme` attribute on `<html>`, persisted to `localStorage` (key: `blog-theme`).
- Tailwind CSS v4 via `@tailwindcss/vite`.

### Markdown plugins

Remark: `remark-gfm`, `remark-emoji`, `remark-math`, `remark-mark` (text highlighting). Rehype: `rehype-katex` (math rendering, HTML output), `rehype-slug`, `rehype-autolink-headings`. Code blocks use `astro-expressive-code`. Syntax highlighting via Shiki is disabled in favor of expressive-code.

### Site config

Site URL and base path are in `astro.config.mjs`. Global constants are in `src/consts.ts`. The username `user1-cloud` is set via `GITHUB_USERNAME` constant.
