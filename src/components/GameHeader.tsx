import Link from 'next/link';
import type { Game } from '@/lib/types';
import { getLastUpdated, formatDate } from '@/lib/codes';

const BASE_TABS = [
  { href: '', label: 'Overview' },
  { href: '/latest', label: 'Latest Codes' },
  { href: '/expired', label: 'Expired Codes' },
  { href: '/redeem-guide', label: 'Redeem Guide' },
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
  const tabs = [...BASE_TABS, ...(EXTRA_TABS_BY_SLUG[game.slug] ?? [])];
  return (
    <section
      className="rounded-xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-6"
      style={game.color ? { borderColor: game.color + '33' } : undefined}
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
        {game.platform}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
        {game.name} Codes
      </h1>
      <p className="mt-2 max-w-2xl text-slate-700">{game.tagline}</p>
      <p className="mt-2 text-xs text-slate-500">
        Last updated {formatDate(lastUpdated)}
      </p>
      <nav
        aria-label={`${game.name} sections`}
        className="mt-5 flex flex-wrap gap-2"
      >
        {tabs.map((t) => {
          const href = `/${game.slug}${t.href}`;
          const isActive = t.href === active;
          return (
            <Link
              key={t.href}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-brand-50 hover:text-brand-700'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
