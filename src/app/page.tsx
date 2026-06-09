import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { SectionHeading } from '@/components/SectionHeading';
import { getAllGames, getGameSummary } from '@/lib/games';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Working game codes, updated daily`,
  description: siteConfig.description,
  path: '/',
  keywords: ['game codes', 'free codes', 'redeem codes', 'working codes'],
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
  const summaries = games.map(getGameSummary);
  const featured = games.find((g) => g.slug === 'blox-fruits') ?? games[0];
  const featuredSummary = getGameSummary(featured);
  const totalActive = summaries.reduce((sum, s) => sum + s.activeCount, 0);
  const totalArchived = summaries.reduce((sum, s) => sum + s.expiredCount, 0);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: summaries.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/${g.slug}`),
      name: `${g.name} codes`,
    })),
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
              Featured · Editor's pick
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              {featured.name} Codes
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
                href={`/${featured.slug}/latest`}
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
              <p className="mt-1 text-3xl font-extrabold text-slate-900">{totalActive}</p>
              <p className="text-xs text-slate-500">Across {summaries.length} games</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Archived</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">{totalArchived}</p>
              <p className="text-xs text-slate-500">Expired codes kept for reference</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Editorial</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs text-slate-500">Verified against the live game</p>
            </div>
          </div>

          <AdSlot slot="home-top" />

          <section aria-labelledby="games-heading">
            <SectionHeading
              id="games-heading"
              icon="list"
              subtitle="Six games tracked. Each has a working code list, an expired archive, and a redeem guide."
            >
              Browse code lists
            </SectionHeading>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {games.map((g) => {
                const summary = getGameSummary(g);
                const base = g.color ?? '#1b3aa5';
                const cardBg = `linear-gradient(135deg, ${base} 0%, ${darken(base, 0.7)} 100%)`;
                return (
                  <li key={g.slug}>
                    <Link
                      href={`/${g.slug}/latest`}
                      className="group flex h-full overflow-hidden rounded-xl text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ background: cardBg }}
                    >
                      <div className="flex-1 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                          {g.platform}
                        </p>
                        <h3 className="mt-1 text-lg font-extrabold leading-tight">
                          {g.name} Codes
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-white/85">
                          {g.tagline}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full bg-emerald-400/25 px-2 py-0.5 font-bold text-emerald-100 ring-1 ring-emerald-300/40">
                            {summary.activeCount} active
                          </span>
                          <span className="text-white/70">{summary.expiredCount} archived</span>
                        </div>
                      </div>
                      {g.heroImage && (
                        <div className="relative hidden w-32 shrink-0 sm:block">
                          {}
                          <img
                            src={g.heroImage}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                          <div
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-16"
                            style={{ background: `linear-gradient(to right, ${base} 0%, transparent 100%)` }}
                          />
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="trust-heading">
            <SectionHeading
              id="trust-heading"
              icon="info"
              subtitle="Every code on this site is verified against the live game by hand before publishing. Here is how we keep the lists honest."
            >
              How {siteConfig.shortName} verifies codes
            </SectionHeading>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: 'Verified in-game',
                  body: 'Every code is tested against the live game on the day it is added to the working list, and re-tested on every weekly refresh.',
                  icon: '✓',
                },
                {
                  title: 'Expired moved fast',
                  body: 'When a code stops working we move it to the expired archive within 24 hours, so the working list stays accurate.',
                  icon: '↻',
                },
                {
                  title: 'Cross-checked sources',
                  body: 'We cross-reference Pocket Tactics, Pro Game Guides, Pocket Gamer, and each game\'s official Twitter / Discord before publishing.',
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

          <section className="rounded-xl border-l-4 border-brand-500 border-y border-r border-y-brand-100 border-r-brand-100 bg-brand-50 p-6">
            <h2 className="text-xl font-bold text-slate-900">Editor's pick — Blox Fruits</h2>
            <p className="mt-2 text-slate-700">
              Blox Fruits is our deepest coverage. Beyond the latest codes, we maintain a 25-fruit{' '}
              <Link href="/blox-fruits/tier-list" className="font-semibold text-brand-700 hover:underline">
                tier list
              </Link>{' '}
              and a four-question{' '}
              <Link href="/blox-fruits/which-fruit" className="font-semibold text-brand-700 hover:underline">
                Fruit Decision quiz
              </Link>{' '}
              that recommends the best fruit for your budget, playstyle, and party. Both are updated every Sunday.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border-2 border-slate-900 bg-slate-900 text-white">
            <div className="border-b-2 border-white/10 px-4 py-3">
              <h2 className="text-sm font-bold uppercase tracking-widest">Recently updated</h2>
            </div>
            <ul className="divide-y divide-white/10">
              {summaries
                .slice()
                .sort((a, b) => (b.lastUpdated.localeCompare(a.lastUpdated)))
                .slice(0, 5)
                .map((s) => (
                  <li key={s.slug}>
                    <Link href={`/${s.slug}/latest`} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition hover:bg-white/5">
                      <div>
                        <p className="font-bold text-white">{s.name}</p>
                        <p className="text-[11px] text-white/60">
                          {s.activeCount} active · updated {s.lastUpdated}
                        </p>
                      </div>
                      <span aria-hidden className="text-white/40">→</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div className="rounded-xl border-2 border-slate-900 bg-white">
            <div className="border-b-2 border-slate-900 px-4 py-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">More guides</h2>
            </div>
            <ul className="divide-y divide-slate-200">
              {[
                { label: 'Blox Fruits Tier List', href: '/blox-fruits/tier-list' },
                { label: 'Fruit Decision Helper', href: '/blox-fruits/which-fruit' },
                { label: 'Genshin redeem guide', href: '/genshin-impact/redeem-guide' },
                { label: 'Anime Vanguards expired archive', href: '/anime-vanguards/expired' },
                { label: 'Honkai: Star Rail redeem guide', href: '/honkai-star-rail/redeem-guide' },
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
