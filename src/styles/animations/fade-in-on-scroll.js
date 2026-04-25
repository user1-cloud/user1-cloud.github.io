document.addEventListener('astro:page-load', () => {
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                // 元素进入视口 → 显示
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } 
                // 元素离开视口 → 隐藏
                else {
                    entry.target.classList.remove('visible');
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    fadeElements.forEach(el => observer.observe(el));
});
