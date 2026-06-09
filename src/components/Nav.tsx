import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/lib/site';
import { getAllSummaries, getAllGames } from '@/lib/games';
import { MobileMenu } from './MobileMenu';

export function Nav() {
  const summaries = getAllSummaries();
  const games = getAllGames();
  const colorBySlug = Object.fromEntries(games.map((g) => [g.slug, g.color ?? '#1b3aa5']));

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center"
          aria-label={`${siteConfig.shortName} home`}
        >
          <span className="flex items-center gap-2 rounded-md border-2 border-slate-900 bg-white px-2.5 py-1 transition group-hover:bg-slate-900">
            <span
              aria-hidden
              className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-brand-600 text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <line x1="6" y1="12" x2="10" y2="12" />
                <line x1="8" y1="10" x2="8" y2="14" />
                <line x1="15" y1="13" x2="15.01" y2="13" />
                <line x1="18" y1="11" x2="18.01" y2="11" />
              </svg>
            </span>
            <span className="text-base font-black uppercase tracking-tight text-slate-900 transition group-hover:text-white">
              {siteConfig.shortName}
            </span>
          </span>
        </Link>

        <div className="hidden flex-1 max-w-md lg:block">
          <label className="relative block">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search a game (e.g. Blox Fruits)"
              aria-label="Search games"
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />
            {summaries.reduce((s, g) => s + g.activeCount, 0)} live codes
          </span>
        </div>

        <MobileMenu games={summaries} />
      </Container>

      <nav
        aria-label="Games"
        className="hidden border-t border-slate-200 bg-white lg:block"
      >
        <Container>
          <ul className="flex items-stretch gap-0">
            {summaries.map((g) => {
              const accent = colorBySlug[g.slug] ?? '#1b3aa5';
              return (
                <li key={g.slug} className="flex-1">
                  <Link
                    href={`/${g.slug}`}
                    className="group relative flex h-full items-center justify-center gap-2 border-b-2 border-transparent px-3 py-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-700 transition hover:border-b-current hover:text-slate-900"
                    style={{ color: undefined }}
                  >
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: accent }}
                      aria-hidden
                    />
                    <span className="truncate">{g.name}</span>
                    <span
                      aria-hidden
                      className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 transition group-hover:bg-slate-200"
                    >
                      {g.activeCount}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
