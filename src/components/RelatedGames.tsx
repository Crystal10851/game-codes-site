import Link from 'next/link';
import { getAllGames, getGameSummary } from '@/lib/games';
import { SectionHeading } from './SectionHeading';

interface Props {
  excludeSlug?: string;
  heading?: string;
}

export function RelatedGames({ excludeSlug, heading = 'More game code guides' }: Props) {
  const games = getAllGames()
    .filter((g) => g.slug !== excludeSlug)
    .slice(0, 6);

  if (games.length === 0) return null;

  return (
    <section aria-labelledby="related-games-heading">
      <SectionHeading
        id="related-games-heading"
        icon="sparkles"
        subtitle="Other games we keep code lists for, all editorially verified on the same schedule."
      >
        {heading}
      </SectionHeading>
      <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => {
          const summary = getGameSummary(g);
          const base = g.color ?? '#1b3aa5';
          const latestActive = g.codes.find((c) => c.status === 'active');
          return (
            <li key={g.slug}>
              <Link
                href={`/${g.slug}/latest`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  {g.heroImage && (
                    <img
                      src={g.heroImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-16"
                    style={{
                      background: `linear-gradient(to top, ${base}cc 0%, transparent 100%)`,
                    }}
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-800 shadow-sm ring-1 ring-black/5 backdrop-blur">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: base }}
                    />
                    {g.platform}
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                    {summary.activeCount} active
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-extrabold leading-tight text-slate-900 group-hover:text-brand-700">
                    {g.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                    {g.tagline}
                  </p>

                  {latestActive && (
                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Latest working
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xs font-bold text-slate-900">
                        {latestActive.code}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-600">
                        {latestActive.reward}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-500">
                      {summary.expiredCount} archived
                    </span>
                    <span className="font-bold text-brand-700 group-hover:underline">
                      View codes →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
