import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { CodeList } from '@/components/CodeList';
import { AdSlot } from '@/components/AdSlot';
import { AffiliateBar } from '@/components/AffiliateBar';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { RefreshPromise } from '@/components/RefreshPromise';
import { getGame, getGameSlugs } from '@/lib/games';
import { getLatestCodes, getExpiredCodes, getLastUpdated } from '@/lib/codes';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ game: string }>;
}

export function generateStaticParams() {
  return getGameSlugs().map((game) => ({ game }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  return buildMetadata({
    title: `${game.name} Codes (${new Date().getFullYear()}) — Working & Expired`,
    description: `${game.name} codes — every working code plus the full expired archive and step-by-step redeem guide. ${game.tagline}`,
    path: `/${game.slug}`,
    type: 'article',
    modifiedTime: getLastUpdated(game),
    keywords: [
      `${game.name} codes`,
      `${game.name} promo codes`,
      `${game.name} redeem codes`,
      `${game.platform} codes`,
    ],
  });
}

export default async function GamePage({ params }: PageProps) {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const latest = getLatestCodes(game);
  const expired = getExpiredCodes(game);
  const lastUpdated = getLastUpdated(game);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${game.name} Codes`,
    description: game.tagline,
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    mainEntityOfPage: absoluteUrl(`/${game.slug}`),
    about: {
      '@type': 'VideoGame',
      name: game.name,
      gamePlatform: game.platform,
      ...(game.developer ? { publisher: game.developer } : {}),
      ...(game.officialUrl ? { url: game.officialUrl } : {}),
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${game.name} Codes`,
        item: absoluteUrl(`/${game.slug}`),
      },
    ],
  };

  return (
    <Container className="space-y-8 py-8">
      <JsonLd id="ld-article" data={[articleLd, breadcrumbLd]} />
      <GameHeader game={game} active="" />
      <AuthorByline verifiedOn={lastUpdated} />

      <RefreshPromise gameName={game.name} />

      <AdSlot slot={`${game.slug}-overview-top`} />

      <section aria-labelledby="latest-heading">
        <div className="flex items-end justify-between">
          <h2
            id="latest-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Latest working {game.name} codes
          </h2>
          <Link
            href={`/${game.slug}/latest`}
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            View all →
          </Link>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {latest.length} working {latest.length === 1 ? 'code' : 'codes'},
          verified manually.
        </p>
        <div className="mt-4">
          <CodeList entries={latest.slice(0, 5)} variant="active" />
        </div>
      </section>

      <section aria-labelledby="about-heading">
        <h2
          id="about-heading"
          className="text-2xl font-bold text-slate-900"
        >
          About {game.name}
        </h2>
        <p className="mt-2 text-slate-700">{game.description}</p>
        <Link
          href={`/${game.slug}/redeem-guide`}
          className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline"
        >
          Read the full redeem guide →
        </Link>
      </section>

      <AffiliateBar game={game} />

      <AdSlot slot={`${game.slug}-overview-mid`} />

      <section aria-labelledby="expired-heading">
        <div className="flex items-end justify-between">
          <h2
            id="expired-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Recently expired
          </h2>
          <Link
            href={`/${game.slug}/expired`}
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            View archive →
          </Link>
        </div>
        <div className="mt-4">
          <CodeList
            entries={expired.slice(0, 3)}
            variant="expired"
            emptyMessage="No expired codes archived yet."
          />
        </div>
      </section>
    </Container>
  );
}
