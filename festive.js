(function () {
  'use strict';
  if (window.__bwPremium) return;
  window.__bwPremium = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastPath = '';

  function mediaBase() {
    var s = document.querySelector('script[src*="festive.js"]');
    if (s) {
      var src = s.getAttribute('src') || '';
      var i = src.lastIndexOf('festive.js');
      if (i >= 0) return src.slice(0, i);
    }
    if (location.pathname.indexOf('/boulevard') === 0) return '/boulevard/';
    return '/';
  }

  function abs(path) {
    var b = mediaBase();
    if (path.charAt(0) === '/') path = path.slice(1);
    return b + path;
  }

  /* Curated pools — all real assets already in the repo */
  var POOLS = {
    mexico: [
      'media/mexico/fountain.jpg',
      'media/mexico/key-art.jpg',
      'media/mexico/dancers.jpg',
      'media/mexico/day-retail.jpg',
      'media/mexico/candy.jpg',
      'media/mexico/lease.jpg',
      'media/mexico/stage.jpg',
      'media/mexico/master-plan.jpg'
    ],
    culture: [
      'media/blog/zocalo.jpg',
      'media/blog/guanajuato.jpg',
      'media/blog/oaxaca.jpg',
      'media/blog/tulum.jpg',
      'media/blog/cancun.jpg',
      'media/blog/chichen.jpg',
      'media/blog/teotihuacan.jpg',
      'media/blog/copper.jpg',
      'media/blog/altar.jpg',
      'media/blog/sunstone.jpg'
    ],
    cuisine: [
      'media/blog/tacos.jpg',
      'media/blog/churros.jpg',
      'media/blog/guacamole.jpg',
      'media/blog/mole.jpg',
      'media/blog/pozole.jpg',
      'media/blog/tamales.jpg',
      'media/blog/elote.jpg',
      'media/blog/enchiladas.jpg',
      'media/blog/chiles.jpg',
      'media/blog/aguas.jpg',
      'media/blog/agave.jpg'
    ],
    blvd: [
      'media/energy/blvd/aerial-night-lagoon.webp',
      'media/energy/blvd/entrance-gate-rock.webp',
      'media/energy/blvd/spain-welcome-arch.webp',
      'media/energy/blvd/spain-plaza-night-overhead.webp',
      'media/energy/blvd/spain-plaza-crowd-fountain.webp',
      'media/energy/blvd/spain-plaza-sunset-flag.webp',
      'media/energy/blvd/spain-plaza-day-overhead.webp',
      'media/energy/blvd/spain-plaza-arch-lit.webp',
      'media/energy/blvd/spain-plaza-arch-pedestrian.webp',
      'media/energy/blvd/og-cover.webp'
    ],
    boards: [
      'media/energy/boards/p02.jpg',
      'media/energy/boards/p03.jpg',
      'media/energy/boards/p07.jpg',
      'media/energy/boards/p09.jpg',
      'media/energy/boards/p11.jpg',
      'media/energy/boards/p14.jpg',
      'media/energy/boards/p17.jpg',
      'media/energy/boards/p20.jpg',
      'media/energy/boards/p24.jpg',
      'media/energy/boards/p28.jpg',
      'media/energy/boards/p32.jpg',
      'media/energy/boards/p36.jpg',
      'media/energy/boards/p40.jpg',
      'media/energy/boards/p44.jpg'
    ],
    cards: [
      'media/energy/cards/card1.webp',
      'media/energy/cards/card2.webp',
      'media/energy/cards/card3.webp',
      'media/energy/cards/card4.webp',
      'media/energy/cards/card5.webp',
      'media/energy/cards/heading.webp'
    ]
  };

  function pick(pool, n, offset) {
    var arr = POOLS[pool] || [];
    var out = [];
    var start = offset || 0;
    for (var i = 0; i < n; i++) out.push(arr[(start + i) % arr.length]);
    return out;
  }

  function mix() {
    var args = Array.prototype.slice.call(arguments);
    var out = [];
    args.forEach(function (a) {
      if (typeof a === 'string') out.push(a);
      else if (a && a.length) out = out.concat(a);
    });
    return out;
  }

  function clearEnergy() {
    document.querySelectorAll('[data-bw-energy]').forEach(function (n) {
      n.parentNode && n.parentNode.removeChild(n);
    });
  }

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

  function makeImg(path, cls) {
    var img = document.createElement('img');
    img.src = abs(path);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    if (cls) img.className = cls;
    return img;
  }

  function makeCinematic(paths) {
    var sec = document.createElement('section');
    sec.className = 'mx-cinematic';
    sec.setAttribute('data-bw-energy', '1');
    sec.setAttribute('aria-hidden', 'true');
    var bg = document.createElement('div');
    bg.className = 'mx-cinematic__bg';
    bg.style.backgroundImage = 'url("' + abs(paths[0]) + '")';
    sec.appendChild(bg);
    var grid = document.createElement('div');
    grid.className = 'mx-cinematic__grid';
    paths.slice(0, 3).forEach(function (p, i) {
      var fig = document.createElement('figure');
      fig.className = 'mx-cinematic__shot mx-cinematic__shot--' + i;
      fig.appendChild(makeImg(p));
      grid.appendChild(fig);
    });
    sec.appendChild(grid);
    var veil = document.createElement('div');
    veil.className = 'mx-cinematic__veil';
    sec.appendChild(veil);
    return sec;
  }

  function makeStrip(paths, variant) {
    var el = document.createElement('div');
    el.className = 'mx-energy-strip' + (variant ? ' mx-energy-strip--' + variant : '');
    el.setAttribute('data-bw-energy', '1');
    el.setAttribute('aria-hidden', 'true');
    var track = document.createElement('div');
    track.className = 'mx-energy-strip__track';
    // duplicate for seamless scroll feel
    var loop = paths.concat(paths);
    loop.forEach(function (p) {
      var fig = document.createElement('figure');
      fig.className = 'mx-energy-strip__item';
      fig.appendChild(makeImg(p));
      track.appendChild(fig);
    });
    el.appendChild(track);
    return el;
  }

  function makeMosaic(paths, title) {
    var el = document.createElement('section');
    el.className = 'mx-energy-mosaic';
    el.setAttribute('data-bw-energy', '1');
    if (title) {
      var h = document.createElement('p');
      h.className = 'mx-energy-mosaic__label';
      h.textContent = title;
      el.appendChild(h);
    }
    var grid = document.createElement('div');
    grid.className = 'mx-energy-mosaic__grid';
    paths.forEach(function (p, i) {
      var fig = document.createElement('figure');
      fig.className = 'mx-energy-mosaic__cell' + (i === 0 ? ' mx-energy-mosaic__cell--hero' : '');
      fig.appendChild(makeImg(p));
      grid.appendChild(fig);
    });
    el.appendChild(grid);
    return el;
  }

  function makeCardRow(paths) {
    var el = document.createElement('div');
    el.className = 'mx-energy-cards';
    el.setAttribute('data-bw-energy', '1');
    el.setAttribute('aria-hidden', 'true');
    paths.forEach(function (p) {
      var fig = document.createElement('figure');
      fig.className = 'mx-energy-cards__card';
      fig.appendChild(makeImg(p));
      el.appendChild(fig);
    });
    return el;
  }

  function makeSidePair(paths) {
    var el = document.createElement('div');
    el.className = 'mx-energy-pair';
    el.setAttribute('data-bw-energy', '1');
    el.setAttribute('aria-hidden', 'true');
    paths.slice(0, 2).forEach(function (p) {
      var fig = document.createElement('figure');
      fig.appendChild(makeImg(p));
      el.appendChild(fig);
    });
    return el;
  }

  function decorateExistingFigures() {
    document.querySelectorAll('main img').forEach(function (img) {
      if (img.closest('[data-bw-energy]')) return;
      var fig = img.closest('figure') || img.parentElement;
      if (fig && !fig.classList.contains('mx-photo-glow')) {
        fig.classList.add('mx-photo-glow');
      }
    });
  }

  function injectHomeEnergy() {
    var main = document.querySelector('main');
    if (!main) return;
    var sections = Array.prototype.slice.call(main.querySelectorAll(':scope > section'));
    if (!sections.length) return;

    // Opening cinematic — Mexico zone + destination night
    var open = makeCinematic(mix(
      POOLS.mexico[0],
      POOLS.mexico[1],
      POOLS.blvd[0]
    ));
    main.insertBefore(open, sections[0]);

    // After hero: mexico strip
    if (sections[0] && sections[0].nextSibling) {
      main.insertBefore(
        makeStrip(mix(pick('mexico', 6), pick('blvd', 2)), 'glow'),
        sections[0].nextSibling
      );
    }

    // Fill bare sections with alternating energy
    var bareIdx = 0;
    sections.forEach(function (sec, i) {
      if (i === 0) return;
      var hasImg = !!sec.querySelector('img');
      var textLen = (sec.textContent || '').trim().length;

      // Before sparse text sections: pair or strip
      if (!hasImg && textLen > 80) {
        var before;
        if (bareIdx % 3 === 0) {
          before = makeStrip(
            mix(pick('culture', 4, bareIdx), pick('mexico', 2, bareIdx)),
            'compact'
          );
        } else if (bareIdx % 3 === 1) {
          before = makeSidePair(mix(pick('blvd', 1, bareIdx), pick('mexico', 1, bareIdx + 2)));
        } else {
          before = makeCardRow(pick('cards', 4, bareIdx));
        }
        main.insertBefore(before, sec);
        bareIdx++;
      }

      // After long copy blocks: cuisine / boards energy
      if (!hasImg && textLen > 500) {
        var after = makeStrip(
          mix(pick('cuisine', 5, i), pick('boards', 3, i)),
          'warm'
        );
        if (sec.nextSibling) main.insertBefore(after, sec.nextSibling);
        else main.appendChild(after);
      }
    });

    // Mid-page mosaic — zone life
    var midAt = sections[Math.min(6, sections.length - 1)];
    if (midAt) {
      main.insertBefore(
        makeMosaic(
          mix(pick('mexico', 4), pick('culture', 3), pick('blvd', 2)),
          'أجواء المنطقة'
        ),
        midAt
      );
    }

    // Destination mosaic near "ما هي الوجهة"
    var destSec = null;
    sections.forEach(function (sec) {
      if ((sec.textContent || '').indexOf('ما هي الوجهة') !== -1) destSec = sec;
    });
    if (destSec) {
      main.insertBefore(
        makeMosaic(
          mix(pick('blvd', 5), pick('boards', 4)),
          'بوليفارد وورلد'
        ),
        destSec
      );
      main.insertBefore(makeStrip(pick('boards', 8), 'wide'), destSec.nextSibling);
    }

    // Closing gallery before last sections / contact
    var last = sections[sections.length - 1];
    if (last) {
      main.insertBefore(
        makeMosaic(
          mix(pick('mexico', 3, 2), pick('culture', 3, 2), pick('cuisine', 3), pick('blvd', 2, 3)),
          'طاقة المكان'
        ),
        last
      );
      main.insertBefore(
        makeStrip(mix(pick('mexico', 4, 1), pick('blvd', 4, 2), pick('culture', 4, 1)), 'finale'),
        last
      );
    }
  }

  function injectInnerEnergy() {
    var main = document.querySelector('main');
    if (!main) return;
    var path = location.pathname || '';

    var topStrip;
    if (path.indexOf('journal') !== -1) {
      topStrip = makeStrip(mix(pick('culture', 6), pick('cuisine', 6)), 'glow');
    } else if (path.indexOf('news') !== -1 || path.indexOf('million') !== -1) {
      topStrip = makeStrip(mix(pick('mexico', 4), pick('blvd', 4), pick('culture', 4)), 'glow');
    } else if (path.indexOf('walk') !== -1 || path.indexOf('pyramid') !== -1) {
      topStrip = makeStrip(mix(pick('mexico', 5), pick('boards', 5)), 'wide');
    } else {
      topStrip = makeStrip(mix(pick('mexico', 4), pick('blvd', 3), pick('culture', 3)), 'compact');
    }

    var first = main.querySelector(':scope > section, :scope > article, :scope > div');
    if (first) main.insertBefore(topStrip, first);
    else main.appendChild(topStrip);

    // Thumbnail cards for list-like pages
    var articles = main.querySelectorAll('article, a.block, li.border');
    var thumbPool = mix(POOLS.culture, POOLS.cuisine, POOLS.mexico);
    var ti = 0;
    articles.forEach(function (art) {
      if (art.querySelector('img')) return;
      if (art.querySelector('[data-bw-thumb]')) return;
      var thumb = document.createElement('div');
      thumb.className = 'mx-energy-thumb';
      thumb.setAttribute('data-bw-energy', '1');
      thumb.setAttribute('data-bw-thumb', '1');
      thumb.appendChild(makeImg(thumbPool[ti % thumbPool.length]));
      ti++;
      art.insertBefore(thumb, art.firstChild);
    });

    // Bottom mosaic on long pages
    main.appendChild(
      makeMosaic(
        mix(pick('blvd', 3), pick('mexico', 3), pick('culture', 3), pick('boards', 3)),
        'من الوجهة'
      )
    );
  }

  function injectEnergy() {
    var path = location.pathname || '';
    // Home: /boulevard/ or / or /boulevard/index.html
    var isHome =
      /\/boulevard\/?$/.test(path) ||
      path === '/' ||
      /\/boulevard\/index\.html$/.test(path) ||
      /\/index\.html$/.test(path) && path.split('/').length <= 3;

    // More precise: no extra segment after base
    var base = mediaBase().replace(/\/$/, '');
    var rest = path.replace(base, '').replace(/\/index\.html$/, '').replace(/\/$/, '');
    isHome = rest === '' || rest === '/';

    if (isHome) injectHomeEnergy();
    else injectInnerEnergy();
  }

  function revealOnScroll() {
    if (reduce) return;
    var nodes = document.querySelectorAll(
      'main > section, main article, figure, .mx-energy-mosaic, .mx-cinematic, .mx-energy-strip, .mx-energy-pair, .mx-energy-cards'
    );
    nodes.forEach(function (n) {
      if (!n.classList.contains('mx-reveal')) n.classList.add('mx-reveal');
    });
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
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function enhanceCtas() {
    document.querySelectorAll('a[href="#contact"], a[href*="#contact"]').forEach(function (a) {
      var t = (a.textContent || '').trim();
      if (t === 'احجز مساحتك الآن' || t === 'اطلب معاينة واحجز مساحتك') {
        a.setAttribute('data-bw-cta', '1');
      }
    });
  }

  function run() {
    try {
      var path = location.pathname;
      if (path !== lastPath) {
        clearEnergy();
        lastPath = path;
      } else if (document.querySelector('[data-bw-energy]')) {
        // already injected for this path
        decorateExistingFigures();
        return;
      }
      injectRail();
      injectTalaveraBands();
      injectEnergy();
      decorateExistingFigures();
      revealOnScroll();
      enhanceCtas();
    } catch (e) { /* keep site usable */ }
  }

  function schedule() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(run, 100);
      });
    } else {
      setTimeout(run, 100);
    }
  }
  schedule();

  // SPA route changes
  window.addEventListener('popstate', function () {
    lastPath = '';
    setTimeout(run, 140);
  });
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('http') === 0) return;
    setTimeout(function () {
      if (location.pathname !== lastPath) {
        lastPath = '';
        run();
      }
    }, 180);
  }, true);

  // Fallback poll for client-side routers + re-inject if hydration wiped nodes
  var reinjectTries = 0;
  setInterval(function () {
    if (location.pathname !== lastPath) {
      lastPath = '';
      reinjectTries = 0;
      run();
    } else if (!document.querySelector('[data-bw-energy]') && reinjectTries < 8) {
      reinjectTries += 1;
      lastPath = '';
      run();
    }
  }, 700);
})();
