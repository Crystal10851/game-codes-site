import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { getAllGames, getGameSummary } from '@/lib/games';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Working game codes, updated daily`,
  description: siteConfig.description,
  path: '/',
  keywords: ['game codes', 'free codes', 'redeem codes', 'working codes'],
});

export default function HomePage() {
  const games = getAllGames();
  const summaries = games.map(getGameSummary);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: summaries.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/${g.slug}`),
      name: `${g.name} codes`,
    })),
  };

  return (
    <Container className="py-10">
      <JsonLd id="ld-home" data={itemListLd} />
      <section className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Working game codes,{' '}
          <span className="text-brand-600">updated daily</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 sm:mx-0">
          {siteConfig.description}
        </p>
      </section>

      <AdSlot slot="home-top" className="mb-8" />

      <section aria-labelledby="games-heading">
        <h2 id="games-heading" className="text-2xl font-bold text-slate-900">
          Browse games
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/${g.slug}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {g.platform}
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {g.name} Codes
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {g.tagline}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">
                    {g.activeCount} working
                  </span>{' '}
                  · {g.expiredCount} expired
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-xl bg-slate-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">How this site works</h2>
        <p className="mt-2 text-slate-700">
          Every code listed here is verified by hand before being published.
          When a code stops working we move it to the Expired Codes page so the
          working list stays accurate. Each game has its own redeem guide so
          you never have to search for instructions.
        </p>
      </section>
    </Container>
  );
}
