/* ============================================
   TZ Gaming - Shared Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initHeroCarousel();
  initFaqAccordion();
  initActivityAccordion();
  initStepTabs();
  initDragScroll();
  initSlotPreviews();
  initCountUp();
  initCoverflow();
  markActiveNav();
});

/* ---- Mobile nav toggle ---- */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Hero carousel (auto-rotating, 3 slides) ---- */
function initHeroCarousel() {
  const track = document.querySelector('.hero-track');
  const dotsWrap = document.querySelector('.hero-dots');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  const dots = Array.from(dotsWrap.children);
  let index = 0;
  let timer = null;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
  }

  function next() { goTo(index + 1); }

  function start() {
    stop();
    timer = setInterval(next, 5000);
  }
  function stop() { if (timer) clearInterval(timer); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); start(); });
  });

  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);

  goTo(0);
  start();
}

/* ---- FAQ accordion ---- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });
}

/* ---- Activity page accordion cards ---- */
function initActivityAccordion() {
  const cards = document.querySelectorAll('.activity-card');
  if (!cards.length) return;
  cards.forEach(card => {
    const toggle = card.querySelector('.activity-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      card.classList.toggle('is-open');
    });
  });
}

/* ---- Mouse drag-to-scroll for horizontally-scrolling rows (desktop) ----
   Touch already scrolls these natively; this just adds mouse-drag support
   so desktop users aren't limited to the trackpad/scrollbar. */
function initDragScroll() {
  document.querySelectorAll('.sport-classic-scroll, .footer-partners').forEach(el => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    el.addEventListener('mousedown', (e) => {
      isDown = true;
      moved = false;
      startX = e.pageX;
      startScroll = el.scrollLeft;
      el.classList.add('is-dragging');
    });
    window.addEventListener('mouseup', () => {
      isDown = false;
      el.classList.remove('is-dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = startScroll - dx;
    });
    // Prevent the drag from also triggering a click on links/buttons inside
    el.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
  });
}

/* ---- Slot page gameplay-preview carousels (supports multiple per page) ---- */
function initSlotPreviews() {
  document.querySelectorAll('.slot-preview').forEach(preview => {
    const track = preview.querySelector('.slot-preview-track');
    const dotsWrap = preview.parentElement.querySelector('.slot-preview-dots');
    if (!track || !dotsWrap) return;
    const slides = Array.from(track.children);
    const dots = Array.from(dotsWrap.children);
    let index = 0;
    let timer = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
    }
    function next() { goTo(index + 1); }
    function start() { stop(); timer = setInterval(next, 4000); }
    function stop() { if (timer) clearInterval(timer); }

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); start(); }));
    preview.addEventListener('mouseenter', stop);
    preview.addEventListener('mouseleave', start);

    goTo(0);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
  });
}

function initStepTabs() {
  const tabs = document.querySelectorAll('.step-tab');
  if (!tabs.length) return;
  const panels = document.querySelectorAll('.step-panel');
  const tabsArr = Array.from(tabs);

  const prevBtn = document.querySelector('.step-nav-prev');
  const nextBtn = document.querySelector('.step-nav-next');

  function updateNavButtons() {
    const currentIndex = tabsArr.findIndex(t => t.classList.contains('is-active'));
    if (prevBtn) prevBtn.style.visibility = currentIndex <= 0 ? 'hidden' : '';
    if (nextBtn) nextBtn.style.visibility = currentIndex >= tabsArr.length - 1 ? 'hidden' : '';
  }

  function activate(tab) {
    const step = tab.getAttribute('data-step');
    tabsArr.forEach(t => t.classList.toggle('is-active', t === tab));
    panels.forEach(p => p.classList.toggle('is-active', p.getAttribute('data-step') === step));
    updateNavButtons();
  }

  tabsArr.forEach(tab => tab.addEventListener('click', () => activate(tab)));

  function step(delta) {
    const currentIndex = tabsArr.findIndex(t => t.classList.contains('is-active'));
    const nextIndex = currentIndex + delta;
    if (nextIndex < 0 || nextIndex >= tabsArr.length) return;   /* first/last step — ignore to prevent mis-taps */
    activate(tabsArr[nextIndex]);
  }
  if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => step(1));

  updateNavButtons();
}

