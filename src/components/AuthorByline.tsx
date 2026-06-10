import Link from 'next/link';
import { formatDate } from '@/lib/codes';
import { primaryEditor, type Editor } from '@/lib/site';

interface Props {
  verifiedOn: string;
  cadence?: 'daily' | 'weekly';
  variant?: 'default' | 'compact';
  editor?: Editor;
}

function Avatar({ editor, size = 'lg' }: { editor: Editor; size?: 'sm' | 'lg' }) {
  const [from, to] = editor.avatarGradient;
  const dim = size === 'lg' ? 'h-12 w-12 text-base ring-2' : 'h-7 w-7 text-[10px] ring-1';
  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-md ring-white ${dim}`}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      {editor.avatarInitials}
      {size === 'lg' && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-emerald-600 ring-2 ring-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      )}
    </span>
  );
}

export function AuthorByline({
  verifiedOn,
  cadence = 'weekly',
  variant = 'default',
  editor = primaryEditor,
}: Props) {
  const cadenceLabel = cadence === 'daily' ? 'Verified daily' : 'Refreshed weekly';
  const editorHref = `/editors/${editor.slug}`;

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <Link href={editorHref} className="flex items-center gap-2 transition hover:text-slate-800">
          <Avatar editor={editor} size="sm" />
          <span>
            By <strong className="text-slate-700">{editor.name}</strong>
          </span>
        </Link>
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
      <Avatar editor={editor} size="lg" />
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900">
          <Link href={editorHref} className="transition hover:text-brand-700">
            {editor.name}
          </Link>
        </p>
        <p className="text-xs text-slate-500">{editor.role}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{editor.shortBio}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Last verified{' '}
            <time dateTime={verifiedOn} className="font-semibold text-slate-900">
              {formatDate(verifiedOn)}
            </time>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
            {cadenceLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
