export type RewardType =
  | 'xp'
  | 'statReset'
  | 'currency'
  | 'reroll'
  | 'material'
  | 'pet'
  | 'title'
  | 'bundle'
  | 'other';

export interface RewardMeta {
  type: RewardType;
  label: string;
  bgClass: string;
  textClass: string;
  ringClass: string;
  borderClass: string;
  barClass: string;
}

const KEYWORDS: Record<RewardType, RegExp> = {
  xp: /\b(xp|exp|experience|boost)\b/i,
  statReset: /\b(stat reset|refund)\b/i,
  reroll: /\b(reroll|rerolls)\b/i,
  currency: /\b(beli|mora|cash|credits|gold|diamonds|gems|stellar jade|primogems|robux)\b/i,
  material: /\b(shards|ore|stones|wit|guide|aether|fuel|memoria|fragments|flowers|fortune|key|keys|adventurer's|enhancement|essence)\b/i,
  pet: /\b(pet|dragon|egg|titanic)\b/i,
  title: /\b(title)\b/i,
  bundle: /,.*,/,
  other: /.*/,
};

const PRIORITY: RewardType[] = [
  'statReset',
  'reroll',
  'xp',
  'pet',
  'title',
  'bundle',
  'currency',
  'material',
  'other',
];

const META: Record<RewardType, Omit<RewardMeta, 'type'>> = {
  xp: {
    label: 'XP Boost',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    ringClass: 'ring-amber-200',
    borderClass: 'border-amber-200',
    barClass: 'bg-amber-400',
  },
  statReset: {
    label: 'Stat Reset',
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-800',
    ringClass: 'ring-violet-200',
    borderClass: 'border-violet-200',
    barClass: 'bg-violet-400',
  },
  reroll: {
    label: 'Reroll',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-800',
    ringClass: 'ring-sky-200',
    borderClass: 'border-sky-200',
    barClass: 'bg-sky-400',
  },
  currency: {
    label: 'Currency',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-800',
    ringClass: 'ring-emerald-200',
    borderClass: 'border-emerald-200',
    barClass: 'bg-emerald-400',
  },
  material: {
    label: 'Material',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-800',
    ringClass: 'ring-indigo-200',
    borderClass: 'border-indigo-200',
    barClass: 'bg-indigo-400',
  },
  pet: {
    label: 'Pet / Unit',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-800',
    ringClass: 'ring-rose-200',
    borderClass: 'border-rose-200',
    barClass: 'bg-rose-400',
  },
  title: {
    label: 'Title',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    ringClass: 'ring-slate-200',
    borderClass: 'border-slate-200',
    barClass: 'bg-slate-400',
  },
  bundle: {
    label: 'Bundle',
    bgClass: 'bg-brand-50',
    textClass: 'text-brand-800',
    ringClass: 'ring-brand-200',
    borderClass: 'border-brand-200',
    barClass: 'bg-brand-400',
  },
  other: {
    label: 'Reward',
    bgClass: 'bg-slate-50',
    textClass: 'text-slate-700',
    ringClass: 'ring-slate-200',
    borderClass: 'border-slate-200',
    barClass: 'bg-slate-300',
  },
};

export function categorizeReward(reward: string): RewardMeta {
  for (const type of PRIORITY) {
    if (KEYWORDS[type].test(reward)) {
      return { type, ...META[type] };
    }
  }
  return { type: 'other', ...META.other };
}

export function summarizeRewardTypes(
  rewards: string[],
): { type: RewardType; label: string; count: number; bgClass: string; textClass: string; barClass: string }[] {
  const tally = new Map<RewardType, number>();
  for (const r of rewards) {
    const meta = categorizeReward(r);
    tally.set(meta.type, (tally.get(meta.type) ?? 0) + 1);
  }
  return Array.from(tally.entries())
    .map(([type, count]) => ({
      type,
      label: META[type].label,
      count,
      bgClass: META[type].bgClass,
      textClass: META[type].textClass,
      barClass: META[type].barClass,
    }))
    .sort((a, b) => b.count - a.count);
}
