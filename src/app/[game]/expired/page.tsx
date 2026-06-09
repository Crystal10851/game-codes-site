import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { GameHero } from '@/components/GameHero';
import { CodeList } from '@/components/CodeList';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { Paragraphs } from '@/components/Prose';
import { StatHero, buildCodeStats } from '@/components/StatHero';
import { SectionHeading } from '@/components/SectionHeading';
import { RelatedGames } from '@/components/RelatedGames';
import { getGame, getGameSlugs } from '@/lib/games';
import { getExpiredCodes, getLatestCodes, getLastUpdated, isRecentlyAdded } from '@/lib/codes';
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
    title: `Expired ${game.name} Codes — Full Archive`,
    description: `The full archive of expired ${game.name} codes with the original reward, the date each code was added, and the date it stopped working.`,
    path: `/${game.slug}/expired`,
    type: 'article',
    modifiedTime: getLastUpdated(game),
    keywords: [
      `expired ${game.name} codes`,
      `${game.name} old codes`,
      `${game.name} code history`,
      `${game.name} dead codes`,
    ],
  });
}

export default async function ExpiredPage({ params }: PageProps) {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const expired = getExpiredCodes(game);
  const active = getLatestCodes(game);
  const lastUpdated = getLastUpdated(game);
  const freshCount = active.filter((c) => isRecentlyAdded(c.addedOn)).length;

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
        name: 'Expired Codes',
        item: absoluteUrl(`/${game.slug}/expired`),
      },
    ],
  };

  return (
    <Container className="space-y-8 py-8">
      <JsonLd id="ld-expired" data={breadcrumbLd} />
      <GameHeader game={game} active="/expired" />

      <GameHero
        game={game}
        activeCount={active.length}
        lastUpdated={lastUpdated}
        primaryCta={{ href: `/${game.slug}/latest`, label: `See ${active.length} working codes` }}
        secondaryCta={{ href: '#expired-heading', label: `Jump to ${expired.length} expired` }}
        eyebrow="Expired code archive"
      />

      <AuthorByline verifiedOn={lastUpdated} />

      <StatHero
        tiles={buildCodeStats({
          activeCount: active.length,
          expiredCount: expired.length,
          lastUpdated,
          freshCount,
        })}
      />

      <AdSlot slot={`${game.slug}-expired-top`} />

      <section aria-labelledby="expired-heading">
        <SectionHeading
          id="expired-heading"
          icon="archive"
          subtitle="Most-recently expired first. Reward column shows what the code paid out while it was still active."
        >
          All expired {game.name} codes
        </SectionHeading>
        <div className="mt-4">
          <CodeList
            entries={expired}
            variant="expired"
            emptyMessage="No expired codes archived yet."
          />
        </div>
      </section>

      {game.expiredCodesContext && (
        <section aria-labelledby="why-expired">
          <SectionHeading id="why-expired" icon="info">
            Why {game.name} codes expire
          </SectionHeading>
          <div className="prose prose-slate mt-3 max-w-none text-slate-700 leading-relaxed [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-brand-700 hover:[&_a]:underline">
            <Paragraphs text={game.expiredCodesContext} />
          </div>
        </section>
      )}

      <section className="rounded-xl border-l-4 border-emerald-500 border-y border-r border-y-emerald-100 border-r-emerald-100 bg-emerald-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Looking for codes that still work?
        </h2>
        <p className="mt-2 text-slate-700">
          The{' '}
          <Link
            href={`/${game.slug}/latest`}
            className="font-semibold text-emerald-800 hover:underline"
          >
            latest {game.name} codes
          </Link>{' '}
          page lists every code currently paying out, verified against the live
          game. New to redeeming? The{' '}
          <Link
            href={`/${game.slug}/redeem-guide`}
            className="font-semibold text-emerald-800 hover:underline"
          >
            redeem guide
          </Link>{' '}
          walks through the in-game flow step by step.
        </p>
      </section>

      <RelatedGames excludeSlug={game.slug} />
    </Container>
  );
}
