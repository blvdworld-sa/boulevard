(function () {
  'use strict';
  if (window.__bwPremium) return;
  window.__bwPremium = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function injectRail() {
    if (document.querySelector('.mx-premium-rail')) return;
    var rail = document.createElement('div');
    rail.className = 'mx-premium-rail';
    rail.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(rail, document.body.firstChild);
  }

  function injectTalaveraBands() {
    var main = document.querySelector('main');
    if (!main) return;
    var sections = main.querySelectorAll(':scope > section');
    sections.forEach(function (sec, i) {
      if (i === 0) return;
      if (sec.previousElementSibling && sec.previousElementSibling.classList.contains('mx-talavera-band')) return;
      var band = document.createElement('div');
      band.className = 'mx-talavera-band';
      band.setAttribute('aria-hidden', 'true');
      sec.parentNode.insertBefore(band, sec);
    });
  }

  function revealOnScroll() {
    if (reduce) return;
    var nodes = document.querySelectorAll('main > section, main article, figure');
    nodes.forEach(function (n) { n.classList.add('mx-reveal'); });
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function enhanceCtas() {
    // Soft label polish on primary lease CTAs if plain
    document.querySelectorAll('a[href="#contact"], a[href*="#contact"]').forEach(function (a) {
      var t = (a.textContent || '').trim();
      if (t === 'احجز مساحتك الآن' || t === 'اطلب معاينة واحجز مساحتك') {
        a.setAttribute('data-bw-cta', '1');
      }
    });
  }

  function run() {
    try {
      injectRail();
      injectTalaveraBands();
      revealOnScroll();
      enhanceCtas();
    } catch (e) { /* keep site usable */ }
  }

  // Delay past TanStack hydration to avoid mismatch
  function schedule() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(run, 80);
      });
    } else {
      setTimeout(run, 80);
    }
  }
  schedule();
})();
