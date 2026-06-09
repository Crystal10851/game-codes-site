import Link from 'next/link';
import { getAllGames, getGameSummary } from '@/lib/games';
import { SectionHeading } from './SectionHeading';

interface Props {
  excludeSlug?: string;
  heading?: string;
}

function darken(hex: string, factor: number): string {
  const clean = hex.replace('#', '');
  const r = Math.max(0, Math.floor(parseInt(clean.slice(0, 2), 16) * factor));
  const g = Math.max(0, Math.floor(parseInt(clean.slice(2, 4), 16) * factor));
  const b = Math.max(0, Math.floor(parseInt(clean.slice(4, 6), 16) * factor));
  return `rgb(${r}, ${g}, ${b})`;
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
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => {
          const summary = getGameSummary(g);
          const base = g.color ?? '#1b3aa5';
          const background = `linear-gradient(135deg, ${base} 0%, ${darken(base, 0.75)} 100%)`;
          return (
            <li key={g.slug}>
              <Link
                href={`/${g.slug}/latest`}
                className="group block overflow-hidden rounded-xl text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background }}
              >
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                    {g.platform}
                  </p>
                  <p className="mt-1 text-lg font-extrabold leading-tight">
                    {g.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-white/85">
                    {g.tagline}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3 text-xs">
                    <span className="font-semibold text-white">
                      {summary.activeCount} active
                    </span>
                    <span className="text-white/75">{summary.expiredCount} archived</span>
                    <span aria-hidden className="text-white opacity-70 transition group-hover:translate-x-0.5">
                      →
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
