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
import { Screenshot } from '@/components/Screenshot';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { ProseSection, Paragraphs } from '@/components/Prose';
import { getGame, getGameSlugs } from '@/lib/games';
import { getLatestCodes, getExpiredCodes, getLastUpdated, formatDate } from '@/lib/codes';
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
    description: `${game.name} codes — every working code, the full expired archive, a step-by-step redeem guide with screenshots, and editorial commentary on the release cadence. ${game.tagline}`,
    path: `/${game.slug}`,
    type: 'article',
    modifiedTime: getLastUpdated(game),
    keywords: [
      `${game.name} codes`,
      `${game.name} promo codes`,
      `${game.name} redeem codes`,
      `${game.platform} codes`,
      `${game.name} codes ${new Date().getFullYear()}`,
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

      <section>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {game.name} Codes ({new Date().getFullYear()})
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {latest.length} active · {expired.length} archived · Editorially verified · Updated {formatDate(lastUpdated)}
        </p>
        <p className="mt-4 max-w-3xl text-slate-700 leading-relaxed">
          {game.tagline} This page is the single home for {game.name} codes —
          every code is verified against the live game before publishing, and
          dead codes are moved to the{' '}
          <Link
            href={`/${game.slug}/expired`}
            className="font-semibold text-brand-700 hover:underline"
          >
            archive
          </Link>{' '}
          within 24 hours of expiry. If you only need the working codes, jump
          straight to the{' '}
          <Link
            href={`/${game.slug}/latest`}
            className="font-semibold text-brand-700 hover:underline"
          >
            latest codes
          </Link>{' '}
          view.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/${game.slug}/latest`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            See all {latest.length} working codes →
          </Link>
          <Link
            href={`/${game.slug}/redeem-guide`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            How to redeem →
          </Link>
        </div>
      </section>

      {game.heroImage && (
        <Screenshot
          src={game.heroImage}
          alt={`${game.name} — gameplay screenshot`}
          caption={`${game.name} on ${game.platform}.`}
          priority
        />
      )}

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

      <ProseSection id="about-game" heading={`About ${game.name}`}>
        {game.longDescription ? (
          <Paragraphs text={game.longDescription} />
        ) : (
          <p>{game.description}</p>
        )}
      </ProseSection>

      {game.whatCodesDo && (
        <ProseSection id="what-codes-do" heading={`What do ${game.name} codes do?`}>
          <Paragraphs text={game.whatCodesDo} />
        </ProseSection>
      )}

      {game.videoId && (
        <section aria-labelledby="video-heading">
          <h2 id="video-heading" className="text-2xl font-bold text-slate-900">
            {game.videoTitle ?? `${game.name} codes — video walkthrough`}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Click play to watch in-page — the iframe only loads when you tap the thumbnail.
          </p>
          <div className="mt-4">
            <YouTubeEmbed
              videoId={game.videoId}
              title={game.videoTitle ?? `${game.name} codes walkthrough`}
            />
          </div>
        </section>
      )}

      {game.releaseCadence && (
        <ProseSection id="release-cadence" heading={`When are new ${game.name} codes released?`}>
          <Paragraphs text={game.releaseCadence} />
        </ProseSection>
      )}

      {game.slug === 'blox-fruits' && (
        <section aria-labelledby="tier-cta-heading">
          <Link
            href="/blox-fruits/tier-list"
            className="group block rounded-xl border-2 border-brand-200 bg-brand-50 p-5 transition hover:border-brand-400 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Editor's pick · Updated weekly
                </p>
                <h2
                  id="tier-cta-heading"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  Blox Fruits Tier List ({new Date().getFullYear()})
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  All 25 active fruits ranked across overall, PvP, and grinding
                  — with rationale, pros and cons, and best combos.
                </p>
              </div>
              <span className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:bg-brand-700">
                See the rankings →
              </span>
            </div>
          </Link>
        </section>
      )}

      <AffiliateBar game={game} />

      <AdSlot slot={`${game.slug}-overview-mid`} />

      {game.whereToFindMore && (
        <ProseSection id="more-codes" heading="Where to find more codes">
          <Paragraphs text={game.whereToFindMore} />
        </ProseSection>
      )}

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
        <p className="mt-1 text-sm text-slate-600">
          {expired.length} archived. The three most-recently expired codes are
          shown below; see the full archive for the complete history.
        </p>
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
