import Link from 'next/link';
import type { Game } from '@/lib/types';
import { getLastUpdated, formatDate, getLatestCodes, getExpiredCodes } from '@/lib/codes';

const BASE_TABS = [
  { href: '', label: 'Overview' },
  { href: '/latest', label: 'Latest' },
  { href: '/expired', label: 'Expired' },
  { href: '/redeem-guide', label: 'How to redeem' },
];

const EXTRA_TABS_BY_SLUG: Record<string, { href: string; label: string }[]> = {
  'blox-fruits': [
    { href: '/tier-list', label: 'Tier List' },
    { href: '/which-fruit', label: 'Which Fruit?' },
  ],
};

export function GameHeader({
  game,
  active,
}: {
  game: Game;
  active: '' | '/latest' | '/expired' | '/redeem-guide' | '/tier-list' | '/which-fruit';
}) {
  const lastUpdated = getLastUpdated(game);
  const activeCount = getLatestCodes(game).length;
  const expiredCount = getExpiredCodes(game).length;
  const tabs = [...BASE_TABS, ...(EXTRA_TABS_BY_SLUG[game.slug] ?? [])];
  const accent = game.color ?? '#1b3aa5';

  return (
    <section
      aria-label={`${game.name} navigation`}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div
        className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3 text-xs"
        style={{ background: `linear-gradient(90deg, ${accent}10 0%, transparent 100%)` }}
      >
        <Link
          href="/"
          className="flex items-center gap-1 font-bold text-slate-500 transition hover:text-slate-900"
        >
          <span aria-hidden>←</span> All games
        </Link>
        <span aria-hidden className="text-slate-300">/</span>
        <span className="flex items-center gap-1.5 font-bold text-slate-900">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full ring-2 ring-white"
            style={{ backgroundColor: accent }}
          />
          {game.name}
        </span>
        <span aria-hidden className="ml-auto inline-flex items-center gap-2 text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 ring-1 ring-emerald-200">
            <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" aria-hidden />
            {activeCount} live
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-bold text-slate-600">
            {expiredCount} archived
          </span>
          <span className="hidden sm:inline">Updated {formatDate(lastUpdated)}</span>
        </span>
      </div>

      <nav
        aria-label={`${game.name} sections`}
        className="flex overflow-x-auto"
      >
        {tabs.map((t) => {
          const href = `/${game.slug}${t.href}`;
          const isActive = t.href === active;
          return (
            <Link
              key={t.href}
              href={href}
              className={`relative flex-shrink-0 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
                isActive
                  ? 'border-current text-slate-900'
                  : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              style={isActive ? { color: accent, borderColor: accent } : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
