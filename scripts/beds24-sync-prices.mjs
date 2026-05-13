#!/usr/bin/env node
/**
 * Sync Beds24 priceRules + calendar prices for Fujisan Garden Hotel
 * with the card UI pricing model.
 *
 * Phase 1: Update offer priceRules
 *   - offer 2 "素泊"        keep ×0.9, 3-day window (existing, no change)
 *   - offer 3 "朝食付"      keep +¥3,000 (2-adult baseline)
 *   - offer 4 "朝夕食付"    update offset 9000 → 12000 (new ¥6,000/adult × 2)
 *   - enable: "no" → "always" for offers 2 / 3 / 4
 *
 * Phase 2: Set calendar prices for offer 1 (Room Only Base)
 *   - Weekday (Sun–Thu) baseline:
 *       ダブル/ツイン ¥10,800,  トリプル ¥13,500
 *   - Weekend (Fri–Sat) × 1.20:
 *       ダブル/ツイン ¥12,960,  トリプル ¥16,200
 *   - Push next 90 days
 *
 * Usage:
 *   node scripts/beds24-sync-prices.mjs            # --dry-run (default)
 *   node scripts/beds24-sync-prices.mjs --commit   # actually write
 *
 * The script is reversible — keep a snapshot of prior state in /tmp/.
 */

import { writeFileSync } from 'node:fs';

const COMMIT = process.argv.includes('--commit');
const PROXY = 'https://smartinn-api-proxy.leoroy225.workers.dev/beds24';
const PROPID = 323430;
const DAYS = 90;

const ROOM_BASE = {
  672188: { name: 'Double',  weekday: 10800 },
  672259: { name: 'Twin',    weekday: 10800 },
  672258: { name: 'Triple',  weekday: 13500 },
};
const WEEKEND_MULT = 1.20;

