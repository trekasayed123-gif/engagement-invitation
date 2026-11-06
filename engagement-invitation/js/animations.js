/* Scroll reveals, gold sparkles, image fallback. All respect prefers-reduced-motion. */
window.Fx = (function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PH = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBEAEF"/><stop offset="1" stop-color="#F0C4D1"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><path d="M200 300C120 240 150 170 200 205C250 170 280 240 200 300Z" fill="none" stroke="#C9708A" stroke-width="3"/></svg>');

  function fallback(img) {                       // never show a broken image
    if (img.dataset.fb) return; img.dataset.fb = '1';
    img.addEventListener('error', () => { if (img.getAttribute('src') !== PH) img.src = PH; });
  }
  function reveal() {
    const els = [...document.querySelectorAll('.reveal:not(.in)')];
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(e => io.observe(e));
  }
  function sparkles() {
    if (reduce) return;
    const cv = document.getElementById('sparkles'), ctx = cv.getContext('2d'); let w, h, ps = [], raf;
    const size = () => { const r = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; cv.width = w * r; cv.height = h * r; ctx.setTransform(r, 0, 0, r, 0, 0); };
    const mk = init => {                              // gold dust rises, rose petals fall
      const petal = Math.random() < .28;
      return { petal, x: Math.random() * w, y: init ? Math.random() * h : (petal ? -20 : h + 10),
        r: petal ? Math.random() * 5 + 4 : Math.random() * 1.7 + .7, vy: petal ? Math.random() * .45 + .3 : -(Math.random() * .25 + .08),
        p: Math.random() * 6.28, s: Math.random() * .02 + .008, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .03 };
    };
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.vy; p.p += p.s; p.x += Math.sin(p.p) * (p.petal ? .6 : .2);
        if (p.petal) {
          p.rot += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillStyle = `rgba(205,130,145,${.35 + .2 * Math.abs(Math.sin(p.p))})`;
          ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.283); ctx.fill(); ctx.restore();
          if (p.y > h + 20) Object.assign(p, mk(false));
        } else {
          ctx.fillStyle = `rgba(214,178,108,${.25 + .5 * Math.abs(Math.sin(p.p * 1.6))})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
          if (p.y < -10) Object.assign(p, mk(false));
        }
      }
      raf = requestAnimationFrame(loop);
    };
    size(); ps = Array.from({ length: innerWidth < 700 ? 22 : 44 }, () => mk(true)); loop();
    addEventListener('resize', size);
    document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden) loop(); });
  }
  return { reveal, sparkles, fallback, PH, reduce };
})();
