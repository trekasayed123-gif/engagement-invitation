/* =====================================================================
   CENTRAL CONFIGURATION — edit this file only; no other code needs changes.
   ===================================================================== */
window.INVITE_CONFIG = {
  defaultLang: 'ar',                       // 'ar' or 'en' (a visitor's saved choice overrides this)
  arabicNumerals: true,                    // true = ٢٣ ، false = 23 inside the Arabic version

  groom: { ar: 'إسلام', en: 'Eslam' },
  bride: { ar: 'ميادة', en: 'Mayade' },

  eventDate: '2026-11-23',                 // YYYY-MM-DD
  eventTime: '19:00',                           // 24h "HH:MM" e.g. "19:30". EMPTY = date-only view, no countdown.
  durationHours: 3,                        // only for "Add to Calendar": end time = start + this many hours (assumption, change it)
  utcOffset: '+02:00',                     // timezone the event time is in (Cairo winter time). Used only when eventTime is set.

  venue: {
    name:    { ar: 'اللوتس',          en: 'Al Lotus' },
    address: { ar: 'دار ضباط النقل', en: "Transport Officers' Club" },
    mapsUrl: 'https://share.google/6RHSWhRJVfOMmdvhE'                            // paste your Google Maps link. EMPTY = opens a Google Maps SEARCH (not a verified pin).
  },

  shareUrl: '',                            // public invitation URL for WhatsApp sharing. EMPTY = current page URL.

  /* MUSIC: drop your song into assets/music/ with ONE of these names (first one found is used). */
  music: { enabled: true, files: ['assets/music/background.mp3', 'assets/music/background.mpeg', 'assets/music/song.mp3', 'assets/music/music.mp3', 'assets/music/background.m4a'], volume: 0.5, loop: true },

  rsvp: {
    formEndpoint: '',                      // e.g. Formspree URL — responses are POSTed as JSON
    whatsappNumber: '201126400356',                    // e.g. "201234567890" (country code, no +)
    maxGuests: 5                           // if BOTH are empty, the form says RSVP is not connected and saves nothing
  },

  /* PHOTOS — NO EDITING NEEDED. Your 6 childhood photos (the two of you together):
       drop them as assets/images/gallery/1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg, 6.jpg  (jpg / jpeg / png / webp)
       Only 6 photos are shown (maxGallery). Numbers must be consecutive. Until you add yours, pink placeholders show. */
  photos: {
    galleryDir: 'assets/images/gallery',
    maxGallery: 6,
    files: [],                             // OPTIONAL: list exact file names if yours are not 1.jpg…6.jpg, e.g. ['assets/images/gallery/a.jpg', 'assets/images/gallery/b.png']
    exts: ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'],
    placeholders: {                        // shown only until you add your own photos
      gallery: [
        { src: 'assets/images/placeholders/g1.jpg', ratio: '4/3' },  { src: 'assets/images/placeholders/g2.jpg', ratio: '8/11' },
        { src: 'assets/images/placeholders/g3.jpg', ratio: '4/5' },  { src: 'assets/images/placeholders/g4.jpg', ratio: '10/7' },
        { src: 'assets/images/placeholders/g5.jpg', ratio: '1/1' },  { src: 'assets/images/placeholders/g6.jpg', ratio: '3/4' }
      ]
    }
  },

  /* OPTIONAL captions, by photo number (1st entry = gallery/1.jpg). Delete the list for no captions. */
  captions: [
    { ar: 'صغيرين… والحكاية بدأت', en: 'Little us, and the story had begun' },
    { ar: 'ضحكة بريئة',            en: 'An innocent laugh' },
    { ar: 'أيام لا تُنسى',         en: 'Days we never forget' },
    { ar: 'كبرنا… ومازلنا معًا',   en: 'We grew up, still together' },
    { ar: 'ذكرى جميلة',            en: 'A lovely memory' },
    { ar: 'ومن هنا بدأ كل شيء',    en: 'And this is where it all began' }
  ]
};
