# 网页自述

这是一个基于 **Astro** 构建的静态网站项目，用于搭建个人博客、作品集或内容展示平台，追求极致的性能与简洁的开发体验。

---

## 项目特点
- 基于 **Astro**：默认零 JavaScript，页面加载速度极快，SEO 友好
- 使用 **pnpm** 包管理器，依赖安装快、磁盘占用低
- 支持 Markdown / MDX 内容写作，轻松管理博客文章
- 内置 TypeScript 支持，类型安全更省心
- 静态站点构建，可直接部署到 GitHub Pages、Vercel、Netlify 等平台

---

## 项目结构
```text
/
├── .codesandbox/            # CodeSandbox 在线环境配置（非必需）
├── .github/                 # GitHub 相关配置（CI/CD、Issue模板等）
├── .vscode/                 # VS Code 编辑器配置（推荐插件、设置）
├── public/                  # 静态资源目录（不会被 Astro 处理，直接原样输出）
│   └── favicon.ico          # 网站图标等放这里
├── src/                     # 项目核心源码目录
│   ├── assets/              # 静态资源（会被 Astro 处理，如图片、字体等）
│   ├── components/          # Astro/React/Vue 等组件目录（可复用的 UI 组件）
│   ├── content/             # 内容集合（Astro Content Collections，存放 Markdown/MDX 博客文章）
│   │   └── blog/            # 博客文章目录（所有 .md/.mdx 文件都在这里）
│   ├── layouts/             # 布局组件（可复用的页面布局，如 BaseLayout、BlogPostLayout）
│   ├── pages/               # 页面路由目录（文件即路由，如 index.astro → /，blog/[slug].astro → /blog/xxx）
│   ├── scripts/             # 自定义脚本（客户端交互逻辑、工具函数等）
│   ├── styles/              # 全局样式文件（CSS/SCSS/PostCSS 等）
│   ├── consts.ts            # 项目常量配置（如网站标题、作者信息、社交链接）
│   └── content.config.ts    # Astro 内容集合配置文件（定义博客文章的 schema、类型）
├── .gitignore               # Git 忽略文件配置
├── .nojekyll                # 用于 GitHub Pages 部署，禁用 Jekyll 处理
├── astro.config.mjs         # Astro 项目核心配置文件（站点设置、集成、适配器等）
├── package.json             # 项目依赖、脚本、元信息配置
├── pnpm-lock.yaml           # pnpm 依赖版本锁定文件
├── pnpm-workspace.yaml      # pnpm 工作区配置（ monorepo 场景用，单项目可忽略）
├── README.md                # 项目说明文档
└── tsconfig.json            # TypeScript 配置文件
```

---

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/user1-cloud/user1-cloud.github.io.git
cd user1-cloud.github.io
```

### 2. 安装依赖
确保已安装 `pnpm`（推荐）：
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm run dev
```
开发服务器默认运行在 `http://localhost:4321`，修改代码后会自动刷新页面。

### 4. 构建生产版本
```bash
pnpm run build
```
构建完成后，静态文件会生成在 `dist/` 目录下，可直接部署到任意静态托管平台。

### 5. 预览构建结果
```bash
pnpm run preview
```
在本地预览构建好的生产版本，确保部署前一切正常。

---

## 如何使用

### 添加博客文章
在 `src/pages/blog/` 目录下创建 `.md` 或 `.mdx` 文件，使用 Markdown 格式编写文章，Astro 会自动生成对应的路由页面。

示例文章头部：
```markdown
---
title: "我的第一篇博客"
description: "记录第一次用 Astro 写博客的感受"
pubDate: 2026-05-15
heroImage: ''
---

这里是文章正文内容...
```

### 修改网站配置
编辑 `astro.config.mjs` 文件，可配置网站基础路径、集成插件、渲染选项等。

---

## 部署指南
### GitHub Pages 部署
项目已包含 `.github/` 目录，可通过 GitHub Actions 自动部署：
1. 在仓库设置中开启 GitHub Pages
2. 配置 Actions 部署工作流（已预设）
3. 每次推送到 `master` 分支时，自动构建并部署到 Pages

### 其他平台部署
- **Vercel**：直接关联 GitHub 仓库，自动识别 Astro 项目并部署
- **Netlify**：关联仓库后，设置构建命令为 `pnpm run build`，输出目录为 `dist/`