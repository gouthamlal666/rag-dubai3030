/* RAG Biz HQ × Dubai 30x30 — page logic (schedule, slider, language, forms) */
(function () {
  'use strict';

  const CFG = window.RAG_CONFIG;
  const I18N = window.RAG_I18N;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const parseDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const initials = (name) => name ? name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() : '?';
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };
  // Unsplash serves any width we ask for; local images are returned unchanged.
  const sizedImage = (url, w) => (/images\.unsplash\.com/.test(url) ? url.replace(/([?&])w=\d+/, `$1w=${w}`) : url);
  // Hero photos fill the screen: 800px wide on phones, 1400px on larger screens.
  // Keep in sync with the <link rel="preload"> tags in index.html.
  const heroImageWidth = () => (window.matchMedia('(max-width: 767px)').matches ? 800 : 1400);
  // Smooth-scroll + scroll-lock helpers are provided by motion.js when it loads.
  const scroller = () => window.RAG_SCROLL;
  const scrollToY = (y) => (scroller() ? scroller().to(y) : window.scrollTo({ top: y, behavior: 'smooth' }));

  const icons = {
    sun: '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>',
    clock: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    arrow: '<svg class="flip-rtl h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chevL: '<svg class="flip-rtl h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>',
    chevR: '<svg class="flip-rtl h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>',
    expand: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  };

  /* ------------------------------------------------------------------ *
   * Language
   * ------------------------------------------------------------------ */
  let lang = store.get('rag3030-lang', 'en') === 'ar' ? 'ar' : 'en';
  const ui = (k) => I18N.ui[lang][k];
  const isAr = () => lang === 'ar';
  const enCache = new WeakMap(); // original English markup, read from the HTML

  function applyStaticText() {
    $$('[data-i18n]').forEach((el) => {
      if (!enCache.has(el)) enCache.set(el, el.innerHTML);
      const ar = I18N.ar[el.dataset.i18n];
      el.innerHTML = isAr() && ar != null ? ar : enCache.get(el);
    });
    $$('[data-i18n-ph]').forEach((el) => {
      if (!el.dataset.phEn) el.dataset.phEn = el.placeholder;
      const ar = I18N.ar[el.dataset.i18nPh];
      el.placeholder = isAr() && ar != null ? ar : el.dataset.phEn;
    });
  }

  function setLang(next, { initial = false } = {}) {
    lang = next;
    store.set('rag3030-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr() ? 'rtl' : 'ltr';
    $$('.lang-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    applyStaticText();
    renderMarquee();
    renderKinetic();
    if (!initial) {
      buildFilterOptions();
      renderWeekTabs();
      renderLegend();
      renderSpotlight();
      renderSchedule();
      renderGallery();
      if (heroSlider) { heroSlider.renderCopy(); heroSlider.refreshCaption(); }
      tickCountdown && tickCountdown();
      document.dispatchEvent(new CustomEvent('rag:langchange', { detail: { lang } }));
    }
  }
  $$('.lang-btn').forEach((b) => b.addEventListener('click', () => { if (b.dataset.lang !== lang) setLang(b.dataset.lang); }));

  /* ------------------------------------------------------------------ *
   * Horizontal scroll rows (week tabs, gallery filters): arrow buttons
   * appear only when there is more to scroll in that direction.
   * ------------------------------------------------------------------ */
  function initHScroll(wrap) {
    const row = wrap.querySelector('.overflow-x-auto');
    const prev = $('.hs-nav-prev', wrap), next = $('.hs-nav-next', wrap);
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      const pos = Math.abs(row.scrollLeft); // scrollLeft is negative in RTL
      const back = max > 2 && pos > 2, fwd = max > 2 && pos < max - 2;
      wrap.classList.toggle('can-back', back);
      wrap.classList.toggle('can-fwd', fwd);
      prev.classList.toggle('is-visible', back);
      next.classList.toggle('is-visible', fwd);
    };
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-hs-dir]'); if (!b) return;
      const dir = Number(b.dataset.hsDir) * (isAr() ? -1 : 1);
      row.scrollBy({ left: dir * Math.max(160, row.clientWidth * 0.7), behavior: 'smooth' });
    });
    row.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(row);
    new MutationObserver(() => requestAnimationFrame(update)).observe(row, { childList: true });
    // Labels change width after a language switch, so re-check the arrows.
    document.addEventListener('rag:langchange', () => requestAnimationFrame(update));
    update();
  }

  /* ------------------------------------------------------------------ *
   * Toast
   * ------------------------------------------------------------------ */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.innerHTML = msg;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), 3200);
  }

  /* ------------------------------------------------------------------ *
   * Marquee + kinetic type
   * ------------------------------------------------------------------ */
  function renderMarquee() {
    const items = ui('marquee').map((t) => `<span>${esc(t)}</span><span class="mq-dot" aria-hidden="true"></span>`).join('');
    $('#marquee').innerHTML = `<div class="marquee-track">${items}</div><div class="marquee-track" aria-hidden="true">${items}</div>`;
  }
  function renderKinetic() {
    const row = (word, a, b) => `<span class="${a}">${esc(word)}</span> <span class="mq-dot mq-dot-lg" aria-hidden="true"></span> <span class="${b}">${esc(word)}</span> <span class="mq-dot mq-dot-lg" aria-hidden="true"></span> <span class="${a}">${esc(word)}</span> <span class="mq-dot mq-dot-lg" aria-hidden="true"></span> <span class="${b}">${esc(word)}</span>`;
    $('.kinetic-a').innerHTML = row(ui('kMins'), 'text-outline', 'text-gold-gradient');
    $('.kinetic-b').innerHTML = row(ui('kDays'), 'text-gold-gradient', 'text-outline');
  }

  /* ------------------------------------------------------------------ *
   * Hero slider (card + synced background)
   * ------------------------------------------------------------------ */
  let heroSlider = null;
  function initHeroSlider() {
    const slides = window.RAG_HERO_SLIDES || [];
    const card = $('#heroSlider');
    if (!slides.length || !card) return;
    const DURATION = 5500;
    const fallback = 'assets/img/gallery/RAG00578.webp';
    // Only the first photo loads with the page (it's preloaded in <head>); the others
    // load once the page is ready, so phones aren't downloading six photos up front.
    const w = heroImageWidth();
    const img = (s, i) => `<img ${i === 0 ? 'src' : 'data-src'}="${esc(sizedImage(s.image, w))}" alt="" class="hs-slide ${i === 0 ? 'is-active' : ''}" decoding="async" ${i === 0 ? 'fetchpriority="high"' : ''} onerror="this.onerror=null;this.src='${fallback}'" />`;
    $('#heroBg').innerHTML = slides.map(img).join('');
    const loadSlide = (el) => { if (el && !el.getAttribute('src') && el.dataset.src) el.src = el.dataset.src; };
    const loadRest = () => $$('#heroBg .hs-slide').forEach(loadSlide);
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
    if (document.readyState === 'complete') idle(loadRest);
    else window.addEventListener('load', () => idle(loadRest), { once: true });
    $('#heroBars').innerHTML = slides.map((_, i) => `<button type="button" class="hs-bar" data-goto="${i}" aria-label="Slide ${i + 1}"><span></span></button>`).join('');

    let current = 0, progress = 0, paused = false, last = performance.now();
    const fills = $$('#heroBars .hs-bar span');

    // Headline + intro for every slide, stacked in one grid cell so the
    // tallest one sets the height and swapping never shifts the layout.
    function renderCopy() {
      $('#heroCopy').innerHTML = slides.map((s, i) => {
        const tag = i === 0 ? 'h1 id="heroTitle"' : 'h2';
        return `
        <div class="hero-copy-item ${i === current ? 'is-active' : ''}" ${i === current ? '' : 'aria-hidden="true"'}>
          <${tag} class="font-display text-[2.4rem] font-extrabold uppercase italic leading-[1] sm:text-6xl lg:text-[4.9rem]">${isAr() ? s.headingAr || s.heading : s.heading}</${tag.split(' ')[0]}>
          <p class="${i === 0 ? 'hero-fade ' : ''}mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">${isAr() ? s.leadAr || s.lead : s.lead}</p>
        </div>`;
      }).join('');
    }

    function refreshCaption() {
      const s = slides[current];
      const eb = $('#heroEyebrow'), cap = $('#heroCaption');
      [eb, cap].forEach((el) => el.classList.remove('is-in'));
      requestAnimationFrame(() => {
        eb.textContent = isAr() ? s.eyebrowAr || s.eyebrow : s.eyebrow;
        cap.textContent = isAr() ? s.titleAr || s.title : s.title;
        requestAnimationFrame(() => [eb, cap].forEach((el) => el.classList.add('is-in')));
      });
    }
    let pending = false;
    function go(i, { instant = false } = {}) {
      const next = (i + slides.length) % slides.length;
      const els = $$('#heroBg .hs-slide');
      const target = els[next];
      loadSlide(target);
      // Wait (briefly) for the next image so it never pops in mid-fade.
      if (!instant && target && !(target.complete && target.naturalWidth)) {
        if (pending) return;
        pending = true;
        const done = () => { if (!pending) return; pending = false; go(next, { instant: true }); };
        target.addEventListener('load', done, { once: true });
        target.addEventListener('error', done, { once: true });
        setTimeout(done, 1200);
        return;
      }
      pending = false;
      const old = current;
      current = next;
      progress = 0;
      els.forEach((el, n) => {
        el.classList.remove('is-prev');
        if (n !== current) el.classList.remove('is-active');
      });
      if (old !== current && els[old]) {
        // The old slide stays fully visible underneath until the new one has finished
        // fading in (transitionend), with a generous timeout as a fallback.
        const under = els[old], over = els[current];
        under.classList.add('is-prev');
        let fallback = null;
        const release = (e) => {
          if (e && (e.target !== over || e.propertyName !== 'opacity')) return;
          over.removeEventListener('transitionend', release);
          clearTimeout(fallback);
          if (over.classList.contains('is-active')) under.classList.remove('is-prev');
        };
        over.addEventListener('transitionend', release);
        fallback = setTimeout(release, 2500);
      }
      els[current].classList.add('is-active');
      $('#heroCount').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      fills.forEach((f, n) => { f.style.width = n < current ? '100%' : '0%'; });
      $$('#heroCopy .hero-copy-item').forEach((el, n) => {
        el.classList.toggle('is-active', n === current);
        n === current ? el.removeAttribute('aria-hidden') : el.setAttribute('aria-hidden', 'true');
      });
      refreshCaption();
    }
    function frame(now) {
      const dt = now - last; last = now;
      if (!paused && !pending && !document.hidden) {
        progress += dt;
        fills[current].style.width = `${Math.min(100, (progress / DURATION) * 100)}%`;
        if (progress >= DURATION) go(current + 1);
      }
      requestAnimationFrame(frame);
    }

    card.addEventListener('click', (e) => {
      const b = e.target.closest('[data-hs], [data-goto]'); if (!b) return;
      if (b.dataset.goto) go(Number(b.dataset.goto));
      else go(current + (b.dataset.hs === 'next' ? 1 : -1));
    });
    card.addEventListener('mouseenter', () => { paused = true; });
    card.addEventListener('mouseleave', () => { paused = false; });
    let tx = null;
    const hero = $('#home');
    hero.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) go(current + ((dx < 0) !== isAr() ? 1 : -1));
      tx = null;
    });

    renderCopy();
    go(0, { instant: true });
    requestAnimationFrame(frame);
    heroSlider = { go, refreshCaption, renderCopy };
  }

  /* ------------------------------------------------------------------ *
   * Build the full 30-day session list
   * ------------------------------------------------------------------ */
  const start = parseDate(CFG.challengeStart);
  const end = parseDate(CFG.challengeEnd);
  const slotNames = Object.keys(CFG.slots);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const byKey = new Map(window.RAG_SESSIONS.map((s) => [`${s.date}|${s.slot}`, s]));
  const sessions = [];
  for (let d = new Date(start), dayNo = 1; d <= end; d = addDays(d, 1), dayNo++) {
    const iso = toISO(d);
    slotNames.forEach((slot) => {
      const row = byKey.get(`${iso}|${slot}`) || {};
      sessions.push({
        id: `${iso}-${slot}`,
        date: iso,
        dateObj: new Date(d),
        dayNo,
        weekNo: Math.floor((dayNo - 1) / 7) + 1,
        slot,
        activity: (row.activity || '').trim(),
        instructor: (row.instructor || '').trim(),
        // Public status: a session with an activity is "Scheduled"; open slots show "Details soon".
        status: (row.activity || '').trim() ? 'Scheduled' : 'Pending',
        past: d < today,
      });
    });
  }
  const activityNames = [...new Set(sessions.map((s) => s.activity).filter(Boolean))];
  const weekCount = Math.max(...sessions.map((s) => s.weekNo));

  // Localised accessors
  const info = (s) => CFG.activities[s.activity] || CFG.activities.default;
  const activityLabel = (name) => (isAr() ? (CFG.activities[name] || {}).nameAr || name : name);
  const title = (s) => (s.activity ? activityLabel(s.activity) : ui('comingSoon'));
  const blurb = (s) => (isAr() ? info(s).blurbAr || info(s).blurb : info(s).blurb);
  const slotLabel = (s) => (isAr() ? CFG.slots[s.slot].labelAr : CFG.slots[s.slot].label);
  const slotTime = (s) => (isAr() ? CFG.slots[s.slot].timeAr : CFG.slots[s.slot].time);
  const statusLabel = (key) => (isAr() ? CFG.statuses[key].labelAr : CFG.statuses[key].label);
  const dayName = (d) => ui('days')[d.getDay()];
  const monthShort = (d) => ui('months')[d.getMonth()];
  const shortDate = (d) => `${d.getDate()} ${ui('monthsLong')[d.getMonth()]}`;
  const longDate = (s) => `${dayName(s.dateObj)}، ${shortDate(s.dateObj)}`.replace('،', isAr() ? '،' : ',');

  const statusChip = (s) => {
    const st = CFG.statuses[s.status];
    return `<span class="status-chip ring-1 ${st.chip}"><span class="h-1.5 w-1.5 rounded-full ${st.dot}"></span>${esc(statusLabel(s.status))}</span>`;
  };
  const slotChip = (s) => `<span class="slot-chip slot-${s.slot}">${icons[CFG.slots[s.slot].icon]}${esc(slotLabel(s))}</span>`;
  // Activity photos come from Unsplash; ask for a width that suits where they're shown.
  const imgTag = (s, cls = '', w = 640) =>
    `<img src="${esc(sizedImage(info(s).image, w))}" alt="${esc(title(s))}" loading="lazy" decoding="async" class="${cls} ${s.activity ? '' : 'tba-img'}" onerror="this.onerror=null;this.src='assets/img/gallery/RAG00578.webp'" />`;


  /* ------------------------------------------------------------------ *
   * Schedule state + filters
   * ------------------------------------------------------------------ */
  const currentWeek = (() => {
    const hit = sessions.find((s) => s.date === toISO(today));
    return hit ? hit.weekNo : 1;
  })();
  const state = { view: 'cards', week: currentWeek, slot: 'all', activity: 'all', status: 'all', selected: null };

  function filtered({ ignoreWeek = false } = {}) {
    return sessions.filter((s) =>
      (ignoreWeek || state.week === 'all' || s.weekNo === state.week) &&
      (state.slot === 'all' || s.slot === state.slot) &&
      (state.activity === 'all' || (state.activity === '__tba' ? !s.activity : s.activity === state.activity)) &&
      (state.status === 'all' || s.status === state.status)
    );
  }

  function renderWeekTabs() {
    let html = `<button class="week-tab" data-week="all"><b>${esc(ui('allDays'))}</b><small>${esc(shortDate(start))} – ${esc(shortDate(end))}</small></button>`;
    for (let w = 1; w <= weekCount; w++) {
      const days = sessions.filter((s) => s.weekNo === w);
      html += `<button class="week-tab" data-week="${w}"><b>${esc(ui('week')(w))}</b><small>${esc(shortDate(days[0].dateObj))} – ${esc(shortDate(days[days.length - 1].dateObj))}</small></button>`;
    }
    $('#weekTabs').innerHTML = html;
    $$('.week-tab').forEach((b) => b.classList.toggle('is-active', String(state.week) === b.dataset.week));
  }

  function buildFilterOptions() {
    $('#activityFilter').innerHTML = `<option value="all">${esc(ui('allActivities'))}</option>` +
      activityNames.map((a) => `<option value="${esc(a)}">${esc(activityLabel(a))}</option>`).join('') +
      `<option value="__tba">${esc(ui('comingSoon'))}</option>`;
    $('#activityFilter').value = state.activity;
    $('#statusFilter').innerHTML = `<option value="all">${esc(ui('anyStatus'))}</option>` +
      Object.keys(CFG.statuses).map((k) => `<option value="${esc(k)}">${esc(statusLabel(k))}</option>`).join('');
    $('#statusFilter').value = state.status;
  }

  function renderLegend() {
    $('#legend').innerHTML = Object.entries(CFG.statuses)
      .map(([k, st]) => `<span class="inline-flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full ${st.dot}"></span>${esc(statusLabel(k))}</span>`).join('');
  }

  function initFilters() {
    renderWeekTabs();
    buildFilterOptions();
    renderLegend();
    $('#activityCount').textContent = activityNames.length;

    $('#weekTabs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-week]'); if (!b) return;
      state.week = b.dataset.week === 'all' ? 'all' : Number(b.dataset.week);
      renderSchedule();
    });
    $('#slotFilter').addEventListener('click', (e) => {
      const b = e.target.closest('[data-slot]'); if (!b) return;
      state.slot = b.dataset.slot;
      $$('#slotFilter .seg-btn').forEach((x) => x.classList.toggle('is-active', x === b));
      renderSchedule();
    });
    $('#activityFilter').addEventListener('change', (e) => { state.activity = e.target.value; renderSchedule(); });
    $('#statusFilter').addEventListener('change', (e) => { state.status = e.target.value; renderSchedule(); });
    $$('.view-btn').forEach((b) => b.addEventListener('click', () => {
      state.view = b.dataset.view;
      $$('.view-btn').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      renderSchedule();
    }));
    $('#resetFilters').addEventListener('click', () => {
      Object.assign(state, { week: 'all', slot: 'all', activity: 'all', status: 'all' });
      $('#activityFilter').value = 'all'; $('#statusFilter').value = 'all';
      $$('#slotFilter .seg-btn').forEach((x) => x.classList.toggle('is-active', x.dataset.slot === 'all'));
      renderSchedule();
    });
  }

  /* ------------------------------------------------------------------ *
   * Renderers
   * ------------------------------------------------------------------ */
  function cardHTML(s) {
    const cta = `<span class="inline-flex items-center gap-1.5 text-sm font-bold text-gold-300">${esc(ui('viewDetails'))}${icons.arrow}</span>`;
    return `
      <button type="button" class="session-card ${s.past ? 'is-past' : ''} ${state.selected === s.id ? 'is-selected' : ''}" data-session="${s.id}" aria-label="${esc(title(s))}, ${esc(longDate(s))}, ${esc(slotLabel(s))}">
        <div class="session-media">
          ${imgTag(s, '', 640)}
          <div class="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/30"></div>
          <div class="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">${slotChip(s)}${statusChip(s)}</div>
          <div class="date-block"><span class="d">${s.dateObj.getDate()}</span><span class="m">${esc(monthShort(s.dateObj))}</span></div>
          <span class="day-pill">${esc(ui('day'))} ${s.dayNo}</span>
        </div>
        <div class="flex flex-1 flex-col p-5">
          <p class="text-[11px] font-medium uppercase tracking-[.2em] text-gold-400">${esc(dayName(s.dateObj))} · <bdi>${esc(slotTime(s))}</bdi></p>
          <h3 class="mt-1 font-display text-[1.7rem] font-bold uppercase italic leading-tight ${s.activity ? '' : 'text-white/60'}">${esc(title(s))}</h3>
          <div class="mt-3 flex items-center gap-3">
            <span class="avatar ${s.instructor ? '' : 'is-empty'}">${esc(initials(s.instructor))}</span>
            <span class="min-w-0 text-sm leading-tight"><span class="block text-[10px] font-medium uppercase tracking-widest text-white/40">${esc(ui('instructor'))}</span><span class="block truncate font-bold ${s.instructor ? '' : 'text-white/50'}">${esc(s.instructor || ui('tba'))}</span></span>
          </div>
          <div class="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span class="inline-flex items-center gap-1.5 text-xs text-white/50">${icons.pin}RAG Biz HQ</span>
            ${cta}
          </div>
        </div>
      </button>`;
  }

  function renderCards(list) {
    const wrap = $('#view-cards');
    wrap.innerHTML = list.map(cardHTML).join('');
    window.RAG_MOTION && window.RAG_MOTION.reveal($$('.session-card', wrap));
  }

  function renderMonth(list) {
    const ids = new Set(list.map((s) => s.id));
    const gridStart = addDays(start, -((start.getDay() + 6) % 7)); // Monday on/before start
    const gridEnd = addDays(end, (7 - end.getDay()) % 7);           // Sunday on/after end
    const heads = ui('weekHeads').map((d) => `<div class="month-head">${esc(d)}</div>`).join('');
    let cells = '';
    for (let d = new Date(gridStart); d <= gridEnd; d = addDays(d, 1)) {
      const iso = toISO(d);
      const inRange = d >= start && d <= end;
      const daySessions = sessions.filter((s) => s.date === iso && ids.has(s.id));
      const first = sessions.find((s) => s.date === iso);
      const minis = daySessions.map((s) =>
        `<span class="mini-session" data-session="${s.id}" role="button" tabindex="0" title="${esc(slotLabel(s))} · ${esc(title(s))}"><span class="dot ${CFG.statuses[s.status].dot}"></span><span class="label">${s.slot === 'Morning' ? '☀' : '☾'} ${esc(title(s))}</span></span>`
      ).join('');
      cells += `
        <div class="day-cell ${inRange ? '' : 'is-out'} ${iso === toISO(today) ? 'is-today' : ''}" ${first ? `data-day="${iso}"` : ''}>
          <span class="num">${d.getDate()}${d.getDate() === 1 || iso === toISO(gridStart) ? `<span class="mx-1 text-[10px] font-bold tracking-widest text-gold-400">${esc(monthShort(d))}</span>` : ''}</span>
          ${first ? `<span class="chal">${esc(ui('day'))} ${first.dayNo}</span>` : ''}
          <div class="dots flex w-full flex-col gap-1">${minis}</div>
        </div>`;
    }
    $('#view-month').innerHTML = `
      <div class="rounded-3xl border border-white/10 bg-navy-900/60 p-3 sm:p-5">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2 px-1">
          <p class="font-display text-2xl font-bold uppercase italic">${ui('monthTitle')}</p>
          <p class="text-xs text-white/50 md:hidden">${esc(ui('tapDay'))}</p>
        </div>
        <div class="month-grid">${heads}${cells}</div>
      </div>`;
  }

  function renderList(list) {
    const groups = {};
    list.forEach((s) => (groups[s.date] = groups[s.date] || []).push(s));
    $('#view-list').innerHTML = Object.values(groups).map((items) => {
      const d = items[0].dateObj;
      return `
        <div class="grid gap-3 border-b border-white/5 py-5 md:grid-cols-[10rem_1fr] md:gap-6">
          <div class="flex items-baseline gap-3 md:block">
            <p class="font-display text-4xl font-bold italic leading-none">${d.getDate()} <span class="text-lg text-gold-400">${esc(monthShort(d))}</span></p>
            <p class="text-sm text-white/50 md:mt-1">${esc(dayName(d))} · ${esc(ui('day'))} ${items[0].dayNo}</p>
          </div>
          <div class="space-y-3">
            ${items.map((s) => `
              <button type="button" class="list-row ${s.past ? 'opacity-50' : ''}" data-session="${s.id}">
                ${imgTag(s, 'list-thumb', 200)}
                <span class="min-w-0">
                  <span class="flex flex-wrap items-center gap-2">${slotChip(s)}<bdi class="text-xs text-white/50">${esc(slotTime(s))}</bdi></span>
                  <span class="mt-1.5 block truncate font-display text-xl font-bold uppercase italic ${s.activity ? '' : 'text-white/60'}">${esc(title(s))}</span>
                  <span class="block truncate text-sm text-white/60">${esc(s.instructor || ui('instructorTba'))}</span>
                </span>
                <span class="flex flex-col items-end gap-2">${statusChip(s)}</span>
              </button>`).join('')}
          </div>
        </div>`;
    }).join('');
  }

  function renderSpotlight() {
    const s = sessions.find((x) => x.id === state.selected);
    if (!s) return;
    const idx = sessions.indexOf(s);
    $('#spotlight').innerHTML = `
      <div class="grid lg:grid-cols-5">
        <div class="spot-media lg:col-span-3">
          ${imgTag(s, '', 1000)}
          <div class="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent lg:via-navy-950/10 lg:to-navy-900 ltr:lg:bg-gradient-to-r rtl:lg:bg-gradient-to-l"></div>
          <div class="absolute top-5 flex gap-2 ltr:left-5 rtl:right-5"><span class="rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-navy-950">${esc(ui('spotlight'))}</span>${slotChip(s)}</div>
          <div class="absolute bottom-5 flex items-end gap-3 ltr:left-5 rtl:right-5">
            <span class="spot-date text-[5.5rem] sm:text-[7rem]">${s.dateObj.getDate()}</span>
            <span class="pb-3"><span class="block font-display text-3xl font-bold text-gold-300">${esc(monthShort(s.dateObj))}</span><span class="block text-xs font-medium uppercase tracking-[.25em] text-white/70">${esc(ui('dayOf')(s.dayNo))}</span></span>
          </div>
        </div>
        <div class="flex flex-col p-6 sm:p-8 lg:col-span-2">
          <div class="flex items-center justify-between gap-3">
            ${statusChip(s)}
            <div class="flex gap-2">
              <button class="spot-nav" data-spot-step="-1" ${idx === 0 ? 'disabled' : ''} aria-label="Previous session">${icons.chevL}</button>
              <button class="spot-nav" data-spot-step="1" ${idx === sessions.length - 1 ? 'disabled' : ''} aria-label="Next session">${icons.chevR}</button>
            </div>
          </div>
          <p class="mt-5 text-xs font-medium uppercase tracking-[.25em] text-gold-400">${esc(longDate(s))}</p>
          <h3 class="mt-1 font-display text-5xl font-bold uppercase italic leading-[.95] ${s.activity ? '' : 'text-white/70'}">${esc(title(s))}</h3>
          <p class="mt-4 text-sm leading-relaxed text-white/65">${esc(blurb(s))}</p>
          <dl class="mt-6 space-y-3 text-sm">
            <div class="flex items-center gap-3"><span class="avatar ${s.instructor ? '' : 'is-empty'}">${esc(initials(s.instructor))}</span><span><dt class="text-[10px] font-medium uppercase tracking-widest text-white/40">${esc(ui('instructor'))}</dt><dd class="font-bold">${esc(s.instructor || ui('tba'))}</dd></span></div>
            <div class="flex items-center gap-3 text-white/75"><span class="spot-ico">${icons.clock}</span><dd>${esc(slotLabel(s))} · <bdi>${esc(slotTime(s))}</bdi></dd></div>
            <div class="flex items-center gap-3 text-white/75"><span class="spot-ico">${icons.pin}</span><dd>${esc(isAr() ? CFG.venueAr : CFG.venue)}</dd></div>
          </dl>
          <div class="mt-auto pt-7">
            <button class="btn-gold w-full justify-center sm:w-auto" data-details="${s.id}">${esc(ui('viewDetails'))} ${icons.arrow}</button>
          </div>
        </div>
      </div>`;
  }

  function renderSchedule() {
    $$('.week-tab').forEach((b) => b.classList.toggle('is-active', String(state.week) === b.dataset.week));
    $('#weekTabsWrap').classList.toggle('hidden', state.view === 'month');

    const list = filtered({ ignoreWeek: state.view === 'month' });
    ['cards', 'month', 'list'].forEach((v) => $(`#view-${v}`).classList.toggle('hidden', state.view !== v || (v !== 'month' && !list.length)));
    $('#emptyState').classList.toggle('hidden', !!list.length);
    $('#resultCount').innerHTML = ui('showing')(list.length, list.filter((s) => s.status === 'Scheduled').length);

    if (state.view === 'cards') renderCards(list);
    else if (state.view === 'month') renderMonth(list);
    else renderList(list);
    window.RAG_MOTION && window.RAG_MOTION.refresh();
  }

  function selectSession(id, { scroll = true } = {}) {
    state.selected = id;
    renderSpotlight();
    $$('.session-card').forEach((c) => c.classList.toggle('is-selected', c.dataset.session === id));
    if (scroll) scrollToY($('#spotlight').getBoundingClientRect().top + window.scrollY - 100);
  }

  function initSchedule() {
    initFilters();
    const next = sessions.find((s) => !s.past && s.status === 'Scheduled') || sessions.find((s) => !s.past) || sessions[0];
    state.selected = next.id;
    renderSpotlight();
    renderSchedule();

    document.addEventListener('click', (e) => {
      const details = e.target.closest('[data-details]');
      if (details) { openDetails(details.dataset.details); return; }
      const step = e.target.closest('[data-spot-step]');
      if (step) {
        const idx = sessions.findIndex((s) => s.id === state.selected) + Number(step.dataset.spotStep);
        if (sessions[idx]) selectSession(sessions[idx].id, { scroll: false });
        return;
      }
      const card = e.target.closest('[data-session]');
      if (card && $('#schedule').contains(card)) { openDetails(card.dataset.session); return; }
      const day = e.target.closest('[data-day]');
      if (day) {
        const s = filtered({ ignoreWeek: true }).find((x) => x.date === day.dataset.day) || sessions.find((x) => x.date === day.dataset.day);
        if (s) openDetails(s.id);
      }
    });
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.mini-session')) { e.preventDefault(); openDetails(e.target.dataset.session); }
    });
  }

  /* ------------------------------------------------------------------ *
   * Modals (contact, session details)
   * ------------------------------------------------------------------ */
  let lastFocus = null;
  const lockScroll = () => { document.body.classList.add('modal-open'); scroller() && scroller().lock(); };
  const unlockScroll = () => { document.body.classList.remove('modal-open'); scroller() && scroller().unlock(); };

  // Touch devices skip autofocus so the keyboard doesn't jump up over the popup.
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  function openModal(el, { focus = !coarsePointer } = {}) {
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    lockScroll();
    if (focus) setTimeout(() => { const f = $('input, textarea, button:not(.modal-close)', el); f && f.focus({ preventScroll: true }); }, 150);
  }
  function closeModal(el) {
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    if (!$('.modal.is-open') && !$('#lightbox.is-open')) unlockScroll();
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  $$('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target.closest('[data-close-modal]')) closeModal(m); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal.is-open').forEach(closeModal); });

  function validate(form) {
    let ok = true;
    $$('input[required], select[required], textarea[required]', form).forEach((inp) => {
      const valid = inp.type === 'checkbox' ? inp.checked : inp.checkValidity() && inp.value.trim() !== '';
      const wrap = inp.closest('div') || inp.parentElement;
      inp.classList.toggle('has-error', !valid);
      if (inp.type === 'checkbox') wrap.classList.toggle('has-error', !valid);
      if (!valid && ok) { inp.focus(); ok = false; }
    });
    return ok;
  }
  $$('form').forEach((f) => f.addEventListener('input', (e) => {
    if (e.target.classList.contains('has-error') && e.target.checkValidity()) {
      e.target.classList.remove('has-error');
      (e.target.closest('div') || e.target.parentElement).classList.remove('has-error');
    }
  }));

  // Session detail window (opens from "View details", cards, list rows and the calendar)
  function openDetails(id) {
    const s = sessions.find((x) => x.id === id); if (!s) return;
    state.selected = id;
    renderSpotlight();
    $$('.session-card').forEach((c) => c.classList.toggle('is-selected', c.dataset.session === id));
    $('#sessionHeader').innerHTML = `
      <div class="relative h-48 overflow-hidden rounded-t-[1.75rem]">
        ${imgTag(s, 'absolute inset-0 h-full w-full object-cover', 800)}
        <div class="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent"></div>
        <div class="absolute top-4 flex gap-2 ltr:left-6 rtl:right-6">${slotChip(s)}${statusChip(s)}</div>
        <div class="absolute bottom-4 left-6 right-6">
          <p class="text-xs font-medium uppercase tracking-[.2em] text-gold-300">${esc(longDate(s))} · ${esc(ui('dayOf')(s.dayNo))}</p>
          <h2 id="sessionTitle" class="mt-1 font-display text-4xl font-bold uppercase italic leading-none">${esc(title(s))}</h2>
        </div>
      </div>`;
    $('#sessionBody').innerHTML = `
      <p class="text-sm leading-relaxed text-white/70">${esc(blurb(s))}</p>
      <dl class="mt-6 space-y-3 text-sm">
        <div class="flex items-center gap-3"><span class="avatar ${s.instructor ? '' : 'is-empty'}">${esc(initials(s.instructor))}</span><span><dt class="text-[10px] font-medium uppercase tracking-widest text-white/40">${esc(ui('instructor'))}</dt><dd class="font-bold">${esc(s.instructor || ui('tba'))}</dd></span></div>
        <div class="flex items-center gap-3 text-white/75"><span class="spot-ico">${icons.clock}</span><dd>${esc(slotLabel(s))} · <bdi>${esc(slotTime(s))}</bdi></dd></div>
        <div class="flex items-center gap-3 text-white/75"><span class="spot-ico">${icons.pin}</span><dd>${esc(isAr() ? CFG.venueAr : CFG.venue)}</dd></div>
      </dl>`;
    openModal($('#sessionModal'));
  }

  // Contact forms (section + popup) and every "Contact Us" button
  $$('.contact-form').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    // TODO: send the enquiry to your backend / CRM / email service here.
    store.set('rag3030-registered', true);
    store.set('rag3030-profile', { name: $('[name=name]', form).value.trim(), phone: $('[name=phone]', form).value.trim() });
    form.classList.add('hidden');
    form.nextElementSibling.classList.remove('hidden');
    toast(ui('toastSent'));
  }));
  function openContact(opts) {
    const modal = $('#contactModal');
    if (!$('#modalSuccess').classList.contains('hidden')) $('#modalForm').reset(); // fresh form after a sent enquiry
    $('#modalForm').classList.remove('hidden');
    $('#modalSuccess').classList.add('hidden');
    $$('.modal.is-open').forEach(closeModal);
    session.set('rag3030-contact-shown', '1');
    openModal(modal, opts);
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-open-contact]')) return;
    e.preventDefault();
    openContact();
  });

  // The contact popup also opens on its own once per visit: after a short delay,
  // or when a desktop visitor moves to leave — never over another popup.
  function maybeAutoContact() {
    if (session.get('rag3030-contact-shown') || store.get('rag3030-registered', false)) return;
    if ($('.modal.is-open') || $('#lightbox.is-open') || $('#mobileMenu.is-open')) return;
    openContact({ focus: false });
  }
  setTimeout(maybeAutoContact, 10000);
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget && e.clientY < 10) maybeAutoContact(); });

  /* ------------------------------------------------------------------ *
   * Gallery + lightbox
   * ------------------------------------------------------------------ */
  const gallery = window.RAG_GALLERY;
  let galleryCat = 'All';
  const catLabel = (c) => (c === 'All' ? ui('all') : (isAr() && ui('categories')[c]) || c);
  const galTitle = (it) => (isAr() ? it.titleAr || it.title : it.title);

  function renderGallery() {
    const cats = ['All', ...new Set(gallery.map((i) => i.category))];
    $('#galleryFilters').innerHTML = cats.map((c) => `<button class="chip-btn ${c === galleryCat ? 'is-active' : ''}" data-cat="${esc(c)}">${esc(catLabel(c))}</button>`).join('');
    // Bento layout: repeating span pattern, holes filled by grid-auto-flow: dense.
    const spans = ['col-span-2 row-span-2', '', '', 'row-span-2', '', 'col-span-2', '', '', 'col-span-2', ''];
    $('#galleryGrid').innerHTML = gallery.map((it, i) => `
      <button type="button" class="gal-item ${spans[i % spans.length]} ${galleryCat !== 'All' && it.category !== galleryCat ? 'is-hidden' : ''}" data-index="${i}" data-cat="${esc(it.category)}" aria-label="${esc(galTitle(it))}">
        <img src="${esc(it.src)}" alt="${esc(galTitle(it))} — RAG Biz HQ" loading="lazy" width="1024" height="683" />
        <span class="cap"><span class="text-start"><span class="block text-[10px] font-bold uppercase tracking-[.2em] text-gold-300">${esc(catLabel(it.category))}</span><span class="block font-display text-2xl font-bold uppercase italic">${esc(galTitle(it))}</span></span>
        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-950">${icons.expand}</span></span>
      </button>`).join('');
    window.RAG_MOTION && window.RAG_MOTION.reveal($$('.gal-item', $('#galleryGrid')));
  }

  function initGallery() {
    renderGallery();
    $('#galleryFilters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]'); if (!b) return;
      galleryCat = b.dataset.cat;
      $$('#galleryFilters .chip-btn').forEach((x) => x.classList.toggle('is-active', x === b));
      $$('.gal-item').forEach((g) => g.classList.toggle('is-hidden', galleryCat !== 'All' && g.dataset.cat !== galleryCat));
      window.RAG_MOTION && window.RAG_MOTION.refresh();
    });

    const lb = $('#lightbox');
    let cur = 0;
    const visible = () => $$('.gal-item:not(.is-hidden)').map((g) => Number(g.dataset.index));
    const show = (i) => {
      cur = i;
      const it = gallery[i]; const v = visible();
      $('#lbImg').src = it.src; $('#lbImg').alt = galTitle(it);
      $('#lbTitle').textContent = galTitle(it);
      $('#lbCount').textContent = `${v.indexOf(i) + 1} / ${v.length}`;
    };
    const step = (d) => { const v = visible(); show(v[(v.indexOf(cur) + d + v.length) % v.length]); };
    const close = () => { lb.classList.remove('is-open'); if (!$('.modal.is-open')) unlockScroll(); };

    $('#galleryGrid').addEventListener('click', (e) => {
      const g = e.target.closest('.gal-item'); if (!g) return;
      show(Number(g.dataset.index)); lb.classList.add('is-open'); lockScroll();
    });
    lb.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lb]');
      if (b) { b.dataset.lb === 'close' ? close() : step(b.dataset.lb === 'next' ? 1 : -1); }
      else if (e.target === lb) close();
    });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
    let tx = null;
    lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      tx = null;
    });
  }

  /* ------------------------------------------------------------------ *
   * Countdown
   * ------------------------------------------------------------------ */
  let tickCountdown = null;
  function initCountdown() {
    const startAt = new Date(`${CFG.challengeStart}T00:00:00+04:00`).getTime();
    const endAt = new Date(`${CFG.challengeEnd}T23:59:59+04:00`).getTime();
    const label = $('#countdownLabel');
    const set = (k, v) => { $(`[data-cd="${k}"]`).textContent = String(v).padStart(2, '0'); };
    tickCountdown = () => {
      const now = Date.now();
      let target = startAt;
      if (now >= startAt && now <= endAt) {
        label.innerHTML = ui('cdLive')(Math.floor((now - startAt) / 864e5) + 1);
        target = endAt;
      } else if (now > endAt) {
        label.textContent = ui('cdDone');
        ['d', 'h', 'm', 's'].forEach((k) => set(k, 0));
        return;
      } else {
        label.textContent = ui('cdStart');
      }
      const diff = Math.max(0, target - now);
      set('d', Math.floor(diff / 864e5));
      set('h', Math.floor(diff / 36e5) % 24);
      set('m', Math.floor(diff / 6e4) % 60);
      set('s', Math.floor(diff / 1e3) % 60);
    };
    tickCountdown(); setInterval(tickCountdown, 1000);
  }

  /* ------------------------------------------------------------------ *
   * Header, menu, scroll chrome
   * ------------------------------------------------------------------ */
  function initChrome() {
    const header = $('#header');
    const progress = $('#progress');
    const toTop = $('#toTop');
    const mobileCta = $('#mobileCta');
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 20);
      if (Math.abs(y - lastY) > 8) { // ignore sub-pixel jitter from smooth scrolling
        header.classList.toggle('is-hidden', y > 400 && y > lastY && !$('#mobileMenu.is-open'));
        lastY = y;
      }
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
      toTop.classList.toggle('is-show', y > 800);
      const reg = $('#contact').getBoundingClientRect();
      mobileCta.classList.toggle('is-show', y > $('#home').offsetHeight * 0.7 && !(reg.top < innerHeight && reg.bottom > 0));
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    toTop.addEventListener('click', () => scrollToY(0));

    const menu = $('#mobileMenu'); const btn = $('#menuBtn');
    const setMenu = (open) => {
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
      open ? lockScroll() : unlockScroll();
    };
    btn.addEventListener('click', () => setMenu(true));
    menu.addEventListener('click', (e) => { if (e.target.closest('[data-close-menu], .mobile-link')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });

    const links = $$('.nav-link');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => spy.observe(s));
  }

  /* ------------------------------------------------------------------ */
  setLang(lang, { initial: true });
  initHeroSlider();
  initSchedule();
  initGallery();
  $$('.hscroll').forEach(initHScroll);
  initCountdown();
  initChrome();
})();
