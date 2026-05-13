#!/usr/bin/env node
/**
 * Beds24 V3 API discovery for Fujisan Garden Hotel (propid 323430).
 *
 * Usage:
 *   1. Get Long Life Token from Beds24 → Settings → Account → API
 *      (permissions: read:properties, read:rooms, write:priceRules)
 *   2. echo 'BEDS24_TOKEN=xxx' > .env.beds24
 *   3. node scripts/beds24-discover.mjs > discovery.json
 *
 * Output: property details, all rooms, existing price rules — used to
 * confirm field shape before running beds24-create-offers.mjs.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const PROPID = 323430;
const API_BASE = 'https://beds24.com/api/v3';

function loadToken() {
  try {
    const env = readFileSync(join(REPO_ROOT, '.env.beds24'), 'utf8');
    const match = env.match(/^BEDS24_TOKEN=(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  if (process.env.BEDS24_TOKEN) return process.env.BEDS24_TOKEN;
  console.error('ERROR: BEDS24_TOKEN not found.');
  console.error('Create .env.beds24 with: BEDS24_TOKEN=your_long_life_token');
  process.exit(1);
}

const TOKEN = loadToken();

async function api(path, opts = {}) {
  const url = API_BASE + path;
  const res = await fetch(url, {
    ...opts,
    headers: {
      token: TOKEN,
      accept: 'application/json',
      'content-type': 'application/json',
      ...(opts.headers ?? {}),
    },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) {
    return { __error: true, status: res.status, body };
  }
  return body;
}

const out = {
  meta: {
    propid: PROPID,
    timestamp: new Date().toISOString(),
    api_base: API_BASE,
  },
  property: null,
  rooms: null,
  priceRules: null,
  cancellationPolicies: null,
  errors: [],
};

console.error('▌ Fetching property…');
out.property = await api(`/properties?id=${PROPID}&includeOffers=true&includePriceRules=true`);
if (out.property.__error) out.errors.push({ at: 'property', ...out.property });

console.error('▌ Fetching rooms…');
out.rooms = await api(`/properties/${PROPID}/rooms?includePrices=true&includeOffers=true`);
if (out.rooms.__error) out.errors.push({ at: 'rooms', ...out.rooms });

console.error('▌ Fetching priceRules…');
out.priceRules = await api(`/priceRules?propertyId=${PROPID}`);
if (out.priceRules.__error) out.errors.push({ at: 'priceRules', ...out.priceRules });

console.error('▌ Fetching cancellation policies…');
out.cancellationPolicies = await api(`/properties/${PROPID}/policies`);
if (out.cancellationPolicies.__error) out.errors.push({ at: 'policies', ...out.cancellationPolicies });

console.log(JSON.stringify(out, null, 2));
console.error(`✓ done. errors: ${out.errors.length}`);
if (out.errors.length) {
  console.error('first error:', JSON.stringify(out.errors[0], null, 2));
}
