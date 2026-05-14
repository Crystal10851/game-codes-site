import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/lib/site';
import { getAllSummaries } from '@/lib/games';
import { MobileMenu } from './MobileMenu';

export function Nav() {
  const games = getAllSummaries();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-brand-700"
        >
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-white shadow-sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="6" y1="12" x2="10" y2="12" />
              <line x1="8" y1="10" x2="8" y2="14" />
              <line x1="15" y1="13" x2="15.01" y2="13" />
              <line x1="18" y1="11" x2="18.01" y2="11" />
              <rect x="2" y="6" width="20" height="12" rx="3" />
            </svg>
          </span>
          <span>{siteConfig.shortName}</span>
        </Link>
        <nav
          aria-label="Games"
          className="hidden flex-wrap items-center gap-1 lg:flex"
        >
          {games.map((g) => (
            <Link
              key={g.slug}
              href={`/${g.slug}`}
              className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              {g.name}
            </Link>
          ))}
        </nav>
        <MobileMenu games={games} />
      </Container>
    </header>
  );
}
