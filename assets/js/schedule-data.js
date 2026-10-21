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

  // Public session status. A session with an activity is "Scheduled";
  // a slot without one shows "Details soon".
  statuses: {
    Scheduled: { label: 'Scheduled', labelAr: 'مجدولة', dot: 'bg-emerald-400', chip: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30' },
    Pending: { label: 'Details soon', labelAr: 'التفاصيل قريباً', dot: 'bg-sky-400', chip: 'bg-sky-400/15 text-sky-300 ring-sky-400/30' },
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
      blurb: 'A calm, guided session built around relaxation.',
      blurbAr: 'جلسة هادئة وموجّهة تتمحور حول الاسترخاء.',
    },
    'Mat Pilates': {
      nameAr: 'بيلاتس الحصيرة',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=70',
      blurb: 'Mat work focused on core strength, posture and stability.',
      blurbAr: 'تمارين على الحصيرة تركّز على قوة الجذع والقوام والثبات.',
    },
    'Dance Fitness': {
      nameAr: 'رقص اللياقة',
      image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=900&q=70',
      blurb: 'High-energy cardio set to music. No dance experience needed.',
      blurbAr: 'تمارين كارديو مليئة بالطاقة على أنغام الموسيقى. لا تحتاج إلى خبرة في الرقص.',
    },
    default: {
      nameAr: 'قريباً',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=70',
      blurb: 'Session details will be announced soon.',
      blurbAr: 'سيتم الإعلان عن تفاصيل الجلسة قريباً.',
    },
  },
};

/* Sessions taken from the instructor planning sheet.
   - The sheet's "status" column is kept for reference; the page shows "Scheduled"
     for any slot with an activity and "Details soon" otherwise.
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

/* Hero slider — each slide changes the card image, the background,
   and the hero headline + intro text. heading/headingAr may contain HTML. */
