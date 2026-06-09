import { formatDate } from '@/lib/codes';
import { siteConfig } from '@/lib/site';

interface Props {
  verifiedOn: string;
  cadence?: 'daily' | 'weekly';
  variant?: 'default' | 'compact';
}

export function AuthorByline({ verifiedOn, cadence = 'weekly', variant = 'default' }: Props) {
  const cadenceLabel =
    cadence === 'daily' ? 'Verified daily' : 'Refreshed weekly';
  const initials = siteConfig.shortName.slice(0, 2).toUpperCase();

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-[10px] font-extrabold text-white"
          >
            {initials}
          </span>
          <span>
            By <strong className="text-slate-700">{siteConfig.name} Editorial</strong>
          </span>
        </div>
        <span aria-hidden>·</span>
        <span>{cadenceLabel}</span>
        <span aria-hidden>·</span>
        <span>
          Updated <time dateTime={verifiedOn}>{formatDate(verifiedOn)}</time>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span
        aria-hidden
        className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-base font-extrabold text-white ring-2 ring-white shadow-md"
      >
        {initials}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-emerald-600 ring-2 ring-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900">
          {siteConfig.name} Editorial Team
        </p>
        <p className="text-xs text-slate-500">
          Codes editor · {cadenceLabel}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Last verified <time dateTime={verifiedOn} className="font-semibold text-slate-900">{formatDate(verifiedOn)}</time>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
            Editorially verified
          </span>
        </div>
      </div>
    </div>
  );
}
