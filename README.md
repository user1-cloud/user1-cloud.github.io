# 个人博客

基于 **Astro** 构建的静态个人博客，追求极致的性能与简洁的开发体验。

---

## 功能特性

- **模糊搜索**：Ctrl+K 唤起搜索弹窗，基于 Fuse.js 模糊匹配，搜索结果高亮关键词
- **分类与标签**：按文件夹层级自动分类（dir1/dir2），支持标签筛选与标签云页面
- **多主题切换**：6 种主题配色（3 种暗色 + 3 种亮色），偏好持久化到 localStorage
- **响应式布局**：自适应桌面端与移动端
- **三栏布局**：左侧目录树/标签树 + 中间正文 + 右侧文章目录，双侧栏可折叠，状态持久化
- **KaTeX 数学公式**：支持 LaTeX 数学公式渲染
- **Mermaid 图表**：支持流程图、时序图等 Markdown 图表渲染
- **GitHub 统计**：首页展示站点统计、月度发文图表、仓库语言构成和贡献墙
- **JSON-LD 结构化数据**：BlogPosting、BreadcrumbList、WebSite 等，SEO 友好
- **RSS 订阅**：自动生成 `/rss.xml`
- **robots.txt**：已配置搜索引擎爬取规则
- **GitHub Pages 自动部署**：推送 master 分支自动构建部署

---

## 项目结构

```text
/
├── .github/workflows/        # GitHub Actions 自动部署
├── public/                   # 静态资源（原样输出）
│   └── favicon.ico
├── src/
│   ├── assets/icons/         # SVG 图标文件
│   ├── components/           # Astro 组件
│   │   ├── layout/           # 布局组件 (Header, Footer, BaseHead, Sidebar 等)
│   │   ├── blog/             # 博客组件 (BlogCard, BlogList, SearchModal 等)
│   │   ├── layout/           # 布局组件 (Header, Footer, SidebarPanel, SidebarLeft, SidebarRight 等)
│   │   ├── ui/               # 通用 UI 组件 (Icon, SocialLinks, HeaderLink)
│   │   ├── widgets/          # 内容组件 (Bilibili, MiniBrowser, Plot3D)
│   │   └── github/           # GitHub 统计组件
│   ├── content/blog/         # 博客文章（.md/.mdx，支持子目录分类）
│   ├── layouts/
│   │   └── BlogPost.astro    # 全局布局（三栏布局 + 双侧栏）
│   ├── lib/                  # 数据处理函数
│   │   ├── blogData.ts       # 博客数据提取
│   │   ├── blogStats.ts      # 站点统计计算
│   │   ├── repoStats.ts      # 仓库语言统计
│   │   └── utils.ts          # 工具函数
│   ├── pages/                # 路由页面
│   │   ├── index.astro       # 首页（统计 + GitHub 组件）
│   │   ├── about.astro       # 关于页
│   │   ├── rss.xml.js        # RSS 订阅源
│   │   └── blog/             # 博客路由
│   │       ├── index.astro   # 博客列表页
│   │       ├── [...slug].astro   # 文章详情页
│   │       ├── category/     # 分类页面
│   │       └── tag/          # 标签页面
│   ├── scripts/              # 客户端脚本
│   │   ├── search.ts         # 搜索逻辑（Fuse.js 模糊搜索 + 高亮）
│   │   ├── toc.ts            # 目录生成与滚动高亮
│   │   ├── mermaid.ts        # Mermaid 图表渲染（按需加载）
│   │   ├── sidebar-tree.ts      # 左侧栏树交互（手风琴/模式切换/指示器）
│   │   ├── sidebar-collapse.ts   # 右侧栏折叠按钮
│   │   ├── theme.ts              # 主题切换下拉菜单
│   │   └── fade-in-on-scroll.ts  # 滚动渐入动画
│   ├── styles/               # 全局样式（SCSS + Tailwind CSS）
│   │   └── themes/           # 6 种主题配色 CSS
│   ├── consts.ts             # 站点常量（统一配置入口）
│   └── content.config.ts     # 内容集合 Schema 定义
├── astro.config.mjs          # Astro 配置
├── package.json
├── tsconfig.json
└── README.md
```

---

## 快速开始

```bash
pnpm install          # 安装依赖
pnpm run dev          # 启动开发服务器 → http://localhost:4321
pnpm run build        # 构建生产版本到 dist/
pnpm run preview      # 本地预览生产构建
```

---

## 添加博客文章

在 `src/content/blog/` 目录下创建 `.md` 文件，可按子目录组织分类：

```markdown
---
title: "我的第一篇博客"
description: "记录第一次用 Astro 写博客的感受"
pubDate: 2026-05-15
tags: ["教程", "博客"]
---

文章正文...
```

- `title`（必填）：文章标题
- `description`（必填）：文章简介
- `pubDate`（必填）：发布日期
- `tags`（可选）：标签列表
- `dir1` / `dir2`（可选）：自定义分类层级，不填则自动取文件路径的前两级目录

---

## 部署

推送 `master` 分支到 GitHub，Actions 自动构建并部署到 GitHub Pages。
