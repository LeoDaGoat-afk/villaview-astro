# Beds24 Field Manual

A practical English handbook to Beds24 — built from production experience operating
Villa VIEW (322452, Okinawa), Fujisan Garden Hotel (323430, Yamanashi), and
International Resort Hotel Yurakujo (327656, Chiba) on the V2 API.

Sources:
- Beds24 V2 API responses observed in production
- Behavior we confirmed empirically (price rules, calendar, channels, booking
  lifecycle, webhooks)
- Quirks and gotchas we hit so you don't have to

This is **not** an exhaustive reference — it covers what actually matters when
running a property on Beds24 with API + custom-branded booking pages.

---

## Contents

1. [Account model](#account-model)
2. [Property → Room → Offer hierarchy](#property--room--offer-hierarchy)
3. [Pricing model](#pricing-model)
4. [Inventory & availability](#inventory--availability)
5. [Booking lifecycle](#booking-lifecycle)
6. [Channel Manager](#channel-manager)
7. [Booking Page (booking2.php) & embed JS](#booking-page-booking2php--embed-js)
8. [V2 API reference (the endpoints we actually use)](#v2-api-reference)
9. [Webhooks](#webhooks)
10. [Quirks & gotchas](#quirks--gotchas)

---

## Account model

```
Beds24 Account (= a Beds24 customer login)
  └─ Property 1 (e.g. propid 322452 — Villa VIEW)
  └─ Property 2 (e.g. propid 327656 — Yurakujo)
       └─ Room 1 (roomId, e.g. 679929)
            └─ priceRules (offers)
       └─ Room 2
       └─ ...
```

- **One account can hold many properties.** Single API token (refresh + access)
  spans the account, so multi-property apps use one set of credentials.
- **propId vs id:** the same property is exposed under both keys. `id` is the
  number, `propId` is sometimes a string in older responses. Always coerce.
- **ownerId:** appears on properties and bookings. Stable per account.
- **API access:** invite a developer account from Account → API → "Create
  Invite Code." Use that code to mint a refresh token via
  `POST /v2/authentication/setup`. Store refresh token, use it to mint
  short-lived access tokens via `POST /v2/authentication/token`.

### Identifier / key reference

Beds24's UI and API use several different identifiers that look similar.
Don't confuse them:

| Identifier | What it is | Where to find | Used for |
|---|---|---|---|
| **propId** (`id`) | Property numeric ID (6 digits) | URL bar in admin, `propid=322452` | API calls, public URLs (`booking2.php?propid=`) |
| **roomId** | Room type numeric ID (6 digits) | Admin → Rooms → Edit URL | API calls referencing a room |
| **bookId** (`id`) | Single booking ID (8 digits) | Booking detail page | API update / cancel |
| **ownerId** | Account owner numeric ID | On every API response object | Multi-account scoping |
| **accessToken** | Short-lived bearer (24h) | Minted via `/authentication/token` | API `token:` header |
| **refreshToken** | Long-lived secret (no expiry) | Minted via `/authentication/setup` | Mint new access tokens |
| **propKey** (= `beds24propKey`) | Per-property API key (V1 legacy) | Admin → Account → Account Access → per-property key | See below |
| **authKey** | Account-wide master key (V1 legacy) | Admin → Account → Account Access | V1 endpoints |
| **genericKey** | Wildcard key for cross-property V1 calls | Admin → Account → Account Access | V1 endpoints |
| **inviteCode** | One-shot string to mint a refreshToken | Account → API → Create Invite Code | `/authentication/setup` only |

### What is `propKey` (`beds24propKey`)?

`propKey` is a **per-property API key** that survives from Beds24's V1 API era.
It is a fixed string per property, configured in:

```
Admin → Account → Account Access → [Property] → Property Key
```

**When you need it:**
- **V1 API calls** — V1 endpoints (e.g. `/api/json/getBookings`) authenticate
  via `propKey` (plus `authKey` or `genericKey` for cross-property scope) instead
  of OAuth tokens. We DO NOT use V1 in our codebase; everything is V2.
- **iCal export URLs** — the iCal feeds Beds24 generates embed `propKey` in the URL.
- **Webhook signature scheme (optional)** — some accounts pass `propKey` as a
  shared secret in the webhook URL to verify Beds24 is the sender.
- **Some legacy widget embeds** — `<script src="...?propKey=...">` style snippets
  Beds24's admin sometimes hands you.

**When you DON'T need it:**
- All V2 REST API calls (the ones documented later in this manual)
- The Property Booking Page Developer scripts (`<BODY> top` etc.)
- Channel Manager configuration

**Security note:** treat `propKey` like a password. With it, anyone can call
V1 endpoints against that property without rate-limit or audit. If it leaks,
rotate it in Admin → Account → Account Access → Generate New.

**Our stack uses tokens, not propKey.** Don't bring propKey into V2 code paths
— it won't work as a V2 authentication credential. The `token:` header on V2
expects an access token from `/v2/authentication/token`, nothing else.

---

## Property → Room → Offer hierarchy

### Property fields you'll touch

| Field | Where set | Notes |
|---|---|---|
| `name` | admin → Properties → Description | Public-facing |
| `address`/`city`/`country`/`postcode` | same | Required for Google Hotel / VR |
| `latitude`/`longitude` | same | Used for map display |
| `currency` | admin → Properties → Description | Cannot change once bookings exist |
| `propTypeId` | admin → Properties → Description | 28 = villa, 1 = hotel, etc. |

### Room fields

| Field | Source of truth |
|---|---|
| `qty` | Number of physical units of this room type (1 for villa, N for hotel) |
| `maxPeople`/`maxAdult`/`maxChildren` | Hard caps for bookings |
| `minPrice` | Floor price (fallback when no calendar entry) |
| `rackRate` | Headline display price (not enforced) |
| `unitNames` | Per-unit nicknames (e.g. "Room A", "Room B") |

### Offers (= priceRules)

A **room can have up to 16 offers**, each a `priceRule` slot. An offer is the
booking-time choice the guest makes — typically **meal plans**:

```
Slot 1 → "Room only" (素泊)
Slot 2 → "With breakfast" (朝食付)
Slot 3 → "Half board" (朝夕食付)
Slot 4..16 → unused or specials
```

Each priceRule has:
- `id` (slot number, 1-16)
- `offer` (offer category number 1-16; can repeat across slots — multiple
  priceRules can target the same offer to handle different occupancies)
- `name` (≤ 20 bytes UTF-8! Longer names are silently truncated)
- `priceFor.type`: `"maxCapacity"` | `"perPerson"` | `"upToPerson"`
- `priceFor.upToPersonValue`: 1..16 (only when type=upToPerson; **≥ 3 is silently
  skipped by the booking resolver — see Quirks**)
- `extraPerson` / `extraChild`: linear per-pax surcharges
- `minimumStay` / `maximumStay` (nights)
- `minDaysUntilCheckin` / `maxDaysUntilCheckin` (advance-booking window)
- `priceLinking`:
  - `roomId` (link to another room as price source — for shared inventory)
  - `priceId` (which slot in source room)
  - `offsetAmount` (flat upcharge)
  - `offsetMultiplier` (multiply linked price)

### Final per-guest-night price formula

```
displayed_price = (linked_price × offsetMultiplier + offsetAmount)
```

`linked_price` is read from the source room's calendar `price1`. If `priceLinking`
isn't set, the room's own `price1` is used.

---

## Pricing model

### Calendar storage

Beds24's `inventory/rooms/calendar` is the master per-day data table:

```json
{
  "from": "2026-06-15",
  "to":   "2026-06-15",
  "numAvail": 1,
  "price":   52250        // master daily rate
}
```

Important:
- **Only `price` is writable via the calendar API.** The API will silently reject
  `price2`, `price3`, etc. with warning "price2 not available".
- For multi-offer rooms, **the per-offer price is computed at booking time** from
  `price` + the offer's `priceLinking.offsetAmount` / `offsetMultiplier`.
- `numAvail` IS writable. Use 0 to block dates.
- The calendar API **returns empty array for past dates.** Always fetch with
  startDate ≥ today.

### Channel-specific prices (admin only)

In `admin → Prices → Daily Prices` you'll see multiple rows per room:

```
マスター価格   (master)       ¥45,000   ← what calendar API returns
airbnb         ¥45,000  (= master × 1.00)
booking        ¥54,000  (= master × 1.20  → adds 20% OTA commission cushion)
officialsite   ¥42,750  (= master × 0.95  → 5% direct-booking discount)
vrbo           ¥54,000
```

These multipliers are configured per-channel in **Channel Manager → [channel] →
Price Multiplier**. The API does NOT return per-channel prices — only the master.
If you need the official-site rate for a custom landing page, **apply the
multiplier in your frontend code** (cache it as a constant).

### Price strategy gotcha

`bookingRules.dailyPriceStrategy` controls how multiple matching priceRules
compete:

- `allowLower` (default) — minimum wins
- `doNotAllowLower` — maximum wins
- `doNotAllowAnyOther` — only the base rule applies, ignore others

If you have one rule for 1-pax single supplement and another for 2-pax
per-person, `allowLower` may pick the wrong one. See Quirks.

---

## Inventory & availability

### Daily fields

| Field | Writable? | Meaning |
|---|---|---|
| `numAvail` | Yes | How many units available (0 = blocked, qty = fully open) |
| `bookable` | Read mostly | Channel-level visibility flag |
| `price` | Yes (only price1) | Master per-night rate |
| `price2`–`price16` | **No via API** | Set in admin "Daily Prices" only |
| `minStay`/`maxStay` | Yes | Per-day stay restrictions |
| `linkedNumAvail` | Read | For shared-inventory rooms |
| `override` | Yes | Forces calendar to override channel-set values |

### Blocking dates

To make a date unbookable across all channels:

```http
POST /v2/inventory/rooms/calendar
[{
  "roomId": 674526,
  "calendar": [{"from":"2026-12-25","to":"2026-12-26","numAvail":0}]
}]
```

Channel managers may take 1-2 min to propagate the block to OTAs.

---

## Booking lifecycle

### Statuses

| Status | When | Notes |
|---|---|---|
| `new` | Default for manual API creation | Hotel reviews & confirms |
| `request` | OTA pending acceptance | Manual approval needed |
| `confirmed` | Paid/accepted | Active reservation |
| `cancelled` | Cancelled by guest/hotel | Terminal |
| `black` | Manual block | Used for maintenance, owner stays |

### Creating a booking (the field names that actually work)

`POST /v2/bookings` with `[{...}]` array of objects. **Critical field rules
we learned the hard way:**

```json
[{
  "propertyId": 322452,
  "roomId":     674526,
  "status":     "new",                  // "confirmed" causes auto-cancel on some property setups
  "firstNight": "2026-06-15",           // ISO YYYY-MM-DD with dashes! "20260615" is rejected
  "lastNight":  "2026-06-16",           // = checkout day MINUS 1 (last night actually slept)
  "guestFirstName": "Taro",             // V1 field name; "firstName" alone is silently dropped
  "guestName":      "Yamada",           // = last name (V1 name; "lastName" silently dropped)
  "guestEmail":     "taro@example.com",
  "guestPhone":     "+8190xxxxxxxx",
  "numAdult":   2,
  "numChild":   0,
  "price":      85500,
  "referer":    "Manual"                // Beds24 OVERWRITES this to "setBooking JSON"
}]
```

- **Do NOT send `arrival`/`departure`** — they trigger "dates not valid" error.
- **Use `guestFirstName` / `guestName`** for name fields. `firstName`/`lastName`
  at top level appear to write but Beds24 stores them in the wrong place.
- **Updating an existing booking** uses `bookId` (NOT `id`):
  ```json
  [{"bookId": 87124416, "status": "cancelled"}]
  ```

### Response shape

V2 returns HTTP 200 even when the inner operation fails:

```json
{
  "ok": true,
  "data": [{
    "status": 200,
    "ok": false,
    "data": {"error": "dates not valid", "errorCode": 6005}
  }]
}
```

Check `data[0].ok` and `data[0].data.error`, not just the HTTP status.

### Auto-cancel trap

Some properties have **"Auto-cancel API bookings"** enabled (Booking Rules or
Stripe-payment-required rule). Bookings created via setBooking JSON come back
with the **same `bookingTime` as `cancelTime`** (cancelled in the same second).

Symptoms:
- Booking IS created (returns `bookId`)
- Status reads `cancelled` immediately
- `referer` is locked to "setBooking JSON" — can't change it to bypass

Fix: in admin, find "Auto-action" or "Booking Rules → Auto-cancel" and disable
for direct API bookings.

---

## Channel Manager

### Channel taxonomy

Beds24 separates **OTA channels** (data sync) from **booking pages** (landing
URLs). Most channels do both.

| Channel | Beds24 product type | Typical landing URL |
|---|---|---|
| Booking.com | OTA (XML push) | OTA-side iframe |
| Airbnb | OTA (API) | airbnb.com |
| **Google for Vacations Rentals (List Property)** | metasearch | `beds24.com/booking.php?...&referer=googlehpa` |
| **Google Hotel Ads** | metasearch | `beds24.com/booking2.php?...` |
| Expedia | OTA | OTA-side |
| Direct (official site) | n/a | `beds24.com/booking2.php?propid=X` or your custom domain |

### Hotel Ads vs Vacation Rentals

A critical product distinction:

- **Google Hotel Ads** → requires multi-room "hotel" property. Lands on
  `booking2.php`. Supports custom embed scripts (Body Top JS).
- **Google for Vacations Rentals (List Property)** → for single-unit villas /
  vacation rentals. Lands on `booking.php` (legacy single-property page).
  **Also supports the Body Top JS injection** (confirmed empirically — both
  page types load the script tag).

The two are mutually exclusive per property; pick based on what your property
actually is. Individuals (民宿) cannot apply for Hotel Ads.

### Channel multipliers

In each channel config there's a `Price Multiplier` (e.g. 1.20). The channel
gets `master_price × multiplier`. Common patterns:

| Channel | Multiplier rationale |
|---|---|
| Booking.com | 1.18-1.20 to absorb their 15-18% commission |
| Airbnb | 1.00 (Airbnb host fee absorbed differently) |
| officialsite | 0.95-1.00 (direct booking discount) |

The multiplier is configured in admin only — not exposed via API. Hard-code in
your frontend if you need to display official-site prices.

### Channel mapping

In `Channels → [channel] → Mapping`, each OTA listing/room must be linked to a
Beds24 roomId. Mismatched mappings cause:
- Bookings landing on the wrong room
- Calendar inventory not syncing

Always re-verify mapping after a Channel Manager reconnect (especially Airbnb).

---

## Booking Page (booking2.php) & embed JS

### Two page templates

- **booking2.php** — modern multi-room booking page. Default.
- **booking.php** — legacy single-property page (Google VR uses this).

Both load the same Property Booking Page Developer scripts:
- `<HEAD> bottom` — meta tags, SEO
- `<BODY> top` — runs before any content (best for full DOM rewrite)
- `<BODY> bottom` — runs after Beds24's UI (good for patching)
- `Custom CSS` — capped at ~2000 chars (use `<link>` injection via JS instead)

### URL params we use

```
propid          property id (required)
roomid          pre-select a specific room
sr1-{roomId}=1  pre-select 1 quantity of that room
singleroom=1    force single-room flow (skips room cards screen)
checkin         YYYYMMDD (compressed, no dashes — opposite of API!)
numnight        number of nights
numadult        adults count
numchild        children count (only set if > 0)
numroom         1
lang            ja|en|zh|zh-Hant|ko|th|fr|de|es|ar
priceId         (silently ignored — see Quirks)
notes           guest notes (passed through to booking)
referer         marketing source tracking
apisource       channel API code (58 = Google VR)
```

### Flow

```
booking2.php?propid=X            ← step 1: room cards (skipped with sr1)
booking2.php?...&sr1-...=1       ← step 2: guest info form
booking2.php?...&br1-X=Book      ← step 3: payment/confirm (also pattern for checkout step)
booking2.php?...&bookid=N        ← step 4: confirmation
```

The step you're on can be detected from URL params (useful for hiding/showing
your custom UI conditionally).

### Branding override

To rebrand the Beds24 booking page:

1. Deploy a JS file to your CDN (e.g. `https://villaokinawa.com/embed/beds24-body-top.js`)
2. In Beds24 admin → Booking Engine → Property Booking Page → Developer →
   `<BODY> top`, paste: `<script src="https://villaokinawa.com/embed/beds24-body-top.js" defer></script>`
3. Your script injects DOM at body-top, with CSS to hide Beds24 native elements.

The same script runs on both booking.php and booking2.php, so a single
deployment covers Google VR landings AND direct site iframe.

To hide Beds24's "Powered by" links and default branding, target:
```css
#powered, .powered, .poweredby, [class*="powered"],
a[href*="beds24.com"][class*="powered"] { display: none !important; }
```

---

## V2 API reference

Base URL: `https://api.beds24.com/v2`. All requests need a valid access token in
the `token` header.

### Authentication

#### `POST /v2/authentication/setup`
Mint a refresh token from an invite code.

```http
POST /v2/authentication/setup
{ "inviteCode": "abc123..." }
```

→ `{"token": "REFRESH_TOKEN", "expiresIn": null}`

Store the refresh token in KV / secret manager. It doesn't expire.

#### `POST /v2/authentication/token`
Mint a short-lived access token from refresh.

```http
POST /v2/authentication/token
{ "refreshToken": "..." }
```

→ `{"token": "ACCESS_TOKEN", "expiresIn": 86400}` (24h)

Cache the access token until ~5 min before expiry, then refresh.

### Properties

#### `GET /v2/properties?id={propId}&includeAllRooms=true&includePriceRules=true`
Fetch property + room types + priceRules.

Useful `include*` params:
- `includeAllRooms=true` — include inactive rooms
- `includePriceRules=true` — include the 16 priceRule slots per room
- `includeBookingRules=true` — strategy & cancel rules (some accounts don't return this)
- `includePictures=true` — image URLs
- `includeOffers=true` — booking-time offer definitions (when distinct from rules)

#### `POST /v2/properties`
Update property + rooms + priceRules.

Critical pattern for priceRules: **always POST all 16 slots**. Partial arrays
silently fail to register new offers. Build the full array, supply an empty
placeholder for unused slots:

```json
{
  "id": 1, "name": "", "offer": 0,
  "priceFor": {"type": "perPerson"},
  "extraPerson": 0, "extraChild": 0,
  "minimumStay": 0, "maximumStay": 365,
  "minDaysUntilCheckin": 0, "maxDaysUntilCheckin": 999,
  "color": "",
  "priceLinking": {"roomId": null, "priceId": null, "offsetAmount": 0, "offsetMultiplier": 1}
}
```

### Inventory / Calendar

#### `GET /v2/inventory/rooms/calendar`
Per-day calendar read.

Query: `?roomId={N}&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&includePrices=true&includeNumAvail=true`

**Without `includePrices=true`, the response returns no price data even if it exists.**
You must explicitly ask for what you want included.

Response is run-length encoded (consecutive same-value days collapse into one
entry with from/to). Expand client-side:

```js
entries.forEach(e => {
  const from = new Date(e.from + 'T12:00:00');
  const to   = new Date(e.to   + 'T12:00:00');
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    map[ymd(d)] = e;
  }
});
```

**Past dates return empty.** Always start from max(yourStart, today).

#### `POST /v2/inventory/rooms/calendar`
Per-day calendar write.

```json
[{
  "roomId": 674526,
  "calendar": [
    {"from":"2026-10-01","to":"2026-12-31","numAvail":0},
    {"from":"2027-01-01","to":"2027-01-03","price":98000}
  ]
}]
```

Only `price` (= price1), `numAvail`, `bookable`, `minStay`, `maxStay`, `override`
are writable. `price2`-`price16` are rejected.

#### `GET /v2/inventory/fixedPrices`
Per-offer "Daily Prices" overrides set in admin.

Returns empty if no fixed-price overrides exist. The data here is **read-only
in practice** — writes silently drop the `offerId` field, so all entries
collapse onto `offerId: 1`.

#### `GET /v2/inventory/rooms/offers`
Booking-time available offers for given dates+occupancy.

Query: `?propertyId={N}&arrival=YYYY-MM-DD&numNights=2&numAdult=2`

Returns the same offer cards a guest sees on booking2.php. Use this for
sanity-checking "what would a guest actually see" without scraping the HTML.

### Bookings

#### `GET /v2/bookings?propertyId={N}`
List bookings.

Useful query params:
- `propertyId` — filter by property
- `bookingId` — single booking by id
- `arrivalFrom` / `arrivalTo` — filter by checkin date range
- `status=new&status=confirmed&status=cancelled` — repeat to OR multiple
- `modifiedFrom=YYYY-MM-DD` — incremental sync

#### `POST /v2/bookings`
Create or update bookings (array). See [Booking lifecycle](#booking-lifecycle)
for field semantics.

For update, **use `bookId` (not `id`)** as the primary key.

### Channels (limited)

Most channel config is admin-only. The V2 API exposes:

#### `POST /v2/channels/stripe/refundCharge`
Refund a Stripe charge tied to a booking.

```json
{ "bookId": 87124416, "amount": 50000, "reason": "guest cancellation" }
```

Channel-specific endpoints (`/v2/channels/google`, `/v2/channels/booking`)
return 404 — they don't exist in V2.

### Bot

#### `GET /v2/bot`
Misc utility endpoint we sometimes use for diagnostics. Not documented anywhere
useful.

---

## Webhooks

Beds24 can push booking events to a webhook URL. Configure in
`admin → Account → Booking Notifications → Webhook URL`.

### Payload

POST with JSON body containing the booking object (same shape as GET response).
Includes `propertyId`, `bookId`, `status`, all guest fields, etc.

### Verification

There's **no built-in signature**. Use a custom `X-Webhook-Secret` header — set
it in admin's webhook URL like:

```
https://your-domain.com/api/webhooks/beds24?secret=XXX
```

Then verify the secret query param server-side. Or set a custom HTTP header in
admin (some plans support this).

### Event triggers

- New booking (status = new/confirmed)
- Cancellation (status = cancelled)
- Modification (any field change)
- Payment events

Beds24 retries on 5xx but **not** on 4xx — return 200 even when you can't
process, then log and retry async.

---

## Quirks & gotchas

A running list, in rough order of how much pain each caused us:

### setBooking: field name minefield
- Top-level `firstName`/`lastName` are silently ignored — use `guestFirstName`/`guestName`.
- Top-level `arrival`/`departure` cause "dates not valid" — use `firstNight`/`lastNight`.
- `id` is ignored on update — use `bookId`.
- Date format **with dashes** (`2026-06-15`). `20260615` is rejected.

### Auto-cancel of API bookings
Some property setups auto-cancel bookings with `referer: "setBooking JSON"`
(the value Beds24 forcibly stamps on V2-created bookings). Look for
"Auto-action" rules in admin if every API booking comes back cancelled.

### priceRule upToPersonValue ≥ 3 silently skipped
The booking resolver ignores priceRules with `upToPersonValue: 3` or higher,
even with proper room maxAdult ≥ 3. Workaround: use `upToPerson upTo=2 +
extraPerson > 0` to express 3-pax pricing (slot 2 extends to 3-pax via
`extraPerson`).

### priceRule perPerson outranks upToPerson
If both exist for the same `offer`, perPerson wins for 1-pax bookings. This
means you can't combine (1-pax single supplement) + (2+ pax per-pax linear)
in one offer.

### Multi-dimensional pricing impossible
Beds24 V3 cannot natively encode all three of: (a) 1-pax single supplement,
(b) 2-pax/3-pax linear per-pax, (c) day-tier variation, **simultaneously**.
Pick two. Document the trade-off before committing to a structure.

### fixedPrices writes drop `offerId`
All aliases (`offer`, `priceId`, `priceRuleId`, `priceSlot`, `slotId`, etc.)
silently drop — every entry ends up `offerId: 1`. Multi-offer per-day overrides
must be set in admin UI, not via API.

### priceRule.name 20-byte limit
UTF-8 byte length, not character. Japanese chars are 3 bytes each (~6 chars max).
Longer names are truncated or rejected without warning.

### priceFor.type enum strict
Accepted: `"maxCapacity"`, `"perPerson"`, `"upToPerson"`.
Rejected silently: `"upToPerson"` (camelCase variation), `"firstPlusExtra"`,
`"perRoom"`, `"flat"`. The wrong values produce no error but silently fall back
to defaults.

### POST /properties always 16 slots
Partial priceRules arrays return `success: true` with no warning, but new
offers fail to register on the booking page. Always GET the full set, merge
your changes, POST all 16.

### dailyPriceStrategy enum strict
`allowLower` (default), `doNotAllowLower`, `doNotAllowAnyOther`. Other values
including `allowHigher`, `overrideAll` are rejected.

### DELETE on fixedPrices returns 500
"Could not process request." Workaround: rename to `OBSOLETE_*` and move
firstNight/lastNight to a far-past date like `2020-01-01` to neutralize.

### Calendar API returns empty for past dates
Always fetch `startDate = max(yourStart, today)`. The API will return `success:
true, calendar: []` for any past date range, which is easy to mistake for
"this property has no data."

### Calendar response is run-length encoded
Consecutive identical days collapse into a single `{from, to, ...}` entry.
Iterate inclusively from from→to to build a per-day map.

### `includePrices=true` required for price fields
Without it, calendar response omits price even when it exists. Same for
`includeNumAvail`, `includeMinStay`, etc.

### `booking2.php?priceId=N` silently ignored
The page always renders offer 1 first regardless. To deep-link to a specific
offer, use `sr1-{roomId}={qty}` form-state params, not `priceId`.

### Channel landing URL not customizable via API
The URL Beds24 publishes to Google/Booking is determined by the channel product
choice in admin. You cannot override to a custom landing page domain via API.

### V2 returns HTTP 200 on inner failures
Check `data[0].ok` and `data[0].data.error`. The HTTP status alone is
insufficient.

### Cloudflare/Beds24 rate limits
Hammering the V2 API trips Cloudflare's WAF (error code 1027 = IP ban) AND
Beds24's per-account limit. Add a Cloudflare Cache layer in your worker
(10-min TTL on calendar) to deflect 99% of repeat traffic.

### Currency cannot change once bookings exist
Plan the property's currency at setup. Migration requires Beds24 support.

### `referer` field always overwritten
Whatever you send is replaced with `"setBooking JSON"` when creating via V2.
Use a custom field (`custom1` etc.) for marketing source tracking instead.

---

## See also

In this repo:
- `villa-view-astro/public/embed/beds24-body-top.js` — production embed JS
- `fuji-garden/scripts/beds24-sync-prices.mjs` — daily price push
- `fuji-garden/scripts/beds24-fix-rules-full16.mjs` — full-16-slot priceRule POST
- `international-resort-hotel-yurakujo/docs/beds24-pricing-rules-v2.md` — priceRule contract
- `international-resort-hotel-yurakujo/scripts/lib/annex-tier-parent-b.mjs` — seasonal A-H tier mapping

External:
- Official wiki: https://wiki.beds24.com
- V2 API Swagger: https://api.beds24.com/v2/docs/
