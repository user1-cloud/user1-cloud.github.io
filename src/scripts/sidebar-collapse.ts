// 右侧栏：折叠按钮绑定 + 状态同步
// BaseHead.astro 负责初始同步（<head> 中同步执行，避免 FOUC）
// 此脚本负责按钮点击后的状态切换和视图过渡后的重新同步

const STORAGE = 'blog-sidebar-collapsed';

function syncCollapse() {
  const collapsed = localStorage.getItem(STORAGE) === 'true';
  if (collapsed) {
    document.documentElement.classList.add('sidebar-collapsed');
  } else {
    document.documentElement.classList.remove('sidebar-collapsed');
  }
}

function initCollapse() {
  const btn = document.getElementById('toggleSidebarBtn');
  if (!btn) return;

  function toggle() {
    document.documentElement.classList.toggle('sidebar-collapsed');
    const nowCollapsed = document.documentElement.classList.contains('sidebar-collapsed');
    localStorage.setItem(STORAGE, String(nowCollapsed));
  }

  btn.removeEventListener('click', toggle);
  btn.addEventListener('click', toggle);
}

syncCollapse();
initCollapse();

// 视图过渡后重新同步状态并重新绑定按钮
document.addEventListener('astro:after-swap', () => {
  syncCollapse();
  initCollapse();
});
