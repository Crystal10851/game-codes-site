'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import tierListData from '../../../../data/games/blox-fruits/tier-list.json';

type Tier = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

interface QuizSignals {
  budget: 'low' | 'mid' | 'high';
  roles: string[];
  newPlayerFriendly: boolean;
  partyFit: string[];
}

interface QuizFruit {
  slug: string;
  name: string;
  type: string;
  rarity: string;
  emoji?: string;
  oneLineReason?: string;
  tiers: { overall: Tier; pvp: Tier; grinding: Tier };
  quizSignals?: QuizSignals;
}

type Budget = 'low' | 'mid' | 'high';
type Role = 'pvp' | 'grinding' | 'boss' | 'trading' | 'fun';
type Experience = 'new' | 'returning' | 'veteran';
type Party = 'solo' | 'duo' | 'group';

interface Answers {
  budget: Budget | null;
  role: Role | null;
  experience: Experience | null;
  party: Party | null;
}

const BUDGET_RANK: Record<Budget, number> = { low: 0, mid: 1, high: 2 };

const RARITY_STYLES: Record<string, string> = {
  Mythical: 'bg-rose-50 text-rose-700 ring-rose-200',
  Legendary: 'bg-amber-50 text-amber-700 ring-amber-200',
  Rare: 'bg-sky-50 text-sky-700 ring-sky-200',
  Uncommon: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Common: 'bg-slate-50 text-slate-600 ring-slate-200',
};

interface ScoredFruit {
  fruit: QuizFruit;
  score: number;
  reasons: string[];
}

function scoreFruit(fruit: QuizFruit, answers: Answers): ScoredFruit | null {
  const sig = fruit.quizSignals;
  if (!sig) return null;
  if (!answers.budget || !answers.role || !answers.experience || !answers.party) {
    return null;
  }

  let score = 0;
  const reasons: string[] = [];

  if (BUDGET_RANK[sig.budget] > BUDGET_RANK[answers.budget]) {
    return null;
  }
  if (BUDGET_RANK[sig.budget] === BUDGET_RANK[answers.budget]) {
    score += 2;
    reasons.push(`Fits your ${answers.budget}-budget ceiling`);
  } else {
    score += 1;
    reasons.push(`Comfortably under your budget`);
  }

  if (sig.roles.includes(answers.role)) {
    score += 5;
    const roleLabel: Record<Role, string> = {
      pvp: 'PvP',
      grinding: 'grinding',
      boss: 'bossing',
      trading: 'trading value',
      fun: 'just-for-fun runs',
    };
    reasons.push(`Built for ${roleLabel[answers.role]}`);
  }

  if (answers.experience === 'new') {
    if (sig.newPlayerFriendly) {
      score += 3;
      reasons.push('Forgiving for first-time owners');
    } else {
      score -= 2;
    }
  } else if (answers.experience === 'veteran') {
    if (!sig.newPlayerFriendly) {
      score += 1;
      reasons.push('Rewards experienced kit-mastery');
    }
  }

  if (sig.partyFit.includes(answers.party)) {
    score += 2;
    const partyLabel: Record<Party, string> = {
      solo: 'solo play',
      duo: 'duo fights',
      group: 'group raids and sea events',
    };
    reasons.push(`Strong fit for ${partyLabel[answers.party]}`);
  }

  if (fruit.tiers.overall === 'S+') score += 1.5;
  else if (fruit.tiers.overall === 'S') score += 1;
  else if (fruit.tiers.overall === 'A') score += 0.5;

  return { fruit, score, reasons };
}

