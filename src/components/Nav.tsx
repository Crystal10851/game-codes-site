import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/lib/site';
import { getAllSummaries } from '@/lib/games';
import { MobileMenu } from './MobileMenu';

export function Nav() {
  const games = getAllSummaries();
  return (
    <header className="sticky top-0 z-30 border-b-2 border-slate-900 bg-white">
      <Container className="flex h-16 items-center justify-between gap-6">
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

        <nav
          aria-label="Games"
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
        >
          {games.map((g) => (
            <Link
              key={g.slug}
              href={`/${g.slug}`}
              className="rounded px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {g.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded border border-slate-300 text-slate-600 transition hover:border-brand-400 hover:text-brand-700 lg:inline-flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <MobileMenu games={games} />
        </div>
      </Container>
    </header>
  );
}
