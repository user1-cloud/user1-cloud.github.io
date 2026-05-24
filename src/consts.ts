// 站点基础常量
export const SITE_TITLE = 'u1的书房';
export const SITE_DESCRIPTION = '欢迎来到我的个人主页！';
export const SITE_START_DATE = new Date('2026-04-23');
export const GITHUB_USERNAME = 'user1-cloud';

// 社交/联系 URL
export const BILIBILI_URL = 'https://space.bilibili.com/1454195719';
export const QQ_SPACE_URL = 'https://user.qzone.qq.com/2931139019';
export const GITHUB_URL = 'https://github.com/user1-cloud';
export const AVATAR_URL = 'https://avatars.githubusercontent.com/u/177993181?v=4';
export const EMAIL_QQ = '2931139019@qq.com';
export const EMAIL_OUTLOOK = 'easbeasbeasb@outlook.com';

// 目录排序（SidebarLeft 和 /blog 页面共享）
export const DIR1_ORDER = ['近期', '程序', '数学', '小说'];
export const DIR2_ORDER: Record<string, string[]> = {
  '程序': ['前端', 'markdown'],
  '数学': ['解析几何'],
  '小说': ['铁锈终章'],
};

// 主题常量（BaseHead 和 LeftSidebar 共享）
export const VALID_THEMES = [
  'dark-blue', 'dark-green', 'dark-purple',
  'light-blue', 'light-green', 'light-rose',
];
export const DEFAULT_DARK_THEME = 'dark-blue';
export const DEFAULT_LIGHT_THEME = 'light-blue';
export const THEME_STORAGE_KEY = 'blog-theme';

// 语言扩展映射（用于仓库代码统计）
export const EXT_MAP: Record<string, { name: string; color: string }> = {
  '.ts': { name: 'TypeScript', color: '#3178c6' },
  '.tsx': { name: 'TypeScript', color: '#3178c6' },
  '.js': { name: 'JavaScript', color: '#f1e05a' },
  '.jsx': { name: 'JavaScript', color: '#f1e05a' },
  '.mjs': { name: 'JavaScript', color: '#f1e05a' },
  '.astro': { name: 'Astro', color: '#ff5a03' },
  '.md': { name: 'Markdown', color: '#083fa1' },
  '.mdx': { name: 'MDX', color: '#fcb32c' },
  '.css': { name: 'CSS', color: '#563d7c' },
  '.scss': { name: 'SCSS', color: '#c6538c' },
  '.json': { name: 'JSON', color: '#292929' },
  '.yaml': { name: 'YAML', color: '#cb171e' },
  '.yml': { name: 'YAML', color: '#cb171e' },
  '.html': { name: 'HTML', color: '#e34c26' },
  '.svg': { name: 'SVG', color: '#ff9900' },
  '.sh': { name: 'Shell', color: '#89e051' },
  '.bash': { name: 'Shell', color: '#89e051' },
  '.py': { name: 'Python', color: '#3572A5' },
  '.toml': { name: 'TOML', color: '#9c4221' },
  '.xml': { name: 'XML', color: '#0060ac' },
  '.sql': { name: 'SQL', color: '#e38c00' },
};

export const BINARY_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pdf', '.zip', '.gz', '.tar', '.mp4', '.mp3',
  '.lock',
]);

export const SKIP_FILES = new Set([
  'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lockb',
]);

// 数字格式化（首页统计用）
export function fmtNum(n: number): string {
  return n >= 10000 ? (n / 10000).toFixed(1) + '万' : String(n);
}
