/* Optional background music. Starts only after a user click; silently hides if the file is missing. */
window.Music = (function () {
  const C = window.INVITE_CONFIG.music, T = window.I18N, KEY = 'inv-music';
  let audio, btn, ok = true, lang = 'ar', resume = false, files = [], fi = 0, want = false;
  const store = { get: () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } }, set: v => { try { localStorage.setItem(KEY, v); } catch (e) {} } };

  function paint() {
    const playing = audio && !audio.paused;
    btn.classList.toggle('playing', !!playing);
    btn.setAttribute('aria-pressed', String(!!playing));
    btn.setAttribute('aria-label', T[lang][playing ? 'music.pause' : 'music.play']);
  }
  function init(l) {
    lang = l; btn = document.getElementById('musicBtn');
    files = C && (C.files || (C.src ? [C.src] : [])) || []; if (!C || !C.enabled || !files.length) return;
    audio = new Audio(); audio.loop = C.loop !== false; audio.volume = C.volume ?? 0.5; audio.preload = 'none';
    audio.addEventListener('error', () => {
      fi++;
      if (fi < files.length) { audio.src = files[fi]; if (want) audio.play().catch(() => {}); } else { ok = false; btn.hidden = true; }
    });
    audio.addEventListener('play', paint); audio.addEventListener('pause', paint);
    btn.addEventListener('click', () => {
      if (audio.paused) { want = true; store.set('on'); audio.play().catch(() => {}); } else { want = false; store.set('off'); audio.pause(); }
    });
    document.addEventListener('visibilitychange', () => {   // be polite on mobile when the tab is hidden
      if (!ok) return;
      if (document.hidden) { resume = !audio.paused; audio.pause(); } else if (resume) audio.play().catch(() => {});
    });
    paint();
  }
  function start() {                                          // call ONLY from a click handler
    if (!audio || !ok) return;
    if (!audio.src) audio.src = files[0];
    btn.hidden = false;
    if (store.get() === 'off') { paint(); return; }
    want = true;           // visitor muted it last time
    audio.play().then(() => store.set('on')).catch(() => { if (ok) paint(); });
  }
  function setLang(l) { lang = l; if (btn && audio) paint(); }
  return { init, start, setLang };
})();
