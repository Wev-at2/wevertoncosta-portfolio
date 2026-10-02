const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function revealSectionsOnScroll() {
  // O hero fica de fora para não atrasar o LCP
  const items = document.querySelectorAll('.wc-main > section:not(.wc-main__banner)');
  if (!items.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

  items.forEach((item) => item.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach((item) => observer.observe(item));
}

export function projectCardTilt() {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll('.wc-case-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      if (window.innerWidth < 992) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 4;
      const rotateX = ((y / rect.height) - 0.5) * -4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}
