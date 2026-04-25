---
title: 'VS Code Markdown 环境部署完整教程'
description: 'VS Code 原生支持 Markdown 基础语法高亮，但缺少实时预览、自动排版、目录生成、公式与流程图渲染、图片快捷插入、文件导出等实用功能。'
pubDate: '2026-4-25'
heroImage: ''
---

# VS Code Markdown 环境部署教程
## 一、环境介绍
VS Code 原生支持 Markdown 基础语法高亮，但缺少实时预览、自动排版、目录生成、公式与流程图渲染、图片快捷插入、文件导出等实用功能。本教程为**零基础一键部署方案**，配置一次即可永久使用，适配笔记、技术文档、项目文案、学习资料等所有写作场景。

## 二、VS Code 安装
1. 访问 [VS Code 官网](https://code.visualstudio.com/)，根据电脑系统（Windows/Mac/Linux）下载对应安装包
2. 默认流程安装，Windows 用户建议勾选「添加到系统 PATH」
3. 安装完成后启动软件，无额外配置即可使用基础功能

## 三、必备插件安装
打开插件面板快捷键：`Ctrl+Shift+X`，搜索以下插件并安装

### 3.1 核心必装插件
#### 1. Markdown All in One
- 核心功能：自动生成/更新文档目录、标题补全、列表与表格优化、文档大纲预览
- 作用：解决手动编写目录、排版杂乱的问题

#### 2. Markdown Preview Enhanced
- 核心功能：高颜值实时预览、Mermaid 流程图/时序图渲染、LaTeX 数学公式渲染
- 支持一键导出 PDF、PNG、HTML 格式文件

#### 3. Prettier
- 核心功能：全局格式化 Markdown 文档，统一空格、换行、表格对齐格式
- 支持保存文件自动规整排版

### 3.2 高效辅助插件
#### Image Paste
- 核心功能：截图后直接 `Ctrl+V` 粘贴，自动保存图片并生成 Markdown 图片链接
- 无需手动新建图片链接、迁移图片文件

## 四、全局配置（最终最优配置）
1. 打开命令面板：`Ctrl+Shift+P`
2. 输入 `Preferences: Open Settings (JSON)` 打开配置文件
3. 清空原有内容，**直接复制粘贴**以下完整配置

```json
{
    "editor.formatOnSave": true,
    "editor.wordWrap": "on",
    "[markdown]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnType": true,
        "editor.wordWrapColumn": 100
    },
    "prettier.printWidth": 100,
    "prettier.proseWrap": "always",
    "markdown-preview-enhanced.enableMermaid": true,
    "markdown-preview-enhanced.mathRenderingOption": "KaTeX",
    "markdown-preview-enhanced.breakOnSingleNewLine": false
}
```
4. 保存文件 `Ctrl+S`，所有配置立即生效

## 五、核心功能使用教程
### 5.1 开启实时预览
- 快捷键：`Ctrl+K` 松开后按 `V`
- 效果：打开独立预览窗口，实现**左编辑、右实时渲染**

### 5.2 自动生成文档目录
1. 将光标放在文档开头
2. 右键选择：`Markdown: Insert Table of Contents` 生成目录
3. 文档标题更新后，右键选择：`Update Table of Contents` 一键更新目录

### 5.3 一键格式化文档
- 手动格式化快捷键：`Alt+Shift+F`
- 开启保存自动格式化后，每次 `Ctrl+S` 会自动规整全文格式

### 5.4 截图一键插入图片
1. 在项目文件夹新建 `assets` 文件夹，统一存放所有配图
2. 使用系统截图快捷键截图保存到剪贴板
3. 在文档对应位置 `Ctrl+V`，插件自动生成图片路径并保存图片

### 5.5 文档导出（PDF/图片/网页）
1. 在编辑页面空白处右键
2. 选择 `Markdown Preview Enhanced: Export`
3. 按需选择：PDF、PNG 长图、HTML 网页等格式
4. 导出文件自动保存至当前文档目录

## 六、常用快捷键汇总
| 快捷键 | 功能说明 |
| ---- | ---- |
| Ctrl+K + V | 打开 Markdown 实时预览 |
| Ctrl+\ | 编辑器分屏 |
| Alt+Shift+F | 手动格式化全文 |
| Ctrl+Shift+X | 打开插件市场 |
| Ctrl+, | 打开可视化设置面板 |
| Ctrl+S | 保存并自动格式化文档 |

## 七、常见问题排查
### 7.1 目录无法生成
文档无二级、三级标题（`##`/`###`），插件无法识别目录层级，添加标题后重试即可。

### 7.2 格式化不生效
1. 确认已安装 Prettier 插件
2. 确认 JSON 配置已完整复制保存
3. 确认 Markdown 默认格式化器为 Prettier

### 7.3 图片粘贴无反应
重启 VS Code，检查 Image Paste 插件是否正常启用，确认当前文件夹拥有写入权限。

### 7.4 公式/流程图预览空白
更新 Markdown Preview Enhanced 插件，重启编辑器即可修复渲染异常。

## 八、部署完成效果
配置完成后，可实现**实时预览、自动排版、智能目录、公式图表渲染、一键配图、多格式导出**全套功能，完全满足专业级 Markdown 写作需求，大幅提升文档撰写、整理、归档效率。
