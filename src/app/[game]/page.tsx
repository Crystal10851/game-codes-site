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
import { StepIllustration } from '@/components/StepIllustration';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { Paragraphs } from '@/components/Prose';
import { StatHero, buildCodeStats } from '@/components/StatHero';
import { SectionHeading } from '@/components/SectionHeading';
import { RewardBreakdown } from '@/components/RewardBreakdown';
import { getGame, getGameSlugs } from '@/lib/games';
import { getLatestCodes, getExpiredCodes, getLastUpdated, isRecentlyAdded } from '@/lib/codes';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl, primaryEditor, siteConfig } from '@/lib/site';

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
    author: {
      '@type': 'Person',
      name: primaryEditor.name,
      url: absoluteUrl(`/editors/${primaryEditor.slug}`),
      jobTitle: primaryEditor.role,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
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

  const jsonLdData: Record<string, unknown>[] = [
    articleLd,
    breadcrumbLd,
    howToLd,
    itemListLd,
  ];
  if (faqLd) jsonLdData.push(faqLd);

  return (
    <Container className="space-y-10 py-8">
      <JsonLd id="ld-hub" data={jsonLdData} />
      <GameHeader game={game} active="" />

      <GameHero
        game={game}
        activeCount={latest.length}
        lastUpdated={lastUpdated}
        primaryCta={{ href: '#latest-heading', label: `Jump to ${latest.length} working codes` }}
        secondaryCta={{ href: '#redeem-heading', label: 'How to redeem' }}
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

      {game.slug === 'blox-fruits' && (
        <section aria-labelledby="tier-cta-heading" className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/blox-fruits/tier-list"
            className="group block rounded-xl border-l-4 border-brand-500 border-y border-r border-y-brand-100 border-r-brand-100 bg-brand-50 p-5 transition hover:bg-brand-100"
          >
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
              All 25 active fruits ranked across overall, PvP, and grinding — with rationale, pros and cons, and best combos.
            </p>
            <span className="mt-3 inline-block text-sm font-bold text-brand-700 group-hover:underline">
              See the rankings →
            </span>
          </Link>
          <Link
            href="/blox-fruits/which-fruit"
            className="group block rounded-xl border-l-4 border-brand-500 border-y border-r border-y-brand-100 border-r-brand-100 bg-brand-50 p-5 transition hover:bg-brand-100"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Interactive tool · 4 questions
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Which Blox Fruit should I buy?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Answer four short questions and we'll recommend the best fruit for your budget, playstyle, and party.
            </p>
            <span className="mt-3 inline-block text-sm font-bold text-brand-700 group-hover:underline">
              Take the quiz →
            </span>
          </Link>
        </section>
      )}

      <section aria-labelledby="latest-heading">
        <SectionHeading
          id="latest-heading"
          icon="list"
          subtitle={`${latest.length} working ${latest.length === 1 ? 'code' : 'codes'}, newest first. Codes are case-sensitive — tap Copy to grab them safely.`}
        >
          Latest working {game.name} codes
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
              thumbnailSrc={game.heroImage}
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

      <AdSlot slot={`${game.slug}-overview-mid`} />

      <section aria-labelledby="redeem-heading">
        <SectionHeading
          id="redeem-heading"
          icon="steps"
          subtitle={`Works on every platform that supports ${game.platform}. Codes are case-sensitive, so always copy-paste rather than retype.`}
        >
          How to redeem {game.name} codes — step by step
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
          subtitle={`${expired.length} archived. Most-recently expired first. Reward column shows what the code paid out while it was still active.`}
        >
          Expired {game.name} codes — full archive
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

      <AffiliateBar game={game} />
    </Container>
  );
}
