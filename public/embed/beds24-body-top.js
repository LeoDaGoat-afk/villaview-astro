/* VILLA VIEW — Beds24 body-top injection.
   Hosted at https://villaokinawa.com/embed/beds24-body-top.js
   Loaded by Beds24 admin → Booking Engine → Property Booking Page → Developer → Body Top.
   Renders branded landing UI (hero, search, price+availability calendar, features, gallery,
   footer) above Beds24 native flow. Direct rate = master × 0.95 (Beds24 officialsite channel).

   2026-08-04: removed the "best rate / 20% OFF" banner. The claim was factually wrong
   (the official site measured 7,089 JPY HIGHER than Booking.com on 2026-08-16, 1 night / 4 guests)
   and an unsubstantiated cheapest-price claim breaches the Japanese Act against Unjustifiable
   Premiums and Misleading Representations. Do not reinstate without evidence on file.
*/
(function () {
  if (window.top !== window.self) document.documentElement.classList.add('embed');

  var qs = location.search || '';
  var isConfirm = /[?&]bookid=\d+/i.test(qs);
  var isCheckout = !isConfirm && /[?&]br\d+-\d+=Book/i.test(qs);
  if (isConfirm || isCheckout) document.documentElement.classList.add('vv-no-search');

  var SITE = 'https://villaokinawa.com';
  var PROXY = 'https://smartinn-api-proxy.leoroy225.workers.dev';
  var PROPID = 322452;
  var ROOMID = 674526;
  var OFFICIAL_MULTIPLIER = 0.95;       // master → officialsite calendar price
  // Saving vs Booking = 1 - (M*0.95)/(M*1.20) = 20.83%

  // Inject brand CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = SITE + '/embed/beds24-custom.css';
  document.head.appendChild(link);

  // Override Beds24 default page title ("Secure Online Booking" → branded)
  try {
    document.title = 'VILLA VIEW Okinawa — ' + (
      location.search.match(/[?&]bookid=/i) ? 'Booking Confirmation' :
      location.search.match(/[?&]br\d+-\d+=Book/i) ? 'Guest Information' :
      'Reservation'
    );
  } catch (e) {}

  ['https://villaokinawa.com', PROXY, 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(function (h) {
    var pre = document.createElement('link'); pre.rel = 'preconnect'; pre.href = h; pre.crossOrigin = 'anonymous'; document.head.appendChild(pre);
  });

  // ===== i18n =====
  function detectLang() {
    var p = new URLSearchParams(location.search);
    var raw = (p.get('lang') || '').toLowerCase();
    if (raw === 'zh-hant' || raw === 'zh-tw') return 'zh-Hant';
    if (raw.indexOf('zh') === 0 || raw.indexOf('cn') === 0) return 'zh';
    if (raw.indexOf('en') === 0) return 'en';
    if (raw.indexOf('ko') === 0) return 'ko';
    if (raw.indexOf('th') === 0) return 'th';
    if (raw.indexOf('hi') === 0) return 'hi';
    if (raw.indexOf('fr') === 0) return 'fr';
    if (raw.indexOf('de') === 0) return 'de';
    if (raw.indexOf('es') === 0) return 'es';
    try {
      var topLang = (window.top.document.documentElement.lang || '').toLowerCase();
      if (topLang.indexOf('en') === 0) return 'en';
      if (topLang.indexOf('zh') === 0) return 'zh';
    } catch (e) {}
    return 'ja';
  }
  var LANG = detectLang();
  document.documentElement.setAttribute('data-vv-lang', LANG);

  var I18N = {
    ja: {
      navHome: 'トップ', navFacilities: '施設', navAttractions: '周辺', navCheckin: 'チェックイン', navAccess: 'アクセス', navBooking: 'ご予約', navFaq: 'よくあるご質問', navContact: 'お問い合わせ',
      heroEyebrow: 'OKINAWA · NANJO', heroTitle: 'VILLA VIEW', heroSub: '太平洋を一望する、4寝室・10名様までの貸切ヴィラ',
      fbarCheckin: 'チェックイン', fbarCheckout: 'チェックアウト', fbarAdults: '大人', fbarChildren: '子供 (6-12歳)', fbarGo: '空き状況を確認',
      fbarNights: '泊数', fbarNightUnit: '泊', fbarBbq: 'BBQ機材を利用する',
      fbarChildNote: '※ 5歳以下無料、6-12歳お一人 ¥2,000追加',
      fbarBbqNote: '※ 現地払い・現金 ¥4,000',
      calTitle: '料金・空室カレンダー', calLegendAvail: '空室あり', calLegendBusy: '満室', calLegendSel: '選択中',
      calBusy: '満室', calLoading: '読み込み中…', calErr: 'カレンダーを読み込めませんでした',
      featTitle: '広々と多機能なヴィラ', featSub: 'SPACIOUS · MULTI-FUNCTIONAL',
      accessTitle: 'アクセス', accessSub: 'OKINAWA · NANJO',
      accessAddr: '〒901-1407 沖縄県南城市つきしろ1663-9',
      accessAirport: '那覇空港から車で約45分',
      accessMonorail: 'ゆいレール 那覇空港駅 → タクシー / レンタカー',
      accessParking: '無料駐車場あり',
      polTitle: 'キャンセル規定', polSummary: '14日前まで無料 / 13〜7日前30% / 6日前〜前日50% / 当日100%',
      pol2d: '14日前まで', pol2dAmt: '無料',
      pol1d: '13〜7日前 / 6日前〜前日', pol1dAmt: '宿泊料金の30% / 50%',
      pol0d: '当日 / 不泊', pol0dAmt: '宿泊料金の100%',
      polNote: '※ ご連絡なしの不泊は全額のキャンセル料を頂戴いたします。',
      footPolicies: '規約・ポリシー', footPrivacy: 'プライバシーポリシー', footTerms: '利用規約', footTokushoho: '特定商取引法',
      f1Lbl: '4 ベッドルーム', f1Desc: '海を望む寝室を含む4部屋',
      f2Lbl: '最大10名', f2Desc: 'ファミリー・ご友人グループに',
      f3Lbl: '太平洋ビュー', f3Desc: '4室中3室から海を一望',
      f4Lbl: 'BBQ テラス', f4Desc: '夕焼けの海を眺めながら',
      f5Lbl: 'YOGA スタジオ', f5Desc: '海を眺める専用空間',
      f6Lbl: 'フルキッチン', f6Desc: '長期滞在にも対応',
      amenTitle: '無料の特典', amenParking: '無料駐車場', amenSauna: '無料サウナ', amenWifi: '無料 Wi-Fi',
      footBrand: 'VILLA VIEW', footTag: '沖縄南城・太平洋を独り占めする貸切プライベートヴィラ',
      footQuick: 'クイックリンク', footContact: 'お問い合わせ',
      tel: 'TEL', addr: '〒901-1407 沖縄県南城市つきしろ1663-9',
      copyr: '© Villa VIEW Okinawa. All rights reserved.',
      dows: ['日','月','火','水','木','金','土'],
      monthLabel: function (y, m) { return y + '年 ' + (m + 1) + '月'; },
    },
    en: {
      navHome: 'Home', navFacilities: 'Facilities', navAttractions: 'Nearby', navCheckin: 'Check-in', navAccess: 'Access', navBooking: 'Reserve', navFaq: 'FAQ', navContact: 'Contact',
      heroEyebrow: 'OKINAWA · NANJO', heroTitle: 'VILLA VIEW', heroSub: 'A private 4-bedroom oceanfront villa for up to 10 guests',
      fbarCheckin: 'Check-in', fbarCheckout: 'Check-out', fbarAdults: 'Adults', fbarChildren: 'Children (6-12)', fbarGo: 'Check Availability',
      fbarNights: 'Nights', fbarNightUnit: '', fbarBbq: 'Add BBQ equipment',
      fbarChildNote: '※ Under 5 free · Ages 6-12 add ¥2,000 per child',
      fbarBbqNote: '※ ¥4,000 cash on-site',
      calTitle: 'Rates & Availability', calLegendAvail: 'Available', calLegendBusy: 'Booked', calLegendSel: 'Selected',
      calBusy: 'Booked', calLoading: 'Loading…', calErr: 'Unable to load calendar',
      featTitle: 'Spacious & Multi-functional', featSub: 'WHOLE-HOUSE PRIVATE VILLA',
      accessTitle: 'Access', accessSub: 'OKINAWA · NANJO',
      accessAddr: '1663-9 Tsukishiro, Nanjo, Okinawa 901-1407, Japan',
      accessAirport: 'About 45 min by car from Naha Airport',
      accessMonorail: 'Yui Rail to Naha Airport, then taxi / rental car',
      accessParking: 'Free on-site parking',
      polTitle: 'Cancellation Policy', polSummary: 'Free up to 14 days / 13–7 days 30% / 6 days–1 day 50% / Day-of 100%',
      pol2d: 'Up to 14 days before', pol2dAmt: 'Free',
      pol1d: '13–7 days / 6 days–1 day before', pol1dAmt: '30% / 50% of room rate',
      pol0d: 'Day of / no-show', pol0dAmt: '100% of room rate',
      polNote: '※ No-shows without notice are charged 100%.',
      footPolicies: 'Policies', footPrivacy: 'Privacy Policy', footTerms: 'Terms of Use', footTokushoho: 'Commerce Disclosure',
      f1Lbl: '4 Bedrooms', f1Desc: 'Four rooms including an oceanview suite',
      f2Lbl: 'Up to 10 Guests', f2Desc: 'Ideal for families and groups',
      f3Lbl: 'Pacific Ocean View', f3Desc: 'Visible from 3 of the 4 bedrooms',
      f4Lbl: 'BBQ Terrace', f4Desc: 'Dine into the Okinawan sunset',
      f5Lbl: 'Yoga Studio', f5Desc: 'A dedicated space facing the sea',
      f6Lbl: 'Full Kitchen', f6Desc: 'Perfect for extended stays',
      amenTitle: 'Included Free', amenParking: 'Free Parking', amenSauna: 'Free Sauna', amenWifi: 'Free Wi-Fi',
      footBrand: 'VILLA VIEW', footTag: 'A private oceanfront villa overlooking the Pacific in Nanjo, Okinawa',
      footQuick: 'Quick Links', footContact: 'Contact',
      tel: 'TEL', addr: '1663-9 Tsukishiro, Nanjo, Okinawa 901-1407, Japan',
      copyr: '© Villa VIEW Okinawa. All rights reserved.',
      dows: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      monthLabel: function (y, m) { return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m] + ' ' + y; },
    },
    zh: {
      navHome: '首页', navFacilities: '设施', navAttractions: '周边', navCheckin: '入住', navAccess: '交通', navBooking: '预订', navFaq: '常见问题', navContact: '联系',
      heroEyebrow: '冲绳 · 南城', heroTitle: 'VILLA VIEW', heroSub: '俯瞰太平洋・4 卧室・最多 10 人独栋别墅',
      fbarCheckin: '入住', fbarCheckout: '退房', fbarAdults: '成人', fbarChildren: '儿童 (6-12岁)', fbarGo: '查空房',
      fbarNights: '晚数', fbarNightUnit: '晚', fbarBbq: '加 BBQ 设备',
      fbarChildNote: '※ 5岁以下免费，6-12岁每人加 ¥2,000',
      fbarBbqNote: '※ 现场付现金 ¥4,000',
      calTitle: '价格 & 空房日历', calLegendAvail: '可订', calLegendBusy: '满房', calLegendSel: '已选',
      calBusy: '满', calLoading: '加载中…', calErr: '日历加载失败',
      featTitle: '宽敞多功能别墅', featSub: '整栋出租 · 独家私享',
      accessTitle: '交通指南', accessSub: 'OKINAWA · NANJO',
      accessAddr: '日本冲绳县南城市つきしろ 1663-9, 901-1407',
      accessAirport: '那霸机场出发开车约 45 分钟',
      accessMonorail: 'Yui 单轨抵那霸机场后转出租 / 租车',
      accessParking: '免费停车',
      polTitle: '退订规定', polSummary: '14天前免费 / 13–7天前30% / 6天前–前1日50% / 当日100%',
      pol2d: '入住日14天前', pol2dAmt: '免费',
      pol1d: '13–7天前 / 6天前–前1日', pol1dAmt: '收取房费30% / 50%',
      pol0d: '当日 / 未到店', pol0dAmt: '收取房费100%',
      polNote: '※ 未提前通知的未到店将收取100%退订费。',
      footPolicies: '条款与政策', footPrivacy: '隐私政策', footTerms: '使用条款', footTokushoho: '特定商业交易',
      f1Lbl: '4 间卧室', f1Desc: '含一间海景套房，共四室',
      f2Lbl: '最多 10 人', f2Desc: '适合家庭与朋友聚会',
      f3Lbl: '太平洋海景', f3Desc: '四间卧室中三间能看到大海',
      f4Lbl: 'BBQ 露台', f4Desc: '在夕阳海景中烧烤',
      f5Lbl: '瑜伽室', f5Desc: '面朝大海的专属空间',
      f6Lbl: '全功能厨房', f6Desc: '适合长期居住',
      amenTitle: '免费设施', amenParking: '免费停车', amenSauna: '免费桑拿', amenWifi: '免费 Wi-Fi',
      footBrand: 'VILLA VIEW', footTag: '冲绳南城・面朝太平洋的私人独栋别墅',
      footQuick: '快速导航', footContact: '联系我们',
      tel: '电话', addr: '日本冲绳县南城市つきしろ 1663-9, 901-1407',
      copyr: '© Villa VIEW Okinawa. 版权所有.',
      dows: ['日','一','二','三','四','五','六'],
      monthLabel: function (y, m) { return y + '年 ' + (m + 1) + '月'; },
    },
  };
  // Fall back to en for languages without custom strings
  ['zh-Hant','ko','th','hi','fr','de','es'].forEach(function (k) { if (!I18N[k]) I18N[k] = I18N.en; });
  var T = I18N[LANG] || I18N.ja;

  // ===== Utilities =====
  function el(html) { var d = document.createElement('div'); d.innerHTML = String(html).trim(); return d.firstChild; }
  function fmtYen(n) { if (n == null || isNaN(n) || n <= 0) return ''; return '¥' + Math.round(n).toLocaleString('en-US'); }
  function ymd(d) { var m = String(d.getMonth() + 1).padStart(2, '0'); var dd = String(d.getDate()).padStart(2, '0'); return d.getFullYear() + '-' + m + '-' + dd; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

  // ===== Build DOM blocks =====
  var heroBg = SITE + '/images/hero-scenery.jpg';
  // Lang prefix on villaokinawa.com: "/" (ja), "/en/", "/zh/", "/zh-Hant/", "/ko/", etc.
  var langPath = (LANG === 'ja') ? '' : '/' + LANG;
  var headerHTML =
    '<header class="vv-header">' +
      '<div class="vv-header-inner">' +
        '<a href="' + SITE + langPath + '/" target="_top" class="vv-logo">' +
          '<span class="vv-logo-main">VILLA VIEW</span>' +
          '<span class="vv-logo-sub">OKINAWA · NANJO</span>' +
        '</a>' +
        '<nav class="vv-nav">' +
          '<a href="' + SITE + langPath + '/" target="_top">' + T.navHome + '</a>' +
          '<a href="' + SITE + langPath + '/#facilities" target="_top">' + T.navFacilities + '</a>' +
          '<a href="' + SITE + langPath + '/#attractions" target="_top">' + T.navAttractions + '</a>' +
          '<a href="' + SITE + langPath + '/#checkin" target="_top">' + T.navCheckin + '</a>' +
          '<a href="' + SITE + langPath + '/#access" target="_top">' + T.navAccess + '</a>' +
          '<a href="' + SITE + langPath + '/faq/" target="_top">' + T.navFaq + '</a>' +
          '<a href="' + SITE + langPath + '/contact/" target="_top">' + T.navContact + '</a>' +
        '</nav>' +
        '<div class="vv-lang-switcher">' +
          '<button class="vv-lang-btn" id="vv-lang-toggle" type="button">' + LANG.toUpperCase() + ' ▾</button>' +
          '<div class="vv-lang-menu" id="vv-lang-menu">' +
            ['ja:日本語','en:English','zh:简体中文','zh-Hant:繁體中文','ko:한국어','th:ไทย','fr:Français','de:Deutsch','es:Español'].map(function (kv) {
              var pair = kv.split(':'); return '<a href="?lang=' + pair[0] + '" data-lang="' + pair[0] + '">' + pair[1] + '</a>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</header>';

  var heroHTML =
    '<section class="vv-page-hero" style="background-image:url(' + heroBg + ')">' +
      '<div class="vv-page-hero-overlay"></div>' +
      '<div class="vv-page-hero-content">' +
        '<p class="vv-page-hero-eyebrow">' + T.heroEyebrow + '</p>' +
        '<h1>' + T.heroTitle + '</h1>' +
        '<p>' + T.heroSub + '</p>' +
      '</div>' +
    '</section>';

  // Removed 2026-08-04 — see file header. Kept as an empty string so the render order below
  // stays untouched. Reinstating requires evidence that the direct rate really is cheaper.
  var directHTML = '';

  var fbarHTML =
    '<section class="vv-fbar">' +
      '<form id="vv-fbar-form" class="vv-fbar-form" onsubmit="return false">' +
        '<div class="vv-fbar-row1">' +
          '<div class="vv-fbar-cell"><label class="vv-fbar-lbl">' + T.fbarCheckin + '</label><input type="date" name="checkin" required></div>' +
          '<div class="vv-fbar-cell"><label class="vv-fbar-lbl">' + T.fbarCheckout + '</label><input type="date" name="checkout" required></div>' +
          '<div class="vv-fbar-cell vv-fbar-nights"><label class="vv-fbar-lbl">' + T.fbarNights + '</label><span class="vv-fbar-nights-val" id="vv-fbar-nights-val">1' + T.fbarNightUnit + '</span></div>' +
          '<div class="vv-fbar-cell"><label class="vv-fbar-lbl">' + T.fbarAdults + '</label><select name="numadult">' +
            [1,2,3,4,5,6,7,8].map(function (n) { return '<option value="' + n + '"' + (n === 2 ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="vv-fbar-cell"><label class="vv-fbar-lbl">' + T.fbarChildren + '</label><select name="numchild">' +
            [0,1,2,3,4,5,6].map(function (n) { return '<option value="' + n + '"' + (n === 0 ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
          '</select></div>' +
        '</div>' +
        '<p class="vv-fbar-note">' + T.fbarChildNote + '</p>' +
        '<div class="vv-fbar-row2">' +
          '<label class="vv-fbar-bbq"><input type="checkbox" name="bbq" value="1"> <span>' + T.fbarBbq + '</span> <em class="vv-fbar-bbq-note">' + T.fbarBbqNote + '</em></label>' +
          '<button type="submit" class="vv-fbar-go">' + T.fbarGo + '</button>' +
        '</div>' +
      '</form>' +
    '</section>';

  var accessHTML =
    '<section class="vv-access">' +
      '<h2 class="vv-access-title">' + T.accessTitle + '</h2>' +
      '<p class="vv-access-sub">' + T.accessSub + '</p>' +
      '<div class="vv-access-grid">' +
        '<div class="vv-access-info">' +
          '<div class="vv-access-line"><strong>' + T.accessAddr + '</strong></div>' +
          '<div class="vv-access-line">▌ ' + T.accessAirport + '</div>' +
          '<div class="vv-access-line">▌ ' + T.accessMonorail + '</div>' +
          '<div class="vv-access-line">▌ ' + T.accessParking + '</div>' +
          '<div class="vv-access-line">▌ TEL: <a href="tel:+81988942474">+81-98-894-2474</a></div>' +
        '</div>' +
        '<div class="vv-access-map">' +
          '<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
            'src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBsvz27efzmzKj7wtc6oJw15fLEYmkDJ84&q=26.162946,127.7936485&zoom=14" ' +
            'allowfullscreen></iframe>' +
        '</div>' +
      '</div>' +
    '</section>';

  var calHTML =
    '<section class="vv-cal-wrap">' +
      '<div class="vv-cal-header">' +
        '<h2 class="vv-cal-title">' + T.calTitle + '</h2>' +
      '</div>' +
      '<div class="vv-cal-months" id="vv-cal-months">' +
        '<div class="vv-cal-loading">' + T.calLoading + '</div>' +
      '</div>' +
    '</section>';

  // Feature cards each with a representative photo
  var feats = [
    { img: 'guestroom/bedroom-oceanview.jpg', lbl: 'f1Lbl', desc: 'f1Desc' },
    { img: 'guestroom/living-room.jpg',        lbl: 'f2Lbl', desc: 'f2Desc' },
    { img: 'hero-scenery.jpg',                 lbl: 'f3Lbl', desc: 'f3Desc' },
    { img: 'bbq/IMG_7211.jpg',                 lbl: 'f4Lbl', desc: 'f4Desc' },
    { img: 'yogastudio/IMG_4715.jpg',          lbl: 'f5Lbl', desc: 'f5Desc' },
    { img: 'beds24/03-kitchen.jpg',            lbl: 'f6Lbl', desc: 'f6Desc' },
  ];
  var featuresHTML =
    '<section class="vv-features">' +
      '<h2 class="vv-features-title">' + T.featTitle + '</h2>' +
      '<p class="vv-features-sub">' + T.featSub + '</p>' +
      '<div class="vv-features-grid">' +
        feats.map(function (f) {
          return '<div class="vv-feature-card">' +
            '<div class="vv-feature-img"><img src="' + SITE + '/images/' + f.img + '" alt="' + T[f.lbl] + '" loading="lazy"></div>' +
            '<div class="vv-feature-body">' +
              '<h3 class="vv-feature-lbl">' + T[f.lbl] + '</h3>' +
              '<p class="vv-feature-desc">' + T[f.desc] + '</p>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</section>';

  // Prominent "free amenities" strip (also configure these in Google Business
  // Profile so they show in Google Hotel's amenities panel).
  var amenityHTML =
    '<section class="vv-amenities">' +
      '<h3 class="vv-amenities-title">' + T.amenTitle + '</h3>' +
      '<div class="vv-amenities-row">' +
        '<span class="vv-amenity"><span class="vv-amenity-ico">P</span>' + T.amenParking + '</span>' +
        '<span class="vv-amenity"><span class="vv-amenity-ico">≈</span>' + T.amenSauna + '</span>' +
        '<span class="vv-amenity"><span class="vv-amenity-ico">⌖</span>' + T.amenWifi + '</span>' +
      '</div>' +
    '</section>';

  // Gallery removed — villaokinawa.com has the full gallery; nav links there.

  var footerHTML =
    '<footer class="vv-footer">' +
      '<div class="vv-footer-inner">' +
        '<div class="vv-footer-brand-col">' +
          '<h3 class="vv-footer-brand">' + T.footBrand + '</h3>' +
          '<p class="vv-footer-tagline">' + T.footTag + '</p>' +
          '<div class="vv-footer-contact">' +
            T.addr + '<br>' +
            T.tel + ': <a href="tel:+81988942474">+81-98-894-2474</a>' +
          '</div>' +
        '</div>' +
        '<div class="vv-footer-policy-col">' +
          '<h4 class="vv-footer-h">' + T.polTitle + '</h4>' +
          '<p class="vv-pol-summary">' + T.polSummary + '</p>' +
          '<ul class="vv-pol-list">' +
            '<li><span>' + T.pol2d + '</span><b>' + T.pol2dAmt + '</b></li>' +
            '<li><span>' + T.pol1d + '</span><b>' + T.pol1dAmt + '</b></li>' +
            '<li><span>' + T.pol0d + '</span><b>' + T.pol0dAmt + '</b></li>' +
          '</ul>' +
          '<p class="vv-pol-note">' + T.polNote + '</p>' +
        '</div>' +
        '<div class="vv-footer-links-col">' +
          '<h4 class="vv-footer-h">' + T.footPolicies + '</h4>' +
          '<ul class="vv-footer-links">' +
            '<li><a href="' + SITE + langPath + '/privacy/" target="_top">' + T.footPrivacy + '</a></li>' +
            '<li><a href="' + SITE + langPath + '/terms/" target="_top">' + T.footTerms + '</a></li>' +
            '<li><a href="' + SITE + langPath + '/tokushoho/" target="_top">' + T.footTokushoho + '</a></li>' +
            '<li><a href="' + SITE + langPath + '/faq/" target="_top">' + T.navFaq + '</a></li>' +
            '<li><a href="' + SITE + langPath + '/contact/" target="_top">' + T.navContact + '</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="vv-footer-bottom">' + T.copyr + '</div>' +
    '</footer>';

  // ===== Calendar state =====
  var calState = { firstMonth: startOfMonth(new Date()), data: null, selStart: null, selEnd: null };

  // ===== Inject DOM (run on body ready) =====
  function inject() {
    if (!document.body) { setTimeout(inject, 50); return; }
    // Top band ABOVE the native Beds24 content: branded header + hero + banner.
    // The broken self-made search bar (fbarHTML) is removed entirely.
    var top = document.createElement('div');
    top.className = 'vv-injected-top';
    top.innerHTML = headerHTML + heroHTML + directHTML;
    document.body.insertBefore(top, document.body.firstChild);
    // Custom price calendar + property write-up + access go AFTER the native
    // Beds24 booking content (then the footer last).
    var bottom = document.createElement('div');
    bottom.className = 'vv-injected-bottom';
    bottom.innerHTML = calHTML + featuresHTML + amenityHTML + accessHTML;
    document.body.appendChild(bottom);
    document.body.appendChild(el(footerHTML));
    wireUp();
    loadCalendar();
  }

  function wireUp() {
    var btn = document.getElementById('vv-lang-toggle');
    var menu = document.getElementById('vv-lang-menu');
    if (btn && menu) {
      btn.addEventListener('click', function (e) { e.stopPropagation(); menu.classList.toggle('open'); });
      document.addEventListener('click', function () { menu.classList.remove('open'); });
      menu.addEventListener('click', function (e) {
        var a = e.target.closest('a[data-lang]'); if (!a) return;
        e.preventDefault();
        var p = new URLSearchParams(location.search);
        p.set('lang', a.getAttribute('data-lang'));
        location.search = '?' + p.toString();
      });
    }
    var form = document.getElementById('vv-fbar-form');
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); submitSearch(); });
  }

  function initFbarDefaults() {
    var form = document.getElementById('vv-fbar-form'); if (!form) return;
    var ci = form.querySelector('input[name=checkin]'), co = form.querySelector('input[name=checkout]');
    var t = new Date();
    if (ci && !ci.value) ci.value = ymd(addDays(t, 1));
    if (co && !co.value) co.value = ymd(addDays(t, 2));
    try {
      var I = new URLSearchParams(location.search);
      ['checkin','numadult','numchild'].forEach(function (k) {
        var v = I.get(k); if (!v) return;
        var elx = form.querySelector('[name="' + k + '"]'); if (!elx) return;
        if (k === 'checkin' && /^\d{8}$/.test(v)) elx.value = v.slice(0,4)+'-'+v.slice(4,6)+'-'+v.slice(6,8);
        else elx.value = v;
      });
    } catch (e) {}
    if (ci) ci.addEventListener('change', function () {
      if (!co || !ci.value) return;
      if (new Date(ci.value) >= new Date(co.value)) co.value = ymd(addDays(new Date(ci.value), 1));
      updateNightsDisplay();
    });
    if (co) co.addEventListener('change', updateNightsDisplay);
    updateNightsDisplay();
  }

  function updateNightsDisplay() {
    var form = document.getElementById('vv-fbar-form'); if (!form) return;
    var ci = form.querySelector('input[name=checkin]'), co = form.querySelector('input[name=checkout]');
    var out = document.getElementById('vv-fbar-nights-val'); if (!out) return;
    if (!ci || !co || !ci.value || !co.value) { out.textContent = '—'; return; }
    var n = Math.round((new Date(co.value) - new Date(ci.value)) / 86400000);
    if (n < 1) n = 1;
    out.textContent = n + (T.fbarNightUnit || '');
  }

  function submitSearch() {
    var form = document.getElementById('vv-fbar-form'); if (!form) return;
    var d = new FormData(form);
    var ciV = String(d.get('checkin') || ''), coV = String(d.get('checkout') || '');
    var diff = 1;
    if (ciV && coV) diff = Math.round((new Date(coV).getTime() - new Date(ciV).getTime()) / 86400000);
    if (diff < 1) diff = 1;

    // Pre-select the only Villa VIEW room (674526) so users skip search-result
    // step and go straight to guest-info / payment.
    var p = new URLSearchParams({
      propid: String(PROPID),
      roomid: String(ROOMID),
      singleroom: '1',
      ['sr1-' + ROOMID]: '1',
      checkin: ciV.replace(/-/g, ''),
      numnight: String(diff),
      numadult: String(d.get('numadult') || '2'),
      numroom: '1',
      lang: LANG,
      referer: 'direct',
    });
    var nc = String(d.get('numchild') || '0'); if (parseInt(nc, 10) > 0) p.set('numchild', nc);

    // BBQ option: passed as a guest note so the hotel sees the request.
    if (d.get('bbq')) {
      var noteText = (LANG === 'ja') ? 'BBQ機材利用希望 (現地払い ¥4,000)'
        : (LANG === 'zh') ? 'BBQ 设备使用申请（现场付现金 ¥4,000）'
        : 'BBQ equipment requested (¥4,000 cash on-site)';
      p.set('notes', noteText);
    }

    // Always navigate to absolute Beds24 URL so the form works both inside the
    // booking iframe AND from external preview pages.
    location.href = 'https://beds24.com/booking2.php?' + p.toString();
  }

  // ===== Calendar (with 10-min localStorage cache + graceful fallback) =====
  var CAL_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  var CAL_CACHE_VER = 'v2'; // bump when shape changes to invalidate old caches

  function calCacheKey(startDate, endDate) {
    return 'vv_cal_' + CAL_CACHE_VER + '_' + ROOMID + '_' + startDate + '_' + endDate;
  }

  function readCalCache(key) {
    try {
      var raw = localStorage.getItem(key); if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || !obj.ts || Date.now() - obj.ts > CAL_CACHE_TTL) return null;
      // Never use empty cache (probably a failed fetch from before)
      if (!obj.data || Object.keys(obj.data).length === 0) return null;
      return obj.data;
    } catch (e) { return null; }
  }

  function writeCalCache(key, data) {
    // Skip caching empty data — fetch failures shouldn't poison subsequent loads
    if (!data || Object.keys(data).length === 0) return;
    try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {}
  }

  // One-shot cleanup of old v1 caches
  try {
    Object.keys(localStorage).forEach(function (k) {
      if (k.indexOf('vv_cal_') === 0 && k.indexOf('vv_cal_v2_') !== 0) localStorage.removeItem(k);
    });
  } catch (e) {}

  function loadCalendar() {
    // Beds24 calendar API returns empty for past dates → start from max(firstMonth, today).
    var today = new Date(); today.setHours(0,0,0,0);
    var fetchStart = calState.firstMonth > today ? calState.firstMonth : today;
    var startDate = ymd(fetchStart);
    var endMonth = new Date(calState.firstMonth.getFullYear(), calState.firstMonth.getMonth() + 2, 0);
    var endDate = ymd(endMonth);
    var key = calCacheKey(startDate, endDate);

    // Try cache first
    var cached = readCalCache(key);
    if (cached) {
      calState.data = cached;
      renderCalendar();
      return;
    }

    var url = PROXY + '/beds24/proxy/inventory/rooms/calendar?roomId=' + ROOMID +
      '&startDate=' + startDate + '&endDate=' + endDate +
      '&includePrices=true&includeNumAvail=true';

    console.log('[vv-cal] fetching', url);
    fetch(url)
      .then(function (res) {
        console.log('[vv-cal] response status', res.status);
        if (res.status === 429) throw new Error('rate-limited');
        return res.json();
      })
      .then(function (json) {
        var entries = (json && json.data && json.data[0] && json.data[0].calendar) || [];
        console.log('[vv-cal] entries received', entries.length, 'first:', entries[0]);
        var map = {};
        entries.forEach(function (e) {
          // e.from / e.to are YYYY-MM-DD strings; iterate inclusive using local-noon
          // anchoring so DST/TZ shifts don't bump the key by ±1 day.
          var from = new Date(e.from + 'T12:00:00');
          var to = new Date(e.to + 'T12:00:00');
          for (var d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
            map[ymd(d)] = e;
          }
        });
        console.log('[vv-cal] map sample keys', Object.keys(map).slice(0, 5));
        calState.data = map;
        writeCalCache(key, map);
        renderCalendar();
      })
      .catch(function (err) {
        console.warn('[vv-cal] fetch failed:', err && err.message);
        calState.data = {};
        renderCalendar();
      });
  }

  function renderCalendar() {
    var box = document.getElementById('vv-cal-months'); if (!box) return;
    box.innerHTML = '';
    var today = new Date(); today.setHours(0,0,0,0);
    for (var i = 0; i < 2; i++) {
      var monthDate = new Date(calState.firstMonth.getFullYear(), calState.firstMonth.getMonth() + i, 1);
      box.appendChild(renderMonth(monthDate, today, i === 0));
    }
    paintSelection();
  }

  function renderMonth(monthDate, today, isFirstMonth) {
    var y = monthDate.getFullYear(), m = monthDate.getMonth();
    var firstDow = new Date(y, m, 1).getDay();
    var numDays = daysInMonth(y, m);
    var wrap = el('<div class="vv-cal-month"></div>');
    var head = el(
      '<div class="vv-cal-month-head">' +
        '<button class="vv-cal-nav-btn" data-act="prev" ' + (isFirstMonth ? '' : 'style="visibility:hidden"') + '>&lsaquo;</button>' +
        '<h3 class="vv-cal-month-title">' + T.monthLabel(y, m) + '</h3>' +
        '<button class="vv-cal-nav-btn" data-act="next" ' + (isFirstMonth ? 'style="visibility:hidden"' : '') + '>&rsaquo;</button>' +
      '</div>'
    );
    wrap.appendChild(head);
    var grid = el('<div class="vv-cal-grid"></div>');
    T.dows.forEach(function (d, i) {
      grid.appendChild(el('<div class="vv-cal-dow ' + (i === 0 ? 'sun' : i === 6 ? 'sat' : '') + '">' + d + '</div>'));
    });
    for (var i = 0; i < firstDow; i++) grid.appendChild(el('<div class="vv-cal-cell empty"></div>'));
    var dataMap = calState.data || {};
    var hasAnyData = Object.keys(dataMap).length > 0;
    for (var dd = 1; dd <= numDays; dd++) {
      var dateObj = new Date(y, m, dd);
      var key = ymd(dateObj);
      var data = dataMap[key];
      var isPast = dateObj < today;
      var hasData = !!data;
      var avail = hasData ? Number(data.numAvail || 0) > 0 : true; // optimistic when no API data
      var masterPrice = hasData ? Number(data.price || 0) : 0;
      var officialPrice = masterPrice * OFFICIAL_MULTIPLIER;
      var cls = 'vv-cal-cell';
      if (isPast) cls += ' past';
      else if (hasData && !avail) cls += ' busy';
      var priceTxt = '';
      if (!isPast) {
        if (hasData && avail && officialPrice > 0) priceTxt = fmtYen(officialPrice);
        else if (hasData && !avail) priceTxt = T.calBusy;
        else priceTxt = '—';
      }
      var priceHTML = priceTxt ? '<span class="vv-cal-price">' + priceTxt + '</span>' : '';
      var cell = el('<div class="' + cls + '" data-date="' + key + '" data-avail="' + (avail ? '1' : '0') + '">' +
        '<span class="vv-cal-day">' + dd + '</span>' + priceHTML +
      '</div>');
      // Calendar is display-only (price/availability reference). Date selection
      // happens in the native Beds24 date bar above; cells are not clickable.
      grid.appendChild(cell);
    }
    wrap.appendChild(grid);
    var prev = head.querySelector('[data-act=prev]');
    var next = head.querySelector('[data-act=next]');
    if (prev) prev.addEventListener('click', function () {
      var minMonth = startOfMonth(new Date());
      var candidate = new Date(calState.firstMonth.getFullYear(), calState.firstMonth.getMonth() - 1, 1);
      if (candidate < minMonth) candidate = minMonth;
      if (candidate.getTime() === calState.firstMonth.getTime()) return;
      calState.firstMonth = candidate; loadCalendar();
    });
    if (next) next.addEventListener('click', function () {
      calState.firstMonth = new Date(calState.firstMonth.getFullYear(), calState.firstMonth.getMonth() + 1, 1);
      loadCalendar();
    });
    return wrap;
  }

  function onCellClick(e) {
    var cell = e.currentTarget;
    var date = cell.getAttribute('data-date'); if (!date) return;
    var form = document.getElementById('vv-fbar-form'); if (!form) return;
    var ci = form.querySelector('input[name=checkin]'), co = form.querySelector('input[name=checkout]');
    if (!calState.selStart || calState.selEnd) {
      calState.selStart = date; calState.selEnd = null;
      if (ci) ci.value = date;
      if (co) co.value = ymd(addDays(new Date(date), 1));
    } else {
      if (new Date(date) <= new Date(calState.selStart)) {
        calState.selStart = date; calState.selEnd = null;
        if (ci) ci.value = date;
        if (co) co.value = ymd(addDays(new Date(date), 1));
      } else {
        calState.selEnd = date;
        if (co) co.value = date;
      }
    }
    paintSelection();
    var fbar = document.querySelector('.vv-fbar'); if (fbar) fbar.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function paintSelection() {
    var cells = document.querySelectorAll('.vv-cal-cell[data-date]');
    var start = calState.selStart ? new Date(calState.selStart) : null;
    var end = calState.selEnd ? new Date(calState.selEnd) : start;
    cells.forEach(function (c) {
      c.classList.remove('selected', 'in-range');
      if (!start) return;
      var d = new Date(c.getAttribute('data-date'));
      if (d.getTime() === start.getTime() || (end && d.getTime() === end.getTime())) c.classList.add('selected');
      else if (end && d > start && d < end) c.classList.add('in-range');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
