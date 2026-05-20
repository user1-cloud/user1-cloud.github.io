// 存储标题与目录项的对应关系
const headingElements: { element: HTMLElement; tocItem: HTMLLIElement }[] = [];
const tocItemElements: HTMLLIElement[] = [];

let ticking = false;
let prevActiveIndex = -1;
let programmaticScrolling = false;

// 监听页面加载（Astro 专属）
document.addEventListener('astro:page-load', initToc);
document.addEventListener('DOMContentLoaded', initToc);

// 初始化目录
export function initToc() {
  buildToc();
  setupScrollSpy();
}

// 生成目录
function buildToc() {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;

  tocList.innerHTML = '';
  headingElements.length = 0;
  tocItemElements.length = 0;

  const headings = document.querySelectorAll('.prose > h2, .prose > h3, .prose h2.mk-title, .prose h3.mk-title');
  if (headings.length === 0) {
    tocList.innerHTML = '<li class="toc-empty">本部分无目录</li>';
    return;
  }

  let tocIndex = 0;
  headings.forEach((heading) => {
    const el = heading as HTMLElement;

    const id = `heading-${tocIndex++}`;
    el.id = id;

    const li = document.createElement('li');
    if (heading.tagName === 'H2') li.classList.add('toc-level-h2');
    if (heading.tagName === 'H3') li.classList.add('toc-level-h3');

    const div = document.createElement('div');
    div.style.cursor = 'pointer';
    div.onclick = () => {
      tocItemElements.forEach(item => item.classList.remove('active'));
      li.classList.add('active');
      updateRightIndicator();

      programmaticScrolling = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      let confirmed = false;
      const confirmActive = () => {
        if (confirmed) return;
        confirmed = true;
        programmaticScrolling = false;
        prevActiveIndex = -1;
        tocItemElements.forEach(item => item.classList.remove('active'));
        li.classList.add('active');
        updateRightIndicator();
      };
      window.addEventListener('scrollend', confirmActive, { once: true });
      setTimeout(confirmActive, 500);
    };
    div.textContent = heading.textContent?.trim() || '';
    li.appendChild(div);
    tocList.appendChild(li);

    headingElements.push({ element: el, tocItem: li });
    tocItemElements.push(li);
  });

  if (headingElements.length === 0) {
    tocList.innerHTML = '<li class="toc-empty">本部分无目录</li>';
  }
}

function scrollTocToView(tocItem: HTMLLIElement) {
  const tocArea = document.querySelector('.toc-area');
  if (!tocArea || !tocItem) return;

  const leadOffset = -100;

  const areaRect = tocArea.getBoundingClientRect();
  const itemRect = tocItem.getBoundingClientRect();

  const itemTopInView = itemRect.top - areaRect.top;
  const itemBottomInView = itemRect.bottom - areaRect.top;

  if (itemTopInView < -leadOffset) {
    tocArea.scrollBy({ top: itemTopInView + leadOffset, behavior: 'smooth' });
  } else if (itemBottomInView > areaRect.height + leadOffset) {
    tocArea.scrollBy({ top: itemBottomInView - areaRect.height - leadOffset, behavior: 'smooth' });
  }
}

// 滚动监听
function setupScrollSpy() {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActive);
      ticking = true;
    }
  });
  updateActive();
}

function updateRightIndicator(headingRects?: DOMRect[]) {
  const container = document.querySelector('.toc-area');
  const indicator = document.querySelector('.toc-area .position-indicator');
  if (!container || !indicator) return;

  // 若未传入缓存的 rect，则当场读取
  if (!headingRects) {
    headingRects = [];
    for (let i = 0; i < headingElements.length; i++) {
      headingRects.push(headingElements[i].element.getBoundingClientRect());
    }
  }

  const viewportHeight = window.innerHeight;
  let firstVisibleIdx = -1;
  let lastVisibleIdx = -1;

  for (let i = 0; i < headingRects.length; i++) {
    const rect = headingRects[i];
    if (rect.top < viewportHeight && rect.bottom >= 0) {
      if (firstVisibleIdx === -1) firstVisibleIdx = i;
      lastVisibleIdx = i;
    }
  }

  let activeIdx = -1;
  const active = document.querySelector('#toc-list li.active');
  if (active) {
    activeIdx = tocItemElements.indexOf(active as HTMLLIElement);
  }

  if (firstVisibleIdx === -1) {
    if (activeIdx === -1) {
      indicator.classList.remove('visible');
      return;
    }
    const item = tocItemElements[activeIdx] as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const relTop = itemRect.top - containerRect.top + container.scrollTop;
    indicator.style.transform = `translateY(${relTop}px)`;
    indicator.style.height = item.offsetHeight + 'px';
    indicator.classList.add('visible');
    return;
  }

  const startIdx = activeIdx >= 0 ? Math.min(activeIdx, firstVisibleIdx) : firstVisibleIdx;
  const firstItem = tocItemElements[startIdx] as HTMLElement;
  const lastItem = tocItemElements[lastVisibleIdx] as HTMLElement;

  const containerRect = container.getBoundingClientRect();
  const firstRect = firstItem.getBoundingClientRect();
  const lastRect = lastItem.getBoundingClientRect();
  const topRel = firstRect.top - containerRect.top + container.scrollTop;
  const bottomRel = lastRect.top - containerRect.top + container.scrollTop + lastItem.offsetHeight;

  indicator.style.transform = `translateY(${topRel}px)`;
  indicator.style.height = (bottomRel - topRel) + 'px';
  indicator.classList.add('visible');
}

// 高亮更新逻辑 — 所有布局读取集中在 Phase 1，避免读写交替导致的强制回流
function updateActive() {
  if (programmaticScrolling) {
    ticking = false;
    return;
  }

  // Phase 1: 一次性读取所有标题的布局数据
  const headingRects: DOMRect[] = [];
  for (let i = 0; i < headingElements.length; i++) {
    headingRects.push(headingElements[i].element.getBoundingClientRect());
  }

  // Phase 2: 纯计算，找出最佳匹配
  let bestMatchIndex = -1;
  const scrollY = window.scrollY;
  const offset = 20;

  for (let i = headingRects.length - 1; i >= 0; i--) {
    if (scrollY + offset >= headingRects[i].top + scrollY) {
      bestMatchIndex = i;
      break;
    }
  }

  // Phase 3: DOM 写入（仅在活跃标题变化时）
  if (bestMatchIndex !== prevActiveIndex) {
    prevActiveIndex = bestMatchIndex;
    tocItemElements.forEach(item => item.classList.remove('active'));
    if (bestMatchIndex !== -1) {
      const active = tocItemElements[bestMatchIndex];
      active.classList.add('active');
      scrollTocToView(active);
    }
  }

  // Phase 4: 用缓存的 rect 更新指示器（内部仍有必要的容器读取，但不再重复读取标题）
  updateRightIndicator(headingRects);
  ticking = false;
}
