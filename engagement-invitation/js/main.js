/* App controller: language, intro sequence, nav, RSVP, share. Wires the other modules together. */
(function () {
  'use strict';
  const C = window.INVITE_CONFIG, T = window.I18N, Fx = window.Fx;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LKEY = 'inv-lang';
  let lang = 'ar', opened = false;

  const dyn = k => ({
    groom: () => C.groom[lang], bride: () => C.bride[lang],
    names: () => `${C.groom[lang]} ${T[lang].amp} ${C.bride[lang]}`,
    'venue.name': () => C.venue.name[lang], 'venue.address': () => C.venue.address[lang]
  }[k]);
  const t = k => { const f = dyn(k); return f ? f() : (T[lang][k] ?? k); };
  const fmtLong = () => Countdown.format(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtShort = () => Countdown.format(lang, { day: 'numeric', month: 'long', year: 'numeric' });

  function split() {                              // wrap words so they can rise in one by one
    $$('[data-split]').forEach(el => {
      const words = el.textContent.trim().split(/\s+/); el.textContent = '';
      words.forEach((w, i) => { const sp = document.createElement('span'); sp.textContent = w; sp.style.setProperty('--i', i); el.append(sp, ' '); });
      el.classList.add('split');
    });
  }
  function burst() {                               // gold sparks from the wax seal
    const b = document.createElement('div'); b.className = 'burst';
    for (let i = 0; i < 18; i++) { const s = document.createElement('i'); s.style.setProperty('--a', i * 20 + 'deg'); s.style.setProperty('--r', 70 + Math.random() * 70 + 'px'); b.append(s); }
    $('#envelope').append(b); setTimeout(() => b.remove(), 1400);
  }
  const shareUrl = () => C.shareUrl || location.href.split('#')[0];
  function applyLang(l, save) {
    lang = T[l] ? l : 'ar';
    if (save) { try { localStorage.setItem(LKEY, lang); } catch (e) {} }
    const h = document.documentElement; h.lang = lang; h.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.title = t('meta.title');
    $$('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
    $$('[data-i18n-alt]').forEach(e => { e.alt = t(e.dataset.i18nAlt); });
    $$('[data-i18n-aria]').forEach(e => e.setAttribute('aria-label', t(e.dataset.i18nAria)));
    $$('[data-i18n-ph]').forEach(e => { e.placeholder = t(e.dataset.i18nPh); });
    $$('[data-date]').forEach(e => { e.textContent = e.dataset.date === 'short' ? fmtShort() : fmtLong(); });
    $$('[data-dp]').forEach(e => {
      const k = e.dataset.dp; e.textContent = Countdown.format(lang, { [k]: k === 'day' || k === 'year' ? 'numeric' : 'long' });
    });
    $$('#rsvpGuests option').forEach(o => { o.textContent = Countdown.num(o.value, lang, 1); });
    const msg = t('share.msg').replace('{names}', t('names')).replace('{date}', fmtLong()) + '\n' + shareUrl();
    $('#shareBtn').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
    split(); Calendar.render(lang);
    Gallery.setLang(lang); Countdown.render(lang); Music.setLang(lang);
  }

  /* ---------- Envelope sequence ---------- */
  function openInvitation() {
    if (opened) return; opened = true;
    const intro = $('#intro'); Music.start();                       // inside the click → allowed by browsers
    const go = (fn, ms) => setTimeout(fn, Fx.reduce ? 0 : ms);
    intro.classList.add('is-opening'); burst();                              // wax seal cracks
    go(() => intro.classList.add('is-open'), 650);                  // flap rotates in 3D
    go(() => intro.classList.add('is-out'), 1650);                  // card slides out
    go(() => {                                                      // cinematic cross-dissolve into the site
      intro.classList.add('leaving'); document.body.classList.remove('locked'); window.scrollTo(0, 0);
      setTimeout(() => Fx.reveal(), Fx.reduce ? 0 : 350);
    }, 2900);
    go(() => { intro.hidden = true; }, 4100);
  }

  /* ---------- RSVP ---------- */
  function rsvpInit() {
    const sel = $('#rsvpGuests'), form = $('#rsvpForm'), st = $('#rsvpStatus');
    for (let i = 1; i <= (C.rsvp.maxGuests || 5); i++) sel.add(new Option(String(i), i));
    $$('input[name=attending]', form).forEach(r => r.addEventListener('change', () => { $('#guestsField').hidden = form.attending.value !== 'yes'; }));
    const say = (k, cls) => { st.className = 'status ' + cls; st.textContent = t(k); };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const d = { name: form.name.value.trim(), attending: form.attending.value, guests: form.attending.value === 'yes' ? form.guests.value : '0', note: form.note.value.trim() };
      if (!d.name) { say('rsvp.needName', 'err'); form.name.focus(); return; }
      const r = C.rsvp;
      if (r.formEndpoint) {
        try {
          const res = await fetch(r.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d) });
          if (!res.ok) throw new Error(res.status); say('rsvp.sent', 'ok'); form.reset(); $('#guestsField').hidden = false;
        } catch (err) { say('rsvp.error', 'err'); }
      } else if (r.whatsappNumber) {
        const text = `${t('names')} — ${d.attending === 'yes' ? t('rsvp.yes') + ' (' + d.guests + ')' : t('rsvp.no')}\n${d.name}${d.note ? '\n' + d.note : ''}`;
        window.open(`https://wa.me/${r.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank', 'noopener'); say('rsvp.wa', 'ok');
      } else say('rsvp.none', 'warn');                               // honest: nothing is stored
    });
  }

  /* ---------- Init ---------- */
  function init() {
    let saved = null; try { saved = localStorage.getItem(LKEY); } catch (e) {}
    lang = T[saved] ? saved : (C.defaultLang || 'ar');

    $$('img[data-img]').forEach(im => { Fx.fallback(im); Photos.single(im.dataset.img).then(r => { im.src = r.src; }); });
    const v = C.venue, q = encodeURIComponent(`${v.name.ar} ${v.address.ar}`);
    $('#dirBtn').href = v.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${q}`;

    Fx.sparkles(); Gallery.init([], lang);
    Photos.gallery().then(list => { Gallery.build(list); if (!document.body.classList.contains('locked')) Fx.reveal(); }); Countdown.init(lang); Music.init(lang); rsvpInit(); applyLang(lang, false);

    $$('[data-lang-toggle]').forEach(b => b.addEventListener('click', () => applyLang(lang === 'ar' ? 'en' : 'ar', true)));
    $('#seal').addEventListener('click', openInvitation); $('#openBtn').addEventListener('click', openInvitation);

    const nav = $('#nav'), top = $('#topBtn'), burger = $('#burger'), menu = $('#navMenu');
    burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
    $$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: Fx.reduce ? 'auto' : 'smooth' }));
    let tick = false;
    addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { nav.classList.toggle('scrolled', scrollY > 40); const mx = document.documentElement.scrollHeight - innerHeight; $('#progress').style.transform = 'scaleX(' + (mx > 0 ? scrollY / mx : 0) + ')'; top.hidden = scrollY < 700; tick = false; }); }, { passive: true });
  }
  document.addEventListener('DOMContentLoaded', init);
})();
