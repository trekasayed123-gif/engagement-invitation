/* Date formatting + live countdown (activates only when config.eventTime is set). */
window.Countdown = (function () {
  const C = window.INVITE_CONFIG, T = window.I18N, $ = s => document.querySelector(s);
  const loc = l => l === 'ar' ? (C.arabicNumerals === false ? 'ar-EG-u-nu-latn' : 'ar-EG') : 'en-GB';
  const [y, m, d] = C.eventDate.split('-').map(Number);
  const base = new Date(Date.UTC(y, m - 1, d, 12));
  const format = (l, o) => new Intl.DateTimeFormat(loc(l), { timeZone: 'UTC', ...o }).format(base);
  const num = (n, l, p = 2) => new Intl.NumberFormat(loc(l), { minimumIntegerDigits: p, useGrouping: false }).format(n);
  const timeOk = /^([01]\d|2[0-3]):[0-5]\d$/.test((C.eventTime || '').trim());
  const target = timeOk ? new Date(`${C.eventDate}T${C.eventTime.trim()}:00${C.utcOffset || ''}`) : null;
  const live = target && !isNaN(target);
  let lang = 'ar', prev = {};

  function render(l) {
    if (l) lang = l;
    const box = $('#countdown'), note = $('#countdownNote'), line = $('#timeLine');
    if (!live) {                                   // graceful date-only mode
      box.hidden = true; note.textContent = '';
      line.textContent = T[lang]['date.tbd']; return;
    }
    const [hh, mm] = C.eventTime.trim().split(':').map(Number);
    const tm = new Intl.DateTimeFormat(loc(lang), { timeZone: 'UTC', hour: 'numeric', minute: '2-digit' }).format(Date.UTC(y, m - 1, d, hh, mm));
    line.textContent = `${T[lang]['date.at']} ${tm}`;
    box.hidden = false;
    const diff = Math.max(0, target - Date.now());
    const v = { days: Math.floor(diff / 864e5), hours: Math.floor(diff / 36e5) % 24, minutes: Math.floor(diff / 6e4) % 60, seconds: Math.floor(diff / 1e3) % 60 };
    for (const u in v) {
      const el = box.querySelector(`[data-unit="${u}"] b`), txt = num(v[u], lang);
      if (el.textContent !== txt) {
        el.textContent = txt;
        if (prev[u] !== undefined) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
      }
      prev[u] = txt;
    }
    note.textContent = diff === 0 ? T[lang]['date.today'] : '';
  }
  function init(l) { lang = l; render(); if (live) setInterval(() => render(), 1000); }
  return { init, render, format, num };
})();
