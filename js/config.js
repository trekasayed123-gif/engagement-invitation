/* =====================================================================
   CENTRAL CONFIGURATION — edit this file only; no other code needs changes.
   ===================================================================== */

const INVITE_NUMBERS = {
  me:     '201126400356',
  mayada: '201099541566'
};
const INVITE_TO = new URLSearchParams(location.search).get('to');
const INVITE_CHOSEN_NUMBER = INVITE_NUMBERS[INVITE_TO] || INVITE_NUMBERS.me;

window.INVITE_CONFIG = {
  defaultLang: 'ar',
  arabicNumerals: true,

  groom: { ar: 'إسلام', en: 'Eslam' },
  bride: { ar: 'ميادة', en: 'Mayade' },

  eventDate: '2026-11-23',
  eventTime: '19:00',
  durationHours: 3,
  utcOffset: '+02:00',

  venue: {
    name:    { ar: 'اللوتس',          en: 'Al Lotus' },
    address: { ar: 'دار ضباط النقل', en: "Transport Officers' Club" },
    mapsUrl: 'https://share.google/6RHSWhRJVfOMmdvhE'
  },

  shareUrl: 'https://engagement-invitation-sandy.vercel.app',

  music: { enabled: true, files: ['assets/music/background.mp3', 'assets/music/background.mpeg', 'assets/music/song.mp3', 'assets/music/music.mp3', 'assets/music/background.m4a'], volume: 0.5, loop: true },

  rsvp: {
    formEndpoint: '',
    whatsappNumber: INVITE_CHOSEN_NUMBER,
    maxGuests: 5
  },

  photos: {
    galleryDir: 'assets/images/gallery',
    maxGallery: 6,
    files: [],
    exts: ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'],
    placeholders: {
      gallery: [
        { src: 'assets/images/placeholders/g1.jpg', ratio: '4/3' },  { src: 'assets/images/placeholders/g2.jpg', ratio: '8/11' },
        { src: 'assets/images/placeholders/g3.jpg', ratio: '4/5' },  { src: 'assets/images/placeholders/g4.jpg', ratio: '10/7' },
        { src: 'assets/images/placeholders/g5.jpg', ratio: '1/1' },  { src: 'assets/images/placeholders/g6.jpg', ratio: '3/4' }
      ]
    }
  },

  captions: [
    { ar: 'صغيرين… والحكاية بدأت', en: 'Little us, and the story had begun' },
    { ar: 'ضحكة بريئة',            en: 'An innocent laugh' },
    { ar: 'أيام لا تُنسى',         en: 'Days we never forget' },
    { ar: 'كبرنا… ومازلنا معًا',   en: 'We grew up, still together' },
    { ar: 'ذكرى جميلة',            en: 'A lovely memory' },
    { ar: 'ومن هنا بدأ كل شيء',    en: 'And this is where it all began' }
  ]
};