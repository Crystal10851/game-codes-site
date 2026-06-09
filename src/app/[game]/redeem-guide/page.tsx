import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { GameHero } from '@/components/GameHero';
import { AdSlot } from '@/components/AdSlot';
import { AffiliateBar } from '@/components/AffiliateBar';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { StepIllustration } from '@/components/StepIllustration';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { StatHero, buildCodeStats } from '@/components/StatHero';
import { SectionHeading } from '@/components/SectionHeading';
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
  const expired = getExpiredCodes(game);
  const freshCount = active.filter((c) => isRecentlyAdded(c.addedOn)).length;

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

      <GameHero
        game={game}
        activeCount={active.length}
        lastUpdated={lastUpdated}
        primaryCta={{ href: '#steps-heading', label: `Jump to ${game.redeemSteps.length} redemption steps` }}
        secondaryCta={{ href: `/${game.slug}/latest`, label: `${active.length} working codes` }}
        eyebrow={`${game.redeemSteps.length}-step redeem guide`}
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

      <AdSlot slot={`${game.slug}-redeem-top`} />

      <section aria-labelledby="steps-heading">
        <SectionHeading
          id="steps-heading"
          icon="steps"
          subtitle={`Works on every platform that supports ${game.platform}. Codes are case-sensitive, so always copy-paste rather than retype.`}
        >
          The step-by-step flow
        </SectionHeading>
        <ol className="mt-4 space-y-6">
          {game.redeemSteps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-base font-extrabold text-white shadow-sm ring-4 ring-brand-100">
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
                <div className="mt-4 sm:pl-14">
                  <StepIllustration
                    src={step.screenshot}
                    stepNumber={i + 1}
                    stepTitle={step.title}
                    gameName={game.name}
                    accentColor={game.color}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {game.videoId && (
        <section aria-labelledby="video-heading">
          <SectionHeading
            id="video-heading"
            icon="video"
            subtitle={game.videoTitle ?? `${game.name} code redemption — full in-game walkthrough.`}
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

      {game.troubleshooting && game.troubleshooting.length > 0 && (
        <section aria-labelledby="troubleshooting-heading">
          <SectionHeading
            id="troubleshooting-heading"
            icon="wrench"
            subtitle={`The ${game.troubleshooting.length} most common reasons a ${game.name} code fails, and the fastest fix for each.`}
          >
            Troubleshooting — code not working?
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

      {game.faq.length > 0 && (
        <section aria-labelledby="faq-heading">
          <SectionHeading
            id="faq-heading"
            icon="help"
            subtitle="Questions our readers actually ask. Click any question to expand."
          >
            {game.name} codes FAQ
          </SectionHeading>
          <div className="mt-4 space-y-3">
            {game.faq.map((f) => (
              <details
                key={f.question}
                className="rounded-lg border border-slate-200 bg-white p-4 open:border-brand-200 open:bg-brand-50/40"
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
          <SectionHeading
            id="official-heading"
            icon="link"
            subtitle="We cross-check every code against these sources before publishing."
          >
            Official {game.name} channels
          </SectionHeading>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {game.officialChannels.map((c) => (
              <li key={c.url}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-slate-50"
                >
                  <span>{c.label}</span>
                  <span aria-hidden className="text-slate-400">→</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AffiliateBar game={game} heading="Useful for this game" />

      <RelatedGames excludeSlug={game.slug} />
    </Container>
  );
}
