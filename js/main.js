/* ═══════════════════════════════════════════
   ELETRIX SERVIÇOS – main.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAV SCROLL ──────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ── 2. HAMBURGER / MOBILE MENU ─────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    // Fecha ao clicar em link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── 3. SCROLL REVEAL ───────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // anima só uma vez
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── 4. CONTADOR ANIMADO ────────────────────
  function animateCounter(el, target, suffix = '+') {
    const duration = 1800;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('[data-target]').forEach(el => {
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '+';
          animateCounter(el, target, suffix);
        });
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // ── 5. PARTÍCULAS HERO ─────────────────────
  const particlesEl = document.getElementById('particles');
  if (particlesEl) {
    for (let i = 0; i < 20; i++) {
      const p    = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 12 + 7}s;
        animation-delay:${Math.random() * 12}s;
      `;
      particlesEl.appendChild(p);
    }
  }

  // ── 6. CARROSSEL ───────────────────────────
  const track = document.getElementById('carousel-track');
  if (track) {
    const slides   = Array.from(track.children);
    const dotsWrap = document.getElementById('carousel-dots');
    const prevBtn  = document.getElementById('carousel-prev');
    const nextBtn  = document.getElementById('carousel-next');
    const carousel = document.getElementById('carousel');
    let current    = 0;
    let autoplay;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function update() {
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function goTo(i) {
      current = (i + slides.length) % slides.length;
      update();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() { autoplay = setInterval(next, 5000); }
    function stopAutoplay()  { clearInterval(autoplay); }

    nextBtn.addEventListener('click', () => { next(); stopAutoplay(); startAutoplay(); });
    prevBtn.addEventListener('click', () => { prev(); stopAutoplay(); startAutoplay(); });
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // swipe (touch)
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 40) { diff < 0 ? next() : prev(); stopAutoplay(); startAutoplay(); }
    }, { passive: true });

    update();
    startAutoplay();
  }

  // ── 7. ANO AUTOMÁTICO NO FOOTER ───────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── 8. DESTAQUE DO LINK DE NAV ATIVO ───────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage) && currentPage !== 'index.html') {
      link.style.color = 'var(--spark)';
    }
  });

});
