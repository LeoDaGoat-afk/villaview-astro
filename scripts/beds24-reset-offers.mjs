#!/usr/bin/env node
/**
 * Reset all priceRules (except id=1 Room Only Base) and recreate 3 clean offers:
 *   id=2  素泊       (maxCapacity, linked id=1 × 0.9)
 *   id=3  朝食付     (maxCapacity, linked id=1 + 3000)
 *   id=4  朝夕食付   (maxCapacity, linked id=1 + 9000)
 *
 * Default --dry-run. Add --commit to actually POST.
 */

const COMMIT = process.argv.includes('--commit');
const ONLY_MATCH = process.argv.find(a => a.startsWith('--only='));
const ONLY_ROOM = ONLY_MATCH ? Number(ONLY_MATCH.split('=')[1]) : null;
const PROXY = 'https://smartinn-api-proxy.leoroy225.workers.dev/beds24';
const PROPID = 323430;
const ROOMS = [672188, 672258, 672259];

// Final desired priceRules at slots 2/3/4. id=1 left untouched.
const TARGET_RULES = [
  {
    id: 2,
    name: '素泊',
    offer: 2,
    priceFor: { type: 'maxCapacity' },
    extraPerson: 0,
    extraChild: 0,
    minimumStay: 0,
    maximumStay: 365,
    minDaysUntilCheckin: 0,
    maxDaysUntilCheckin: 999,
    color: '',
    priceLinking: { roomId: null, priceId: 1, offsetAmount: 0, offsetMultiplier: 0.9 },
  },
  {
    id: 3,
    name: '朝食付',
    offer: 3,
    priceFor: { type: 'maxCapacity' },
    extraPerson: 0,
    extraChild: 0,
    minimumStay: 0,
    maximumStay: 365,
    minDaysUntilCheckin: 0,
    maxDaysUntilCheckin: 999,
    color: '',
    priceLinking: { roomId: null, priceId: 1, offsetAmount: 3000, offsetMultiplier: 1 },
  },
  {
    id: 4,
    name: '朝夕食付',
    offer: 4,
    priceFor: { type: 'maxCapacity' },
    extraPerson: 0,
    extraChild: 0,
    minimumStay: 0,
    maximumStay: 365,
    minDaysUntilCheckin: 0,
    maxDaysUntilCheckin: 999,
    color: '',
    priceLinking: { roomId: null, priceId: 1, offsetAmount: 9000, offsetMultiplier: 1 },
  },
];

// Reset slots 5..16 to empty placeholders.
const EMPTY_SLOTS = [];
for (let i = 5; i <= 16; i++) {
  EMPTY_SLOTS.push({ id: i, name: '', offer: 0 });
}

async function api(method, path, body) {
  const res = await fetch(PROXY + path, {
    method,
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await res.text();
  let p; try { p = JSON.parse(t); } catch { p = t; }
  return { status: res.status, body: p };
}

console.error('▌ Plan (per room):');
console.error('  Keep id=1 (Room Only Base) untouched');
console.error('  Set  id=2 素泊      = base × 0.9');
console.error('  Set  id=3 朝食付    = base + 3000');
console.error('  Set  id=4 朝夕食付  = base + 9000');
console.error('  Clear id=5..16 (set name="")');
console.error('');

if (!COMMIT) {
  console.error('DRY RUN — add --commit to actually POST.');
  console.error('  payload preview saved to /tmp/fuji-reset-preview.json');
  const { writeFileSync } = await import('node:fs');
  writeFileSync('/tmp/fuji-reset-preview.json', JSON.stringify(
    [{ id: PROPID, roomTypes: [{ id: ROOMS[0], priceRules: [...TARGET_RULES, ...EMPTY_SLOTS] }] }],
    null, 2
  ));
  process.exit(0);
}

console.error('▌ COMMITTING…');
if (ONLY_ROOM) console.error(`  --only=${ONLY_ROOM}`);

for (const rid of ROOMS) {
  if (ONLY_ROOM && rid !== ONLY_ROOM) {
    console.error(`  skip ${rid}`);
    continue;
  }
  const payload = [{
    id: PROPID,
    roomTypes: [{
      id: rid,
      priceRules: [...TARGET_RULES, ...EMPTY_SLOTS],
    }],
  }];
  console.error(`\n  POST room ${rid}…`);
  const r = await api('POST', '/properties', payload);
  console.error(`    status ${r.status}`);
  console.error(`    body: ${JSON.stringify(r.body).slice(0, 600)}`);
  if (r.status !== 200) {
    console.error('    ABORT.');
    process.exit(1);
  }
  await new Promise(x => setTimeout(x, 2000));
}

console.error('\n▌ verify:');
const g = await api('GET', `/proxy/properties?id=${PROPID}&includeAllRooms=true&includePriceRules=true`);
for (const rt of g.body.data[0].roomTypes) {
  const named = (rt.priceRules ?? []).filter(r => r.name);
  console.error(`  ${rt.name} (${rt.id}): ${named.map(r => `id=${r.id} ${r.name}`).join(' | ')}`);
}
