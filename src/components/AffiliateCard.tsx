import type { AffiliateOffer } from '@/lib/affiliates';

export function AffiliateCard({ offer }: { offer: AffiliateOffer }) {
  const isPlaceholder = !offer.enabled;

  return (
    <article
      className={`flex h-full flex-col rounded-xl border p-5 transition ${
        isPlaceholder
          ? 'border-dashed border-slate-300 bg-slate-50'
          : 'border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md'
      }`}
    >
      {offer.badge && (
        <span className="mb-2 inline-flex w-fit items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
          {offer.badge}
        </span>
      )}
      <h3 className="text-base font-bold text-slate-900">{offer.title}</h3>
      <p className="mt-1 flex-1 text-sm text-slate-600">{offer.description}</p>
      {isPlaceholder ? (
        <span className="mt-4 inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
          Configure in <code className="ml-1 font-mono">affiliates.ts</code>
        </span>
      ) : (
        <a
          href={offer.href}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-1 rounded-md bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          {offer.cta}
          <span aria-hidden>→</span>
        </a>
      )}
    </article>
  );
}
