# Branded Booking Page Playbook — Beds24 + Static Site

Reproducible recipe for turning Beds24's default `booking2.php` page into
a fully branded, Google-Hotel-compliant booking flow under your own
domain — without paying for a custom front-end build per hotel.

Reference implementation: **Fujisan Garden Hotel** (`chijapanhotel.com/fuji-garden`).
Total build time once you have the playbook: **~1 working day** per new property.

---

## ▌ Architecture (3 layers)

```
┌─────────────────────────────────────────────────────────┐
│  hotel.com/booking/   ← Astro page, just an iframe      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ beds24.com/booking2.php?propid=N  (the iframe)    │  │
│  │ ┌─────────────────────────────────────────────┐   │  │
│  │ │ Beds24 admin loads <script src=…> from CDN  │   │  │
│  │ │ → fetches our beds24-body-top.js            │   │  │
│  │ │ → script injects: header, hero, fbar, room  │   │  │
│  │ │   cards, meal plan, total bar, cancel       │   │  │
│  │ │   policy, confirmation banner, footer       │   │  │
│  │ │ → CSS loaded from same CDN restyles native  │   │  │
│  │ │   Beds24 elements (Property Calendar)       │   │  │
│  │ └─────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

Layer 1: Astro site         → bare iframe wrapper at /booking/
Layer 2: Beds24 booking2.php → host + transaction engine
Layer 3: CDN-loaded JS+CSS  → our branded UI inside the iframe
```

The Beds24 admin only stores a **two-line loader** (script tag pointing to
the CDN). All real code lives in the Astro project's `public/embed/`,
deployed to Cloudflare Pages. Changes ship by `git push` — no admin
re-paste needed.

---

## ▌ Prerequisites

Required before you start:

- A registered domain on Cloudflare DNS (or willing to migrate)
- Cloudflare Pages site deployed (Astro/static — used to host CDN assets)
- Beds24 account with the property created (rooms, owner email set up)
- Beds24 V2 API access via a worker proxy that holds a refresh token
  (we use `smartinn-api-proxy.leoroy225.workers.dev` — substitute your own)
- Rakuten Travel App ID (for price benchmark scraping; optional but
  recommended)
- One-time: Beds24 invite code → refresh token exchange

---

## ▌ Phase 1 — Beds24 admin setup

### 1.1 Create property + rooms

