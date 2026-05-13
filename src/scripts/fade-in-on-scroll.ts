document.addEventListener('astro:page-load', () => {
  if ((window as any).fadeObserver) {
    (window as any).fadeObserver.disconnect();
  }

  // 把所有动画类写在这里
  const fadeElements = document.querySelectorAll<HTMLElement>(
    `.fade-down-on-scroll,
    .fade-up-on-scroll,
    .fade-left-on-scroll,
    .fade-right-on-scroll,
    .fade-scale-on-scroll,
    .fade-only-on-scroll
    `
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  (window as any).fadeObserver = observer;
  fadeElements.forEach((el) => observer.observe(el));
});