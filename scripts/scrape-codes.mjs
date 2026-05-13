#!/usr/bin/env node
/**
 * Scrape recent tweets from configured X (Twitter) handles, extract candidate
 * redeem codes, and append them to the relevant data/games/<slug>.json files
 * for review. Designed to be run by a GitHub Action that opens a draft PR
 * when files change.
 *
 * Required env:
 *   X_BEARER_TOKEN   App-only bearer token (X API v2).
 *
 * No-op behaviour:
 *   - Token missing  → log + exit 0 (lets CI run on forks without secrets)
 *   - Rate limited   → log + exit 0 (prevents noisy PR churn)
 *   - No new codes   → no file writes
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCES_FILE = path.join(ROOT, 'data', 'sources', 'index.json');
const CACHE_FILE = path.join(ROOT, '.cache', 'x-user-ids.json');
const GAMES_DIR = path.join(ROOT, 'data', 'games');
const TODAY = new Date().toISOString().slice(0, 10);
const BEARER = process.env.X_BEARER_TOKEN;

const TRIGGER_RE = /\b(code|codes|redeem|promo)\b/i;
const CODE_RE = /\b[A-Z0-9][A-Z0-9_]{3,19}\b/g;
const BLOCKLIST = new Set([
  'CODE', 'CODES', 'REDEEM', 'PROMO', 'PROMOS', 'BLOX', 'BLOXFRUITS',
  'GENSHIN', 'IMPACT', 'HOYOVERSE', 'HONKAI', 'STARRAIL',
  'NEW', 'USE', 'GIFT', 'FREE', 'XP', 'HP', 'AND', 'THE', 'FOR',
  'ROBLOX', 'TWITTER', 'HTTPS', 'HTTP', 'URL', 'YOUTUBE', 'YOUTU',
  'OUT', 'IGN', 'API', 'APP', 'RT', 'DM', 'FYI', 'TBA', 'TBD', 'FAQ',
]);

function log(...a) { console.log('[scrape]', ...a); }

async function readJson(p, fallback = null) {
  try { return JSON.parse(await fs.readFile(p, 'utf8')); }
  catch { return fallback; }
}

async function writeJson(p, data) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function xFetch(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${BEARER}` },
  });
  if (res.status === 429) {
    log('Rate limited (HTTP 429) — exiting cleanly.');
    process.exit(0);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`X API ${res.status}: ${text.slice(0, 400)}`);
  }
  return res.json();
}

async function resolveUserId(handle, cache) {
  if (cache[handle]) return cache[handle];
  const json = await xFetch(
    `https://api.twitter.com/2/users/by/username/${encodeURIComponent(handle)}`,
  );
  const id = json?.data?.id;
  if (!id) throw new Error(`No user id resolved for @${handle}`);
  cache[handle] = id;
  return id;
}

async function recentTweets(userId, max = 10) {
  const json = await xFetch(
    `https://api.twitter.com/2/users/${userId}/tweets` +
      `?max_results=${max}&tweet.fields=created_at&exclude=retweets,replies`,
  );
  return json?.data ?? [];
}

function extractCandidates(text) {
  if (!TRIGGER_RE.test(text)) return [];
  const found = new Set();
  for (const m of text.match(CODE_RE) ?? []) {
    if (BLOCKLIST.has(m)) continue;
    // Require either a digit or a long uppercase run (avoids common words).
    if (!/\d/.test(m) && !/[A-Z]{5,}/.test(m)) continue;
    found.add(m);
  }
  return [...found];
}

async function main() {
  if (!BEARER) {
    log('X_BEARER_TOKEN not set — skipping scrape (no-op).');
    return;
  }

  const sources = await readJson(SOURCES_FILE);
  if (!sources) {
    log(`No sources at ${SOURCES_FILE} — exiting.`);
    return;
  }

  const cache = (await readJson(CACHE_FILE)) ?? {};
  let totalAdded = 0;

  for (const [slug, cfg] of Object.entries(sources)) {
    const handles = cfg.handles ?? [];
    if (handles.length === 0) continue;

    const gamePath = path.join(GAMES_DIR, `${slug}.json`);
    const game = await readJson(gamePath);
    if (!game) {
      log(`Skipping ${slug} — missing ${gamePath}`);
      continue;
    }
    const known = new Set(game.codes.map((c) => c.code.toUpperCase()));
    let added = 0;

    for (const handle of handles) {
      log(`@${handle} → ${slug}`);
      try {
        const id = await resolveUserId(handle, cache);
        const tweets = await recentTweets(id, cfg.tweetLookback ?? 10);
        for (const t of tweets) {
          const text = t.text ?? '';
          const cands = extractCandidates(text);
          if (cands.length === 0) continue;
          const url = `https://x.com/${handle}/status/${t.id}`;
          for (const code of cands) {
            const key = code.toUpperCase();
            if (known.has(key)) continue;
            game.codes.unshift({
              code,
              reward: 'TBD — please verify in tweet',
              addedOn: TODAY,
              expiresOn: null,
              status: 'active',
              notes: `Auto-detected from @${handle}: ${url}`,
            });
            known.add(key);
            added++;
            log(`  + ${code}`);
          }
        }
      } catch (err) {
        log(`  error on @${handle}:`, err.message);
      }
    }

    if (added > 0) {
      await writeJson(gamePath, game);
      totalAdded += added;
    }
  }

  await writeJson(CACHE_FILE, cache);
  log(`Done. ${totalAdded} candidate code(s) appended for review.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
