import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/lib/site';
import { getAllSummaries } from '@/lib/games';

export function Footer() {
  const games = getAllSummaries();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t-2 border-slate-900 bg-slate-900 text-slate-300">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_3fr]">
          <div>
            <div className="flex items-center gap-2 rounded-md border-2 border-white bg-slate-900 px-2.5 py-1 w-fit">
              <span aria-hidden className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-brand-500 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <line x1="6" y1="12" x2="10" y2="12" />
                  <line x1="8" y1="10" x2="8" y2="14" />
                  <line x1="15" y1="13" x2="15.01" y2="13" />
                  <line x1="18" y1="11" x2="18.01" y2="11" />
                </svg>
              </span>
              <span className="text-base font-black uppercase tracking-tight text-white">
                {siteConfig.shortName}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Questions, code reports, or tip-offs? Email{' '}
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-300 hover:underline">
                {siteConfig.contactEmail}
              </a>
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { label: 'X', path: 'M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.5 3a4.5 4.5 0 00-4.41 5.5A12.83 12.83 0 013 4s-4 9 5 13a13.94 13.94 0 01-8 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z M9.75 15.02V8.48l5.75 3.27-5.75 3.27z' },
                { label: 'Discord', path: 'M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z' },
                { label: 'RSS', path: 'M4 11a9 9 0 019 9 M4 4a16 16 0 0116 16 M5 19a1 1 0 100-2 1 1 0 000 2z' },
              ].map((s) => (
                <span
                  key={s.label}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400"
                  title={`${s.label} (coming soon)`}
                >
                  <svg viewBox="0 0 24 24" fill={s.label === 'YouTube' || s.label === 'Discord' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d={s.path} />
                  </svg>
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">All codes</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {games.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/${g.slug}`} className="text-slate-400 hover:text-white">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Redeem guides</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {games.map((g) => (
                  <li key={`guide-${g.slug}`}>
                    <Link href={`/${g.slug}/redeem-guide`} className="text-slate-400 hover:text-white">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Site</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href="/about" className="text-slate-400 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-white">Privacy policy</Link></li>
                <li><Link href="/blox-fruits/tier-list" className="text-slate-400 hover:text-white">Blox Fruits tier list</Link></li>
                <li><Link href="/blox-fruits/which-fruit" className="text-slate-400 hover:text-white">Fruit Decision Helper</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-slate-800 bg-slate-950">
        <Container className="flex flex-col gap-1 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {year} {siteConfig.legalName}. All trademarks belong to their respective owners.
          </span>
          <span>Not affiliated with any game publisher. Editorially independent.</span>
        </Container>
      </div>
    </footer>
  );
}