/* ---- Count-up animation ---- (used for the homepage's player/member/
   payout stats, and the slot page's RTP/payout-multiplier stats)
   Supports optional data-decimals / data-prefix / data-suffix / a
   data-no-commas flag so the exact same animation can drive plain
   integers (3,545), percentages (96.89%) and prefixed multipliers
   (x 81000) alike. */
function initCountUp() {
  const nums = document.querySelectorAll('[data-count-to]');
  if (!nums.length) return;

  const duration = 1800; // ms
  const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  function format(n, decimals, useCommas) {
    const fixed = n.toFixed(decimals);
    if (!useCommas) return fixed;
    const parts = fixed.split('.');
    parts[0] = Number(parts[0]).toLocaleString('en-US');
    return parts.join('.');
  }

  function animate(el) {
    const target = Number(el.getAttribute('data-count-to'));
    const decimals = Number(el.getAttribute('data-decimals') || 0);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const useCommas = !el.hasAttribute('data-no-commas');
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutExpo(progress);
      const current = 1 + (target - 1) * eased;
      el.textContent = prefix + format(current, decimals, useCommas) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + format(target, decimals, useCommas) + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  nums.forEach(el => observer.observe(el));
}

/* ---- Game category coverflow carousel (ref: Figma "Frame 475") ----
   Faithful port of the confirmed step-3 standalone demo: a 15-card
   sliding track (3 looping blocks of the 5 categories), shifted with
   translateX inside a viewport that fills the page's 1440px container
   (minus its 56px side insets) and scales with it — however many cards
   that fits is what's visible. The centre card enlarges and crossfades
   to its full-colour artwork. On loop reset, both the track position
   AND every active-card transition are killed instantly so the wrap
   point is never visible.
------------------------------------------------------------------ */
function initCoverflow() {
  const track = document.getElementById('coverflowTrack');
  if (!track) return;

  const CATEGORIES = [
    { key: 'sport', name: '\u9ad4\u80b2\u6295\u6ce8', href: 'sport.html',    img: 'images/game-sport.png', imgActive: 'images/game-sport-active.png' },
    { key: 'card',  name: '\u68cb\u724c\u904a\u6232', href: 'mb.html',       img: 'images/game-card.png',  imgActive: 'images/game-card-active.png'  },
    { key: 'slot',  name: '\u96fb\u5b50\u904a\u6232', href: 'slot.html',     img: 'images/game-slot.png',  imgActive: 'images/game-slot-active.png'  },
    { key: 'chess', name: '\u771f\u4eba\u8996\u8a0a', href: 'live.html',     img: 'images/game-chess.png', imgActive: 'images/game-chess-active.png' },
    { key: 'lotto', name: '\u5f69\u7968\u904a\u6232', href: 'activity.html', img: 'images/game-lotto.png', imgActive: 'images/game-lotto-active.png' }
  ];

  const BLOCKS = 3;                     // 3 sets of 5 = 15 cards, buffer on both sides of the loop reset
  const TOTAL = CATEGORIES.length * BLOCKS;
  const CENTER_OFFSET = 2;              // centre card = baseIndex + 2 (2 default cards lead it on screen)
  const ADVANCE_MS = 2000;              // slide one card every 2 seconds

  // Card size is intentionally constant at every screen size (per spec) —
  // only the 1440px container's 56px side inset responds to the viewport.
  const DEFAULT_W = 240, DEFAULT_H = 399, ACTIVE_W = 280, ACTIVE_H = 465;
  const GAP = 56;   // must match .coverflow-track's CSS `gap` — used for the render() centring math below

  const frag = document.createDocumentFragment();
  for (let i = 0; i < TOTAL; i++) {
    const cat = CATEGORIES[i % CATEGORIES.length];
    const card = document.createElement('a');
    card.className = 'coverflow-card';
    card.href = cat.href;
    card.setAttribute('data-key', cat.key);
    card.setAttribute('aria-label', cat.name);
    card.innerHTML = `
      <img class="img-default" src="${cat.img}" alt="${cat.name}" onerror="this.style.display='none'" style="opacity:1;">
      <img class="img-active" src="${cat.imgActive}" alt="${cat.name}" onerror="this.style.display='none'" style="opacity:0;">
    `;
    // Fixed base size, set inline so no external CSS rule can ever override it
    card.style.width = DEFAULT_W + 'px';
    card.style.height = DEFAULT_H + 'px';
    card.style.transition = 'width .6s ease, height .6s ease';
    card.querySelectorAll('img').forEach(img => { img.style.transition = 'opacity .6s ease'; });
    frag.appendChild(card);
  }
  track.appendChild(frag);

  const cards = Array.from(track.children);
  let baseIndex = CATEGORIES.length;   // start in the middle block
  let activeCard = null;
  let timer = null;

  function killTransition(el) {
    el.style.transition = 'none';
    el.querySelectorAll('img').forEach(img => { img.style.transition = 'none'; });
  }
  function restoreTransition(el) {
    el.style.transition = 'width .6s ease, height .6s ease';
    el.querySelectorAll('img').forEach(img => { img.style.transition = 'opacity .6s ease'; });
  }

  function applyState(el, active) {
    el.classList.toggle('is-active', active);
    el.style.width = (active ? ACTIVE_W : DEFAULT_W) + 'px';
    el.style.height = (active ? ACTIVE_H : DEFAULT_H) + 'px';
    const imgDefault = el.querySelector('.img-default');
    const imgActive = el.querySelector('.img-active');
    if (imgDefault) imgDefault.style.opacity = active ? '0' : '1';
    if (imgActive) imgActive.style.opacity = active ? '1' : '0';
  }

  function setActive(idx, instant) {
    const prev = activeCard;
    const next = cards[idx];
    if (instant) {
      if (prev) killTransition(prev);
      killTransition(next);
    }
    if (prev) applyState(prev, false);
    applyState(next, true);
    activeCard = next;
    if (instant) {
      // force reflow so the "no transition" state applies before we restore it
      // eslint-disable-next-line no-unused-expressions
      next.offsetHeight;
      if (prev) restoreTransition(prev);
      restoreTransition(next);
    }
  }

  function render(withTransition) {
    const activeIdx = baseIndex + CENTER_OFFSET;
    setActive(activeIdx, !withTransition);
    track.style.transition = withTransition ? '' : 'none';
    // Compute the centring offset purely from the known constants instead of
    // reading activeCardEl.offsetLeft/offsetWidth: while a card's width
    // transition is still in flight (i.e. every normal advance, not just the
    // instant reset), the browser doesn't reliably report the just-set target
    // size on a synchronous read — it can still reflect the pre-transition
    // value, which threw the centring off by a consistent 20px on every
    // regular slide (confirmed by measurement) even though the instant reset
    // frame landed exactly on centre. Since every card except the active one
    // is always DEFAULT_W in the settled/target layout, its offsetLeft is
    // just activeIdx * (DEFAULT_W + GAP) — no DOM read needed.
    const viewportWidth = track.parentElement.clientWidth;
    const offset = activeIdx * (DEFAULT_W + GAP)
      + ACTIVE_W / 2
      - viewportWidth / 2
      - track.offsetLeft;
    track.style.transform = `translateX(-${offset}px)`;
    if (!withTransition) {
      // eslint-disable-next-line no-unused-expressions
      track.offsetHeight;
      track.style.transition = '';
    }
  }

  function advance() {
    baseIndex += 1;
    if (baseIndex >= CATEGORIES.length * 2) {
      // Slide into the 3rd block, then snap back to the 2nd block instantly \u2014
      // both blocks are identical, so the reset is invisible.
      render(true);
      const onEnd = (e) => {
        // transitionend bubbles from every card's width/height and every
        // image's opacity transition too (9+ events fire almost at once
        // on every step). Without this filter, the reset can be triggered
        // by one of those instead of the track's own slide finishing \u2014
        // firing early, mid-slide, and causing a visible stutter/jump.
        if (e.target !== track || e.propertyName !== 'transform') return;
        track.removeEventListener('transitionend', onEnd);
        baseIndex -= CATEGORIES.length;
        render(false);
      };
      track.addEventListener('transitionend', onEnd);
      return;
    }
    render(true);
  }

  function start() {
    stop();
    timer = setInterval(advance, ADVANCE_MS);
  }
  function stop() { if (timer) clearInterval(timer); }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  requestAnimationFrame(() => {
    render(false);
    if (!prefersReducedMotion) start();
  });

  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', () => { if (!prefersReducedMotion) start(); });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    // card sizes never change — this only re-measures the track's translateX
    // offset, since the 56px inset area can still change width with the viewport.
    resizeTimer = setTimeout(() => render(false), 150);
  });
}


/* ---- Highlight current page in nav ---- */
function markActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .footer-nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('is-active');
  });
}
