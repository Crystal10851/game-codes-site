import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/lib/site';
import { getAllSummaries } from '@/lib/games';
import { MobileMenu } from './MobileMenu';

const PRIMARY_LINKS = [
  { href: '/blox-fruits', label: 'Codes hub' },
  { href: '/blox-fruits/tier-list', label: 'Tier list' },
  { href: '/blox-fruits/which-fruit', label: 'Fruit quiz' },
  { href: '/about', label: 'About' },
];

export function Nav() {
  const summaries = getAllSummaries();
  const liveCount = summaries.reduce((s, g) => s + g.activeCount, 0);

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

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {PRIMARY_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />
            {liveCount} live codes
          </span>
        </div>

        <MobileMenu links={PRIMARY_LINKS} />
      </Container>
    </header>
  );
}
