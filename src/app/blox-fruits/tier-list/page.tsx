import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { getGame } from '@/lib/games';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';
import { formatDate } from '@/lib/codes';
import tierListData from '../../../../data/games/blox-fruits/tier-list.json';

type Tier = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

interface Fruit {
  slug: string;
  name: string;
  type: string;
  rarity: string;
  emoji?: string;
  oneLineReason?: string;
  youtubeQuery?: string;
  tiers: { overall: Tier; pvp: Tier; grinding: Tier };
  tierRationale: string;
  pros: string[];
  cons: string[];
  bestCombos: {
    sword?: string;
    fightingStyle?: string;
    gun?: string;
    notes?: string;
  };
  howToObtain: string[];
}

const RARITY_STYLES: Record<string, string> = {
  Mythical: 'bg-rose-50 text-rose-700 ring-rose-200',
  Legendary: 'bg-amber-50 text-amber-700 ring-amber-200',
  Rare: 'bg-sky-50 text-sky-700 ring-sky-200',
  Uncommon: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Common: 'bg-slate-50 text-slate-600 ring-slate-200',
};

const TIER_ORDER: Tier[] = ['S+', 'S', 'A', 'B', 'C', 'D'];

const TIER_STYLES: Record<Tier, { ring: string; bg: string; text: string }> = {
  'S+': { ring: 'ring-rose-300', bg: 'bg-rose-100', text: 'text-rose-800' },
  S: { ring: 'ring-orange-300', bg: 'bg-orange-100', text: 'text-orange-800' },
  A: { ring: 'ring-amber-300', bg: 'bg-amber-100', text: 'text-amber-800' },
  B: { ring: 'ring-emerald-300', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  C: { ring: 'ring-sky-300', bg: 'bg-sky-100', text: 'text-sky-800' },
  D: { ring: 'ring-slate-300', bg: 'bg-slate-100', text: 'text-slate-700' },
};

function renderInlineLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link
        key={`l-${key++}`}
        href={match[2]}
        className="font-semibold text-brand-700 underline-offset-2 hover:underline"
      >
        {match[1]}
      </Link>,
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function generateMetadata(): Metadata {
  const game = getGame('blox-fruits');
  const year = new Date().getFullYear();
  return buildMetadata({
    title: `Blox Fruits Tier List (${year}) — Best Fruits Ranked`,
    description: `Editorial Blox Fruits tier list for ${year}. All 25 active fruits ranked by overall, PvP, and grinding performance, with rationale, pros and cons, and best combos. Updated weekly.`,
    path: '/blox-fruits/tier-list',
    type: 'article',
    modifiedTime: tierListData.meta.lastUpdated,
    keywords: [
      'blox fruits tier list',
      `blox fruits tier list ${year}`,
      'best blox fruits',
      'blox fruits ranking',
      'blox fruits pvp tier list',
      'blox fruits grinding tier list',
    ],
  });
}

export default function BloxFruitsTierListPage() {
  const game = getGame('blox-fruits');
  if (!game) notFound();

  const fruits = tierListData.fruits as Fruit[];
  const lastUpdated = tierListData.meta.lastUpdated;
  const intro = tierListData.meta.intro;

  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    fruits: fruits.filter((f) => f.tiers.overall === tier),
  })).filter((g) => g.fruits.length > 0);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Blox Fruits Tier List (${new Date().getFullYear()})`,
    description: 'Editorial Blox Fruits tier ranking covering overall, PvP, and grinding performance.',
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    mainEntityOfPage: absoluteUrl('/blox-fruits/tier-list'),
    about: {
      '@type': 'VideoGame',
      name: 'Blox Fruits',
      gamePlatform: 'Roblox',
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
        name: 'Blox Fruits Codes',
        item: absoluteUrl('/blox-fruits'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Tier List',
        item: absoluteUrl('/blox-fruits/tier-list'),
      },
    ],
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: fruits.length,
    itemListElement: fruits.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${f.name} — ${f.tiers.overall}`,
      url: absoluteUrl(`/blox-fruits/tier-list#${f.slug}`),
    })),
  };

  return (
    <Container className="space-y-10 py-8">
      <JsonLd id="ld-tier-list" data={[articleLd, breadcrumbLd, itemListLd]} />
      <GameHeader game={game} active="/tier-list" />
      <AuthorByline verifiedOn={lastUpdated} />

      <section className="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 p-8 text-white shadow-xl sm:p-12">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-fuchsia-400/30 to-amber-400/40" aria-hidden />
        <div className="absolute -right-12 -top-12 h-48 w-48 animate-float rounded-full bg-amber-300/30 blur-3xl" aria-hidden />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 animate-float rounded-full bg-sky-300/30 blur-3xl" style={{ animationDelay: '1.5s' }} aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm ring-1 ring-white/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden />
            Updated {formatDate(lastUpdated)}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight drop-shadow-sm sm:text-5xl">
            Blox Fruits Tier List <span className="block text-amber-200">({new Date().getFullYear()})</span>
          </h1>
          <p className="mt-3 text-sm font-medium text-white/85">
            {fruits.length} fruits ranked across overall, PvP, and grinding · Editorial picks
          </p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/95">
            {renderInlineLinks(intro)}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/blox-fruits/which-fruit"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 shadow-lg ring-1 ring-white/20 transition hover:scale-[1.03] hover:bg-amber-50"
            >
              <span aria-hidden className="text-base">🧭</span>
              <span>Not sure? Take the Fruit Decision quiz</span>
            </Link>
            <Link
              href="/blox-fruits/latest"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <span aria-hidden className="text-base">🎁</span>
              <span>Latest XP codes</span>
            </Link>
          </div>
        </div>
      </section>

      <nav
        aria-label="Jump to tier"
        className="sticky top-0 z-30 -mx-4 flex flex-wrap items-center gap-2 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border sm:border-slate-200 sm:px-4"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jump to:</span>
        {grouped.map(({ tier, fruits: tierFruits }) => {
          const style = TIER_STYLES[tier];
          return (
            <a
              key={tier}
              href={`#tier-${tier}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 transition hover:scale-105 ${style.ring} ${style.bg} ${style.text}`}
            >
              <span>{tier}</span>
              <span className="opacity-60">·</span>
              <span className="opacity-80">{tierFruits.length}</span>
            </a>
          );
        })}
      </nav>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          How to read this tier list
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
          <li><strong className="text-slate-900">Overall</strong> — default tier shown in each header below. Best all-round answer to “is this fruit good?”</li>
          <li><strong className="text-slate-900">PvP</strong> — performance in 1v1 and small-group fights.</li>
          <li><strong className="text-slate-900">Grinding</strong> — speed of leveling, bossing, and sea events.</li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Scale: S+ (meta-defining, ≤3 fruits per dimension) · S · A · B · C · D. Tier calls are editorial and refreshed every Sunday.
        </p>
      </section>

      {grouped.map(({ tier, fruits: tierFruits }) => {
        const style = TIER_STYLES[tier];
        return (
          <section key={tier} aria-labelledby={`tier-${tier}`} className="scroll-mt-20">
            <div className="flex items-baseline gap-3">
              <span
                className={`inline-flex h-12 w-16 items-center justify-center rounded-lg ring-2 ${style.ring} ${style.bg} ${style.text} text-2xl font-extrabold shadow-sm`}
              >
                {tier}
              </span>
              <h2
                id={`tier-${tier}`}
                className="text-2xl font-bold text-slate-900"
              >
                Tier {tier}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  · {tierFruits.length} {tierFruits.length === 1 ? 'fruit' : 'fruits'}
                </span>
              </h2>
            </div>
            <div className="mt-4 grid gap-5">
              {tierFruits.map((fruit, idx) => (
                <FruitCard key={fruit.slug} fruit={fruit} index={idx} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="rounded-xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Pair your fruit with a working code
        </h2>
        <p className="mt-2 text-slate-700">
          XP boosts compound especially well when you're grinding a fresh
          Mythical or pushing the awakening fragment cost. See the{' '}
          <Link
            href="/blox-fruits/latest"
            className="font-semibold text-brand-700 hover:underline"
          >
            latest Blox Fruits codes
          </Link>{' '}
          for active 2x XP promos, or the{' '}
          <Link
            href="/blox-fruits/redeem-guide"
            className="font-semibold text-brand-700 hover:underline"
          >
            redeem guide
          </Link>{' '}
          if you're new to the in-game code box.
        </p>
      </section>
    </Container>
  );
}

function FruitCard({ fruit, index = 0 }: { fruit: Fruit; index?: number }) {
  const rarityClass =
    RARITY_STYLES[fruit.rarity] ?? RARITY_STYLES.Common;
  const youtubeUrl = fruit.youtubeQuery
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(fruit.youtubeQuery)}`
    : null;
  const delay = Math.min(index, 4) * 80;
  return (
    <article
      id={fruit.slug}
      style={{ animationDelay: `${delay}ms` }}
      className="animate-fade-in-up scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {fruit.emoji && (
            <span
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-4xl ring-1 ring-slate-200 shadow-sm"
            >
              {fruit.emoji}
            </span>
          )}
          <div>
            <h3 className="text-xl font-bold text-slate-900">{fruit.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ring-1 ${rarityClass}`}>
                {fruit.rarity}
              </span>
              <span className="text-slate-500">{fruit.type}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <TierBadge label="Overall" tier={fruit.tiers.overall} />
          <TierBadge label="PvP" tier={fruit.tiers.pvp} />
          <TierBadge label="Grinding" tier={fruit.tiers.grinding} />
        </div>
      </header>

      {fruit.oneLineReason && (
        <p className="mt-3 rounded-md bg-brand-50 px-3 py-2 text-sm font-medium text-brand-900 ring-1 ring-brand-100">
          {fruit.oneLineReason}
        </p>
      )}

      <p className="mt-3 text-slate-700 leading-relaxed">{fruit.tierRationale}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Pros
          </h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {fruit.pros.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            Cons
          </h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {fruit.cons.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
        <p className="font-semibold text-slate-900">Best combos</p>
        <p className="mt-1 text-slate-700">
          {fruit.bestCombos.sword && (
            <>
              <strong>Sword:</strong> {fruit.bestCombos.sword}
              {(fruit.bestCombos.fightingStyle || fruit.bestCombos.gun) && ' · '}
            </>
          )}
          {fruit.bestCombos.fightingStyle && (
            <>
              <strong>Fighting style:</strong> {fruit.bestCombos.fightingStyle}
              {fruit.bestCombos.gun && ' · '}
            </>
          )}
          {fruit.bestCombos.gun && (
            <>
              <strong>Gun:</strong> {fruit.bestCombos.gun}
            </>
          )}
        </p>
        {fruit.bestCombos.notes && (
          <p className="mt-1 text-slate-600">{fruit.bestCombos.notes}</p>
        )}
      </div>

      <div className="mt-3 text-sm">
        <p className="font-semibold text-slate-900">How to obtain</p>
        <ul className="mt-1 list-inside list-disc text-slate-700">
          {fruit.howToObtain.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>

      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${fruit.name} showcases on YouTube`}
          className="group relative mt-4 block overflow-hidden rounded-xl ring-1 ring-slate-200 transition hover:ring-red-300 hover:shadow-md"
        >
          <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 40%, rgba(244,63,94,0.35), transparent 55%), radial-gradient(circle at 75% 70%, rgba(99,102,241,0.30), transparent 55%)',
              }}
            />
            {fruit.emoji && (
              <span
                aria-hidden
                className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl opacity-25 drop-shadow-lg transition group-hover:scale-110 group-hover:opacity-40 sm:text-8xl"
              >
                {fruit.emoji}
              </span>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <span
                aria-hidden
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl ring-4 ring-white/20 transition group-hover:scale-110 group-hover:bg-red-500"
              >
                <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
              </span>
              <p className="mt-3 text-sm font-bold drop-shadow sm:text-base">
                Watch {fruit.name} showcases
              </p>
              <p className="text-xs text-white/70">on YouTube</p>
            </div>
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              <span className="inline-flex h-3 w-3 items-center justify-center rounded-sm bg-red-600 text-[8px]">▶</span>
              YouTube
            </span>
          </div>
        </a>
      )}
    </article>
  );
}

function TierBadge({ label, tier }: { label: string; tier: Tier }) {
  const style = TIER_STYLES[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 ${style.ring} ${style.bg} ${style.text}`}
    >
      <span className="font-medium opacity-75">{label}</span>
      <span className="font-bold">{tier}</span>
    </span>
  );
}
