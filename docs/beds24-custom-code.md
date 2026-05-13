# Beds24 Custom Code — Fujisan Garden Hotel (propid 323430)

Brand colors: teal `#2F555A` + accent orange `#E8633A`.
Beds24 layout in use: **V3 Bootstrap template** (Card / form-control / btn).

## Where to paste

1. Log in to https://beds24.com/
2. **Settings → Properties → Fujisan Garden Hotel (323430) → Booking Page**
3. Find **"Custom CSS"** field (sometimes labeled "Custom Code" / "Header
   Code" / under *Page Layout* or *Templates*).
4. Paste the **CSS block** below into Custom CSS.
5. Optionally paste the **HTML/JS block** into Custom HTML (Header Code) to
   strip the "powered by Beds24" link if it shows up.
6. Save → reload `/stay/` on the website.

---

## 1) Custom CSS

```css
/* ===== Fujisan Garden Hotel — Beds24 V3 (Bootstrap) theme ===== */

:root {
  --fg-teal:     #2F555A;
  --fg-teal-2:   #244348;
  --fg-orange:   #E8633A;
  --fg-orange-2: #c84e28;
  --fg-mint:     #88BFBF;
  --fg-text:     #333;
  --fg-muted:    #777;
  --fg-border:   #e2e2e2;
  --fg-bg:       #ffffff;
  --fg-bg-alt:   #f7f7f7;
}

/* ---------- Base typography ---------- */
html, body {
  background: var(--fg-bg) !important;
  color: var(--fg-text) !important;
  font-family: "Helvetica Neue", "Hiragino Sans", "Hiragino Kaku Gothic ProN",
               "Yu Gothic", "Meiryo", "Noto Sans JP", "PingFang SC",
               "Microsoft YaHei", Arial, sans-serif !important;
  font-size: 15px;
}
a, a:visited { color: var(--fg-teal); text-decoration: none; }
a:hover      { color: var(--fg-orange); }

h1, h2, h3, h4, h5, h6 {
  color: var(--fg-teal) !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
}

/* ---------- Language switcher (top dropdown) ---------- */
.dropdown-toggle, .navbar .dropdown-toggle {
  color: var(--fg-teal) !important;
  font-weight: 500;
}

/* ---------- Cards (search bar + each room) ---------- */
.card {
  background: #fff !important;
  border: 1px solid var(--fg-border) !important;
  border-radius: 4px !important;
  box-shadow: none !important;
  margin-bottom: 14px !important;
}

/* Card header = "Double Room" / "Triple Room" / search-bar header */
.card-header,
.card > .card-header,
.card-header h2,
.card-header h3,
.card-header h4 {
  background: var(--fg-teal) !important;
  color: #fff !important;
  border-bottom: none !important;
  border-radius: 4px 4px 0 0 !important;
  padding: 12px 18px !important;
  font-weight: 600 !important;
  letter-spacing: 1px !important;
  font-size: 16px !important;
}
.card-header h2, .card-header h3, .card-header h4,
.card-header .card-title {
  color: #fff !important;
  margin: 0 !important;
  background: transparent !important;
}

.card-body { padding: 16px 18px !important; background: #fff !important; }

/* ---------- Form fields (Check in / out / Nights / Quantity) ---------- */
.form-control,
.form-select,
input[type="text"], input[type="email"], input[type="tel"],
input[type="number"], input[type="date"], select, textarea {
  border: 1px solid var(--fg-border) !important;
  border-radius: 3px !important;
  padding: 9px 12px !important;
  font-size: 14px !important;
  background: #fff !important;
  color: var(--fg-text) !important;
  box-shadow: none !important;
  height: auto !important;
}
.form-control:focus, .form-select:focus,
input:focus, select:focus, textarea:focus {
  outline: none !important;
  border-color: var(--fg-teal) !important;
  box-shadow: 0 0 0 2px rgba(47,85,90,0.12) !important;
}

.input-group-text,
.input-group-prepend .input-group-text,
.input-group-append .input-group-text {
  background: var(--fg-teal) !important;
  color: #fff !important;
  border: 1px solid var(--fg-teal) !important;
  border-radius: 3px 0 0 3px !important;
}
.input-group-text i,
.input-group-text .fa,
.input-group-text svg { color: #fff !important; }

label, .form-label, .col-form-label {
  color: var(--fg-text) !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  letter-spacing: 0.5px;
  margin-bottom: 4px !important;
}

/* ---------- Buttons ---------- */
.btn,
button, input[type="submit"], input[type="button"] {
  border-radius: 3px !important;
  font-weight: 500 !important;
  letter-spacing: 1.5px !important;
  padding: 9px 22px !important;
  font-size: 14px !important;
  box-shadow: none !important;
  text-shadow: none !important;
  transition: background 0.25s, color 0.25s, border-color 0.25s !important;
}

/* Primary CTA = orange (Search / Book / Continue / Reserve) */
.btn-primary, .btn-success,
.bookButton, .searchButton, .continueButton, .submitButton,
button[type="submit"] {
  background: var(--fg-orange) !important;
  border: 1px solid var(--fg-orange) !important;
  color: #fff !important;
}
.btn-primary:hover, .btn-success:hover,
.bookButton:hover, .searchButton:hover,
.continueButton:hover, .submitButton:hover,
button[type="submit"]:hover {
  background: var(--fg-orange-2) !important;
  border-color: var(--fg-orange-2) !important;
  color: #fff !important;
}

/* Secondary = teal */
.btn-secondary, .btn-outline-primary, .btn-default,
.btn-info, .btn-link {
  background: var(--fg-teal) !important;
  border: 1px solid var(--fg-teal) !important;
  color: #fff !important;
}
.btn-secondary:hover, .btn-outline-primary:hover, .btn-default:hover,
.btn-info:hover, .btn-link:hover {
  background: var(--fg-teal-2) !important;
  border-color: var(--fg-teal-2) !important;
  color: #fff !important;
}

/* Cancel / back / danger */
.btn-danger, .btn-warning, .cancelButton, .backButton {
  background: #999 !important;
  border-color: #999 !important;
  color: #fff !important;
}
.btn-danger:hover, .btn-warning:hover,
.cancelButton:hover, .backButton:hover {
  background: #777 !important;
  border-color: #777 !important;
}

/* ---------- Pricing ---------- */
.price, .totalPrice, .roomPrice,
.b24-price, b, strong {
  /* keep generic bold text alone — only the "from JPY ..." line should pop */
}
.card-body strong:not(.text-muted) { color: var(--fg-text); }
.text-end strong, .text-right strong,
.price, .b24-price, .roomPrice, .totalPrice {
  color: var(--fg-orange) !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}

/* ---------- Room layout ---------- */
.room, .roomtype, .roomBox, .b24-room, .b24-roomtype {
  background: #fff !important;
}
.card img, .room img {
  border-radius: 3px;
  max-width: 100%;
  height: auto;
}

/* ---------- Calendar / availability table ---------- */
.calendar, table.calendar, .availabilityCalendar, .b24-calendar {
  border-collapse: separate !important;
  border-spacing: 0 !important;
  width: 100% !important;
}
.calendar th, .availabilityCalendar th, .b24-calendar th {
  background: var(--fg-teal) !important;
  color: #fff !important;
  font-weight: 500 !important;
  padding: 8px 6px !important;
  border: 1px solid var(--fg-teal) !important;
}
.calendar td, .availabilityCalendar td, .b24-calendar td {
  border: 1px solid var(--fg-border) !important;
  padding: 6px !important;
  vertical-align: top;
}
.calendar td.available { background: #f0faf8 !important; }
.calendar td.unavailable, .calendar td.closed, .calendar td.full {
  background: #f3f3f3 !important; color: #aaa !important;
}
.calendar td.selected, .calendar td.checkin, .calendar td.checkout {
  background: var(--fg-orange) !important; color: #fff !important;
}

/* Date picker (flatpickr / native popups Beds24 uses) */
.flatpickr-day.selected,
.flatpickr-day.startRange,
.flatpickr-day.endRange,
.flatpickr-day.inRange {
  background: var(--fg-orange) !important;
  border-color: var(--fg-orange) !important;
  color: #fff !important;
}
.flatpickr-day.today { border-color: var(--fg-teal) !important; }

/* ---------- Tabs / nav ---------- */
.nav-tabs .nav-link {
  color: var(--fg-teal) !important;
  border: 1px solid var(--fg-border) !important;
  border-bottom: none !important;
  border-radius: 3px 3px 0 0 !important;
}
.nav-tabs .nav-link.active {
  background: var(--fg-teal) !important;
  color: #fff !important;
  border-color: var(--fg-teal) !important;
}

/* ---------- Alerts / messages ---------- */
.alert-info {
  background: #eaf3f4 !important;
  color: var(--fg-teal) !important;
  border-color: var(--fg-teal) !important;
}
.alert-success {
  background: #fdf0ea !important;
  color: var(--fg-orange-2) !important;
  border-color: var(--fg-orange) !important;
}

/* ---------- Hide Beds24 branding ---------- */
a[href*="beds24.com"][target="_blank"],
.beds24-branding, .poweredBy, .b24-poweredBy,
img[src*="beds24-logo"], img[src*="powered_by"] {
  display: none !important;
}

/* ---------- Spacing / cleanup ---------- */
.shadow, .b2-shadow { box-shadow: none !important; }
fieldset {
  border: 1px solid var(--fg-border) !important;
  border-radius: 4px;
  padding: 12px 16px;
}
legend {
  color: var(--fg-teal) !important;
  padding: 0 6px;
  font-weight: 600;
  font-size: 14px;
  width: auto;
}

/* ---------- Mobile ---------- */
@media (max-width: 767px) {
  body { font-size: 14px !important; }
  .card-header { font-size: 15px !important; padding: 10px 14px !important; }
  .card-body   { padding: 12px 14px !important; }
  .btn, button, input[type="submit"] {
    width: 100%;
    padding: 11px 14px !important;
  }
  .calendar th, .calendar td { padding: 4px !important; font-size: 12px !important; }
}
```

## 2) Optional — strip "powered by Beds24" via Custom HTML

```html
<script>
(function () {
  function clean() {
    document.querySelectorAll(
      'a[href*="beds24.com"][target="_blank"], .poweredBy, .b24-poweredBy'
    ).forEach(function (el) { el.style.display = 'none'; });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', clean);
  } else {
    clean();
  }
  setTimeout(clean, 1500);
  setTimeout(clean, 4000);
})();
</script>
```

---

## What this changes (vs. the screenshot)

- Room title bars (`Double Room`, `Triple Room`, `Check in / out / Nights`)
  → teal `#2F555A` background with white text.
- Form inputs (date pickers, Quantity select) → cleaner border, teal focus ring.
- Calendar icons inside the date input → white-on-teal pill.
- "from JPY 13,167.00" prices → orange `#E8633A`, bold.
- All primary action buttons → orange `#E8633A`; secondary → teal.
- Date picker selected day → orange.
- Beds24 branding link/img → hidden.
- Body font → matches main site (Hiragino / Yu Gothic / Noto Sans JP / PingFang SC stack), so JP/EN/ZH all look consistent.

If anything still looks default after pasting, open DevTools on the booking
page, copy the actual class on that element, and add a rule using that class
— Beds24 occasionally adds a `b24-` prefix or a wrapping container.
