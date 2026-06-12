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

  // ── 6. FORMULÁRIO DE CONTATO ───────────────
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const nome     = document.getElementById('nome')?.value.trim();
      const telefone = document.getElementById('telefone')?.value.trim();
      const servico  = document.getElementById('servico')?.value;

      if (!nome || !telefone || !servico) {
        showFormError('Por favor, preencha nome, telefone e tipo de serviço.');
        return;
      }

      // Simula envio (aqui você pode integrar com e-mail / backend real)
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Enviando…';

      setTimeout(() => {
        document.getElementById('contact-form').style.display  = 'none';
        document.getElementById('form-success').style.display  = 'block';
      }, 1200);
    });
  }

  function showFormError(msg) {
    let err = document.getElementById('form-error');
    if (!err) {
      err = document.createElement('p');
      err.id = 'form-error';
      err.style.cssText = 'color:#ff6b6b;font-size:.87rem;margin-top:.5rem;text-align:center;';
      document.getElementById('submit-btn')?.insertAdjacentElement('afterend', err);
    }
    err.textContent = msg;
    setTimeout(() => { err.textContent = ''; }, 4000);
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
