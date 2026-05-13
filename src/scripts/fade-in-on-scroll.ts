document.addEventListener('astro:page-load', () => {
  // 清理旧的观察器，防止 Astro 局部导航时重复绑定
  if ((window as any).fadeObserver) {
    (window as any).fadeObserver.disconnect();
  }

  const fadeElements = document.querySelectorAll<HTMLElement>('.fade-in-on-scroll');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px', 
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 进入视口，添加可见类
        entry.target.classList.add('visible');
      } else {
        // 离开视口，直接移除可见类，实现消失效果
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  (window as any).fadeObserver = observer;
  fadeElements.forEach((el) => observer.observe(el));
});