export default function FruitQuiz() {
  const [answers, setAnswers] = useState<Answers>({
    budget: null,
    role: null,
    experience: null,
    party: null,
  });

  const fruits = tierListData.fruits as QuizFruit[];

  const recommendations = useMemo((): ScoredFruit[] => {
    if (!answers.budget || !answers.role || !answers.experience || !answers.party) {
      return [];
    }
    const scored = fruits
      .map((f) => scoreFruit(f, answers))
      .filter((s): s is ScoredFruit => s !== null)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }, [answers, fruits]);

  const step =
    answers.budget === null
      ? 1
      : answers.role === null
      ? 2
      : answers.experience === null
      ? 3
      : answers.party === null
      ? 4
      : 5;

  const reset = () =>
    setAnswers({ budget: null, role: null, experience: null, party: null });

  return (
    <div className="space-y-6">
      <ProgressBar step={step} total={4} />

      {step === 1 && (
        <Question
          number={1}
          title="What's your Robux budget?"
          subtitle="This filters fruits you can realistically afford right now."
          options={[
            {
              value: 'low',
              label: 'No Robux to spend',
              hint: 'I want a fruit I can grind Beli for under 1M',
              emoji: '💰',
            },
            {
              value: 'mid',
              label: 'Up to ~1.5K Robux',
              hint: "I'll spend on a good Legendary",
              emoji: '💵',
            },
            {
              value: 'high',
              label: '2K+ Robux available',
              hint: "I'm willing to spend on a Mythical",
              emoji: '💎',
            },
          ]}
          onPick={(value) =>
            setAnswers((a) => ({ ...a, budget: value as Budget }))
          }
        />
      )}

      {step === 2 && (
        <Question
          number={2}
          title="What do you want this fruit to do?"
          subtitle="Pick the single thing that matters most. You can always buy a second fruit later."
          options={[
            {
              value: 'pvp',
              label: 'Win PvP fights',
              hint: '1v1s, ganking, bounty hunting',
              emoji: '⚔️',
            },
            {
              value: 'grinding',
              label: 'Grind levels fast',
              hint: 'Clear mob camps efficiently',
              emoji: '⚡',
            },
            {
              value: 'boss',
              label: 'Solo bosses and raids',
              hint: 'Awakening fragments, Sea Beast hunts',
              emoji: '👑',
            },
            {
              value: 'fun',
              label: 'Just have fun',
              hint: 'Unique kit, novelty, or budget pick',
              emoji: '🎮',
            },
          ]}
          onBack={() => setAnswers((a) => ({ ...a, budget: null }))}
          onPick={(value) =>
            setAnswers((a) => ({ ...a, role: value as Role }))
          }
        />
      )}

      {step === 3 && (
        <Question
          number={3}
          title="How experienced are you with Blox Fruits?"
          subtitle="This adjusts toward forgiving kits versus high-ceiling ones."
          options={[
            {
              value: 'new',
              label: 'New player',
              hint: 'First fruit, still learning the basics',
              emoji: '🌱',
            },
            {
              value: 'returning',
              label: 'Returning player',
              hint: 'I have some hours, comfortable with combos',
              emoji: '🔄',
            },
            {
              value: 'veteran',
              label: 'Veteran',
              hint: '500+ hours, I want a high-skill fruit',
              emoji: '🎯',
            },
          ]}
          onBack={() => setAnswers((a) => ({ ...a, role: null }))}
          onPick={(value) =>
            setAnswers((a) => ({ ...a, experience: value as Experience }))
          }
        />
      )}

      {step === 4 && (
        <Question
          number={4}
          title="Who are you playing with?"
          subtitle="Fruits that shine solo aren't always the strongest in group raids."
          options={[
            {
              value: 'solo',
              label: 'Mostly solo',
              hint: 'Self-sufficient kit matters most',
              emoji: '🧍',
            },
            {
              value: 'duo',
              label: 'Duo with a friend',
              hint: 'Coordinated PvP and bounty runs',
              emoji: '🤝',
            },
            {
              value: 'group',
              label: 'Group raids and sea events',
              hint: 'AOE and crowd control matter more',
              emoji: '👥',
            },
          ]}
          onBack={() => setAnswers((a) => ({ ...a, experience: null }))}
          onPick={(value) =>
            setAnswers((a) => ({ ...a, party: value as Party }))
          }
        />
      )}

      {step === 5 && (
        <Results
          recommendations={recommendations}
          onReset={reset}
          answers={answers}
        />
      )}
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const displayStep = Math.min(step, total);
  const pct = step > total ? 100 : Math.round(((step - 1) / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          {step > total
            ? `All ${total} questions answered`
            : `Question ${displayStep} of ${total}`}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Question({
  number,
  title,
  subtitle,
  options,
  onPick,
  onBack,
}: {
  number: number;
  title: string;
  subtitle: string;
  options: { value: string; label: string; hint: string; emoji: string }[];
  onPick: (value: string) => void;
  onBack?: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
        Step {number}
      </p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPick(opt.value)}
            className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-2xl ring-1 ring-slate-200 group-hover:bg-white"
            >
              {opt.emoji}
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-slate-900">
                {opt.label}
              </span>
              <span className="mt-0.5 block text-xs text-slate-600">
                {opt.hint}
              </span>
            </span>
          </button>
        ))}
      </div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-5 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back
        </button>
      )}
    </div>
  );
}

