import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { AdSlot } from '@/components/AdSlot';
import { AffiliateBar } from '@/components/AffiliateBar';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { getGame, getGameSlugs } from '@/lib/games';
import { getLastUpdated } from '@/lib/codes';
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
    title: `How to Redeem ${game.name} Codes — Step-by-Step Guide`,
    description: `Step-by-step guide to redeem ${game.name} codes on ${game.platform}, plus the most common reasons a code doesn’t work.`,
    path: `/${game.slug}/redeem-guide`,
    type: 'article',
    modifiedTime: getLastUpdated(game),
    keywords: [
      `how to redeem ${game.name} codes`,
      `${game.name} redeem guide`,
      `${game.name} code not working`,
    ],
  });
}

export default async function RedeemGuidePage({ params }: PageProps) {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const lastUpdated = getLastUpdated(game);

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to redeem ${game.name} codes`,
    description: `Step-by-step instructions for redeeming codes in ${game.name} on ${game.platform}.`,
    step: game.redeemSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.detail,
    })),
  };

  const faqLd = game.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: game.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

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
        name: 'Redeem Guide',
        item: absoluteUrl(`/${game.slug}/redeem-guide`),
      },
    ],
  };

  return (
    <Container className="space-y-8 py-8">
      <JsonLd
        id="ld-redeem"
        data={faqLd ? [howToLd, faqLd, breadcrumbLd] : [howToLd, breadcrumbLd]}
      />
      <GameHeader game={game} active="/redeem-guide" />
      <AuthorByline verifiedOn={lastUpdated} />

      <AdSlot slot={`${game.slug}-redeem-top`} />

      <section aria-labelledby="steps-heading">
        <h2
          id="steps-heading"
          className="text-2xl font-bold text-slate-900"
        >
          How to redeem {game.name} codes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Works on every platform that supports {game.platform}. Codes are
          case-sensitive, so always copy-paste rather than retype.
        </p>
        <ol className="mt-4 space-y-4">
          {game.redeemSteps.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {game.faq.length > 0 && (
        <section aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-2xl font-bold text-slate-900"
          >
            {game.name} codes FAQ
          </h2>
          <div className="mt-4 space-y-3">
            {game.faq.map((f) => (
              <details
                key={f.question}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {f.question}
                </summary>
                <p className="mt-2 text-sm text-slate-700">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <AffiliateBar game={game} heading="Useful for this game" />
    </Container>
  );
}
