// 存储标题与目录项的对应关系
const headingElements: { element: HTMLElement; tocItem: HTMLLIElement }[] = [];
const tocItemElements: HTMLLIElement[] = [];

let ticking = false;

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

  // 清空之前的目录
  tocList.innerHTML = '';
  headingElements.length = 0;
  tocItemElements.length = 0;

  // 只获取文章内容里的 h2、h3
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

    // 创建目录项
    const li = document.createElement('li');
    if (heading.tagName === 'H2') li.classList.add('toc-level-h2');
    if (heading.tagName === 'H3') li.classList.add('toc-level-h3');

    const div = document.createElement('div');
    div.style.cursor = 'pointer';
    div.onclick = () => {
      tocItemElements.forEach(item => item.classList.remove('active'));
      li.classList.add('active');
      updateRightIndicator();

      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      let confirmed = false;
      const confirmActive = () => {
        if (confirmed) return;
        confirmed = true;
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
    return;
  }
}

function scrollTocToView(tocItem: HTMLLIElement) {
  const tocArea = document.querySelector('.toc-area');
  if (!tocArea || !tocItem) return;

  // 这里调整超前量，数字越大，目录越提前滚动上去
  const leadOffset = -100; 

  const areaRect = tocArea.getBoundingClientRect();
  const itemRect = tocItem.getBoundingClientRect();

  const itemTopInView = itemRect.top - areaRect.top;
  const itemBottomInView = itemRect.bottom - areaRect.top;

  // 向上滚出可视区（提前 leadOffset）
  if (itemTopInView < -leadOffset) {
    tocArea.scrollBy({ top: itemTopInView + leadOffset, behavior: 'smooth' });
  }
  // 向下滚出可视区（也提前一点）
  else if (itemBottomInView > areaRect.height + leadOffset) {
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

function getRelativeTop(el: HTMLElement, ancestor: HTMLElement): number {
  return el.getBoundingClientRect().top - ancestor.getBoundingClientRect().top + ancestor.scrollTop;
}

function updateRightIndicator() {
  const container = document.querySelector('.toc-area');
  const indicator = document.querySelector('.toc-area .position-indicator');
  if (!container || !indicator) return;

  const viewportHeight = window.innerHeight;
  let firstVisibleIdx = -1;
  let lastVisibleIdx = -1;

  for (let i = 0; i < headingElements.length; i++) {
    const rect = headingElements[i].element.getBoundingClientRect();
    if (rect.top < viewportHeight && rect.bottom >= 0) {
      if (firstVisibleIdx === -1) firstVisibleIdx = i;
      lastVisibleIdx = i;
    }
  }

  // 找活跃标题的索引
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
    const relTop = getRelativeTop(item, container as HTMLElement);
    indicator.style.top = relTop + 'px';
    indicator.style.height = item.offsetHeight + 'px';
    indicator.classList.add('visible');
    return;
  }

  // 起点取活跃标题和第一个可见标题中更靠上的，避免活跃标题刚滚出视口时竖线顶部跳跃
  const startIdx = activeIdx >= 0 ? Math.min(activeIdx, firstVisibleIdx) : firstVisibleIdx;
  const firstItem = tocItemElements[startIdx] as HTMLElement;
  const lastItem = tocItemElements[lastVisibleIdx] as HTMLElement;

  const topRel = getRelativeTop(firstItem, container as HTMLElement);
  const bottomRel = getRelativeTop(lastItem, container as HTMLElement) + lastItem.offsetHeight;

  indicator.style.top = topRel + 'px';
  indicator.style.height = (bottomRel - topRel) + 'px';
  indicator.classList.add('visible');
}

// 高亮更新逻辑
function updateActive() {
  let bestMatchIndex = -1;
  const scrollY = window.scrollY;
  const offset = 20;

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const heading = headingElements[i].element;
    const top = heading.getBoundingClientRect().top + scrollY;

    if (scrollY + offset >= top) {
      bestMatchIndex = i;
      break;
    }
  }

  tocItemElements.forEach(item => item.classList.remove('active'));
  if (bestMatchIndex !== -1) {
    const active = tocItemElements[bestMatchIndex];
    active.classList.add('active');
    scrollTocToView(active);
  }

  updateRightIndicator();
  ticking = false;
}