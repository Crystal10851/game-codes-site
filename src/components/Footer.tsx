import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/lib/site';

export function Footer() {
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
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Blox Fruits</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href="/blox-fruits" className="text-slate-400 hover:text-white">Codes hub</Link></li>
                <li><Link href="/blox-fruits/tier-list" className="text-slate-400 hover:text-white">Tier list</Link></li>
                <li><Link href="/blox-fruits/which-fruit" className="text-slate-400 hover:text-white">Fruit Decision Helper</Link></li>
                <li><Link href="/blox-fruits#redeem-heading" className="text-slate-400 hover:text-white">How to redeem</Link></li>
                <li><Link href="/blox-fruits#expired-heading" className="text-slate-400 hover:text-white">Expired codes archive</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Site</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href="/about" className="text-slate-400 hover:text-white">About</Link></li>
                <li><Link href="/editors/ben-yu" className="text-slate-400 hover:text-white">Editor — Ben Yu</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-white">Privacy policy</Link></li>
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
