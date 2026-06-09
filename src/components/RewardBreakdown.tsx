import { summarizeRewardTypes } from '@/lib/rewardType';
import { RewardIcon } from './RewardIcon';

interface Props {
  rewards: string[];
}

export function RewardBreakdown({ rewards }: Props) {
  if (rewards.length === 0) return null;
  const summary = summarizeRewardTypes(rewards);
  const total = rewards.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Reward type breakdown
        </h3>
        <p className="text-xs text-slate-500">{total} active {total === 1 ? 'code' : 'codes'}</p>
      </div>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
        {summary.map((s) => (
          <div
            key={s.type}
            className={s.barClass}
            style={{ width: `${(s.count / total) * 100}%` }}
            title={`${s.label}: ${s.count}`}
          />
        ))}
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {summary.map((s) => (
          <li
            key={s.type}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${s.bgClass} ${s.textClass}`}
          >
            <RewardIcon type={s.type} className="h-4 w-4" />
            <span className="font-semibold">{s.label}</span>
            <span className="ml-auto font-mono text-xs">
              {s.count} · {Math.round((s.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
