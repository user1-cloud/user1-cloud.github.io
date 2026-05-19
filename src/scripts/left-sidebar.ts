const STORAGE_KEY = 'left-sidebar-state';

interface State {
  mode: 'directory' | 'tag';
  expandedPaths: string[];
  collapsed: boolean;
}

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { mode: 'directory', expandedPaths: [], collapsed: false };
}

function saveState(state: State): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

const state = loadState();

function getSlugFromPath(path: string): string | null {
  const m = path.match(/^\/blog\/(.+)/);
  if (!m) return null;
  const slug = decodeURIComponent(m[1].replace(/\/+$/, ''));
  if (slug === 'tags' || slug.startsWith('tag/') || slug.startsWith('category/')) return null;
  return slug;
}

function findArticleBySlug(slug: string): HTMLElement | null {
  const visibleTree = document.querySelector('.ls-tree:not([hidden])');
  if (!visibleTree) return null;
  const links = visibleTree.querySelectorAll<HTMLElement>('a[data-slug]');
  for (const link of links) {
    if (link.dataset.slug === slug) return link;
  }
  return null;
}

function isMobile(): boolean {
  return window.innerWidth < 900;
}

function updateIndicator(): void {
  const container = document.querySelector('.left-sidebar .sidebar-inner');
  if (!container) return;

  const path = window.location.pathname;
  const slug = getSlugFromPath(path);

  if (slug) {
    const target = findArticleBySlug(slug);
    if (target) {
      expandAncestors(target);
      if (!isMobile()) {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }
}

function expandAncestors(el: HTMLElement): void {
  let cur: HTMLElement | null = el.parentElement;
  while (cur) {
    if (cur.classList.contains('node-children') && cur.classList.contains('collapsed')) {
      cur.classList.remove('collapsed');
      const header = cur.previousElementSibling as HTMLElement | null;
      if (header && header.classList.contains('node-header')) {
        header.classList.add('expanded');
        const label = header.querySelector('.node-label')?.textContent?.trim();
        if (label && !state.expandedPaths.includes(label)) {
          state.expandedPaths.push(label);
        }
      }
    }
    if (cur.classList.contains('sidebar-inner')) break;
    cur = cur.parentElement;
  }
  saveState(state);
}

function switchMode(mode: 'directory' | 'tag'): void {
  state.mode = mode;
  saveState(state);

  const dirTree = document.getElementById('ls-tree-dir');
  const tagTree = document.getElementById('ls-tree-tag');
  const dirBtn = document.getElementById('ls-mode-dir');
  const tagBtn = document.getElementById('ls-mode-tag');

  if (mode === 'directory') {
    dirTree?.removeAttribute('hidden');
    tagTree?.setAttribute('hidden', '');
    dirBtn?.classList.add('active');
    tagBtn?.classList.remove('active');
  } else {
    dirTree?.setAttribute('hidden', '');
    tagTree?.removeAttribute('hidden');
    dirBtn?.classList.remove('active');
    tagBtn?.classList.add('active');
  }

  requestAnimationFrame(() => updateIndicator());
}

function toggleNode(header: HTMLElement): void {
  const children = header.nextElementSibling as HTMLElement | null;
  if (!children || !children.classList.contains('node-children')) return;

  const isCollapsed = children.classList.contains('collapsed');
  if (isCollapsed) {
    children.classList.remove('collapsed');
    header.classList.add('expanded');
  } else {
    children.classList.add('collapsed');
    header.classList.remove('expanded');
  }

  const label = header.querySelector('.node-label')?.textContent?.trim();
  if (label) {
    if (isCollapsed) {
      if (!state.expandedPaths.includes(label)) state.expandedPaths.push(label);
    } else {
      state.expandedPaths = state.expandedPaths.filter(p => p !== label);
    }
    saveState(state);
  }

  requestAnimationFrame(() => updateIndicator());
}

function applyExpandedState(): void {
  document.querySelectorAll('.ls-tree .node-header').forEach(header => {
    const label = header.querySelector('.node-label')?.textContent?.trim();
    if (label && state.expandedPaths.includes(label)) {
      header.classList.add('expanded');
      const children = header.nextElementSibling as HTMLElement | null;
      if (children && children.classList.contains('node-children')) {
        children.classList.remove('collapsed');
      }
    }
  });
}

function applyCollapsedState(): void {
  // 移动端不使用 left-sidebar-collapsed 类（走覆盖层模式）
  if (window.innerWidth < 900) {
    document.documentElement.classList.remove('left-sidebar-collapsed');
    return;
  }
  if (state.collapsed) {
    document.documentElement.classList.add('left-sidebar-collapsed');
  } else {
    document.documentElement.classList.remove('left-sidebar-collapsed');
  }
}

function closeMobileOverlay(): void {
  if (window.innerWidth >= 900) return;
  const sidebar = document.getElementById('leftSidebar');
  const backdrop = document.querySelector('.left-sidebar-overlay-backdrop');
  const btn = document.getElementById('toggleLeftSidebarBtn');
  if (sidebar) sidebar.classList.remove('overlay-open');
  if (backdrop) backdrop.classList.remove('open');
  if (btn) btn.classList.remove('overlay-open');
}

function handleSidebarToggleClick(): void {
  if (window.innerWidth < 900) {
    const sidebar = document.getElementById('leftSidebar');
    const backdrop = document.querySelector('.left-sidebar-overlay-backdrop');
    const btn = document.getElementById('toggleLeftSidebarBtn');
    if (!sidebar || !backdrop) return;
    const isOpen = sidebar.classList.contains('overlay-open');
    if (isOpen) {
      sidebar.classList.remove('overlay-open');
      backdrop.classList.remove('open');
      if (btn) btn.classList.remove('overlay-open');
    } else {
      sidebar.classList.add('overlay-open');
      backdrop.classList.add('open');
      if (btn) btn.classList.add('overlay-open');
    }
  } else {
    document.documentElement.classList.toggle('left-sidebar-collapsed');
    state.collapsed = document.documentElement.classList.contains('left-sidebar-collapsed');
    saveState(state);
  }
}

// 事件委托 (兼容 Astro 视图过渡)
document.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;

  // 树节点展开/折叠
  const header = target.closest('.ls-tree .node-header');
  if (header) {
    e.preventDefault();
    toggleNode(header as HTMLElement);
    return;
  }

  // 模式切换按钮
  const modeBtn = target.closest('#ls-mode-dir, #ls-mode-tag');
  if (modeBtn) {
    const mode = (modeBtn as HTMLElement).dataset.mode as 'directory' | 'tag';
    if (mode) switchMode(mode);
    return;
  }

  // 左侧栏内文章链接 — 移动端点击后关闭覆盖层
  const articleLink = target.closest('.ls-tree a[data-slug]');
  if (articleLink) {
    closeMobileOverlay();
    return;
  }

  // 左侧栏切换按钮
  if (target.closest('#toggleLeftSidebarBtn')) {
    handleSidebarToggleClick();
    return;
  }
});

function init(): void {
  applyCollapsedState();

  if (state.mode === 'tag') {
    switchMode('tag');
  }

  applyExpandedState();
  updateIndicator();
}

// 生命周期
document.addEventListener('astro:page-load', () => {
  init();
  updateIndicator();
});

document.addEventListener('astro:after-swap', () => {
  requestAnimationFrame(() => updateIndicator());
});

document.addEventListener('DOMContentLoaded', init);

// 初始应用折叠状态
applyCollapsedState();
