/* Asymmetric gallery + accessible lightbox (keyboard, buttons, swipe). */
window.Gallery = (function () {
  const $ = s => document.querySelector(s);
  let items = [], idx = 0, lang = 'ar', lb, img, cap, cnt, opener, tx = 0;

  function build(list) {
    items = list; const grid = $('#galleryGrid'); grid.textContent = '';
    list.forEach((it, i) => {
      const f = document.createElement('figure'); f.className = 'g-item reveal';
      f.style.setProperty('--r', it.ratio); f.style.setProperty('--d', (i % 3) * .12 + 's');
      const b = document.createElement('button'); b.type = 'button'; b.className = 'g-btn';
      const im = new Image(); im.loading = 'lazy'; im.decoding = 'async'; im.alt = ''; window.Fx.fallback(im); im.src = it.src;
      const c = document.createElement('span'); c.className = 'g-cap';
      b.append(im, c); f.append(b); grid.append(f);
      b.addEventListener('click', () => open(i, b));
    });
    setLang(lang);
  }
  function show() {
    const it = items[idx], text = (it.caption && it.caption[lang]) || '';
    img.classList.remove('in'); img.alt = text; img.src = it.src;
    const done = () => img.classList.add('in'); img.onload = done; img.onerror = done; if (img.complete) done();
    cap.textContent = text; cnt.textContent = `${idx + 1} / ${items.length}`;
    [idx - 1, idx + 1].forEach(n => { new Image().src = items[(n + items.length) % items.length].src; });
  }
  function open(i, from) { idx = i; opener = from; lb.hidden = false; document.documentElement.classList.add('noscroll'); show(); $('#lbClose').focus(); }
  function close() { lb.hidden = true; document.documentElement.classList.remove('noscroll'); if (opener) opener.focus(); }
  const step = d => { idx = (idx + d + items.length) % items.length; show(); };
  function setLang(l) {
    lang = l;
    document.querySelectorAll('.g-btn').forEach((b, i) => { const t = (items[i].caption && items[i].caption[l]) || ''; b.querySelector('.g-cap').textContent = t; b.querySelector('img').alt = t; b.setAttribute('aria-label', t); });
    if (lb && !lb.hidden) show();
  }
  function init(list, l) {
    lang = l; lb = $('#lightbox'); img = $('#lbImg'); cap = $('#lbCap'); cnt = $('#lbCount'); window.Fx.fallback(img);
    $('#lbClose').addEventListener('click', close); $('#lbPrev').addEventListener('click', () => step(-1)); $('#lbNext').addEventListener('click', () => step(1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') { const f = [...lb.querySelectorAll('button')], a = document.activeElement; if (e.shiftKey && a === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
    });
    lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }, { passive: true });
    build(list);
  }
  return { init, build, setLang };
})();
