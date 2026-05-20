interface Props {
  gameName: string;
}

export function RefreshPromise({ gameName }: Props) {
  return (
    <aside
      role="note"
      className="rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-slate-700"
    >
      <p className="flex items-start gap-2">
        <span aria-hidden="true" className="text-base leading-none">🔄</span>
        <span>
          <strong className="text-slate-900">We refresh this list every Sunday.</strong>{' '}
          New {gameName} codes drop with each major update or partnered livestream —
          bookmark this page so you don't miss the next one.
        </span>
      </p>
    </aside>
  );
}
