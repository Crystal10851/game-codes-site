import Link from 'next/link';
import { Container } from './Container';
import { siteConfig } from '@/lib/site';
import { getAllSummaries } from '@/lib/games';

export function Footer() {
  const games = getAllSummaries();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
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
        <div>
          <h2 className="text-base font-semibold text-slate-900">Games</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {games.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/${g.slug}`}
                  className="text-slate-600 hover:text-brand-700"
                >
                  {g.name} codes
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Site</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              <Link href="/about" className="hover:text-brand-700">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-700">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-700">
                Privacy Policy
              </Link>
            </li>
          </ul>
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
