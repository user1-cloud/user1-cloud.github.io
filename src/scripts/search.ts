import Fuse from 'fuse.js';

interface SearchItem {
  title: string;
  description: string;
  dir1: string;
  dir2: string;
  tags: string;
  slug: string;
}

let fuse: Fuse<SearchItem> | null = null;
let results: Fuse.FuseResult<SearchItem>[] = [];
let selectedIndex = -1;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// ---- Read search data ----
function getSearchData(): SearchItem[] {
  return (window as any).__SEARCH_DATA__ || [];
}

// ---- Initialize Fuse ----
function initFuse(data: SearchItem[]): Fuse<SearchItem> {
  return new Fuse(data, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'dir1', weight: 0.1 },
      { name: 'dir2', weight: 0.1 },
      { name: 'tags', weight: 0.1 },
    ],
    threshold: 0.4,
    minMatchCharLength: 1,
    includeMatches: true,
    includeScore: true,
  });
}

// ---- DOM refs ----
function getModal(): HTMLDialogElement | null {
  return document.getElementById('search-modal') as HTMLDialogElement | null;
}

function getInput(): HTMLInputElement | null {
  return document.getElementById('search-input') as HTMLInputElement | null;
}

function getResultsList(): HTMLUListElement | null {
  return document.getElementById('search-results') as HTMLUListElement | null;
}

// ---- Modal open/close ----
function openModal(): void {
  const modal = getModal();
  const input = getInput();
  if (!modal || !input) return;

  modal.showModal();
  setTimeout(() => input.focus(), 50);

  // Clear previous state
  input.value = '';
  results = [];
  selectedIndex = -1;
  renderResults();
}

function closeModal(): void {
  const modal = getModal();
  if (modal) modal.close();
}

// ---- Escape HTML ----
function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Truncate text ----
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

// ---- Build post URL from slug ----
function buildPostUrl(slug: string): string {
  const parts = slug.split('/').map(encodeURIComponent).join('/');
  return `/blog/${parts}/`;
}

// ---- Perform search ----
function performSearch(query: string): void {
  if (!fuse || !query.trim()) {
    results = [];
    selectedIndex = -1;
    renderResults();
    return;
  }
  results = fuse.search(query.trim());
  selectedIndex = -1;
  renderResults();
}

// ---- Render results ----
function renderResults(): void {
  const list = getResultsList();
  if (!list) return;

  if (results.length === 0) {
    list.innerHTML = '<li class="search-no-results">没有找到相关文章</li>';
  } else {
    list.innerHTML = results
      .map((r, i) => {
        const item = r.item;
        const category = [item.dir1, item.dir2].filter(Boolean).join(' / ');
        const cls = i === selectedIndex ? 'search-result-item selected' : 'search-result-item';
        return `
        <li class="${cls}" data-index="${i}" role="option" aria-selected="${i === selectedIndex}">
          <a href="${buildPostUrl(item.slug)}" class="search-result-link" data-index="${i}">
            <span class="search-result-title">${escapeHtml(item.title)}</span>
            ${category ? `<span class="search-result-category">${escapeHtml(category)}</span>` : ''}
            <span class="search-result-desc">${escapeHtml(truncate(item.description, 100))}</span>
          </a>
        </li>`;
      })
      .join('');
  }
}

// ---- Keyboard navigation ----
function handleKeydown(e: KeyboardEvent): void {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
      renderResults();
      scrollSelectedIntoView();
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      renderResults();
      scrollSelectedIntoView();
      break;
    case 'Enter':
      if (selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        const item = results[selectedIndex].item;
        closeModal();
        window.location.href = buildPostUrl(item.slug);
      }
      break;
    case 'Escape':
      e.preventDefault();
      closeModal();
      break;
  }
}

function scrollSelectedIntoView(): void {
  const selected = document.querySelector('.search-result-item.selected');
  if (selected) {
    selected.scrollIntoView({ block: 'nearest' });
  }
}

// ---- Global keyboard shortcut ----
function handleGlobalKeydown(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openModal();
  }
}

// ---- Debounced input ----
function handleInput(e: Event): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performSearch((e.target as HTMLInputElement).value);
  }, 150);
}

// ---- Initialization ----
function init(): void {
  const data = getSearchData();
  if (data.length === 0) return;

  if (!fuse) {
    fuse = initFuse(data);
  }

  // Bind modal listeners
  const modal = getModal();
  const input = getInput();
  const triggerBtn = document.getElementById('search-trigger-btn');
  const closeBtn = document.getElementById('search-close-btn');

  // Search trigger button
  if (triggerBtn) {
    triggerBtn.removeEventListener('click', openModal);
    triggerBtn.addEventListener('click', openModal);
  }

  // Input
  if (input) {
    input.removeEventListener('input', handleInput);
    input.addEventListener('input', handleInput);
    input.removeEventListener('keydown', handleKeydown);
    input.addEventListener('keydown', handleKeydown);
  }

  // Close button
  if (closeBtn) {
    closeBtn.removeEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
  }

  // Click on modal backdrop to close
  if (modal) {
    modal.removeEventListener('click', handleModalBackdropClick);
    modal.addEventListener('click', handleModalBackdropClick);
  }

  // Global shortcut
  document.removeEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('keydown', handleGlobalKeydown);
}

function handleModalBackdropClick(e: MouseEvent): void {
  const modal = getModal();
  if (!modal) return;
  // Close if clicking the backdrop, not the content inside
  if (e.target === modal) {
    closeModal();
  }
}

// Close modal on SPA navigation
document.addEventListener('astro:before-swap', () => {
  closeModal();
});

// Initialize on page load (follows toc.ts pattern)
document.addEventListener('astro:page-load', init);
document.addEventListener('DOMContentLoaded', init);
