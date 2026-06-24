import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { JsonLd } from '@/components/JsonLd';
import { SectionHeading } from '@/components/SectionHeading';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `Site changelog — what changed on ${siteConfig.shortName}`,
  description: `A dated log of every meaningful change to ${siteConfig.shortName}: new tools, schema upgrades, editorial expansions, and the focus pivot to a single-game site.`,
  path: '/changelog',
});

interface ChangelogEntry {
  date: string;
  title: string;
  type: 'launch' | 'tool' | 'editorial' | 'structure' | 'cadence';
  body: string;
}

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-06-24',
    title: 'Methodology page published; tier list & quiz surfaced first',
    type: 'editorial',
    body:
      'Added a dedicated /methodology page documenting the full code-verification pipeline — sourcing channels, the four-step redeem test, the upstream demotion window, and what we explicitly do not publish. The codes hub now shows the Tier List and Fruit Decision quiz cards directly above the working-codes list rather than at the bottom of the page; the homepage "What you\'ll find" grid was reordered to match. The intent is that a first-time reader sees the original ranking and the interactive tool before the codes table, which is the part of the site that most overlaps with other code aggregators.',
  },
  {
    date: '2026-06-22',
    title: 'Focus pivoted to single-game coverage',
    type: 'structure',
    body:
      'Retired multi-game scaffolding to concentrate on Blox Fruits as the single editorial focus. The site dropped from 37 prerendered routes to 8 user-facing pages, all of them either Blox Fruits content (codes hub, tier list, decision quiz) or essential site furniture (about, methodology, editor profile, contact, privacy). Legacy multi-game URLs return permanent redirects to the homepage. Rationale: an aggregator-shaped site with thin coverage of six games is weaker than a focused site with deep coverage of one. Every editorial cycle from this point compounds on the same game rather than fanning out.',
  },
  {
    date: '2026-06-10',
    title: 'Real editor identity rolled out',
    type: 'editorial',
    body:
      'Added Ben Yu as the named editor across the site — full editor profile at /editors/ben-yu, Person-typed JSON-LD on every article, byline component on the codes hub and the tier list, a "Meet the editor" card on the About page. Each guide now states who maintains it, what their beat is, and how to reach them. The intent is straightforward: readers should know whose taste and testing standards are behind the codes list.',
  },
  {
    date: '2026-06-09',
    title: 'Editorial deep-dive layer added to every guide',
    type: 'editorial',
    body:
      'Expanded the codes hub from a code list with a redeem guide into a full editorial article. New sections: a three-paragraph game-state overview, a reward-type explainer with grind-strategy notes, an analysis of when new codes drop and why, an explanation of why we keep an expired archive visible, and a curated list of where to look for codes between our refreshes. The FAQ expanded from four entries to eight, and a five-entry troubleshooting matrix was added covering the case-sensitivity trap, the level-1500 stat-reset gate, the group-gated SKGames code, the early-2026 Twitter-icon UI refresh, and the once-per-account redemption rule.',
  },
  {
    date: '2026-06-05',
    title: 'Fruit Decision Helper interactive quiz shipped',
    type: 'tool',
    body:
      'Launched /blox-fruits/which-fruit — a four-question quiz that asks for budget, role (PvP, grinding, boss, trading, fun), experience level and party context, then ranks the available fruits using a quizSignals algorithm with a tier-tiebreaker. The result page shows the top three matches with rank pills, rationale bullets and links to the relevant tier-list anchors, plus a guarded empty-state for combinations that filter the candidate set to zero. The tier list was simultaneously extended from ten fruits to a full twenty-five-fruit roster covering Common through Mythical.',
  },
  {
    date: '2026-05-26',
    title: 'Full upstream re-verification of every code',
    type: 'cadence',
    body:
      'Cross-referenced every active code on the site against the two most-current upstream lists, demoted four Anime Vanguards strings that had quietly stopped paying out, and rewrote any notes that read as present-tense for codes already in the expired archive. Established the "no contradicting-tone" rule: every line of editorial copy on the page about a code should agree with the code\'s current status.',
  },
  {
    date: '2026-05-21',
    title: 'Weekly Sunday refresh cycle established',
    type: 'cadence',
    body:
      'Locked in the weekly cadence — every Sunday the active codes list is re-tested, the expired archive is updated, the date stamps are bumped, the tier-list interactive data is re-synced, and the sitemap is pinged. The refresh promise component went live on the codes hub the same day. The intent is that a reader who lands on a Monday can trust that the page they are looking at is at most a few days from being human-verified.',
  },
  {
    date: '2026-05-20',
    title: 'First Blox Fruits tier list published',
    type: 'tool',
    body:
      'Initial tier list shipped at /blox-fruits/tier-list with ten fruits ranked across overall, PvP and grinding axes. Each fruit got a one-line summary, a rationale paragraph, a pros and cons list and a recommended combo. The fruit slugs (dragon, leopard, dough, buddha, spirit, venom, shadow, rumble, light, phoenix) all became anchor targets so other pages could deep-link into a specific ranking.',
  },
  {
    date: '2024-01',
    title: 'Site launched',
    type: 'launch',
    body:
      'GameCodes Hub launched as a personal project by Ben Yu, born out of frustration with stale code lists. The initial focus was multi-game — Blox Fruits alongside Anime Vanguards, Genshin Impact, Honkai Star Rail, King Legacy and Pet Simulator 99. The editorial principle has been the same since day one: every code redeemed on a real account before publication, every expired code archived rather than deleted.',
  },
];

