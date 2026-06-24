import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { SectionHeading } from '@/components/SectionHeading';
import { getAllGames, getGameSummary } from '@/lib/games';
import { getLatestCodes } from '@/lib/codes';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Blox Fruits codes, tier list & fruit decision quiz`,
  description: siteConfig.description,
  path: '/',
  keywords: [
    'blox fruits codes',
    'blox fruits tier list',
    'which blox fruit should I buy',
    'roblox codes',
  ],
});

function darken(hex: string, factor: number): string {
  const clean = hex.replace('#', '');
  const r = Math.max(0, Math.floor(parseInt(clean.slice(0, 2), 16) * factor));
  const g = Math.max(0, Math.floor(parseInt(clean.slice(2, 4), 16) * factor));
  const b = Math.max(0, Math.floor(parseInt(clean.slice(4, 6), 16) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function HomePage() {
  const games = getAllGames();
  const featured = games.find((g) => g.slug === 'blox-fruits') ?? games[0];
  if (!featured) {
    return (
      <Container className="py-16 text-center text-slate-700">
        <p>No game data available yet.</p>
      </Container>
    );
  }
  const featuredSummary = getGameSummary(featured);
  const featuredLatest = getLatestCodes(featured, 3);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        url: absoluteUrl(`/${featured.slug}`),
        name: `${featured.name} codes`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        url: absoluteUrl(`/${featured.slug}/tier-list`),
        name: `${featured.name} tier list`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        url: absoluteUrl(`/${featured.slug}/which-fruit`),
        name: `Which ${featured.name} fruit quiz`,
      },
    ],
  };

  const featuredBg = `linear-gradient(135deg, ${featured.color ?? '#1b3aa5'} 0%, ${darken(featured.color ?? '#1b3aa5', 0.75)} 60%, ${darken(featured.color ?? '#1b3aa5', 0.5)} 100%)`;

  return (
    <Container className="py-8">
      <JsonLd id="ld-home" data={itemListLd} />

      <section
        className="relative overflow-hidden rounded-2xl text-white shadow-lg"
        style={{ background: featuredBg }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 14px)',
          }}
        />
        <div className="relative grid gap-0 md:grid-cols-[1fr_45%]">
          <div className="p-7 sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/95 ring-1 ring-white/20 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden />
              Editorially verified · Updated weekly
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              {featured.name} Codes, Tier List & Fruit Quiz
            </h1>
            <p className="mt-2 max-w-xl text-base text-white/90 sm:text-lg">
              {featured.tagline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 font-bold text-emerald-100 ring-1 ring-emerald-300/40">
                {featuredSummary.activeCount} active codes
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold text-white/90 ring-1 ring-white/20">
                Tier list · Fruit quiz · Redeem guide
              </span>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/${featured.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-md transition hover:bg-slate-100"
              >
                See {featured.name} codes
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/blox-fruits/tier-list"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Tier list
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/blox-fruits/which-fruit"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Fruit quiz
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          {featured.heroImage && (
            <div className="relative hidden md:block">
              {}
              <img
                src={featured.heroImage}
                alt={`${featured.name} gameplay still`}
                loading="eager"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-32"
                style={{ background: `linear-gradient(to right, ${featured.color ?? '#1b3aa5'} 0%, transparent 100%)` }}
              />
              <span className="absolute bottom-2 right-3 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                Image via {featured.developer ?? featured.name}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Active codes</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">{featuredSummary.activeCount}</p>
              <p className="text-xs text-slate-500">Verified in-game</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Archived</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">{featuredSummary.expiredCount}</p>
              <p className="text-xs text-slate-500">Expired codes kept for reference</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Tools</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">2</p>
              <p className="text-xs text-slate-500">Tier list · Fruit decision quiz</p>
            </div>
          </div>

          <AdSlot slot="home-top" />

          <section aria-labelledby="what-we-cover">
            <SectionHeading
              id="what-we-cover"
              icon="info"
              subtitle="A focused, single-game site. Everything here is hand-verified against the live game, written by a single editor, and refreshed every Sunday."
            >
              What you'll find on {siteConfig.shortName}
            </SectionHeading>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Original tier ranking
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                  <Link href="/blox-fruits/tier-list" className="hover:text-brand-700">
                    Blox Fruits Tier List
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  All 25 active fruits ranked across overall, PvP, and grinding — with rationale, pros and cons, and best combos. Written from in-game testing, not a copy of another tier list.
                </p>
                <Link
                  href="/blox-fruits/tier-list"
                  className="mt-3 inline-block text-sm font-bold text-brand-700 hover:underline"
                >
                  See the rankings →
                </Link>
              </li>
              <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Interactive tool
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                  <Link href="/blox-fruits/which-fruit" className="hover:text-brand-700">
                    Fruit Decision Helper
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Four short questions about budget, playstyle, experience and party context — and we recommend the best fruit for your situation, with two alternates and two to avoid.
                </p>
                <Link
                  href="/blox-fruits/which-fruit"
                  className="mt-3 inline-block text-sm font-bold text-brand-700 hover:underline"
                >
                  Take the quiz →
                </Link>
              </li>
              <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Codes &amp; redeem flow
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                  <Link href={`/${featured.slug}`} className="hover:text-brand-700">
                    {featured.name} Codes hub
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Every working code with the exact reward, addition date, and case-sensitive copy button — plus the full expired archive, illustrated 4-step redeem flow, FAQ, and troubleshooting in one place.
                </p>
                <Link
                  href={`/${featured.slug}`}
                  className="mt-3 inline-block text-sm font-bold text-brand-700 hover:underline"
                >
                  Open the codes hub →
                </Link>
              </li>
              <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Editorial standards
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                  <Link href="/editors/ben-yu" className="hover:text-brand-700">
                    Who maintains this site
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Maintained by Ben Yu since 2024. Every code is redeemed on a live account before it is added to the working list, and moved to the expired archive within 24 hours of failing.
                </p>
                <Link
                  href="/editors/ben-yu"
                  className="mt-3 inline-block text-sm font-bold text-brand-700 hover:underline"
                >
                  Read the editor profile →
                </Link>
              </li>
            </ul>
          </section>

          <section aria-labelledby="trust-heading">
            <SectionHeading
              id="trust-heading"
              icon="info"
              subtitle="Every code on this site is verified against the live game by hand before publishing. Here is how we keep the list honest."
            >
              How {siteConfig.shortName} verifies codes
            </SectionHeading>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: 'Verified in-game',
                  body: 'Every code is redeemed on a live Roblox account on the day it is added to the working list, and re-tested on every weekly refresh.',
                  icon: '✓',
                },
                {
                  title: 'Expired moved fast',
                  body: 'When a code stops working we move it to the expired archive within 24 hours, so the working list stays accurate.',
                  icon: '↻',
                },
                {
                  title: 'Cross-checked sources',
                  body: 'We cross-reference Pocket Tactics, Pro Game Guides, the official Blox Fruits Twitter / X account, and the Gamer Robot Discord before publishing.',
                  icon: '⇆',
                },
              ].map((t) => (
                <li key={t.title} className="rounded-xl border border-slate-200 bg-white p-4">
                  <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-base font-bold text-brand-700 ring-1 ring-brand-100">
                    {t.icon}
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-slate-900">{t.title}</h3>
                  <p className="mt-1 text-xs text-slate-600">{t.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border-2 border-slate-900 bg-slate-900 text-white">
            <div className="border-b-2 border-white/10 px-4 py-3">
              <h2 className="text-sm font-bold uppercase tracking-widest">Top working codes</h2>
            </div>
            <ul className="divide-y divide-white/10">
              {featuredLatest.map((c) => (
                <li key={c.code} className="px-4 py-3">
                  <p className="font-mono text-sm font-bold text-white">{c.code}</p>
                  <p className="mt-0.5 text-[11px] text-white/70">{c.reward}</p>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 border-t-2 border-white/10">
              <Link
                href={`/${featured.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-white/90 hover:text-white"
              >
                See all {featuredSummary.activeCount} active codes →
              </Link>
            </div>
          </div>

          <div className="rounded-xl border-2 border-slate-900 bg-white">
            <div className="border-b-2 border-slate-900 px-4 py-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">More on this site</h2>
            </div>
            <ul className="divide-y divide-slate-200">
              {[
                { label: 'Blox Fruits Tier List', href: '/blox-fruits/tier-list' },
                { label: 'Fruit Decision Helper', href: '/blox-fruits/which-fruit' },
                { label: 'How to redeem codes', href: '/blox-fruits#redeem-heading' },
                { label: 'Expired codes archive', href: '/blox-fruits#expired-heading' },
                { label: 'Editor — Ben Yu', href: '/editors/ben-yu' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">About {siteConfig.shortName}</h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {siteConfig.description} Maintained by a single editor; questions or code tip-offs welcome at{' '}
              <a href={`mailto:${siteConfig.contactEmail}`} className="font-semibold text-brand-700 hover:underline">
                {siteConfig.contactEmail}
              </a>.
            </p>
            <Link href="/about" className="mt-3 inline-block text-xs font-bold uppercase tracking-wider text-brand-700 hover:underline">
              Read the full story →
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
