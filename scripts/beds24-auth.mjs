#!/usr/bin/env node
/**
 * Beds24 V3 auth setup — exchange Invite Code → Access Token + Refresh Token.
 *
 * Beds24 V3 invite codes are single-use, short-lived. Run this ONCE.
 * Resulting refresh token is long-life and used to mint new access tokens.
 *
 * Usage: node scripts/beds24-auth.mjs
 * Reads:  BEDS24_INVITE_CODE from .env.beds24 (only used first time)
 * Writes: BEDS24_ACCESS_TOKEN, BEDS24_REFRESH_TOKEN, BEDS24_TOKEN_EXPIRES_AT
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const ENV_PATH = join(REPO_ROOT, '.env.beds24');
const API_BASE = 'https://api.beds24.com/v2';

function parseEnv(text) {
  const map = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) map[m[1]] = m[2];
  }
  return map;
}

function serializeEnv(map, originalText) {
  // Preserve comment lines + structure
  const lines = originalText.split('\n');
  const out = [];
  const seen = new Set();
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=/);
    if (m) {
      out.push(`${m[1]}=${map[m[1]] ?? ''}`);
      seen.add(m[1]);
    } else {
      out.push(line);
    }
  }
  for (const k of Object.keys(map)) {
    if (!seen.has(k)) out.push(`${k}=${map[k]}`);
  }
  return out.join('\n');
}

const original = readFileSync(ENV_PATH, 'utf8');
const env = parseEnv(original);

const refreshToken = env.BEDS24_REFRESH_TOKEN;
const inviteCode = env.BEDS24_INVITE_CODE;

async function exchangeInvite(code) {
  console.error('▌ Exchanging invite code for tokens…');
  const res = await fetch(API_BASE + '/authentication/setup', {
    method: 'GET',
    headers: {
      code: code,
      deviceName: 'fuji-garden-claude',
      accept: 'application/json',
    },
  });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) {
    console.error('ERROR:', res.status, JSON.stringify(body, null, 2));
    process.exit(1);
  }
  return body;
}

async function refreshAccess(refreshTok) {
  console.error('▌ Refreshing access token…');
  const res = await fetch(API_BASE + '/authentication/token', {
    method: 'GET',
    headers: {
      refreshToken: refreshTok,
      accept: 'application/json',
    },
  });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) {
    console.error('ERROR:', res.status, JSON.stringify(body, null, 2));
    process.exit(1);
  }
  return body;
}

let result;
if (refreshToken && refreshToken.length > 10) {
  result = await refreshAccess(refreshToken);
  env.BEDS24_ACCESS_TOKEN = result.token;
  if (result.expiresIn) {
    env.BEDS24_TOKEN_EXPIRES_AT = String(Date.now() + result.expiresIn * 1000);
  }
} else if (inviteCode && inviteCode.length > 10) {
  result = await exchangeInvite(inviteCode);
  env.BEDS24_ACCESS_TOKEN = result.token;
  env.BEDS24_REFRESH_TOKEN = result.refreshToken;
  if (result.expiresIn) {
    env.BEDS24_TOKEN_EXPIRES_AT = String(Date.now() + result.expiresIn * 1000);
  }
  // Clear used invite code (single-use)
  env.BEDS24_INVITE_CODE = '# used at ' + new Date().toISOString();
} else {
  console.error('ERROR: neither BEDS24_REFRESH_TOKEN nor BEDS24_INVITE_CODE set in .env.beds24');
  process.exit(1);
}

const newText = serializeEnv(env, original);
writeFileSync(ENV_PATH, newText, 'utf8');

console.error('✓ tokens saved to .env.beds24');
console.error('  access token expires in:', result.expiresIn ?? '?', 'seconds');
console.error('  full response:', JSON.stringify(result, (k, v) => (k === 'token' || k === 'refreshToken') ? `${String(v).slice(0, 8)}…` : v, 2));
