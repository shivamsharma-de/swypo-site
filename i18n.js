/* swypo.app — DE/EN language switch.
   German is the default and lives in the HTML. English lives here.
   Elements with data-i18n="key" get their content swapped. */
(function () {
  var EN = {
    // shared
    'nav.features': 'Features',
    'nav.themes': 'Themes',
    'foot.by': 'a hobby project by Shivam Sharma',
    'foot.privacy': 'Privacy',
    'foot.contact': 'Contact',
    'foot.home': 'Home',
    'foot.appprivacy': 'App privacy',
    'p.applink': 'App privacy policy: the swypo iOS app',

    // home
    'hero.eyebrow': 'German from A1 to C2',
    'hero.title': 'Learn German,<br><em>word by word.</em>',
    'hero.lede': 'swypo is your vocabulary for the Goethe and telc exams: a dictionary, a scanner for your textbook page and a deck that brings each word back at the right moment.',
    'hero.soon': 'Coming soon to the App Store',
    'hero.contact': 'Contact',
    'features.eyebrow': 'Features',
    'f1.title': 'Dictionary',
    'f1.text': 'Every word with its article, plural, case and an example sentence.',
    'f2.title': 'Page scan',
    'f2.text': 'Take a photo of a textbook page. swypo finds the words and sorts them into nouns, verbs and adjectives.',
    'f3.title': 'Your deck',
    'f3.text': 'Spaced repetition: rate each card Again, Hard, Good or Easy, and swypo schedules the rest.',
    'f4.title': 'Streak and XP',
    'f4.text': 'A 15-minute daily goal, a streak worth keeping and progress for every level.',
    'themes.eyebrow': 'Exam themes',
    'themes.lede': '22 themes from Goethe, telc and the Klett textbook chapters, from family to science.',
    't1': 'Environment and climate<small>Umwelt und Klima</small>',
    't2': 'Health<small>Gesundheit</small>',
    't3': 'Work and careers<small>Arbeit und Beruf</small>',
    't4': 'Travel and transport<small>Reisen und Verkehr</small>',
    'levels.eyebrow': 'Your vocabulary by level',
    'support.eyebrow': 'Support · Help',
    'support.title': 'Questions, bugs, ideas?',
    'support.text': 'Write to us, in English or German.',

    // privacy
    'p.eyebrow': 'Privacy',
    'p.title': 'Privacy policy',
    'p.h.controller': 'Responsible',
    'p.h.site': 'This website',
    'p.site': 'swypo.app is a static information site. We use no cookies and no analytics. Your language choice (DE/EN) is stored only in your own browser. When you visit, our host GitHub Pages processes technically necessary server logs (for example IP address, time and page requested). Fonts are loaded from Google Fonts, which sends your IP address to Google.',
    'p.h.app': 'The app',
    'p.app': 'What data the swypo iOS app processes, such as your account, study progress, scans and analytics, is set out in its own policy:',
    'p.h.rights': 'Your rights',
    'p.rights': 'You have the right to access, correct, delete, restrict and port your data, to object to its processing and to complain to a data protection authority. To do so, write to',
    'p.date': 'Last updated: 30.10.2026'
  };

  var META = {
    home: {
      de: { title: 'swypo. · Deutsch lernen, Wort für Wort' },
      en: { title: 'swypo. · Learn German, word by word' }
    },
    privacy: {
      de: { title: 'Datenschutz · swypo.' },
      en: { title: 'Privacy · swypo.' }
    },
    'app-privacy': {
      de: { title: 'Datenschutzerklärung der App · swypo.' },
      en: { title: 'App privacy policy · swypo.' }
    }
  };

  var TOAST_EN = '<strong>Hey, you’ll get there sooner than you think.</strong> Don’t worry, swypo will help you reach your goal.';

  // Lets CSS show one language at a time; without JS both stay visible.
  document.documentElement.classList.add('i18n');

  var KEY = 'swypo-lang';
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var DE = {};
  nodes.forEach(function (el) { DE[el.getAttribute('data-i18n')] = el.innerHTML; });

  var page = document.body.getAttribute('data-page') || 'home';
  var current = 'de';
  var toastTimer;

  function apply(lang) {
    current = lang;
    var dict = lang === 'en' ? EN : DE;
    nodes.forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] != null) el.innerHTML = dict[k];
    });
    document.documentElement.lang = lang;
    if (META[page]) document.title = META[page][lang].title;
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
  }

  function save(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function showToast(html) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = html;
    t.hidden = false;
    // restart the entrance animation
    t.classList.remove('show');
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4200);
  }

  function hideToast() {
    var t = document.getElementById('toast');
    if (!t || t.hidden) return;
    t.classList.remove('show');
    setTimeout(function () { t.hidden = true; }, 300);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.lang button');
    if (b) {
      var lang = b.getAttribute('data-lang');
      if (lang === current) return;
      apply(lang);
      save(lang);
      if (lang === 'en') showToast(TOAST_EN); else hideToast();
      return;
    }
    if (e.target.closest('#toast')) hideToast();
  });

  // Starting language: ?lang=en in the URL, then the saved choice, else German.
  var start = 'de';
  var q = (location.search.match(/[?&]lang=(de|en)\b/) || [])[1];
  if (q) { start = q; save(q); }
  else {
    try { var s = localStorage.getItem(KEY); if (s === 'en' || s === 'de') start = s; } catch (e) {}
  }
  if (start !== 'de') apply(start);
})();
