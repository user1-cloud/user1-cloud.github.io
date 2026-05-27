// 侧栏间隙按钮水平定位 — 将 fixed 按钮居中于 gutter
// 按钮本身有 CSS transition: left/right 0.2s ease，JS 只负责设置目标位置
const LEFT_BTN = 'toggleLeftSidebarBtn';
const LEFT_GUTTER = 'left-gutter';
const RIGHT_BTN = 'toggleSidebarBtn';
const RIGHT_GUTTER = 'right-gutter';

function centerBtnInGutter(btnId: string, gutterId: string): void {
  const btn = document.getElementById(btnId);
  const gutter = document.getElementById(gutterId);
  if (!btn || !gutter) return;

  const gr = gutter.getBoundingClientRect();
  const bw = btn.getBoundingClientRect().width;
  const isLeft = gutterId === LEFT_GUTTER;
  const html = document.documentElement;
  const collapsed = isLeft
    ? html.classList.contains('left-sidebar-collapsed')
    : html.classList.contains('sidebar-collapsed');

  if (collapsed) {
    if (isLeft) {
      btn.style.left = gr.left + 'px';
      btn.style.right = 'auto';
    } else {
      btn.style.left = 'auto';
      btn.style.right = (window.innerWidth - gr.right) + 'px';
    }
  } else {
    const center = gr.left + gr.width / 2;
    if (isLeft) {
      btn.style.left = (center - bw / 2) + 'px';
      btn.style.right = 'auto';
    } else {
      btn.style.left = 'auto';
      btn.style.right = (window.innerWidth - center - bw / 2) + 'px';
    }
  }
}

function syncAll(): void {
  centerBtnInGutter(LEFT_BTN, LEFT_GUTTER);
  centerBtnInGutter(RIGHT_BTN, RIGHT_GUTTER);
}

// 侧栏过渡期间定期更新按钮目标位置（CSS transition 负责平滑移动）
let trackTimer: ReturnType<typeof setInterval> | null = null;

function startTracking(): void {
  if (trackTimer !== null) clearInterval(trackTimer);
  syncAll(); // 立即设置起始目标
  // 过渡期间每 50ms 更新一次目标，CSS 负责插值
  trackTimer = setInterval(() => syncAll(), 50);
  // 0.2s 过渡 + 余量后停止
  setTimeout(() => {
    if (trackTimer !== null) { clearInterval(trackTimer); trackTimer = null; }
    syncAll();
  }, 250);
}

// transitionend 兜底
function onTransitionEnd(e: TransitionEvent): void {
  const target = e.target as HTMLElement;
  if (target.classList.contains('sidebar-panel') && e.propertyName === 'width') {
    syncAll();
  }
}

// class 变化时启动跟踪
let observer: MutationObserver | null = null;

function setupObserver(): void {
  if (observer) observer.disconnect();
  observer = new MutationObserver(() => startTracking());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

function init(): void {
  requestAnimationFrame(() => syncAll());
  setupObserver();
}

init();
window.addEventListener('resize', syncAll);
document.addEventListener('transitionend', onTransitionEnd, true);

// 视图过渡后重新同步
document.addEventListener('astro:after-swap', () => {
  requestAnimationFrame(() => {
    syncAll();
    setupObserver();
  });
});
