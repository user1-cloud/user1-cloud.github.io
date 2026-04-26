// 监听 Astro 页面加载事件
document.addEventListener('astro:page-load', () => {
  // 获取所有需要淡入的元素（明确类型）
  const fadeElements = document.querySelectorAll<HTMLElement>('.fade-in-on-scroll');

  // 交叉观察器配置
  const observerOptions: IntersectionObserverInit = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px',
  };

  // 创建观察器（TS 自动推导类型）
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  // 监听所有元素
  fadeElements.forEach((el) => observer.observe(el));
});