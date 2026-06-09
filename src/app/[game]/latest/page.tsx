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
import { ProseSection, Paragraphs } from '@/components/Prose';
import { getGame, getGameSlugs } from '@/lib/games';
import { getLatestCodes, getLastUpdated, formatDate } from '@/lib/codes';
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
  const lastUpdated = getLastUpdated(game);

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
        <p className="mt-2 text-sm text-slate-500">
          {latest.length} active {latest.length === 1 ? 'code' : 'codes'} ·
          Editorially verified · Updated {formatDate(lastUpdated)}
        </p>
        <p className="mt-4 max-w-3xl text-slate-700 leading-relaxed">
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

      <AdSlot slot={`${game.slug}-latest-top`} />

      <section aria-labelledby="codes-heading">
        <h2 id="codes-heading" className="text-2xl font-bold text-slate-900">
          All working {game.name} codes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Newest first. Codes are case-sensitive — tap Copy to grab them safely.
        </p>
        <div className="mt-4">
          <CodeList
            entries={latest}
            variant="active"
            emptyMessage="No working codes right now. Check back after the next update."
          />
        </div>
      </section>

      {game.whatCodesDo && (
        <ProseSection id="what-codes-do" heading={`What do ${game.name} codes do?`}>
          <Paragraphs text={game.whatCodesDo} />
        </ProseSection>
      )}

      {game.videoId && (
        <section aria-labelledby="video-heading">
          <h2 id="video-heading" className="text-2xl font-bold text-slate-900">
            Video walkthrough
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {game.videoTitle ??
              `Watch how ${game.name} codes are redeemed in-game and what each reward looks like.`}
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
        <ProseSection id="release-cadence" heading="When are new codes released?">
          <Paragraphs text={game.releaseCadence} />
        </ProseSection>
      )}

      {game.troubleshooting && game.troubleshooting.length > 0 && (
        <section aria-labelledby="troubleshooting-heading">
          <h2
            id="troubleshooting-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Code not working? Common fixes
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Five things that usually cause a {game.name} code to fail, and the
            fastest fix for each.
          </p>
          <div className="mt-4 space-y-3">
            {game.troubleshooting.map((t) => (
              <div
                key={t.symptom}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <p className="font-semibold text-slate-900">{t.symptom}</p>
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
        <ProseSection id="more-codes" heading="Where to find more codes">
          <Paragraphs text={game.whereToFindMore} />
        </ProseSection>
      )}

      <section className="rounded-xl border border-brand-100 bg-brand-50 p-6">
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
