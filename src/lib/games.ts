import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { Game, GameSummary } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'games');

let cache: Map<string, Game> | null = null;

function loadAll(): Map<string, Game> {
  if (cache) return cache;
  const map = new Map<string, Game>();
  if (!fs.existsSync(DATA_DIR)) {
    cache = map;
    return map;
  }
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
    const game = JSON.parse(raw) as Game;
    map.set(game.slug, game);
  }
  cache = map;
  return map;
}

export function getAllGames(): Game[] {
  return Array.from(loadAll().values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getGameSlugs(): string[] {
  return Array.from(loadAll().keys());
}

export function getGame(slug: string): Game | null {
  return loadAll().get(slug) ?? null;
}

export function getGameSummary(game: Game): GameSummary {
  const active = game.codes.filter((c) => c.status === 'active');
  const expired = game.codes.filter((c) => c.status === 'expired');
  const lastUpdated = game.codes
    .map((c) => c.addedOn)
    .sort()
    .reverse()[0] ?? new Date().toISOString().slice(0, 10);
  return {
    slug: game.slug,
    name: game.name,
    tagline: game.tagline,
    platform: game.platform,
    activeCount: active.length,
    expiredCount: expired.length,
    lastUpdated,
  };
}

export function getAllSummaries(): GameSummary[] {
  return getAllGames().map(getGameSummary);
}
