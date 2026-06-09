import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { GameHero } from '@/components/GameHero';
import { CodeList } from '@/components/CodeList';
import { AdSlot } from '@/components/AdSlot';
import { AffiliateBar } from '@/components/AffiliateBar';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { RefreshPromise } from '@/components/RefreshPromise';
import { Screenshot } from '@/components/Screenshot';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { Paragraphs } from '@/components/Prose';
import { StatHero, buildCodeStats } from '@/components/StatHero';
import { SectionHeading } from '@/components/SectionHeading';
import { RewardBreakdown } from '@/components/RewardBreakdown';
import { RelatedGames } from '@/components/RelatedGames';
import { getGame, getGameSlugs } from '@/lib/games';
import { getLatestCodes, getExpiredCodes, getLastUpdated, isRecentlyAdded } from '@/lib/codes';
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
  const freshCount = latest.filter((c) => isRecentlyAdded(c.addedOn)).length;
  const activeRewards = latest.map((c) => c.reward);

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

      <GameHero
        game={game}
        activeCount={latest.length}
        lastUpdated={lastUpdated}
        primaryCta={{ href: `/${game.slug}/latest`, label: `See ${latest.length} working codes` }}
        secondaryCta={{ href: `/${game.slug}/redeem-guide`, label: 'How to redeem' }}
        eyebrow={`${new Date().getFullYear()} codes`}
      />

      <AuthorByline verifiedOn={lastUpdated} />

      <StatHero
        tiles={buildCodeStats({
          activeCount: latest.length,
          expiredCount: expired.length,
          lastUpdated,
          freshCount,
        })}
      />

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
        <SectionHeading
          id="latest-heading"
          icon="list"
          subtitle={`${latest.length} working ${latest.length === 1 ? 'code' : 'codes'}, verified manually.`}
        >
          Latest working {game.name} codes
        </SectionHeading>
        <div className="mt-4">
          <CodeList entries={latest.slice(0, 5)} variant="active" />
        </div>
        <div className="mt-3 text-right">
          <Link
            href={`/${game.slug}/latest`}
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            View all {latest.length} active codes →
          </Link>
        </div>
      </section>

      {activeRewards.length > 0 && (
        <RewardBreakdown rewards={activeRewards} />
      )}

      <section aria-labelledby="about-game">
        <SectionHeading id="about-game" icon="info">
          About {game.name}
        </SectionHeading>
        <div className="prose prose-slate mt-3 max-w-none text-slate-700 leading-relaxed [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-brand-700 hover:[&_a]:underline">
          {game.longDescription ? (
            <Paragraphs text={game.longDescription} />
          ) : (
            <p>{game.description}</p>
          )}
        </div>
      </section>

      {game.whatCodesDo && (
        <section aria-labelledby="what-codes-do">
          <SectionHeading id="what-codes-do" icon="reward">
            What do {game.name} codes do?
          </SectionHeading>
          <div className="prose prose-slate mt-3 max-w-none text-slate-700 leading-relaxed [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-brand-700 hover:[&_a]:underline">
            <Paragraphs text={game.whatCodesDo} />
          </div>
        </section>
      )}

      {game.videoId && (
        <section aria-labelledby="video-heading">
          <SectionHeading
            id="video-heading"
            icon="video"
            subtitle="Click play to watch in-page — the iframe only loads when you tap the thumbnail."
          >
            {game.videoTitle ?? `${game.name} codes — video walkthrough`}
          </SectionHeading>
          <div className="mt-4">
            <YouTubeEmbed
              videoId={game.videoId}
              title={game.videoTitle ?? `${game.name} codes walkthrough`}
            />
          </div>
        </section>
      )}

      {game.releaseCadence && (
        <section aria-labelledby="release-cadence">
          <SectionHeading id="release-cadence" icon="calendar">
            When are new {game.name} codes released?
          </SectionHeading>
          <div className="prose prose-slate mt-3 max-w-none text-slate-700 leading-relaxed [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-brand-700 hover:[&_a]:underline">
            <Paragraphs text={game.releaseCadence} />
          </div>
        </section>
      )}

      {game.slug === 'blox-fruits' && (
        <section aria-labelledby="tier-cta-heading">
          <Link
            href="/blox-fruits/tier-list"
            className="group block rounded-xl border-l-4 border-brand-500 border-y border-r border-y-brand-100 border-r-brand-100 bg-brand-50 p-5 transition hover:bg-brand-100"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
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
              <span className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:bg-brand-700">
                See the rankings →
              </span>
            </div>
          </Link>
        </section>
      )}

      <AffiliateBar game={game} />

      <AdSlot slot={`${game.slug}-overview-mid`} />

      {game.whereToFindMore && (
        <section aria-labelledby="more-codes">
          <SectionHeading id="more-codes" icon="compass">
            Where to find more codes
          </SectionHeading>
          <div className="prose prose-slate mt-3 max-w-none text-slate-700 leading-relaxed [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-brand-700 hover:[&_a]:underline">
            <Paragraphs text={game.whereToFindMore} />
          </div>
        </section>
      )}

      <section aria-labelledby="expired-heading">
        <SectionHeading
          id="expired-heading"
          icon="archive"
          subtitle={`${expired.length} archived. The three most-recently expired codes are shown below; see the full archive for the complete history.`}
        >
          Recently expired
        </SectionHeading>
        <div className="mt-4">
          <CodeList
            entries={expired.slice(0, 3)}
            variant="expired"
            emptyMessage="No expired codes archived yet."
          />
        </div>
        <div className="mt-3 text-right">
          <Link
            href={`/${game.slug}/expired`}
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            View full archive →
          </Link>
        </div>
      </section>

      <RelatedGames excludeSlug={game.slug} />
    </Container>
  );
}