async function api(method, path, body) {
  const opts = { method, headers: { accept: 'application/json' } };
  if (body !== undefined) {
    opts.headers['content-type'] = 'application/json';
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const res = await fetch(`${PROXY}${path}`, opts);
  const text = await res.text();
  let parsed; try { parsed = JSON.parse(text); } catch { parsed = text; }
  return { status: res.status, body: parsed };
}

function isWeekend(date) {
  const w = date.getUTCDay();
  return w === 5 || w === 6; // Fri / Sat (UTC = Japan calendar day match)
}

function priceForDate(date, weekday) {
  return isWeekend(date) ? Math.round(weekday * WEEKEND_MULT) : weekday;
}

function dateRange(days) {
  const out = [];
  // Anchor at UTC midnight today so day-of-week math is timezone-independent
  const now = new Date();
  const startUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (let i = 0; i < days; i++) {
    const d = new Date(startUTC + i * 86400000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// ───────────────────────────── Phase 1: priceRules ─────────────────────────────
console.error('▌ Phase 1: fetch current priceRules + offers');
const cur = await api('GET',
  `/proxy/properties?id=${PROPID}&includeAllRooms=true&includePriceRules=true&includeOffers=true`
);
if (cur.status !== 200 || !cur.body.data?.[0]) {
  console.error('ERROR fetching property:', cur.status, JSON.stringify(cur.body).slice(0, 500));
  process.exit(1);
}
writeFileSync('/tmp/beds24-before.json', JSON.stringify(cur.body, null, 2));
console.error('  saved current state to /tmp/beds24-before.json');

const property = cur.body.data[0];
const phase1Plans = [];

for (const rt of property.roomTypes) {
  const allRules = (rt.priceRules ?? []).slice().sort((a, b) => a.id - b.id);
  const allOffers = (rt.offers ?? []).slice();

  // Identify the rules by name
  const rule2 = allRules.find(r => r.name === '素泊');       // offer 2
  const rule3 = allRules.find(r => r.name === '朝食付');     // offer 3
  const rule4 = allRules.find(r => r.name === '朝夕食付');   // offer 4

  if (!rule2 || !rule3 || !rule4) {
    console.error(`ERROR: room ${rt.name} missing one of 素泊 / 朝食付 / 朝夕食付 priceRules`);
    process.exit(1);
  }

  // Update offer 4 priceLinking offsetAmount: 9000 → 12000
  const updatedRules = allRules.map(r => {
    if (r.id === rule4.id) {
      return {
        ...r,
        priceLinking: {
          ...(r.priceLinking || {}),
          offsetAmount: 12000,
          offsetMultiplier: 1,
        },
      };
    }
    return r;
  });

  // Offers: enable 2, 3, 4
  const updatedOffers = allOffers.map(o => {
    if (o.offerId === 2 || o.offerId === 3 || o.offerId === 4) {
      return { ...o, enable: 'always' };
    }
    return o;
  });

  phase1Plans.push({
    roomId: rt.id,
    roomName: rt.name,
    rules: updatedRules,
    offers: updatedOffers,
  });
}

console.error('\n▌ Phase 1 plan:');
for (const p of phase1Plans) {
  console.error(`  Room ${p.roomName} (${p.roomId}):`);
  console.error(`    - enable offers 2 (素泊), 3 (朝食付), 4 (朝夕食付)`);
  console.error(`    - offer 4 (朝夕食付) offset: 9000 → 12000`);
}

// ───────────────────────────── Phase 2: calendar prices ─────────────────────────────
console.error('\n▌ Phase 2: build 90-day calendar prices for offer 1 (Room Only Base)');
const dates = dateRange(DAYS);
const phase2Plan = [];
for (const roomId of Object.keys(ROOM_BASE)) {
  const cfg = ROOM_BASE[roomId];
  for (const dStr of dates) {
    const d = new Date(dStr);
    const price = priceForDate(d, cfg.weekday);
    phase2Plan.push({
      roomId: Number(roomId),
      date: dStr,
      price1: price,
    });
  }
}
console.error(`  total entries: ${phase2Plan.length} (${Object.keys(ROOM_BASE).length} rooms × ${DAYS} days)`);
console.error(`  sample:`);
console.error(`    ${ROOM_BASE[672188].name}  ${dates[0]}  ¥${priceForDate(new Date(dates[0]), 10800)}`);
console.error(`    ${ROOM_BASE[672188].name}  ${dates[3]}  ¥${priceForDate(new Date(dates[3]), 10800)}`);
console.error(`    ${ROOM_BASE[672258].name}  ${dates[0]}  ¥${priceForDate(new Date(dates[0]), 13500)}`);

if (!COMMIT) {
  console.error('\n▌ DRY RUN — add --commit to write.');
  writeFileSync('/tmp/beds24-phase1-preview.json', JSON.stringify(phase1Plans, null, 2));
  writeFileSync('/tmp/beds24-phase2-preview.json', JSON.stringify(phase2Plan, null, 2));
  console.error('  previews saved to /tmp/beds24-phase{1,2}-preview.json');
  process.exit(0);
}

// ───────────────────────────── EXECUTE Phase 1 ─────────────────────────────
console.error('\n▌ EXECUTE Phase 1: POST /properties priceRules + offers');
for (const p of phase1Plans) {
  console.error(`\n  POST room ${p.roomName} (${p.roomId})…`);
  const payload = [{
    id: PROPID,
    roomTypes: [{
      id: p.roomId,
      priceRules: p.rules,
      offers: p.offers,
    }],
  }];
  const res = await api('POST', '/proxy/properties', payload);
  console.error(`    status ${res.status}`);
  if (res.status !== 200 && res.status !== 201) {
    console.error(`    body: ${JSON.stringify(res.body).slice(0, 1200)}`);
    console.error('    ABORTING.');
    process.exit(1);
  }
  console.error(`    ✓ ok`);
  await new Promise(r => setTimeout(r, 1500));
}

// ───────────────────────────── EXECUTE Phase 2 ─────────────────────────────
console.error('\n▌ EXECUTE Phase 2: POST /inventory/rooms/calendar (per room)');
// Beds24 V2 endpoint: POST /inventory/rooms/calendar
// Body: [{ roomId, calendar: [{ from, to, price1 }, ...] }]
// Group phase2Plan by room and send 1 request per room.
const byRoom = {};
for (const p of phase2Plan) {
  if (!byRoom[p.roomId]) byRoom[p.roomId] = [];
  byRoom[p.roomId].push({ from: p.date, to: p.date, price1: p.price1 });
}
for (const roomId of Object.keys(byRoom)) {
  const cal = byRoom[roomId];
  console.error(`  POST room ${ROOM_BASE[roomId].name} (${roomId}) — ${cal.length} daily entries…`);
  const payload = [{ roomId: Number(roomId), calendar: cal }];
  const res = await api('POST', '/proxy/inventory/rooms/calendar', payload);
  console.error(`    status ${res.status}`);
  if (res.status !== 200 && res.status !== 201) {
    console.error(`    body: ${JSON.stringify(res.body).slice(0, 1500)}`);
    console.error('    ABORTING.');
    process.exit(1);
  }
  console.error(`    ✓ ok`);
  await new Promise(r => setTimeout(r, 1500));
}

console.error('\n✓ All done. Verifying…');
const verify = await api('GET',
  `/proxy/inventory/rooms/offers?propertyId=${PROPID}&arrival=${dates[0]}&departure=${dates[1]}&numAdults=2`
);
console.error(JSON.stringify(verify.body, null, 2));
