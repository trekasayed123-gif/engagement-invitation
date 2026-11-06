/* Month calendar card (heart on the event day) + "Add to Calendar" link. Driven by config.js. */
window.Calendar = (function () {
  const C = window.INVITE_CONFIG, T = window.I18N, $ = s => document.querySelector(s);
  const loc = l => l === 'ar' ? (C.arabicNumerals === false ? 'ar-EG-u-nu-latn' : 'ar-EG') : 'en-GB';
  const [y, m, d] = C.eventDate.split('-').map(Number);
  const AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];                 // Sun..Sat
  const num = (n, l) => new Intl.NumberFormat(loc(l), { useGrouping: false }).format(n);
  const pad = n => String(n).padStart(2, '0');

  function link(lang) {
    const names = `${C.groom[lang]} ${T[lang].amp} ${C.bride[lang]}`;
    const where = `${C.venue.name[lang]} - ${C.venue.address[lang]}`;
    const t = (C.eventTime || '').trim(); let dates;
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) {
      const st = new Date(`${C.eventDate}T${t}:00${C.utcOffset || ''}`);
      if (isNaN(st)) return '';
      const en = new Date(st.getTime() + (C.durationHours || 3) * 36e5);
      const f = x => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      dates = `${f(st)}/${f(en)}`;
    } else {                                                      // no time yet → all-day event
      const nx = new Date(Date.UTC(y, m - 1, d + 1));
      dates = `${y}${pad(m)}${pad(d)}/${nx.getUTCFullYear()}${pad(nx.getUTCMonth() + 1)}${pad(nx.getUTCDate())}`;
    }
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(`${names} — ${T[lang]['hero.eyebrow']}`) +
      '&dates=' + dates + '&location=' + encodeURIComponent(where) + '&details=' + encodeURIComponent(T[lang]['hero.message']);
  }

  function render(lang) {
    const grid = $('#calGrid'); if (!grid) return;
    const first = new Date(Date.UTC(y, m - 1, 1)), days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const ws = lang === 'ar' ? 6 : 1, off = (first.getUTCDay() - ws + 7) % 7;   // week starts Saturday (ar) / Monday (en)
    $('#calMonth').textContent = new Intl.DateTimeFormat(loc(lang), { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(first);
    const fr = document.createDocumentFragment();
    for (let k = 0; k < 7; k++) {
      const i = (ws + k) % 7, c = document.createElement('span'); c.className = 'wd';
      c.textContent = lang === 'ar' ? AR[i] : new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short' }).format(new Date(Date.UTC(2023, 0, 1 + i))).slice(0, 2);
      fr.append(c);
    }
    for (let k = 0; k < off; k++) fr.append(document.createElement('span'));
    for (let n = 1; n <= days; n++) {
      const c = document.createElement('span'); c.className = 'd' + (n === d ? ' ev' : '');
      c.style.setProperty('--i', n + off); c.textContent = num(n, lang); fr.append(c);
    }
    grid.textContent = ''; grid.append(fr);
    const a = $('#addCal'), u = link(lang); a.hidden = !u; a.href = u || '#';
  }
  return { render };
})();
