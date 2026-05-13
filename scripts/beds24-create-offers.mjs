#!/usr/bin/env node
/**
 * Add 3 new flat-rate offers (priceRules) to each room in Fujisan Garden Hotel.
 *
 * - 素泊・不可取消    parent × 0.9      non-refundable
 * - 朝食付プラン     parent + 4500     standard cancel
 * - 朝夕食付プラン   parent + 13500    standard cancel
 *
 * Uses SmartInn worker proxy (no local Beds24 token needed).
 *
 * Usage:
 *   node scripts/beds24-create-offers.mjs            # --dry-run by default
 *   node scripts/beds24-create-offers.mjs --commit   # actually POST
 */

import { readFileSync, writeFileSync } from 'node:fs';

const COMMIT = process.argv.includes('--commit');
const ONLY_MATCH = process.argv.find(a => a.startsWith('--only='));
const ONLY_ROOM = ONLY_MATCH ? Number(ONLY_MATCH.split('=')[1]) : null;
const PROXY = 'https://smartinn-api-proxy.leoroy225.workers.dev/beds24';
const PROPID = 323430;

// New offers to add. Same set per room.
const NEW_OFFERS = [
  {
    name: '素泊不可取消',
    priceFor: { type: 'maxCapacity' },
    extraPerson: 0,
    extraChild: 0,
    minimumStay: 0,
    maximumStay: 365,
    minDaysUntilCheckin: 0,
    maxDaysUntilCheckin: 999,
    color: '',
    priceLinking: {
      roomId: null,        // same room, set per-room at runtime
      priceId: 1,          // link to offer 1 (Room Only Base) within same room
      offsetAmount: 0,
      offsetMultiplier: 0.9,
    },
  },
  {
    name: '朝食付プラン',
    priceFor: { type: 'maxCapacity' },
    extraPerson: 0,
    extraChild: 0,
    minimumStay: 0,
    maximumStay: 365,
    minDaysUntilCheckin: 0,
    maxDaysUntilCheckin: 999,
    color: '',
    priceLinking: {
      roomId: null,
      priceId: 1,
      offsetAmount: 4500,
      offsetMultiplier: 1,
    },
  },
  {
    name: '1泊2食プラン',
    priceFor: { type: 'maxCapacity' },
    extraPerson: 0,
    extraChild: 0,
    minimumStay: 0,
    maximumStay: 365,
    minDaysUntilCheckin: 0,
    maxDaysUntilCheckin: 999,
    color: '',
    priceLinking: {
      roomId: null,
      priceId: 1,
      offsetAmount: 13500,
      offsetMultiplier: 1,
    },
  },
];

