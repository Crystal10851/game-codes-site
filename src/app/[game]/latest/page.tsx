import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { CodeList } from '@/components/CodeList';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { Paragraphs } from '@/components/Prose';
import { StatHero, buildCodeStats } from '@/components/StatHero';
import { SectionHeading } from '@/components/SectionHeading';
import { RewardBreakdown } from '@/components/RewardBreakdown';
import { getGame, getGameSlugs } from '@/lib/games';
import { getLatestCodes, getLastUpdated, isRecentlyAdded } from '@/lib/codes';
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
    title: `Latest ${game.name} Codes (${new Date().getFullYear()}) — Working Today`,
    description: `Every currently working ${game.name} code with rewards, the date each code was added, and a step-by-step redeem guide. Updated whenever a new code drops.`,
    path: `/${game.slug}/latest`,
    type: 'article',
    modifiedTime: getLastUpdated(game),
    keywords: [
      `latest ${game.name} codes`,
      `new ${game.name} codes`,
      `working ${game.name} codes`,
      `${game.name} codes ${new Date().getFullYear()}`,
    ],
  });
}

export default async function LatestPage({ params }: PageProps) {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const latest = getLatestCodes(game);
  const expired = game.codes.filter((c) => c.status === 'expired');
  const lastUpdated = getLastUpdated(game);
  const freshCount = latest.filter((c) => isRecentlyAdded(c.addedOn)).length;
  const activeRewards = latest.map((c) => c.reward);

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
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Latest Codes',
        item: absoluteUrl(`/${game.slug}/latest`),
      },
    ],
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Working ${game.name} codes`,
    numberOfItems: latest.length,
    dateModified: lastUpdated,
    itemListElement: latest.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.code,
      description: c.reward,
    })),
  };

  return (
    <Container className="space-y-8 py-8">
      <JsonLd id="ld-latest" data={[breadcrumbLd, itemListLd]} />
      <GameHeader game={game} active="/latest" />
      <AuthorByline verifiedOn={lastUpdated} />

      <section>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Latest {game.name} Codes ({new Date().getFullYear()})
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700 leading-relaxed">
          Every {game.name} code on this page is currently working. We test the
          list against the live game on every refresh and move any code that
          stops paying out to the{' '}
          <Link
            href={`/${game.slug}/expired`}
            className="font-semibold text-brand-700 hover:underline"
          >
            expired archive
          </Link>{' '}
          within 24 hours, so what you see below is what you can actually redeem
          today.
        </p>
      </section>

      <StatHero
        tiles={buildCodeStats({
          activeCount: latest.length,
          expiredCount: expired.length,
          lastUpdated,
          freshCount,
        })}
      />

      <AdSlot slot={`${game.slug}-latest-top`} />

      <section aria-labelledby="codes-heading">
        <SectionHeading
          id="codes-heading"
          icon="list"
          subtitle="Newest first. Codes are case-sensitive — tap Copy to grab them safely."
        >
          All working {game.name} codes
        </SectionHeading>
        <div className="mt-4">
          <CodeList
            entries={latest}
            variant="active"
            emptyMessage="No working codes right now. Check back after the next update."
          />
        </div>
      </section>

      {activeRewards.length > 0 && (
        <RewardBreakdown rewards={activeRewards} />
      )}

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
            subtitle={
              game.videoTitle ??
              `Watch how ${game.name} codes are redeemed in-game and what each reward looks like.`
            }
          >
            Video walkthrough
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
            When are new codes released?
          </SectionHeading>
          <div className="prose prose-slate mt-3 max-w-none text-slate-700 leading-relaxed [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-brand-700 hover:[&_a]:underline">
            <Paragraphs text={game.releaseCadence} />
          </div>
        </section>
      )}

      {game.troubleshooting && game.troubleshooting.length > 0 && (
        <section aria-labelledby="troubleshooting-heading">
          <SectionHeading
            id="troubleshooting-heading"
            icon="wrench"
            subtitle={`${game.troubleshooting.length} things that usually cause a ${game.name} code to fail, and the fastest fix for each.`}
          >
            Code not working? Common fixes
          </SectionHeading>
          <div className="mt-4 space-y-3">
            {game.troubleshooting.map((t) => (
              <div
                key={t.symptom}
                className="rounded-lg border-l-4 border-amber-300 border-y border-r border-y-slate-200 border-r-slate-200 bg-amber-50/40 p-4"
              >
                <p className="flex items-start gap-2 font-semibold text-slate-900">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden>
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <path d="M12 9v4 M12 17h.01" />
                  </svg>
                  {t.symptom}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Cause:</span>{' '}
                  {t.cause}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Fix:</span>{' '}
                  {t.fix.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
                    const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
                    if (m) {
                      return (
                        <Link
                          key={i}
                          href={m[2]}
                          className="font-semibold text-brand-700 hover:underline"
                        >
                          {m[1]}
                        </Link>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

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

      <section className="rounded-xl border-l-4 border-brand-500 border-y border-r border-y-brand-100 border-r-brand-100 bg-brand-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Need step-by-step instructions?
        </h2>
        <p className="mt-2 text-slate-700">
          The full{' '}
          <Link
            href={`/${game.slug}/redeem-guide`}
            className="font-semibold text-brand-700 hover:underline"
          >
            {game.name} redeem guide
          </Link>{' '}
          walks through every step with screenshots, plus the full FAQ. Looking
          for codes that no longer work? The{' '}
          <Link
            href={`/${game.slug}/expired`}
            className="font-semibold text-brand-700 hover:underline"
          >
            expired archive
          </Link>{' '}
          is kept up to date so you do not waste time retrying dead codes.
        </p>
      </section>
    </Container>
  );
}