const TYPE_STYLES: Record<ChangelogEntry['type'], { label: string; cls: string }> = {
  launch: { label: 'Launch', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  tool: { label: 'Tool', cls: 'bg-brand-50 text-brand-700 ring-brand-200' },
  editorial: { label: 'Editorial', cls: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  structure: { label: 'Structure', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  cadence: { label: 'Cadence', cls: 'bg-slate-100 text-slate-700 ring-slate-200' },
};

function formatDate(iso: string): string {
  if (iso.length <= 7) {
    const [y, m] = iso.split('-');
    const name = new Date(Number(y), Number(m) - 1).toLocaleString('en-US', { month: 'long' });
    return `${name} ${y}`;
  }
  return new Date(iso).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ChangelogPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Site changelog',
    url: absoluteUrl('/changelog'),
    description: 'Dated log of meaningful changes to GameCodes Hub.',
    hasPart: ENTRIES.map((e) => ({
      '@type': 'CreativeWork',
      headline: e.title,
      datePublished: e.date,
      abstract: e.body.slice(0, 160) + (e.body.length > 160 ? '…' : ''),
    })),
  };

  return (
    <Container className="max-w-3xl py-12">
      <JsonLd id="ld-changelog" data={ld} />

      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
          Site changelog
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          What changed on {siteConfig.shortName}
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          A dated log of every meaningful change — new tools, editorial
          layers, schema upgrades, and the structural decisions that took the
          site from a multi-game aggregator to a single-game Blox Fruits
          resource. The newest entry sits at the top.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          For weekly code refreshes, see the date stamp on the{' '}
          <Link href="/blox-fruits" className="font-semibold text-brand-700 hover:underline">
            codes hub
          </Link>
          ; the changelog records structural and editorial changes, not
          routine maintenance.
        </p>
      </header>

      <div className="mt-12">
        <SectionHeading id="entries" icon="calendar">
          Timeline
        </SectionHeading>
      </div>

      <ol className="mt-6 space-y-6">
        {ENTRIES.map((e) => {
          const style = TYPE_STYLES[e.type];
          return (
            <li
              key={e.date + e.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <time
                  dateTime={e.date}
                  className="text-sm font-bold text-slate-900"
                >
                  {formatDate(e.date)}
                </time>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${style.cls}`}
                >
                  {style.label}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                {e.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {e.body}
              </p>
            </li>
          );
        })}
      </ol>

      <p className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        For the methodology behind every entry above — the redeem test, the
        sourcing pipeline, the expired-archive rules — see the{' '}
        <Link
          href="/methodology"
          className="font-semibold text-brand-700 hover:underline"
        >
          verification methodology page
        </Link>
        .
      </p>
    </Container>
  );
}
