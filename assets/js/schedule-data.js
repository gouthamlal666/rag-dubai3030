/* ==========================================================================
   RAG Biz HQ × Dubai 30x30 — Session schedule
   Edit this file to update the calendar. Everything on the page is rendered
   from the data below (cards, month view, list view, filters, popups).
   Fields ending in "Ar" are the Arabic versions shown when the page is in Arabic.
   ========================================================================== */

window.RAG_CONFIG = {
  challengeStart: '2026-10-31',
  challengeEnd: '2026-11-29',
  venue: 'RAG Biz HQ, Addiyar Building, Sheikh Zayed Road, Dubai',
  venueAr: 'RAG Biz HQ، مبنى الديار، شارع الشيخ زايد، دبي',
  whatsapp: '971586046586',
  phone: '+971 58 604 6586',
  email: 'info@ragroup.ae',

  // Slot timings shown on every session — change to your real timings.
  slots: {
    Morning: { label: 'Morning', labelAr: 'صباحاً', time: '7:00 – 7:45 AM', timeAr: '7:00 – 7:45 ص', start: '07:00', end: '07:45', icon: 'sun' },
    Evening: { label: 'Evening', labelAr: 'مساءً', time: '6:30 – 7:15 PM', timeAr: '6:30 – 7:15 م', start: '18:30', end: '19:15', icon: 'moon' },
  },

  // Status values used in the spreadsheet → how they look on the site.
  statuses: {
    Confirmed: { label: 'Confirmed', labelAr: 'مؤكدة', dot: 'bg-emerald-400', chip: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30' },
    Tentative: { label: 'Tentative', labelAr: 'مبدئية', dot: 'bg-amber-400', chip: 'bg-amber-400/15 text-amber-300 ring-amber-400/30' },
    Available: { label: 'Available', labelAr: 'متاحة', dot: 'bg-sky-400', chip: 'bg-sky-400/15 text-sky-300 ring-sky-400/30' },
  },

  // Image + description per activity. Unknown activities fall back to "default".
  activities: {
    Yoga: {
      nameAr: 'يوغا',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=70',
      blurb: 'Flow, breathe and build strength with a guided all-levels yoga practice.',
      blurbAr: 'تنفّس وتحرّك بانسيابية وابنِ قوتك مع جلسة يوغا موجّهة لجميع المستويات.',
    },
    Wellness: {
      nameAr: 'العافية',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=70',
      blurb: 'Mindfulness, breathwork and recovery to reset body and mind after work.',
      blurbAr: 'تأمل وتمارين تنفس واستشفاء لإعادة توازن الجسم والعقل بعد العمل.',
    },
    'Magnetic Healing': {
      nameAr: 'العلاج المغناطيسي',
      image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=70',
      blurb: 'A calming, restorative energy session to release stress and recharge.',
      blurbAr: 'جلسة طاقة مهدّئة ومجدِّدة للتخلص من التوتر واستعادة النشاط.',
    },
    'Mat Pilates': {
      nameAr: 'بيلاتس الحصيرة',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=70',
      blurb: 'Core-focused mat work for posture, stability and long, lean strength.',
      blurbAr: 'تمارين على الحصيرة تركّز على عضلات الجذع لتحسين القوام والثبات والقوة.',
    },
    'Dance Fitness': {
      nameAr: 'رقص اللياقة',
      image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=900&q=70',
      blurb: 'High-energy cardio set to music — no dance experience needed.',
      blurbAr: 'تمارين كارديو مليئة بالطاقة على أنغام الموسيقى — لا تحتاج إلى خبرة في الرقص.',
    },
    default: {
      nameAr: 'قريباً',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=70',
      blurb: 'A new session is being lined up. Register to be the first to know.',
      blurbAr: 'نجهّز جلسة جديدة. سجّل لتكون أول من يعلم.',
    },
  },
};

/* Sessions taken from the instructor planning sheet.
   - activity / instructor left empty → shown as "Coming soon" / "To be announced".
   - Dates with no row are filled in automatically as open "Available" slots. */
window.RAG_SESSIONS = [
  { date: '2026-10-31', slot: 'Morning', activity: 'Yoga',             instructor: 'Jignesh',        status: 'Confirmed' },
  { date: '2026-11-01', slot: 'Morning', activity: 'Yoga',             instructor: 'Savita',         status: 'Confirmed' },
  { date: '2026-11-01', slot: 'Evening', activity: '',                 instructor: '',               status: 'Available' },
  { date: '2026-11-02', slot: 'Morning', activity: 'Yoga',             instructor: 'Azi',            status: 'Available' },
  { date: '2026-11-02', slot: 'Evening', activity: '',                 instructor: '',               status: 'Available' },
  { date: '2026-11-03', slot: 'Morning', activity: '',                 instructor: '',               status: 'Confirmed' },
  { date: '2026-11-03', slot: 'Evening', activity: 'Wellness',         instructor: 'Twinkle',        status: 'Confirmed' },
  { date: '2026-11-04', slot: 'Morning', activity: '',                 instructor: 'Vasanti',        status: 'Tentative' },
  { date: '2026-11-04', slot: 'Evening', activity: '',                 instructor: '',               status: 'Available' },
  { date: '2026-11-05', slot: 'Morning', activity: 'Yoga',             instructor: 'Renee',          status: 'Confirmed' },
  { date: '2026-11-05', slot: 'Evening', activity: 'Magnetic Healing', instructor: 'Ashmi Modi',     status: 'Available' },
  { date: '2026-11-06', slot: 'Morning', activity: '',                 instructor: '',               status: 'Available' },
  { date: '2026-11-06', slot: 'Evening', activity: '',                 instructor: '',               status: 'Confirmed' },
  { date: '2026-11-07', slot: 'Morning', activity: 'Yoga',             instructor: 'Savita',         status: 'Confirmed' },
  { date: '2026-11-07', slot: 'Evening', activity: '',                 instructor: '',               status: 'Tentative' },
  { date: '2026-11-08', slot: 'Morning', activity: '',                 instructor: '',               status: 'Available' },
  { date: '2026-11-08', slot: 'Evening', activity: '',                 instructor: '',               status: 'Confirmed' },
  { date: '2026-11-09', slot: 'Morning', activity: 'Yoga',             instructor: 'Ankit',          status: 'Tentative' },
  { date: '2026-11-09', slot: 'Evening', activity: 'Mat Pilates',      instructor: 'Shiella',        status: 'Available' },
  { date: '2026-11-10', slot: 'Morning', activity: 'Yoga',             instructor: 'Vasanti',        status: 'Available' },
  { date: '2026-11-10', slot: 'Evening', activity: 'Wellness',         instructor: 'Yasmeen Hamdan', status: 'Confirmed' },
  { date: '2026-11-11', slot: 'Morning', activity: 'Yoga',             instructor: 'Renee',          status: 'Available' },
  { date: '2026-11-11', slot: 'Evening', activity: 'Dance Fitness',    instructor: 'Claudia',        status: 'Tentative' },
  { date: '2026-11-12', slot: 'Morning', activity: 'Yoga',             instructor: 'Renee',          status: 'Available' },
  { date: '2026-11-12', slot: 'Evening', activity: 'Wellness',         instructor: 'Twinkle',        status: 'Confirmed' },
  { date: '2026-11-13', slot: 'Morning', activity: 'Yoga',             instructor: 'Tasmin Dry',     status: 'Available' },
];

/* Hero slider — images rotate in the hero card and background */
window.RAG_HERO_SLIDES = [
  { image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Free · All levels', title: 'Morning & evening sessions',
    eyebrowAr: 'مجاني · لجميع المستويات', titleAr: 'جلسات صباحية ومسائية' },
  { image: 'assets/img/gallery/RAG00584.webp',
    eyebrow: 'The venue', title: 'RAG Biz HQ, Sheikh Zayed Road',
    eyebrowAr: 'المكان', titleAr: 'RAG Biz HQ، شارع الشيخ زايد' },
  { image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Yoga', title: 'Flow into your day',
    eyebrowAr: 'يوغا', titleAr: 'ابدأ يومك بانسيابية' },
  { image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Mat Pilates', title: 'Build real core strength',
    eyebrowAr: 'بيلاتس الحصيرة', titleAr: 'قوِّ عضلات الجذع' },
  { image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Dance Fitness', title: 'Cardio set to music',
    eyebrowAr: 'رقص اللياقة', titleAr: 'كارديو على أنغام الموسيقى' },
  { image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Wellness', title: 'Breathe, reset, recharge',
    eyebrowAr: 'العافية', titleAr: 'تنفّس، استرخِ، استعد طاقتك' },
];

/* RAG Biz HQ gallery */
window.RAG_GALLERY = [
  { src: 'assets/img/gallery/RAG00584.webp', title: 'Grand Reception',         titleAr: 'الاستقبال الرئيسي',  category: 'Reception' },
  { src: 'assets/img/gallery/RAG00578.webp', title: 'Community Hub',           titleAr: 'المساحة المجتمعية',  category: 'Community' },
  { src: 'assets/img/gallery/RAG00577.webp', title: 'Executive Lounge',        titleAr: 'صالة كبار التنفيذيين', category: 'Lounges' },
  { src: 'assets/img/gallery/RAG01206.webp', title: 'Recreation Zone',         titleAr: 'منطقة الترفيه',       category: 'Recreation' },
  { src: 'assets/img/gallery/RAG00576.webp', title: 'Welcome Desk',            titleAr: 'مكتب الترحيب',       category: 'Reception' },
  { src: 'assets/img/gallery/RAG00967.webp', title: 'Boardroom',               titleAr: 'قاعة الاجتماعات',     category: 'Meeting Rooms' },
  { src: 'assets/img/gallery/RAG00580.webp', title: 'Tiered Townhall Seating', titleAr: 'مدرج اللقاءات',       category: 'Community' },
  { src: 'assets/img/gallery/RAG00588.webp', title: 'Client Lounge',           titleAr: 'صالة العملاء',        category: 'Lounges' },
  { src: 'assets/img/gallery/RAG00593.webp', title: 'Skyline Work Bar',        titleAr: 'منصة العمل المطلة',   category: 'Workspaces' },
  { src: 'assets/img/gallery/RAG00595.webp', title: 'Focus Pods',              titleAr: 'كبائن التركيز',       category: 'Workspaces' },
];
