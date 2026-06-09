import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { AdSlot } from '@/components/AdSlot';
import { AffiliateBar } from '@/components/AffiliateBar';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { Screenshot } from '@/components/Screenshot';
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
    title: `How to Redeem ${game.name} Codes — Step-by-Step Guide with Screenshots`,
    description: `Full step-by-step guide to redeem ${game.name} codes on ${game.platform}, with screenshots, the most common reasons a code doesn't work, and an extended FAQ.`,
    path: `/${game.slug}/redeem-guide`,
    type: 'article',
    modifiedTime: getLastUpdated(game),
    keywords: [
      `how to redeem ${game.name} codes`,
      `${game.name} redeem guide`,
      `${game.name} code not working`,
      `${game.name} code box location`,
    ],
  });
}

export default async function RedeemGuidePage({ params }: PageProps) {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const lastUpdated = getLastUpdated(game);
  const active = getLatestCodes(game);

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to redeem ${game.name} codes`,
    description: `Step-by-step instructions for redeeming codes in ${game.name} on ${game.platform}.`,
    totalTime: 'PT2M',
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

      <section>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          How to Redeem {game.name} Codes
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {game.redeemSteps.length}-step in-game flow · Works on every {game.platform} platform · Updated {formatDate(lastUpdated)}
        </p>
        <p className="mt-4 max-w-3xl text-slate-700 leading-relaxed">
          Redeeming a {game.name} code takes under a minute once you know where
          the code box is. The full flow is identical across PC, mobile, Xbox,
          and the {game.platform} web player — only the position of the
          on-screen icon changes. Follow the {game.redeemSteps.length} steps
          below, then jump straight to the{' '}
          <Link
            href={`/${game.slug}/latest`}
            className="font-semibold text-brand-700 hover:underline"
          >
            latest {active.length} working codes
          </Link>{' '}
          to start redeeming.
        </p>
      </section>

      <AdSlot slot={`${game.slug}-redeem-top`} />

      <section aria-labelledby="steps-heading">
        <h2
          id="steps-heading"
          className="text-2xl font-bold text-slate-900"
        >
          The step-by-step flow
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Works on every platform that supports {game.platform}. Codes are
          case-sensitive, so always copy-paste rather than retype.
        </p>
        <ol className="mt-4 space-y-6">
          {game.redeemSteps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-base font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
              {step.screenshot && (
                <div className="mt-4 pl-12">
                  <Screenshot
                    src={step.screenshot}
                    alt={`${game.name} redeem step ${i + 1}: ${step.title}`}
                    caption={`Step ${i + 1} — ${step.title}`}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {game.videoId && (
        <section aria-labelledby="video-heading">
          <h2 id="video-heading" className="text-2xl font-bold text-slate-900">
            Video walkthrough
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {game.videoTitle ?? `${game.name} code redemption — full in-game walkthrough.`}
          </p>
          <div className="mt-4">
            <YouTubeEmbed
              videoId={game.videoId}
              title={game.videoTitle ?? `${game.name} codes walkthrough`}
            />
          </div>
        </section>
      )}

      {game.troubleshooting && game.troubleshooting.length > 0 && (
        <section aria-labelledby="troubleshooting-heading">
          <h2
            id="troubleshooting-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Troubleshooting — code not working?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            The {game.troubleshooting.length} most common reasons a {game.name} code fails, and the fastest fix for each.
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

      {game.faq.length > 0 && (
        <section aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-2xl font-bold text-slate-900"
          >
            {game.name} codes FAQ
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Questions our readers actually ask. Click any question to expand.
          </p>
          <div className="mt-4 space-y-3">
            {game.faq.map((f) => (
              <details
                key={f.question}
                className="rounded-lg border border-slate-200 bg-white p-4 open:bg-slate-50"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {f.question}
                </summary>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {game.officialChannels && game.officialChannels.length > 0 && (
        <section aria-labelledby="official-heading">
          <h2
            id="official-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Official {game.name} channels
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            We cross-check every code against these sources before publishing.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {game.officialChannels.map((c) => (
              <li key={c.url}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-slate-50"
                >
                  {c.label} →
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AffiliateBar game={game} heading="Useful for this game" />
    </Container>
  );
}
