import type { GameCode } from '@/lib/types';
import { formatDate } from '@/lib/codes';
import { CopyButton } from './CopyButton';

interface Props {
  entry: GameCode;
  variant?: 'active' | 'expired';
}

export function CodeCard({ entry, variant = 'active' }: Props) {
  const isExpired = variant === 'expired' || entry.status === 'expired';
  return (
    <article
      className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
        isExpired
          ? 'border-slate-200 bg-slate-50'
          : 'border-brand-100 bg-white shadow-sm'
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <code
            className={`block break-all rounded px-2 py-1 font-mono text-sm sm:text-base ${
              isExpired
                ? 'bg-slate-200 text-slate-500 line-through'
                : 'bg-brand-50 text-brand-900'
            }`}
          >
            {entry.code}
          </code>
          {isExpired ? (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
              Expired
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Working
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
