/* VILLA VIEW — Beds24 body-top injection.
 *   propid 322452
 *   Hosted at https://villaokinawa.com/embed/beds24-body-top.js
 *   Register in Beds24 admin (propid 322452 → Settings → Booking page →
 *   "Custom HTML > Body Top"):
 *     <script src="https://villaokinawa.com/embed/beds24-body-top.js" defer></script>
 *
 * Goal: keep Beds24's native middle UI (calendar + price + booking form +
 * payment) and wrap it with VILLA VIEW brand chrome: anti-flash, header,
 * hero carousel, fbar (light search), footer (cancel policy + contact),
 * plus i18n + attribution capture for Google Ads / GA4.
 */
(function () {
  'use strict';

  // --- Top-frame escape guard: only render brand UI inside an iframe -----
  if (window.top === window.self) return;
  document.documentElement.classList.add('vv-embed');

  // --- Anti-flash: hide Beds24's default chrome until our CSS lands ------
  function injectAntiFlash() {
    if (document.getElementById('vv-anti-flash')) return;
    var s = document.createElement('style');
    s.id = 'vv-anti-flash';
    s.textContent = 'html.vv-booting body{visibility:hidden!important}';
    (document.head || document.documentElement).appendChild(s);
    document.documentElement.classList.add('vv-booting');
  }
  function releaseAntiFlash() {
    document.documentElement.classList.remove('vv-booting');
  }
  injectAntiFlash();
  setTimeout(releaseAntiFlash, 3000);

  // --- Asset origin ------------------------------------------------------
  var CDN = 'https://villaokinawa.com';
  var PROP_ID = '322452';
  var TEL_HUMAN = '098-894-2474';
  var TEL_INTL = '+81988942474';
  // Ryokan Business Act (旅館業法) simple-lodging license — Nanjo Health Center, Reiwa 6 №5
  var LICENSE_NO = '南保第R6-5号';

  // Preconnect to our own asset host
  var pc = document.createElement('link');
  pc.rel = 'preconnect'; pc.href = CDN; pc.crossOrigin = 'anonymous';
  document.head.appendChild(pc);

  // Stylesheet
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = CDN + '/embed/beds24-custom.css?v=1';
  document.head.appendChild(css);

  // Preload hero (slide 1) for LCP
  var pl = document.createElement('link');
  pl.rel = 'preload'; pl.as = 'image';
  pl.href = CDN + '/images/hero-scenery.jpg';
  pl.setAttribute('fetchpriority', 'high');
  document.head.appendChild(pl);

  // --- i18n --------------------------------------------------------------
  var SUPPORTED = ['ja','en','zh','zh-Hant','ko','th','fr','de','es','hi'];

  function detectLang() {
    var p = new URLSearchParams(location.search);
    var u = (p.get('lang') || '').trim();
    if (u) {
      for (var i = 0; i < SUPPORTED.length; i++) {
        if (SUPPORTED[i].toLowerCase() === u.toLowerCase()) return SUPPORTED[i];
      }
    }
    var n = (navigator.language || 'en').toLowerCase();
    if (n.indexOf('ja') === 0) return 'ja';
    if (n.indexOf('zh-hant') === 0 || n.indexOf('zh-tw') === 0 || n.indexOf('zh-hk') === 0) return 'zh-Hant';
    if (n.indexOf('zh') === 0) return 'zh';
    if (n.indexOf('ko') === 0) return 'ko';
    if (n.indexOf('th') === 0) return 'th';
    if (n.indexOf('fr') === 0) return 'fr';
    if (n.indexOf('de') === 0) return 'de';
    if (n.indexOf('es') === 0) return 'es';
    if (n.indexOf('hi') === 0) return 'hi';
    return 'en';
  }
  var LANG = detectLang();

  // Compact dictionary — only the few strings we render outside Beds24's UI
  var DICT = {
    ja: { brand:'VILLA VIEW', tag:'沖縄 南城 海を望むプライベートヴィラ',
          slides:['美しい海景','満点の夜景','ヨガもできる広いリビング','徒歩3分・24h ローソン'],
          ci:'チェックイン', co:'チェックアウト', adults:'大人', children:'子供', search:'検索',
          tel:'お電話でのご予約', cancel:'キャンセルポリシー',
          cancelTxt:'宿泊日の7日前まで無料 / 6〜2日前 50% / 前日 80% / 当日 100%',
          addr:'〒901-1407 沖縄県南城市玉城字つきしろ1663-9', lic:'旅館業法簡易宿所営業許可' },
    en: { brand:'VILLA VIEW', tag:'Private ocean-view villa · Nanjo, Okinawa',
          slides:['Ocean view','Night view','Spacious yoga-ready living','Lawson 3 min walk · 24h'],
          ci:'Check-in', co:'Check-out', adults:'Adults', children:'Children', search:'Search',
          tel:'Phone reservations', cancel:'Cancellation policy',
          cancelTxt:'Free up to 7 days / 6–2 days 50% / 1 day 80% / Day-of 100%',
          addr:'1663-9 Tsukishiro, Nanjo, Okinawa 901-1407, Japan', lic:'Inn Business Act – Simple Lodging License' },
    zh: { brand:'VILLA VIEW', tag:'冲绳南城 · 海景私人别墅',
          slides:['绝美海景','璀璨夜景','可练瑜伽的超大客厅','徒步3分钟 · 24小时罗森'],
          ci:'入住', co:'退房', adults:'成人', children:'儿童', search:'搜索',
          tel:'电话预订', cancel:'取消政策',
          cancelTxt:'入住日 7 天前免费 / 6–2 天前 50% / 前一天 80% / 当日 100%',
          addr:'〒901-1407 冲绳县南城市玉城字つきしろ 1663-9', lic:'旅馆业法简易宿所营业许可' },
    'zh-Hant': { brand:'VILLA VIEW', tag:'沖繩南城 · 海景私人別墅',
          slides:['絕美海景','璀璨夜景','可練瑜伽的超大客廳','徒步3分鐘 · 24小時羅森'],
          ci:'入住', co:'退房', adults:'成人', children:'兒童', search:'搜尋',
          tel:'電話預訂', cancel:'取消政策',
          cancelTxt:'入住日 7 天前免費 / 6–2 天前 50% / 前一天 80% / 當日 100%',
          addr:'〒901-1407 沖繩縣南城市玉城字つきしろ 1663-9', lic:'旅館業法簡易宿所營業許可' },
    ko: { brand:'VILLA VIEW', tag:'오키나와 난조 · 오션뷰 프라이빗 빌라',
          slides:['바다 풍경','야경','요가가 가능한 넓은 거실','로손 도보 3분 · 24시간'],
          ci:'체크인', co:'체크아웃', adults:'성인', children:'어린이', search:'검색',
          tel:'전화 예약', cancel:'취소 정책',
          cancelTxt:'체크인 7일 전까지 무료 / 6–2일 전 50% / 전일 80% / 당일 100%',
          addr:'〒901-1407 오키나와현 난조시 타마구스쿠 츠키시로 1663-9', lic:'여관업법 간이숙소 영업 허가' },
    th: { brand:'VILLA VIEW', tag:'วิลล่าวิวทะเลส่วนตัว · นันโจ โอกินาวา',
          slides:['วิวทะเลสุดงาม','วิวกลางคืน','ห้องนั่งเล่นกว้างฝึกโยคะได้','ลอว์สัน 24 ชม. เดิน 3 นาที'],
          ci:'เช็คอิน', co:'เช็คเอาท์', adults:'ผู้ใหญ่', children:'เด็ก', search:'ค้นหา',
          tel:'จองทางโทรศัพท์', cancel:'นโยบายการยกเลิก',
          cancelTxt:'ฟรีถึง 7 วันก่อน / 6–2 วัน 50% / 1 วัน 80% / วันเช็คอิน 100%',
          addr:'1663-9 ทสึกิชิโระ นันโจ โอกินาวา 901-1407 ประเทศญี่ปุ่น', lic:'ใบอนุญาตที่พักเรียบง่ายตาม พ.ร.บ. ที่พักของญี่ปุ่น' },
    fr: { brand:'VILLA VIEW', tag:'Villa privée vue mer · Nanjo, Okinawa',
          slides:['Vue océan','Vue de nuit','Salon spacieux pour le yoga','Lawson 24 h, 3 min à pied'],
          ci:'Arrivée', co:'Départ', adults:'Adultes', children:'Enfants', search:'Rechercher',
          tel:'Réservation par téléphone', cancel:'Politique d\'annulation',
          cancelTxt:'Gratuit jusqu\'à 7 jours / 6–2 jours 50% / 1 jour 80% / Jour J 100%',
          addr:'1663-9 Tsukishiro, Nanjo, Okinawa 901-1407, Japon', lic:'Licence d\'hébergement simple (loi japonaise sur l\'hôtellerie)' },
    de: { brand:'VILLA VIEW', tag:'Private Villa mit Meerblick · Nanjo, Okinawa',
          slides:['Meerblick','Nachtansicht','Großes Wohnzimmer, yogatauglich','Lawson 3 Min., 24 h'],
          ci:'Anreise', co:'Abreise', adults:'Erwachsene', children:'Kinder', search:'Suchen',
          tel:'Telefonische Reservierung', cancel:'Stornierungsbedingungen',
          cancelTxt:'Kostenlos bis 7 Tage / 6–2 Tage 50% / 1 Tag 80% / Anreisetag 100%',
          addr:'1663-9 Tsukishiro, Nanjo, Okinawa 901-1407, Japan', lic:'Gasthausgewerbegesetz – Einfache Beherbergungslizenz' },
    es: { brand:'VILLA VIEW', tag:'Villa privada con vista al mar · Nanjo, Okinawa',
          slides:['Vista al mar','Vista nocturna','Sala amplia ideal para yoga','Lawson 24 h, 3 min a pie'],
          ci:'Entrada', co:'Salida', adults:'Adultos', children:'Niños', search:'Buscar',
          tel:'Reserva por teléfono', cancel:'Política de cancelación',
          cancelTxt:'Gratis hasta 7 días / 6–2 días 50% / 1 día 80% / Día de llegada 100%',
          addr:'1663-9 Tsukishiro, Nanjo, Okinawa 901-1407, Japón', lic:'Licencia de alojamiento simple (Ley japonesa de hostelería)' },
    hi: { brand:'VILLA VIEW', tag:'निजी ओशन-व्यू विला · नांजो, ओकिनावा',
          slides:['ओशन व्यू','रात का दृश्य','योग के लिए विशाल बैठक','लॉसन 3 मिनट, 24 घंटे'],
          ci:'चेक-इन', co:'चेक-आउट', adults:'वयस्क', children:'बच्चे', search:'खोजें',
          tel:'फ़ोन से आरक्षण', cancel:'रद्दीकरण नीति',
          cancelTxt:'7 दिन तक मुफ़्त / 6–2 दिन 50% / 1 दिन 80% / उस दिन 100%',
          addr:'1663-9 त्सुकिशिरो, नांजो, ओकिनावा 901-1407, जापान', lic:'जापान आवास व्यवसाय कानून – सरल आवास लाइसेंस' },
  };
  var L = DICT[LANG] || DICT.en;
  document.documentElement.lang = LANG;

  // --- Carousel slides (override images by replacing files at these paths) -
  var SLIDES = [
    { src: CDN + '/images/hero-scenery.jpg',                  alt: L.slides[0] },
    { src: CDN + '/images/night-view.jpg',                    alt: L.slides[1] },
    { src: CDN + '/images/yogastudio/living-room-oceanview.jpg', alt: L.slides[2] },
    { src: CDN + '/images/lawson.jpg',                        alt: L.slides[3] },
  ];

  // --- Attribution capture (UTM / gclid / fbclid → cookie + localStorage) -
  function captureAttribution() {
    try {
      var qs = new URLSearchParams(location.search);
      var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term',
                  'gclid','dclid','dsclid','gad_source','fbclid','msclkid','WT.mc_id','referer'];
      var rec = {}, has = false;
      for (var i = 0; i < keys.length; i++) {
        var v = qs.get(keys[i]);
        if (v) { rec[keys[i]] = v; has = true; }
      }
      if (!has) return;
      rec._ts = new Date().toISOString();
      rec._referrer = document.referrer || '';
      rec._landing = location.pathname + location.search;
      try {
        if (!localStorage.getItem('vv_attribution')) {
          localStorage.setItem('vv_attribution', JSON.stringify(rec));
        }
      } catch (e) {}
      var maxAge = 60 * 60 * 24 * 90;
      document.cookie = 'vv_attr=' + encodeURIComponent(JSON.stringify(rec)) +
                        '; path=/; max-age=' + maxAge + '; SameSite=Lax';
    } catch (e) {}
  }
  captureAttribution();

  // --- HTML builders -----------------------------------------------------
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
  }); }

  function headerHTML() {
    return '' +
      '<header class="vv-header">' +
        '<a class="vv-brand" href="https://villaokinawa.com" target="_top">' +
          '<span class="vv-logo">VILLA VIEW</span>' +
          '<span class="vv-tag">' + esc(L.tag) + '</span>' +
        '</a>' +
        '<a class="vv-tel" href="tel:' + TEL_INTL + '">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.9.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.4.2 2.7.6 3.9.1.4 0 .8-.2 1.1l-2.3 1.8z"/></svg>' +
          esc(TEL_HUMAN) +
        '</a>' +
      '</header>';
  }

  function carouselHTML() {
    var slides = SLIDES.map(function (s, i) {
      return '<div class="vv-slide' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' +
               '<img src="' + esc(s.src) + '" alt="' + esc(s.alt) + '" ' +
                    (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' />' +
               '<div class="vv-slide-cap"><span>' + esc(s.alt) + '</span></div>' +
             '</div>';
    }).join('');
    var dots = SLIDES.map(function (s, i) {
      return '<button type="button" class="vv-dot' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
    }).join('');
    return '' +
      '<section class="vv-carousel" aria-label="Highlights">' +
        '<div class="vv-slides">' + slides + '</div>' +
        '<button type="button" class="vv-cnav vv-cprev" aria-label="Previous">‹</button>' +
        '<button type="button" class="vv-cnav vv-cnext" aria-label="Next">›</button>' +
        '<div class="vv-dots">' + dots + '</div>' +
      '</section>';
  }

  function fbarHTML() {
    return '' +
      '<form class="vv-fbar" id="vv-fbar" onsubmit="return false">' +
        '<div class="vv-fbar-cell"><label>' + esc(L.ci) + '</label><input type="date" name="checkin" required></div>' +
        '<div class="vv-fbar-cell"><label>' + esc(L.co) + '</label><input type="date" name="checkout" required></div>' +
        '<div class="vv-fbar-cell"><label>' + esc(L.adults) + '</label>' +
          '<select name="numadult"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option></select></div>' +
        '<div class="vv-fbar-cell"><label>' + esc(L.children) + '</label>' +
          '<select name="numchild"><option value="0" selected>0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>' +
        '<button type="submit" class="vv-fbar-go">' + esc(L.search) + ' ▸</button>' +
      '</form>';
  }

  function footerHTML() {
    return '' +
      '<footer class="vv-footer">' +
        '<div class="vv-foot-grid">' +
          '<div class="vv-foot-block">' +
            '<h4>' + esc(L.brand) + '</h4>' +
            '<p>' + esc(L.addr) + '</p>' +
            '<p><a href="tel:' + TEL_INTL + '">' + esc(L.tel) + '：' + esc(TEL_HUMAN) + '</a></p>' +
            '<p class="vv-license">' + esc(L.lic) + '：<strong>' + esc(LICENSE_NO) + '</strong></p>' +
          '</div>' +
          '<div class="vv-foot-block">' +
            '<h4>' + esc(L.cancel) + '</h4>' +
            '<p>' + esc(L.cancelTxt) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="vv-foot-copy">© ' + new Date().getFullYear() + ' VILLA VIEW · All rights reserved.</div>' +
      '</footer>';
  }

  // --- Mount -------------------------------------------------------------
  function mount() {
    if (document.getElementById('vv-shell')) return;
    var shell = document.createElement('div');
    shell.id = 'vv-shell';
    shell.innerHTML = headerHTML() + carouselHTML() + fbarHTML();
    document.body.insertBefore(shell, document.body.firstChild);

    var foot = document.createElement('div');
    foot.id = 'vv-shell-foot';
    foot.innerHTML = footerHTML();
    document.body.appendChild(foot);

    wireCarousel();
    wireFbar();
    releaseAntiFlash();
  }

  // --- Carousel behavior -------------------------------------------------
  function wireCarousel() {
    var root = document.querySelector('.vv-carousel');
    if (!root) return;
    var slides = root.querySelectorAll('.vv-slide');
    var dots = root.querySelectorAll('.vv-dot');
    var idx = 0;
    function show(i) {
      i = (i + slides.length) % slides.length;
      slides[idx].classList.remove('is-active');
      dots[idx].classList.remove('is-active');
      idx = i;
      slides[idx].classList.add('is-active');
      dots[idx].classList.add('is-active');
    }
    root.querySelector('.vv-cprev').addEventListener('click', function () { show(idx - 1); restart(); });
    root.querySelector('.vv-cnext').addEventListener('click', function () { show(idx + 1); restart(); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { show(parseInt(d.getAttribute('data-i'), 10)); restart(); });
    });

    var timer = setInterval(function () { show(idx + 1); }, 5000);
    function restart() { clearInterval(timer); timer = setInterval(function () { show(idx + 1); }, 5000); }

    // Touch swipe
    var x0 = null;
    root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = (e.changedTouches[0].clientX - x0);
      if (Math.abs(dx) > 40) { show(dx < 0 ? idx + 1 : idx - 1); restart(); }
      x0 = null;
    });
  }

  // --- Fbar behavior: pre-fill from URL, post to booking2.php ------------
  function wireFbar() {
    var f = document.getElementById('vv-fbar');
    if (!f) return;
    var qs = new URLSearchParams(location.search);
    var ci = f.querySelector('input[name=checkin]');
    var co = f.querySelector('input[name=checkout]');
    var na = f.querySelector('select[name=numadult]');
    var nc = f.querySelector('select[name=numchild]');

    function todayPlus(n) {
      var d = new Date(); d.setDate(d.getDate() + n);
      return d.getFullYear() + '-' +
             String(d.getMonth() + 1).padStart(2, '0') + '-' +
             String(d.getDate()).padStart(2, '0');
    }
    function normYmd(v) {
      if (!v) return '';
      if (/^\d{8}$/.test(v)) return v.slice(0,4) + '-' + v.slice(4,6) + '-' + v.slice(6,8);
      return v;
    }
    ci.value = normYmd(qs.get('checkin') || qs.get('arrivalDate') || '') || todayPlus(1);
    co.value = normYmd(qs.get('checkout') || qs.get('departureDate') || '') || todayPlus(2);
    var a = qs.get('numadult') || qs.get('room1NumAdults');
    if (a && na.querySelector('option[value="' + a + '"]')) na.value = a;
    var c = qs.get('numchild') || qs.get('room1NumChildren');
    if (c && nc.querySelector('option[value="' + c + '"]')) nc.value = c;

    ci.addEventListener('change', function () {
      if (new Date(co.value) <= new Date(ci.value)) {
        var d = new Date(ci.value); d.setDate(d.getDate() + 1);
        co.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      }
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ciV = ci.value, coV = co.value;
      var nights = 1;
      if (ciV && coV) {
        nights = Math.max(1, Math.round((new Date(coV) - new Date(ciV)) / 86400000));
      }
      var p = new URLSearchParams({
        propid: PROP_ID,
        lang: LANG,
        checkin: ciV.replace(/-/g, ''),
        numnight: String(nights),
        numadult: na.value,
        numroom: '1',
      });
      if (parseInt(nc.value, 10) > 0) p.set('numchild', nc.value);
      // Stay inside the iframe — relative reload
      location.href = 'booking2.php?' + p.toString();
    });
  }

  // --- Boot --------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