window.RAG_HERO_SLIDES = [
  { image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Daily sessions', title: 'Morning and evening sessions',
    eyebrowAr: 'جلسات يومية', titleAr: 'جلسات صباحية ومسائية',
    heading: '<span class="text-gold-gradient">Dubai 30x30</span><br />Hosted at<br /><span class="text-gold-gradient">RAG Biz HQ</span>',
    lead: '30 minutes of activity a day, for 30 days. Sessions run from 31 October to 29 November in the RAG Biz HQ Community Arena on Sheikh Zayed Road.',
    headingAr: '<span class="text-gold-gradient">دبي 30×30</span><br />تستضيفه<br /><span class="text-gold-gradient" dir="ltr">RAG Biz HQ</span>',
    leadAr: '30 دقيقة من النشاط يومياً لمدة 30 يوماً. تُقام الجلسات من 31 أكتوبر إلى 29 نوفمبر في الساحة المجتمعية لـ RAG Biz HQ في شارع الشيخ زايد.' },
  { image: 'assets/img/gallery/RAG00584.webp',
    eyebrow: 'The venue', title: 'RAG Biz HQ, Sheikh Zayed Road',
    eyebrowAr: 'المكان', titleAr: 'RAG Biz HQ، شارع الشيخ زايد',
    heading: 'The RAG Biz HQ<br /><span class="text-gold-gradient">Community Arena</span>',
    lead: 'RAG Biz HQ, our business centre on Sheikh Zayed Road, hosts fitness and wellness sessions for 30 days.',
    headingAr: '<span class="text-gold-gradient" dir="ltr">RAG Biz HQ</span><br /><span class="text-gold-gradient">الساحة المجتمعية</span>',
    leadAr: 'يستضيف RAG Biz HQ، مركز أعمالنا في شارع الشيخ زايد، جلسات لياقة وعافية لمدة 30 يوماً.' },
  { image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Yoga', title: 'Flow into your day',
    eyebrowAr: 'يوغا', titleAr: 'ابدأ يومك بانسيابية',
    heading: 'Morning yoga<br /><span class="text-gold-gradient">at RAG Biz HQ</span>',
    lead: 'Guided yoga sessions are on the morning calendar. Each one is led by an independent instructor.',
    headingAr: 'يوغا الصباح<br /><span class="text-gold-gradient">في <span dir="ltr">RAG Biz HQ</span></span>',
    leadAr: 'جلسات يوغا موجّهة ضمن جدول الصباح، يقود كل جلسة منها مدرّب مستقل.' },
  { image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Mat Pilates', title: 'Core strength on the mat',
    eyebrowAr: 'بيلاتس الحصيرة', titleAr: 'قوة الجذع على الحصيرة',
    heading: 'Mat Pilates<br /><span class="text-gold-gradient">in the Arena</span>',
    lead: 'Mat Pilates sessions focus on core strength, posture and stability. An independent instructor leads each one.',
    headingAr: 'بيلاتس الحصيرة<br /><span class="text-gold-gradient">في الساحة</span>',
    leadAr: 'تركّز جلسات بيلاتس الحصيرة على قوة الجذع والقوام والثبات، ويقود كل جلسة مدرّب مستقل.' },
  { image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Dance Fitness', title: 'Cardio set to music',
    eyebrowAr: 'رقص اللياقة', titleAr: 'كارديو على أنغام الموسيقى',
    heading: 'Dance fitness<br /><span class="text-gold-gradient">in the evening</span>',
    lead: 'High-energy dance fitness sessions are on the evening calendar. No dance experience is needed.',
    headingAr: 'رقص اللياقة<br /><span class="text-gold-gradient">في المساء</span>',
    leadAr: 'جلسات رقص لياقة مليئة بالطاقة ضمن جدول المساء. لا تحتاج إلى أي خبرة في الرقص.' },
  { image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=75',
    eyebrow: 'Wellness', title: 'Breathe and reset after work',
    eyebrowAr: 'العافية', titleAr: 'تنفّس واسترخِ بعد العمل',
    heading: 'Wellness<br /><span class="text-gold-gradient">after work</span>',
    lead: 'Wellness sessions cover mindfulness, breathwork and recovery. They run in the evening slot.',
    headingAr: 'العافية<br /><span class="text-gold-gradient">بعد العمل</span>',
    leadAr: 'تشمل جلسات العافية التأمل وتمارين التنفس والاستشفاء، وتُقام في الفترة المسائية.' },
];

/* RAG Biz HQ gallery */
window.RAG_GALLERY = [
  // RAG Community Arena — events hosted at RAG Biz HQ
  { src: 'assets/img/gallery/arena-rcb-entrance.webp',    title: 'RCB Fan Army UAE at RAG Biz HQ',        titleAr: 'RCB Fan Army UAE في RAG Biz HQ',            category: 'RAG Community Arena' },
  { src: 'assets/img/gallery/arena-nikon-workshop.webp',  title: 'RAG Club × Nikon School workshop',      titleAr: 'ورشة RAG Club × Nikon School',              category: 'RAG Community Arena' },
  { src: 'assets/img/gallery/arena-rcb-anniversary.webp', title: 'RCB Fan Army UAE 1st anniversary',      titleAr: 'الذكرى الأولى لـ RCB Fan Army UAE',          category: 'RAG Community Arena' },
  { src: 'assets/img/gallery/arena-nikon-photowalk.webp', title: 'Nikon School photographers at RAG',     titleAr: 'مصورو Nikon School في RAG',                 category: 'RAG Community Arena' },
  { src: 'assets/img/gallery/arena-rcb-guests.webp',      title: 'Guests of honour',                      titleAr: 'ضيوف الشرف',                                category: 'RAG Community Arena' },
  { src: 'assets/img/gallery/arena-rcb-audience.webp',    title: 'Community meet in the Arena',           titleAr: 'لقاء مجتمعي في الساحة',                      category: 'RAG Community Arena' },

  // RAG Biz HQ spaces
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
