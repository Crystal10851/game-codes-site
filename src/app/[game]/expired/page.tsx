import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { CodeList } from '@/components/CodeList';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { getGame, getGameSlugs } from '@/lib/games';
import { getExpiredCodes, getLastUpdated } from '@/lib/codes';
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
    title: `Expired ${game.name} Codes — Archive`,
    description: `The full archive of expired ${game.name} codes. Useful to see past rewards and confirm a code is no longer redeemable.`,
    path: `/${game.slug}/expired`,
    type: 'article',
    modifiedTime: getLastUpdated(game),
    keywords: [
      `expired ${game.name} codes`,
      `${game.name} old codes`,
      `${game.name} code history`,
    ],
  });
}

export default async function ExpiredPage({ params }: PageProps) {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const expired = getExpiredCodes(game);
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

      <AdSlot slot={`${game.slug}-expired-top`} />

      <section aria-labelledby="expired-heading">
        <h2 id="expired-heading" className="text-2xl font-bold text-slate-900">
          Expired {game.name} codes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {expired.length} archived {expired.length === 1 ? 'code' : 'codes'}.
          These no longer work — head back to the{' '}
          <Link
            href={`/${game.slug}/latest`}
            className="font-semibold text-brand-700 hover:underline"
          >
            latest codes
          </Link>{' '}
          page for working ones.
        </p>
        <div className="mt-4">
          <CodeList
            entries={expired}
            variant="expired"
            emptyMessage="No expired codes archived yet."
          />
        </div>
      </section>
    </Container>
  );
}
