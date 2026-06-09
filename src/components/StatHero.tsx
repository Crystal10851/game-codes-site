import { formatDate } from '@/lib/codes';

interface StatTileProps {
  label: string;
  value: string | number;
  accent?: 'brand' | 'emerald' | 'amber' | 'rose' | 'slate' | 'sky' | 'violet';
  hint?: string;
}

const ACCENT: Record<NonNullable<StatTileProps['accent']>, { bar: string; text: string; valueText: string }> = {
  brand: { bar: 'bg-brand-500', text: 'text-brand-700', valueText: 'text-slate-900' },
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-700', valueText: 'text-slate-900' },
  amber: { bar: 'bg-amber-500', text: 'text-amber-700', valueText: 'text-slate-900' },
  rose: { bar: 'bg-rose-500', text: 'text-rose-700', valueText: 'text-slate-900' },
  slate: { bar: 'bg-slate-400', text: 'text-slate-600', valueText: 'text-slate-900' },
  sky: { bar: 'bg-sky-500', text: 'text-sky-700', valueText: 'text-slate-900' },
  violet: { bar: 'bg-violet-500', text: 'text-violet-700', valueText: 'text-slate-900' },
};

export function StatHero({ tiles }: { tiles: StatTileProps[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => {
        const accent = ACCENT[tile.accent ?? 'slate'];
        return (
          <div
            key={tile.label}
            className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <span className={`absolute left-0 top-0 h-full w-1 ${accent.bar}`} aria-hidden />
            <p className={`text-xs font-bold uppercase tracking-wider ${accent.text}`}>
              {tile.label}
            </p>
            <p className={`mt-1 text-2xl font-extrabold ${accent.valueText}`}>
              {tile.value}
            </p>
            {tile.hint && (
              <p className="mt-1 text-xs text-slate-500">{tile.hint}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function buildCodeStats({
  activeCount,
  expiredCount,
  lastUpdated,
  freshCount,
}: {
  activeCount: number;
  expiredCount: number;
  lastUpdated: string;
  freshCount: number;
}): StatTileProps[] {
  return [
    {
      label: 'Active codes',
      value: activeCount,
      accent: 'emerald',
      hint: 'Verified working in-game',
    },
    {
      label: 'New this week',
      value: freshCount,
      accent: freshCount > 0 ? 'rose' : 'slate',
      hint: freshCount > 0 ? 'Added in the past 7 days' : 'No new codes this week',
    },
    {
      label: 'Archived',
      value: expiredCount,
      accent: 'slate',
      hint: 'Expired codes kept for reference',
    },
    {
      label: 'Last verified',
      value: formatDate(lastUpdated),
      accent: 'brand',
      hint: 'Cross-checked against the live game',
    },
  ];
}
