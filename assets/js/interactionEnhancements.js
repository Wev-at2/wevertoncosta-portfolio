export function revealSectionsOnScroll() {
  const items = document.querySelectorAll('.wc-main > section');
  if (!items.length) return;

  items.forEach((item) => item.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });

  items.forEach((item) => observer.observe(item));
}

export function projectCardTilt() {
  const cards = document.querySelectorAll('.wc-projects__item');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      if (window.innerWidth < 992) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}
