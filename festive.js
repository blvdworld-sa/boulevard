(function () {
  'use strict';
  if (window.__mxFestive) return;
  window.__mxFestive = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function papelPicadoSVG() {
    var colors = ['#e4007c', '#f77f00', '#00a896', '#ffd60a', '#8ac926', '#0077b6', '#ff4fa3'];
    var parts = [];
    var n = 14;
    var w = 100 / n;
    for (var i = 0; i < n; i++) {
      var c = colors[i % colors.length];
      var x = i * w;
      var jagged = '';
      for (var k = 0; k <= 5; k++) {
        jagged += (x + (k * w) / 5) + ',' + (38 + ((k % 2) ? 8 : 0)) + ' ';
      }
      parts.push(
        '<polygon points="' + x + ',0 ' + (x + w - 0.4) + ',0 ' + jagged + '" fill="' + c + '" opacity="0.92"/>' +
        '<circle cx="' + (x + w / 2) + '" cy="14" r="3.2" fill="#fff8e7" opacity="0.85"/>' +
        '<circle cx="' + (x + w / 2) + '" cy="24" r="2.2" fill="#fff8e7" opacity="0.7"/>'
      );
    }
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 46" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      parts.join('') +
      '<line x1="0" y1="1" x2="100" y2="1" stroke="#5c3d2e" stroke-width="1.2"/>' +
      '</svg>'
    );
  }

  function injectBunting() {
    if (document.querySelector('.mx-bunting')) return;
    var bar = document.createElement('div');
    bar.className = 'mx-bunting';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = papelPicadoSVG();
    document.body.insertBefore(bar, document.body.firstChild);
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

  function sprinkleEmojis() {
    var map = [
      { sel: 'h1', emoji: '🌮' },
      { sel: 'header a.active p.truncate, header a[aria-current="page"] p.truncate', emoji: '🎉' },
      { sel: '#mexico h2, [id="mexico"] h2', emoji: '🌵' },
      { sel: '#sales h2, [id="sales"] h2', emoji: '💀' },
      { sel: '#visit h2, [id="visit"] h2', emoji: '🎉' },
      { sel: '#contact h2, [id="contact"] h2', emoji: '🌮' }
    ];
    map.forEach(function (item) {
      document.querySelectorAll(item.sel).forEach(function (el) {
        if (el.querySelector('.mx-emoji')) return;
        var span = document.createElement('span');
        span.className = 'mx-emoji';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = item.emoji;
        el.appendChild(document.createTextNode(' '));
        el.appendChild(span);
      });
    });
  }

  function revealOnScroll() {
    var nodes = document.querySelectorAll('main > section, main article, figure');
    nodes.forEach(function (n) { n.classList.add('mx-reveal'); });
    if (reduce) {
      nodes.forEach(function (n) { n.classList.add('mx-in'); });
      return;
    }
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('mx-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('mx-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function confettiBurst() {
    if (reduce) return;
    if (document.getElementById('mx-confetti')) return;
    var canvas = document.createElement('canvas');
    canvas.id = 'mx-confetti';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var colors = ['#e4007c', '#f77f00', '#00a896', '#ffd60a', '#8ac926', '#0077b6', '#ffffff'];
    var pieces = [];
    var count = window.innerWidth < 600 ? 48 : 90;
    for (var i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.4,
        w: 6 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        vx: -1.5 + Math.random() * 3,
        vy: 1.5 + Math.random() * 3.5,
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        color: colors[i % colors.length]
      });
    }
    var start = performance.now();
    var duration = 3200;
    function frame(now) {
      var t = now - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.03;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - t / duration);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (t < duration) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
      }
    }
    requestAnimationFrame(frame);
  }

  function enhance() {
    injectBunting();
    injectTalaveraBands();
    sprinkleEmojis();
    revealOnScroll();
    // Confetti once per session on home-ish pages
    try {
      var key = 'mx-confetti-once';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        setTimeout(confettiBurst, 400);
      }
    } catch (e) {
      setTimeout(confettiBurst, 400);
    }
  }

  function start() {
    // Wait for React/TanStack hydration to finish before mutating DOM
    var kick = function () { setTimeout(enhance, 50); };
    if (window.requestIdleCallback) {
      setTimeout(function () { requestIdleCallback(kick, { timeout: 1500 }); }, 900);
    } else {
      setTimeout(kick, 1200);
    }
    // SPA navigations: re-apply lightly
    setTimeout(enhance, 2500);
    window.addEventListener('popstate', function () { setTimeout(enhance, 400); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
