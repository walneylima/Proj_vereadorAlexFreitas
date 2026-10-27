/* ============================================================
   GALLERY SLIDER
   ============================================================ */
(function () {
  const slides   = document.querySelectorAll('.gslide');
  const dots     = document.querySelectorAll('.gdot');
  const btnPrev  = document.getElementById('gPrev');
  const btnNext  = document.getElementById('gNext');

  let current      = 0;
  let autoInterval = null;
  const INTERVAL   = 5000;

  function goTo(index) {
    slides[current].classList.remove('gslide--active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('gdot--active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('gslide--active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('gdot--active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoInterval = setInterval(next, INTERVAL);
  }

  function stopAuto() {
    if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
  }

  btnNext.addEventListener('click', function () { next(); startAuto(); });
  btnPrev.addEventListener('click', function () { prev(); startAuto(); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); startAuto(); });
  });

  // Pausa no hover / focus
  const wrap = document.querySelector('.gallery__slider-wrap');
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);
  wrap.addEventListener('focusin',    stopAuto);
  wrap.addEventListener('focusout',   startAuto);

  // Swipe touch
  let touchStartX = 0;
  wrap.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  wrap.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      startAuto();
    }
  }, { passive: true });

  // Teclado (só quando o slider está em foco)
  wrap.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); startAuto(); }
    if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
  });

  startAuto();
})();


/* ============================================================
   HEADER — hamburger
   ============================================================ */
(function () {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.header__mobile-link');

  function openMenu() {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', function () {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });

  document.addEventListener('click', function (e) {
    if (!document.getElementById('header').contains(e.target)) closeMenu();
  });
})();


/* ============================================================
   HEADER — sombra ao rolar
   ============================================================ */
(function () {
  const header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ============================================================
   FORMULÁRIO — feedback de envio
   ============================================================ */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Valida campos obrigatórios
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(function (field) {
      field.classList.remove('form__input--error');
      if (!field.value.trim()) {
        field.classList.add('form__input--error');
        valid = false;
      }
    });

    if (!valid) return;

    // Simula envio — substitua aqui pela integração real (EmailJS, Formspree etc.)
    const btn = form.querySelector('.form__btn');
    btn.disabled = true;
    btn.innerHTML = '<span>Enviando...</span>';

    setTimeout(function () {
      // Esconde o formulário
      form.style.display = 'none';

      // Mostra mensagem de sucesso
      const success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('is-visible');
        success.focus();
      }
    }, 1000);
  });
})();
