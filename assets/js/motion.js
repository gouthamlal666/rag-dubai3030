/* RAG Biz HQ × Dubai 30x30 — premium motion (GSAP + ScrollTrigger + Lenis)
   Degrades gracefully: without GSAP, or with reduced motion, content is
   simply shown and native scrolling is used. */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const intro = $('#intro');

  /* ---------------- Fallback: no GSAP or reduced motion ---------------- */
  if (!hasGsap || reduced) {
    intro && intro.remove();
    $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
    document.documentElement.classList.add('scroll-native');
    window.RAG_MOTION = { reveal() {}, refresh() {} };
    return;
  }

  // Always start at the top so the intro + hero sequence plays as designed.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const ease = 'power4.out';

  /* ---------------- Smooth scrolling (Lenis) ---------------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    document.documentElement.classList.add('scroll-native');
  }

  window.RAG_SCROLL = {
    lock() { lenis && lenis.stop(); },
    unlock() { lenis && lenis.start(); },
    to(target) {
      if (lenis) lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : -90, duration: 1.4 });
      else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
      else target.scrollIntoView({ behavior: 'smooth' });
    },
  };

  // Route in-page anchor links through Lenis.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    window.RAG_SCROLL.to(target.id === 'home' ? 0 : target);
  });

  /* ---------------- Helpers ---------------- */
  // Wrap each word in a mask so it can rise into view. Keeps nested markup (gradient spans, <br>).
  function splitWords(el) {
    if (el.dataset.splitDone) return $$('.w-inner', el);
    const walk = (node, gradientClass) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const outer = document.createElement('span');
            outer.className = 'w-mask';
            const inner = document.createElement('span');
            inner.className = `w-inner ${gradientClass || ''}`;
            inner.textContent = p;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          const grad = ['text-gold-gradient', 'text-gold-gradient-dark'].find((c) => child.classList.contains(c));
          if (grad) child.classList.remove(grad);
          walk(child, grad || gradientClass);
        }
      });
    };
    walk(el);
    el.dataset.splitDone = '1';
    return $$('.w-inner', el);
  }

  function countUp(el) {
    const obj = { v: 0 };
    gsap.to(obj, { v: Number(el.dataset.count), duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(obj.v); } });
  }

  /* ---------------- Intro + hero ---------------- */
  gsap.set('#header .nav-shell', { yPercent: -160 });
  const heroWords = splitWords($('#heroTitle'));
  gsap.set(heroWords, { yPercent: 115, rotate: 4 });
  gsap.set('.hero-fade', { y: 30, opacity: 0 });
  gsap.set('.hero-media', { scale: 1.12, opacity: 0 });
  gsap.set('#heroEyebrow', { y: 20, opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease } });
  tl.fromTo('.intro-logo', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 })
    .to('.intro-logo', { scale: 1.15, opacity: 0, duration: 0.45, ease: 'power2.in' }, '+=0.25')
    .to(intro, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.15')
    .set(intro, { display: 'none' })
    .to('#header .nav-shell', { yPercent: 0, duration: 0.9 }, '-=0.5')
    .to(heroWords, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.06 }, '-=0.75')
    .to('.hero-media', { scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out' }, '-=1.1')
    .to('#heroEyebrow', { y: 0, opacity: 1, duration: 0.8, clearProps: 'all' }, '-=1.5')
    .to('.hero-fade', { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, '-=1.1');

  // Hero content drifts and fades as you scroll away.
  gsap.to('.hero-title', { yPercent: -18, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('#heroBg', { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---------------- Section reveals ---------------- */
  $$('[data-split]').forEach((el) => {
    if (el.id === 'heroTitle') return;
    const words = splitWords(el);
    gsap.from(words, { yPercent: 115, rotate: 3, duration: 1.1, ease, stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });

  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  $$('[data-stagger]').forEach((el) => {
    gsap.from(el.children, {
      y: 60, opacity: 0, duration: 1, ease, stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true, onEnter: () => $$('[data-count]', el).forEach(countUp) },
    });
  });

  // Image curtain reveal: clip from below + slow zoom-out
  $$('[data-clip]').forEach((el) => {
    const img = $('img', el);
    const t = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    t.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 1.5rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', duration: 1.4, ease: 'expo.out' });
    if (img) t.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
  });

  // Parallax layers
  $$('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.1;
    gsap.fromTo(el, { yPercent: 0 }, { yPercent: -speed * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Kinetic type band: rows slide in opposite directions with scroll
  gsap.fromTo('.kinetic-a', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.kinetic', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.kinetic-b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.kinetic', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Giant footer wordmark rises
  gsap.fromTo('.footer-giant', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  // Marquee reacts to scroll velocity (speed + skew)
  const marquee = $('#marquee');
  if (marquee) {
    const skewTo = gsap.quickTo(marquee, 'skewX', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({
      onUpdate(self) {
        const v = self.getVelocity();
        skewTo(gsap.utils.clamp(-12, 12, v / -250));
        marquee.getAnimations().forEach((a) => { a.playbackRate = 1 + Math.min(4, Math.abs(v) / 600); });
      },
    });
  }

  /* ---------------- Dynamic content (cards, gallery) ---------------- */
  // Batch-reveal freshly rendered elements as they enter the viewport.
  function reveal(nodes) {
    if (!nodes.length) return;
    gsap.set(nodes, { y: 60, opacity: 0 });
    ScrollTrigger.batch(nodes, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, ease, stagger: 0.07, overwrite: true }),
    });
    ScrollTrigger.refresh();
  }
  window.RAG_MOTION = { reveal, refresh: () => ScrollTrigger.refresh() };
  reveal($$('.session-card'));
  reveal($$('.gal-item'));

  /* ---------------- Magnetic buttons (desktop) ---------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    $$('.magnetic').forEach((btn) => {
      const x = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const y = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.25);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('mouseleave', () => { x(0); y(0); });
    });
  }

  // Language switch replaces text/layout — recalc trigger positions.
  document.addEventListener('rag:langchange', () => setTimeout(() => ScrollTrigger.refresh(), 50));
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