function Results({
  recommendations,
  onReset,
  answers,
}: {
  recommendations: ScoredFruit[];
  onReset: () => void;
  answers: Answers;
}) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          No clean matches at your budget
        </h2>
        <p className="mt-2 text-slate-700">
          The combination you picked doesn't fit any single fruit cleanly. Try
          relaxing the budget or experience filter — most playstyles have a
          better answer one tier up.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Retake the quiz
        </button>
      </div>
    );
  }

  const roleLabel: Record<Role, string> = {
    pvp: 'PvP',
    grinding: 'grinding',
    boss: 'bossing',
    trading: 'trading',
    fun: 'just-for-fun runs',
  };
  const hasRoleMatch = answers.role
    ? recommendations.some((rec) =>
        rec.fruit.quizSignals?.roles.includes(answers.role!),
      )
    : true;

  return (
    <div className="space-y-5">
      {hasRoleMatch ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Your top matches
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Three fruits that fit your answers
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Ranked by overall fit. Tap any card to jump to the full tier-list
            entry for pros, cons, and best sword/style combos.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            Closest fits — no exact role match
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Nothing in your budget is actually built for {answers.role ? roleLabel[answers.role] : 'this role'}
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            The three picks below are the best of what your budget allows, but
            none of them is genuinely a {answers.role ? roleLabel[answers.role] : 'role'} specialist —
            read each card's reasons to see what it actually does well.
            Raising your budget one tier usually unlocks a real match;{' '}
            <button
              type="button"
              onClick={onReset}
              className="font-semibold text-amber-900 underline-offset-2 hover:underline"
            >
              retake the quiz
            </button>{' '}
            to try.
          </p>
        </div>
      )}

      <ol className="space-y-4">
        {recommendations.map((rec, i) => (
          <RecommendationCard
            key={rec.fruit.slug}
            rec={rec}
            rank={i + 1}
            primary={i === 0}
          />
        ))}
      </ol>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <p>
          <strong className="text-slate-900">Want to compare?</strong> The full{' '}
          <Link
            href="/blox-fruits/tier-list"
            className="font-semibold text-brand-700 hover:underline"
          >
            tier list
          </Link>{' '}
          ranks all 25 active fruits across overall, PvP, and grinding. Pair
          your pick with active{' '}
          <Link
            href="/blox-fruits/latest"
            className="font-semibold text-brand-700 hover:underline"
          >
            XP codes
          </Link>{' '}
          for the awakening grind.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Retake quiz
          </button>
          <span className="text-xs text-slate-500 self-center">
            Answers: {answers.budget} budget · {answers.role} focus ·{' '}
            {answers.experience} player · {answers.party}
          </span>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({
  rec,
  rank,
  primary,
}: {
  rec: ScoredFruit;
  rank: number;
  primary: boolean;
}) {
  const { fruit, reasons } = rec;
  const rarityClass = RARITY_STYLES[fruit.rarity] ?? RARITY_STYLES.Common;
  const delay = (rank - 1) * 120;
  return (
    <li
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-fade-in-up relative rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        primary
          ? 'border-brand-300 ring-2 ring-brand-200 animate-pulse-glow'
          : 'border-slate-200'
      }`}
    >
      {primary && (
        <span className="absolute -top-3 left-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md ring-2 ring-white">
          <span aria-hidden>🏆</span>
          Best match
        </span>
      )}
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold shadow-sm ${
              primary
                ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white ring-2 ring-brand-200'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            #{rank}
          </span>
          {fruit.emoji && (
            <span
              aria-hidden
              className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-4xl ring-1 ring-slate-200 shadow-sm ${
                primary ? 'animate-float' : ''
              }`}
            >
              {fruit.emoji}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900">{fruit.name}</h3>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${rarityClass}`}
            >
              {fruit.rarity}
            </span>
            <span className="text-xs text-slate-500">{fruit.type}</span>
          </div>
          {fruit.oneLineReason && (
            <p className="mt-1 text-sm text-slate-700">{fruit.oneLineReason}</p>
          )}
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            {reasons.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span
                  aria-hidden
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <TierBadge label="Overall" tier={fruit.tiers.overall} />
            <TierBadge label="PvP" tier={fruit.tiers.pvp} />
            <TierBadge label="Grinding" tier={fruit.tiers.grinding} />
          </div>
          <Link
            href={`/blox-fruits/tier-list#${fruit.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
          >
            See full {fruit.name} breakdown →
          </Link>
        </div>
      </div>
    </li>
  );
}

const TIER_STYLES: Record<Tier, string> = {
  'S+': 'bg-rose-100 text-rose-800 ring-rose-300',
  S: 'bg-orange-100 text-orange-800 ring-orange-300',
  A: 'bg-amber-100 text-amber-800 ring-amber-300',
  B: 'bg-emerald-100 text-emerald-800 ring-emerald-300',
  C: 'bg-sky-100 text-sky-800 ring-sky-300',
  D: 'bg-slate-100 text-slate-700 ring-slate-300',
};

function TierBadge({ label, tier }: { label: string; tier: Tier }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 ${TIER_STYLES[tier]}`}
    >
      <span className="font-medium opacity-75">{label}</span>
      <span className="font-bold">{tier}</span>
    </span>
  );
}
