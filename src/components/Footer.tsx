import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/lib/site';
import { getAllSummaries } from '@/lib/games';

export function Footer() {
  const games = getAllSummaries();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <Container className="py-10">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-base font-semibold text-slate-900">
            {siteConfig.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{siteConfig.description}</p>
          <p className="mt-3 text-xs text-slate-500">
            Questions? Email{' '}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-brand-700 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">All Game Codes</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {games.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/${g.slug}`}
                    className="text-slate-600 hover:text-brand-700"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Latest Codes</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {games.map((g) => (
                <li key={`latest-${g.slug}`}>
                  <Link
                    href={`/${g.slug}/latest`}
                    className="text-slate-600 hover:text-brand-700"
                  >
                    {g.name} latest
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Redeem Guides</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {games.map((g) => (
                <li key={`guide-${g.slug}`}>
                  <Link
                    href={`/${g.slug}/redeem-guide`}
                    className="text-slate-600 hover:text-brand-700"
                  >
                    How to redeem {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Site</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-brand-700"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 hover:text-brand-700"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-600 hover:text-brand-700"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-slate-200">
        <Container className="flex flex-col gap-1 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {year} {siteConfig.legalName}. All trademarks belong to
            their respective owners.
          </span>
          <span>
            Not affiliated with any game publisher.
          </span>
        </Container>
      </div>
    </footer>
  );
}