Standard property setup in Beds24 admin → Settings → Properties. Note the
**propid** (you'll need it everywhere). For each room create:

- `qty` = number of physical rooms of this type
- `maxPeople / maxAdult / maxChild` per room type
- One short room name in property language (override per-language later)

### 1.2 Create offers (priceRules) — 4 per room

Beds24 V3 has 16 priceRule slots per room. We use the first 4:

| Slot | offer | name              | priceLinking                 | maxDaysUntilCheckin |
|------|-------|-------------------|------------------------------|---------------------|
| 1    | 1     | Room Only Base    | parent, offset 0             | 999                 |
| 2    | 2     | 素泊 / Room Only  | parent ×0.9                  | **3** (rolling 3-day special) |
| 3    | 3     | 朝食付 / Breakfast | parent + ¥3,000             | 999                 |
| 4    | 4     | 朝夕食付 / HalfBoard | parent + ¥12,000          | 999                 |

`priceLinking.priceId` always points to slot 1 (offer 1 is the parent
calendar baseline). Adjust offset amounts per the local hotel meal cost.

**Initial state**: offer 1 is `enable: "always"`, offers 2-4 are
`enable: "no"` by default. They'll be flipped via API in Phase 3.

### 1.3 Property layout (for the Calendar widget)

Beds24 admin → Booking Page → **Layout** → Modules → Property Top →
Add `Property Calendar` module, Position 1, Desktop + Mobile both
visible. This is the only Beds24-native widget we keep visible (showing
30-60 days of green/red availability).

### 1.4 Standard Questions (booking form fields)

Booking Page → Standard Questions. Set usage:

- **Compulsory Booking Page**: First Name, Surname, Email, Telephone,
  Country (selector), Arrival Time
- **Optional**: Mobile, Address, City, Postcode, Guest Comments
- **Not Used**: Guest Title, Company, State, Country (text), Fax

### 1.5 Custom Questions (1 only)

Booking Page → Custom Questions → Add new:

- Question: "アレルギー / 食材制限" (Allergies / Dietary)
- Type: Text Area
- Required: Optional
- Show on: Booking Page
- Fill JA / EN / ZH translations in each language tab

### 1.6 Confirmation Text + Email Templates

Booking Page → Texts → **Confirmation Text**: paste JA/EN/ZH text from
`docs/beds24-admin-content.md` § 1.

Email Templates → Guest Confirmation: switch editor to HTML mode, paste
the full branded HTML from `docs/beds24-email-html.md` (3 templates —
JA / EN / ZH).

### 1.7 Custom HTML loaders (the **only** Beds24 admin code you paste)

Booking Page → **Custom Code**:

- **Body Top** field:
  ```html
  <script src="https://YOUR-DOMAIN.com/embed/beds24-body-top.js" defer></script>
  ```
- **Body Bottom** field:
  ```html
  <script src="https://YOUR-DOMAIN.com/embed/beds24-body-bottom.js" defer></script>
  ```

That's it. All real code lives in your CDN.

> **Why a loader, not inline HTML?** Beds24 admin caps Custom HTML fields
> at ~2000 chars. Our injection script alone is 16k+. Loader pattern
> sidesteps the limit AND lets us deploy updates via `git push` without
> ever opening Beds24 admin again.

### 1.8 Google Hotel channel

Channels → Google Hotel. Settings:

- **Google Product**: Google Hotel Ads (umbrella name for both paid + free)
- **Google Ads Customer Id**: **empty** (only fill if you have a paid
  Google Ads account — for free booking links leave blank)
- **URL additions**: `&utm_source=google&utm_medium=hotel-free&utm_campaign=fbl`
- 3 rooms: Synchronise = **Enable**
- Save.

This is the entire "submission to Google Hotel" step. Beds24 pushes the
feed; Google auto-reviews in 1-3 days.

---

## ▌ Phase 2 — CDN-hosted UI assets

### 2.1 File layout in your Astro project

```
public/
  embed/
    beds24-body-top.js      ← 700+ lines, the main injection
    beds24-body-bottom.js   ← shorter, addon-meal hints (optional)
    beds24-custom.css       ← brand-aligned styles, 200+ lines
  images/
    main_logo-sm.webp       ← optimized for booking-page header
    hd_room-sm.webp         ← optimized hero
    01_double01.{avif,webp,jpg}  ← room cards, 3 formats
    facility/open_air_bath02-sm.{avif,webp}  ← facility tiles
    restaurant/dinner01-sm.{avif,webp}
    tourism/05-sm.{avif,webp}
```

All images sized for **actual display dimensions** (no 1600×600 hero for
a 1200px card) and compressed at quality 50-78. Typical budget:
**total image weight ≤150 KB** for first paint.

### 2.2 beds24-body-top.js structure

```js
(function () {
  // 1. iframe detection
  if (window.top !== window.self) document.documentElement.classList.add('embed');

  // 2. step detection (search / checkout / confirmation)
  var qs = location.search || '';
  var bookIdMatch = qs.match(/[?&]bookid=(\d+)/i);
  var isConfirm = !!bookIdMatch;
  var isCheckout = !isConfirm && /[?&]br\d+-\d+=Book/i.test(qs);
  if (isConfirm) document.documentElement.classList.add('fg-confirmation');
  // ...

  // 3. preconnect + preload critical resources
  // 4. CSS link injection
  // 5. i18n detection + dictionary (JA/EN/ZH)
  // 6. siteHeaderHTML() / siteFooterHTML() helpers
  // 7. ROOMS catalog (id, name, meta, base, img, maxAdult, maxChild)
  // 8. roomCardHTML(r) builder
  // 9. cancelPolicyHTML builder
  // 10. Confirmation branch: insertAtTop(headerHTML + bannerHTML) → return
  // 11. Normal branch: insert full HTML (header, hero, fpt, fbar,
  //     cancel-policy, rooms, meal-bar, total) + footer at bottom of body
  // 12. Wire up: ci/co date listeners, qty buttons, meal radios,
  //     adult/child selects, 予約 button
  // 13. Pricing logic: nightlyPrice(base, adults, children, mealId, weekend)
  // 14. buildAndGo() — multi-room direct-book URL
  // 15. hideBeds24Native() — runtime hide of duplicate forms/headings/alerts
  // 16. Run hideBeds24Native at 0/100/500/1500ms to catch async render
})();
```

### 2.3 Pricing model (the formula that drives card + total)

```js
roomCharge = base                        // weekday baseline per room
           + occupancyAdj(adults)        // 1人 0, 2人 0, 3人 +¥3,000
           × weekendMult(date)            // Fri/Sat ×1.20

mealCharge = adults × mealAdult(mealId)  // 朝食 ¥1,500, 朝夕食 ¥6,000
           + children × mealChild(mealId) // half-price for 6-12yo

dailyTotal = roomCharge + mealCharge     // per night, per room
stayTotal  = Σ dailyTotal for each night between checkin/checkout
finalTotal = Σ stayTotal × qty for each booked room
```

**Critical**: use `getUTCDay()` not `getDay()` for weekend detection.
`new Date('YYYY-MM-DD')` parses as UTC midnight; local timezone shift
will misclassify Friday as Thursday in negative UTC offsets.

### 2.4 i18n pattern

```js
function detectLang() {
  // 1. URL param ?lang=
  // 2. parent document html lang (when iframed)
  // 3. default 'ja'
}
var L = I18N[detectLang()] || I18N.ja;
var SITEROOT = SITE + (LANG === 'ja' ? '' : '/' + LANG);

// usage:
'<a href=' + SITEROOT + '/access/>' + L.access + '</a>'
```

Forward the `lang` param onward when navigating to Beds24's next step,
so the guest-info / confirmation pages also stay in chosen language.

### 2.5 Beds24-native UI cleanup

CSS hide rules are unreliable across Beds24 versions. Use JS that
probes by content:

```js
function hideBeds24Native() {
  // (a) forms with checkin/checkout/numadult/numnight inputs (not our fbar)
  // (b) headings h1-h4 matching room names ("Double Room", "ダブル", etc.)
  //     → walk up to closest .card/SECTION/ARTICLE → hide that container
  // (c) .alert-danger / .alert-warning native messages
  // (d) <select name=lang> native language switcher
}
// Run a few times to catch async Beds24 render
hideBeds24Native();
setTimeout(hideBeds24Native, 100);
setTimeout(hideBeds24Native, 500);
setTimeout(hideBeds24Native, 1500);
```

Always **skip elements inside our own injected containers**
(`fg-site-header, fg-room-card, fg-confirm-banner, fg-site-footer,
fg-page-hero`) so we never hide our own UI.

---

## ▌ Phase 3 — Pricing sync

### 3.1 Pull Rakuten as price benchmark

`scripts/rakuten-price-pull.mjs` — calls Rakuten Travel API
`VacantHotelSearch/20170426` via your proxy. Probe ~30 days × 2 adults
to capture weekday/weekend variance:

```js
const v = await fetchVacancy(date, 2);
// classify each plan: classifyRoom(roomName) → double/twin/triple
//                     classifyMeal(plan)     → sutomari/choshoku/choseki
// store: { date, total, perPerson, planId, planName }
```

Output: min / median / max per room × meal cell. Use median as your
weekday baseline, OR pick `Rakuten median × 0.85` to undercut OTAs
(standard direct-booking strategy: 10-15% below Rakuten).

### 3.2 Push prices to Beds24

`scripts/beds24-sync-prices.mjs`:

**Phase 1** — `POST /properties` with `roomTypes[].offers[].enable = "always"`
to flip offers 2/3/4 on, and update offer 4 priceLinking.offsetAmount.

**Phase 2** — `POST /inventory/rooms/calendar` per room with array of
`{ from, to, price1 }` entries for next 90 days. Weekend prices use
`base × 1.20`. Snapshot prior state to `/tmp/beds24-before.json` for
rollback.

Beds24 returns HTTP 201 on success (NOT 200) — make sure script accepts
both.

### 3.3 Verify

```bash
curl ".../proxy/inventory/rooms/offers?propertyId=X&arrival=Y&departure=Y+1&numAdults=2"
```

Should return offer 1/2/3/4 for each room with prices matching your
formula (subject to maxDaysUntilCheckin constraint for offer 2).

---

## ▌ Phase 4 — Astro site integration

### 4.1 Pages

- `/booking/` — single iframe at full width, no outer shell. The Beds24
  CDN injection provides ALL the booking UI.
- `/en/booking/`, `/zh/booking/`, ... — same but pass `lang` to iframe src.

Implementation:
```astro
const widgetSrc = `https://beds24.com/booking2.php?propid=${propId}&lang=${pageLang}&numnight=1`;
<iframe src={widgetSrc} id="beds24-widget" data-lang={pageLang}></iframe>
```

Plus a small client-side script that relays `?checkin=`, `?priceId=`,
`sr*-*` / `br*-*` URL params from the parent page into iframe src.

### 4.2 BOOKING_URL constant for all CTAs

```ts
// src/i18n/utils.ts
export const BOOKING_URL = 'https://chijapanhotel.com/fuji-garden/booking/';
```

Use across the site — homepage CTA, stay-page room cards, restaurant
page, blog plan pages, header/footer "予約" links — all point here.

### 4.3 Multi-language site routes

For each booking page route in 10 langs:

```
src/pages/booking.astro          → JA
src/pages/en/booking.astro       → EN  (BOOKING_URL appends /en/)
src/pages/zh/booking.astro       → ZH
... etc
```

All share BookingContent.astro; only the URL path differs.

---

## ▌ Phase 5 — Google Hotel submission

Network and pages should pass these before submitting:

| Check | How |
|---|---|
| HTTPS | Cloudflare Pages auto |
| Mobile responsive | Open booking URL on phone, verify cards stack |
| Tax-included pricing visible | Each room card tag + total bar pill |
| Cancellation policy pre-booking | fg-cancel-policy widget |
| Privacy / Terms link | footer links |
| Hotel name + address + phone | header + footer |
| Real-time availability | Beds24 calendar (Property Calendar widget) |
| Beds24 → Google channel enabled | Channels page, Synchronise: Enable |

Then in Beds24 → Channels → Google Hotel → Save. Google auto-reviews
1-3 days. No human review of destination URL needed unless flagged.

---

## ▌ Phase 6 — Maintenance

### Updating prices

```bash
# Edit weekday baseline in scripts/beds24-sync-prices.mjs (ROOM_BASE)
node scripts/beds24-sync-prices.mjs            # dry run
node scripts/beds24-sync-prices.mjs --commit   # actually push
```

Pushes overwrite future 90 days. To preserve manually-set special-day
prices, expand the script with skip ranges or per-day exceptions.

### Updating card UI

Edit `public/embed/beds24-body-top.js` + `docs/beds24-custom.css`.
`git push` → Cloudflare deploy ~1 min → strong-refresh booking page.
No Beds24 admin re-paste needed.

### Adding a new room

1. Beds24 admin: create room, set qty, max occupancy
2. Run `node scripts/beds24-create-offers.mjs --commit` to create
   4 priceRules in the new room's first 4 slots
3. Edit `ROOMS` catalog in `beds24-body-top.js` — add the new room id,
   name (per-lang), meta, base, img path, maxAdult/maxChild
4. Re-run `scripts/beds24-sync-prices.mjs --commit` with the new
   roomId included
5. Cloudflare deploy → refresh booking page

### Adding a new language

1. Add language entry to `I18N` dictionary in `beds24-body-top.js`
   (~70 strings)
2. Add room names to `ROOM_NAMES` + `ROOM_META`
3. Add the locale to `Lang` type union in `src/i18n/utils.ts`
4. Create `src/pages/{lang}/booking.astro` route
5. Update `LANGS` list + add `Lang` translations to existing i18n
   strings

---

## ▌ Common gotchas

| Symptom | Cause | Fix |
|---|---|---|
| Booking page shows nothing (white) | Beds24 admin Custom HTML field was cleared or contains a typo | Paste the loader script line back |
| Property Calendar invisible | Over-aggressive CSS hide rule | Avoid `.card:has(>.card-header:not(:has(.flatpickr-calendar)))` and similar broad `:has()` patterns |
| Weekend price NOT applied | `getDay()` used instead of `getUTCDay()` | Switch to `getUTCDay()` everywhere |
| Mobile qty stepper broken | Global mobile CSS `button{width:100%}` overrides | Add `!important` to `.fg-qty-btn { width: 30px; }` |
| Card price ≠ Beds24 final price | Single-occupancy discount in card but flat priceRule in Beds24 | Either drop the card discount OR upgrade Beds24 plan for `price1Single` |
| Confirmation email = plain Beds24 default | HTML template not pasted into admin Email Templates | Paste 3 templates from `docs/beds24-email-html.md` |
| `<select name=lang>` still visible | Beds24 native language picker | Hide via runtime JS — `select[name=lang]`'s parent div |
| All booking CTAs loop back to /booking/ | BOOKING_URL = /booking/ AND /booking/'s own CTA also uses BOOKING_URL | /booking/ should be iframe, not have its own CTA, OR use a separate constant for inner-CTA |
| Two emails on a test booking | One to guest, one to property notification recipient | Normal — set different recipients in Beds24 Account → Email |
| CDN cache serving old version | Cloudflare/browser cache | Hard refresh + add `?_=N` cache-buster |

---

## ▌ Replication checklist for a new property

```
[ ] Domain on Cloudflare DNS
[ ] Astro project scaffolded + deployed to Cloudflare Pages
[ ] Beds24 property created, rooms created, qty set
[ ] Beds24 4 offers/priceRules created per room (slots 1-4)
[ ] Beds24 Booking Page Layout: Property Calendar in Property Top
[ ] Beds24 Standard Questions configured (compulsory + optional)
[ ] Beds24 Custom Question (allergies) added
[ ] Beds24 Confirmation Text pasted (JA / EN / ZH)
[ ] Beds24 Email Templates: branded HTML pasted (JA / EN / ZH)
[ ] CDN-loader (2 lines) pasted into Beds24 admin Custom HTML Body Top + Bottom
[ ] beds24-body-top.js customized: ROOMS catalog, prices, brand colors
[ ] beds24-custom.css customized: brand palette, room card layout
[ ] Images compressed (logo, hero, room cards, facility cards) — total <150 KB
[ ] Rakuten price baseline pulled (or hand-set if no Rakuten presence)
[ ] beds24-sync-prices.mjs run: 90 days × 3+ rooms calendar prices
[ ] Astro /booking/ page = iframe-only with lang relay
[ ] BOOKING_URL constant exported, all CTAs site-wide updated
[ ] 10-lang booking routes built (or fewer if not multi-lang)
[ ] Test booking through full flow: search → guest info → confirmation page
[ ] Verify confirmation email arrives (both guest + property notification)
[ ] Beds24 Channels → Google Hotel enabled + Save
[ ] Wait 1-3 days, verify hotel appears in Google search
```

---

## ▌ Reference files (this repository)

- `public/embed/beds24-body-top.js` — main injection
- `public/embed/beds24-body-bottom.js` — addon-meal hints
- `public/embed/beds24-custom.css` — branded styles
- `docs/beds24-admin-content.md` — paste-ready JA/EN/ZH content
- `docs/beds24-email-html.md` — branded email HTML templates
- `docs/beds24-body-top-loader.html` — 1-line loader for admin
- `docs/beds24-body-bottom-loader.html` — same
- `docs/rakuten-prices-snapshot.json` — last Rakuten pull output
- `scripts/beds24-discover.mjs` — Beds24 V3 API probe
- `scripts/beds24-create-offers.mjs` — create 4 priceRules per room
- `scripts/beds24-sync-prices.mjs` — push 90-day calendar + enable offers
- `scripts/rakuten-price-pull.mjs` — Rakuten benchmark pull
- `src/components/BookingContent.astro` — minimal iframe wrapper
- `src/components/HomeBookingBar.astro` — CTA component
- `src/i18n/utils.ts` — Lang type, BOOKING_URL, withBase, htmlLangFor
