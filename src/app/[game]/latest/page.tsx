import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { CodeList } from '@/components/CodeList';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { getGame, getGameSlugs } from '@/lib/games';
import { getLatestCodes, getLastUpdated } from '@/lib/codes';
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
    title: `Latest ${game.name} Codes — Working Today`,
    description: `Every currently working ${game.name} code, with rewards and the date each code was added. Updated whenever a new code drops.`,
    path: `/${game.slug}/latest`,
    type: 'article',
    modifiedTime: getLastUpdated(game),
    keywords: [
      `latest ${game.name} codes`,
      `new ${game.name} codes`,
      `working ${game.name} codes`,
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

      <AdSlot slot={`${game.slug}-latest-top`} />

      <section aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="text-2xl font-bold text-slate-900">
          All working {game.name} codes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {latest.length} active {latest.length === 1 ? 'code' : 'codes'} ·
          newest first. Codes are case-sensitive — tap Copy to grab them safely.
        </p>
        <div className="mt-4">
          <CodeList
            entries={latest}
            variant="active"
            emptyMessage="No working codes right now. Check back after the next update."
          />
        </div>
      </section>
    </Container>
  );
}
