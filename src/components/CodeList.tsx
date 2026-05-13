import type { GameCode } from '@/lib/types';
import { CodeCard } from './CodeCard';

export function CodeList({
  entries,
  variant,
  emptyMessage,
}: {
  entries: GameCode[];
  variant?: 'active' | 'expired';
  emptyMessage?: string;
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        {emptyMessage ?? 'No codes available right now. Check back soon.'}
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {entries.map((c) => (
        <CodeCard key={c.code} entry={c} variant={variant} />
      ))}
    </div>
  );
}
