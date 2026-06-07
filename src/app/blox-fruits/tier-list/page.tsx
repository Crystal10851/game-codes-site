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

      <section>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Blox Fruits Tier List ({new Date().getFullYear()})
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {fruits.length} active fruits ranked · Editorially verified · Updated {formatDate(lastUpdated)}
        </p>
        <p className="mt-4 max-w-3xl text-slate-700 leading-relaxed">
          {renderInlineLinks(intro)}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/blox-fruits/which-fruit"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Not sure? Take the Fruit Decision quiz
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/blox-fruits/latest"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Latest XP codes
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <nav
        aria-label="Jump to tier"
        className="sticky top-0 z-30 -mx-4 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:border-slate-200"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jump to</span>
        {grouped.map(({ tier, fruits: tierFruits }) => {
          const style = TIER_STYLES[tier];
          return (
            <a
              key={tier}
              href={`#tier-${tier}`}
              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold ring-1 transition hover:bg-slate-100 ${style.ring} ${style.bg} ${style.text}`}
            >
              <span>{tier}</span>
              <span className="opacity-50">·</span>
              <span className="font-medium opacity-70">{tierFruits.length}</span>
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
                className={`inline-flex h-10 w-14 items-center justify-center rounded-md ring-1 ${style.ring} ${style.bg} ${style.text} text-lg font-bold`}
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
  const delay = Math.min(index, 4) * 60;
  return (
    <article
      id={fruit.slug}
      style={{ animationDelay: `${delay}ms` }}
      className="animate-fade-in-up scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {fruit.emoji && (
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-3xl ring-1 ring-slate-200"
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
        <div className="mt-4 border-t border-slate-100 pt-3">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-700"
          >
            <span
              aria-hidden
              className="inline-flex h-5 w-5 items-center justify-center rounded bg-red-600 text-[10px] font-bold text-white"
            >
              ▶
            </span>
            Watch {fruit.name} showcases on YouTube
          </a>
        </div>
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
