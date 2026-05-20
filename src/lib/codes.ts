import type { Game, GameCode } from './types';

export function getLatestCodes(game: Game, limit?: number): GameCode[] {
  const sorted = game.codes
    .filter((c) => c.status === 'active')
    .slice()
    .sort((a, b) => b.addedOn.localeCompare(a.addedOn));
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

export function getExpiredCodes(game: Game): GameCode[] {
  return game.codes
    .filter((c) => c.status === 'expired')
    .slice()
    .sort((a, b) =>
      (b.expiresOn ?? b.addedOn).localeCompare(a.expiresOn ?? a.addedOn),
    );
}

export function getLastUpdated(game: Game): string {
  const dates = game.codes.map((c) => c.addedOn);
  if (game.lastVerifiedOn) dates.push(game.lastVerifiedOn);
  dates.sort();
  return dates[dates.length - 1] ?? new Date().toISOString().slice(0, 10);
}

export function isRecentlyAdded(iso: string, withinDays = 7): boolean {
  const cutoffMs = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  const cutoffIso = new Date(cutoffMs).toISOString().slice(0, 10);
  return iso >= cutoffIso;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
