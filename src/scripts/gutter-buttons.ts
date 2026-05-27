// 侧栏间隙按钮水平定位 — 将 fixed 按钮居中于 gutter
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
    // 折叠时按钮靠外侧（远离正文），用 gutter 全宽做缓冲
    if (isLeft) {
      btn.style.left = gr.left + 'px';
      btn.style.right = 'auto';
    } else {
      btn.style.left = 'auto';
      btn.style.right = (window.innerWidth - gr.right) + 'px';
    }
  } else {
    // 展开时按钮居中于间隙
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

// 过渡跟踪：持续同步直到 gutter 位置稳定
let trackingId: number | null = null;

function startTracking(): void {
  if (trackingId !== null) cancelAnimationFrame(trackingId);

  let lastLeftX = -1;
  let lastRightX = -1;
  let stable = 0;
  let total = 0;
  const MAX_FRAMES = 30; // ~0.5s，0.2s 过渡绰绰有余

  function loop(): void {
    syncAll();

    const lg = document.getElementById(LEFT_GUTTER);
    const rg = document.getElementById(RIGHT_GUTTER);
    const lx = lg ? lg.getBoundingClientRect().left : -1;
    const rx = rg ? rg.getBoundingClientRect().left : -1;

    if (lx === lastLeftX && rx === lastRightX) {
      stable++;
    } else {
      stable = 0;
    }
    lastLeftX = lx;
    lastRightX = rx;
    total++;

    if (stable < 2 && total < MAX_FRAMES) {
      trackingId = requestAnimationFrame(loop);
    } else {
      trackingId = null;
    }
  }

  trackingId = requestAnimationFrame(loop);
}

// transitionend 兜底：确保过渡结束后按钮在正确位置
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

  observer = new MutationObserver(() => {
    startTracking();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

function init(): void {
  requestAnimationFrame(() => syncAll());
  setupObserver();
}

// 初始运行
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
