/* Auto-discovers the photos you drop into assets/images/ — no config edits needed. */
window.Photos = (function () {
  const CFG = window.INVITE_CONFIG, P = CFG.photos, CAP = CFG.captions || [];
  const probe = src => new Promise(res => {
    const i = new Image();
    i.onload = () => res({ src, w: i.naturalWidth, h: i.naturalHeight });
    i.onerror = () => res(null);
    i.src = src;
  });
  async function find(base) { for (const e of P.exts) { const r = await probe(`${base}.${e}`); if (r) return r; } return null; }
  async function single(key) { return (await find(P[key])) || { src: P.placeholders[key] }; }
  async function gallery() {
    const found = [];
    if (P.files && P.files.length) {                       // explicit list wins: any file names
      for (const f of P.files.slice(0, P.maxGallery)) { const r = await probe(f); if (r) found.push({ src: r.src, ratio: `${r.w}/${r.h}` }); else console.warn('[photos] not found:', f); }
    } else for (let n = 1; n <= P.maxGallery; n++) { const r = await find(`${P.galleryDir}/${n}`); if (!r) break; found.push({ src: r.src, ratio: `${r.w}/${r.h}` }); }
    if (!found.length) console.info('[photos] no real photos found in', P.galleryDir, '- showing placeholders');
    return (found.length ? found : P.placeholders.gallery).map((it, i) => ({ ...it, caption: CAP[i] }));
  }
  return { single, gallery };
})();
