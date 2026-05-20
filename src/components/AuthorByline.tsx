import { formatDate } from '@/lib/codes';
import { siteConfig } from '@/lib/site';

interface Props {
  verifiedOn: string;
  cadence?: 'daily' | 'weekly';
}

export function AuthorByline({ verifiedOn, cadence = 'weekly' }: Props) {
  const cadenceLabel =
    cadence === 'daily' ? 'Verified daily' : 'Refreshed weekly';
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white"
        >
          {siteConfig.shortName.slice(0, 2).toUpperCase()}
        </span>
        <span>
          By <strong className="text-slate-700">{siteConfig.name} Editorial</strong>
        </span>
      </div>
      <span aria-hidden="true">·</span>
      <span>{cadenceLabel}</span>
      <span aria-hidden="true">·</span>
      <span>
        Last verified <time dateTime={verifiedOn}>{formatDate(verifiedOn)}</time>
      </span>
    </div>
  );
}