async function api(method, path, body) {
  const url = `${PROXY}${path}`;
  const opts = {
    method,
    headers: { accept: 'application/json' },
  };
  if (body !== undefined) {
    opts.headers['content-type'] = 'application/json';
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  let parsed; try { parsed = JSON.parse(text); } catch { parsed = text; }
  return { status: res.status, body: parsed };
}

console.error('▌ Step 1: fetching current property + rooms…');
const cur = await api('GET',
  `/proxy/properties?id=${PROPID}&includeAllRooms=true&includePriceRules=true&includeRoomOffers=true&includePropertyOffers=true`
);
if (cur.status !== 200 || !cur.body.data?.[0]) {
  console.error('ERROR fetching property:', cur.status, JSON.stringify(cur.body, null, 2).slice(0, 500));
  process.exit(1);
}
const property = cur.body.data[0];
const roomTypes = property.roomTypes ?? [];
console.error(`  property: ${property.name} (${property.id})`);
console.error(`  rooms: ${roomTypes.map(r => `${r.name}(${r.id})`).join(', ')}`);

// Beds24 has 16 priceRule slots per room. Named slots are used,
// unnamed ({id: N}) are empty. Fill first 3 empty slots with our new rules.
const plan = roomTypes.map(rt => {
  const allRules = (rt.priceRules ?? []).slice().sort((a, b) => a.id - b.id);
  const named = allRules.filter(r => r.name);
  const empties = allRules.filter(r => !r.name);
  const maxOffer = Math.max(0, ...named.map(r => Number(r.offer) || 0));
  const existingNames = new Set(named.map(r => r.name));

  // Find 3 first empty slot ids to occupy
  const slotsNeeded = NEW_OFFERS.filter(t => !existingNames.has(t.name)).length;
  const targetSlots = empties.slice(0, slotsNeeded).map(s => s.id);
  if (targetSlots.length < slotsNeeded) {
    console.error(`ERROR: Room ${rt.name} has no free priceRule slots (need ${slotsNeeded}, have ${targetSlots.length})`);
    process.exit(1);
  }

  // Build new rules placed at empty slot ids
  let nextOffer = maxOffer;
  const filledMap = new Map(); // slot id → new rule
  NEW_OFFERS.forEach((tpl, i) => {
    if (existingNames.has(tpl.name)) return;
    nextOffer++;
    const slot = targetSlots.shift();
    filledMap.set(slot, {
      ...tpl,
      id: slot,
      offer: nextOffer,
      priceLinking: { ...tpl.priceLinking },
    });
  });

  // Reconstruct full 16-slot array
  const fullRules = allRules.map(orig => {
    if (filledMap.has(orig.id)) return filledMap.get(orig.id);
    return orig;
  });
  const toAdd = [...filledMap.values()];

  return {
    roomId: rt.id,
    roomName: rt.name,
    namedCount: named.length,
    maxOffer,
    skip: toAdd.length === 0,
    toAdd,
    fullRules,
  };
});

console.error('\n▌ Step 2: plan');
for (const p of plan) {
  console.error(`\n  Room ${p.roomName} (${p.roomId})`);
  console.error(`    named priceRules: ${p.namedCount} / 16 slots`);
  if (p.skip) {
    console.error('    → SKIP (all 3 offers already exist)');
  } else {
    for (const r of p.toAdd) {
      const f = r.priceLinking;
      const formula = f.offsetMultiplier !== 1
        ? `parent × ${f.offsetMultiplier}${f.offsetAmount ? (f.offsetAmount > 0 ? ' + ' : ' − ') + Math.abs(f.offsetAmount) : ''}`
        : `parent + ${f.offsetAmount}`;
      console.error(`    + offer ${r.offer}: ${r.name}  (${r.priceFor.type}, ${formula})`);
    }
  }
}

if (!COMMIT) {
  console.error('\n▌ DRY RUN — to commit, add --commit flag.');
  console.error('First room POST payload preview:');
  const sample = plan.find(p => !p.skip);
  if (sample) {
    const payload = {
      id: PROPID,
      roomTypes: [
        {
          id: sample.roomId,
          priceRules: sample.fullRules,
        },
      ],
    };
    writeFileSync('/tmp/fuji-offers-preview.json', JSON.stringify(payload, null, 2));
    console.error('  saved to /tmp/fuji-offers-preview.json');
    console.error('  payload summary: roomTypes[0].priceRules has', sample.fullRules.length, 'rules');
  }
  process.exit(0);
}

console.error('\n▌ Step 3: COMMITTING…');
if (ONLY_ROOM) console.error(`  --only=${ONLY_ROOM} — will only POST that room`);
for (const p of plan) {
  if (p.skip) continue;
  if (ONLY_ROOM && p.roomId !== ONLY_ROOM) {
    console.error(`  (skipping ${p.roomName} — not the --only target)`);
    continue;
  }
  console.error(`\n  POST room ${p.roomName} (${p.roomId})…`);
  const payload = [
    {
      id: PROPID,
      roomTypes: [
        {
          id: p.roomId,
          priceRules: p.fullRules,
        },
      ],
    },
  ];
  const res = await api('POST', '/properties', payload);
  console.error(`    status ${res.status}`);
  console.error(`    body: ${JSON.stringify(res.body).slice(0, 1500)}`);
  if (res.status !== 200) {
    console.error('    ABORTING (do not continue if first room failed)');
    process.exit(1);
  } else {
    console.error('    ✓ http ok (check body for warnings)');
  }
  // Beds24 API: at most 1 request at a time; small delay
  await new Promise(r => setTimeout(r, 2000));
}

console.error('\n▌ Step 4: re-fetch + report new offer IDs');
const after = await api('GET',
  `/proxy/properties?id=${PROPID}&includeAllRooms=true&includePriceRules=true`
);
if (after.status === 200) {
  const summary = {};
  for (const rt of after.body.data[0].roomTypes) {
    summary[rt.name] = (rt.priceRules ?? [])
      .filter(r => ['素泊不可取消', '朝食付プラン', '1泊2食プラン'].includes(r.name))
      .map(r => ({ id: r.id, offer: r.offer, name: r.name }));
  }
  console.error(JSON.stringify(summary, null, 2));
  writeFileSync('/tmp/fuji-offers-after.json', JSON.stringify(after.body, null, 2));
  console.error('\n✓ done. Full response saved to /tmp/fuji-offers-after.json');
}
