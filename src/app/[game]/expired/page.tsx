import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { CodeList } from '@/components/CodeList';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { ProseSection, Paragraphs } from '@/components/Prose';
import { getGame, getGameSlugs } from '@/lib/games';
import { getExpiredCodes, getLatestCodes, getLastUpdated, formatDate } from '@/lib/codes';
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
    description: `The full archive of expired ${game.name} codes with the original reward, the date each code was added, and the date it stopped working. Useful for confirming a code is dead and seeing how the developer's release cadence has evolved.`,
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
      <AuthorByline verifiedOn={lastUpdated} />

      <section>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Expired {game.name} Codes — Full Archive
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {expired.length} archived {expired.length === 1 ? 'code' : 'codes'} ·
          Sorted by expiry date · Updated {formatDate(lastUpdated)}
        </p>
        <p className="mt-4 max-w-3xl text-slate-700 leading-relaxed">
          These {game.name} codes no longer work. We keep the archive live for
          three practical reasons: (1) you can quickly confirm a code you saw on
          YouTube or in a Discord screenshot is genuinely dead before wasting
          time retyping it, (2) the addition and expiry dates document the
          game's release history at a glance, and (3) the archive is part of how
          we prove the {active.length} codes on the{' '}
          <Link
            href={`/${game.slug}/latest`}
            className="font-semibold text-brand-700 hover:underline"
          >
            active list
          </Link>{' '}
          are genuinely verified — every retired code lived here, with dates,
          before being moved.
        </p>
      </section>

      <AdSlot slot={`${game.slug}-expired-top`} />

      <section aria-labelledby="expired-heading">
        <h2 id="expired-heading" className="text-2xl font-bold text-slate-900">
          All expired {game.name} codes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Most-recently expired first. Reward column shows what the code paid
          out while it was still active.
        </p>
        <div className="mt-4">
          <CodeList
            entries={expired}
            variant="expired"
            emptyMessage="No expired codes archived yet."
          />
        </div>
      </section>

      {game.expiredCodesContext && (
        <ProseSection id="why-expired" heading={`Why ${game.name} codes expire`}>
          <Paragraphs text={game.expiredCodesContext} />
        </ProseSection>
      )}

      <section className="rounded-xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Looking for codes that still work?
        </h2>
        <p className="mt-2 text-slate-700">
          The{' '}
          <Link
            href={`/${game.slug}/latest`}
            className="font-semibold text-brand-700 hover:underline"
          >
            latest {game.name} codes
          </Link>{' '}
          page lists every code currently paying out, verified against the live
          game. New to redeeming? The{' '}
          <Link
            href={`/${game.slug}/redeem-guide`}
            className="font-semibold text-brand-700 hover:underline"
          >
            redeem guide
          </Link>{' '}
          walks through the in-game flow step by step.
        </p>
      </section>
    </Container>
  );
}
