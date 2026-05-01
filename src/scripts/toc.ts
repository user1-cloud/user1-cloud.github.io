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
  const headings = document.querySelectorAll('.prose h2, .prose h3');
  if (headings.length === 0) {
    tocList.innerHTML = '<li class="toc-empty">本部分无目录</li>';
    return;
  }

  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    (heading as HTMLElement).id = id;

    // 创建目录项
    const li = document.createElement('li');
    if (heading.tagName === 'H3') li.classList.add('toc-level-h3');

    const div = document.createElement('div');
    div.style.cursor = 'pointer';
    div.onclick = () => {
      (heading as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(updateActive, 100);
    };
    div.textContent = heading.textContent?.trim() || '';
    li.appendChild(div);
    tocList.appendChild(li);

    headingElements.push({ element: heading as HTMLElement, tocItem: li });
    tocItemElements.push(li);
  });
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

// 高亮更新逻辑（完全正确）
function updateActive() {
  let bestMatchIndex = -1;
  const scrollY = window.scrollY;
  const offset = 100;

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

  ticking = false;
}