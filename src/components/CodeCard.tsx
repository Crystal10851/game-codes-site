import type { GameCode } from '@/lib/types';
import { formatDate, isRecentlyAdded } from '@/lib/codes';
import { categorizeReward } from '@/lib/rewardType';
import { CopyButton } from './CopyButton';
import { RewardIcon } from './RewardIcon';

interface Props {
  entry: GameCode;
  variant?: 'active' | 'expired';
}

export function CodeCard({ entry, variant = 'active' }: Props) {
  const isExpired = variant === 'expired' || entry.status === 'expired';
  const isFresh = !isExpired && isRecentlyAdded(entry.addedOn);
  const isPermanent = !isExpired && entry.expiresOn === null && !isFresh && isOlderThanMonths(entry.addedOn, 6);
  const meta = categorizeReward(entry.reward);

  return (
    <article
      className={`flex flex-col gap-3 rounded-lg border-l-4 bg-white shadow-sm sm:flex-row sm:items-center sm:justify-between ${
        isExpired
          ? 'border-l-slate-300 border-y border-r border-y-slate-200 border-r-slate-200 bg-slate-50'
          : `${meta.borderClass.replace('border-', 'border-l-')} border-y border-r border-y-slate-200 border-r-slate-200`
      } p-4`}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <code
            className={`block break-all rounded px-2 py-1 font-mono text-sm sm:text-base ${
              isExpired
                ? 'bg-slate-200 text-slate-500 line-through'
                : 'bg-slate-100 text-slate-900'
            }`}
          >
            {entry.code}
          </code>
          {!isExpired && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ${meta.bgClass} ${meta.textClass} ${meta.ringClass}`}
            >
              <RewardIcon type={meta.type} className="h-3 w-3" />
              {meta.label}
            </span>
          )}
          {isExpired ? (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-slate-600">
              Expired
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
              Working
            </span>
          )}
          {isFresh && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm">
              New
            </span>
          )}
          {isPermanent && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-800">
              Permanent
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Reward:</span>{' '}
          {entry.reward}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Added {formatDate(entry.addedOn)}
          {entry.expiresOn ? ` · Expired ${formatDate(entry.expiresOn)}` : ''}
        </p>
        {entry.notes ? (
          <p className="mt-1 text-xs italic text-slate-500">{entry.notes}</p>
        ) : null}
      </div>
      {!isExpired && (
        <div className="sm:ml-4">
          <CopyButton value={entry.code} />
        </div>
      )}
    </article>
  );
}

function isOlderThanMonths(iso: string, months: number): boolean {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return d < cutoff;
}
