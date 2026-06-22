import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { JsonLd } from '@/components/JsonLd';
import { editors, absoluteUrl, siteConfig } from '@/lib/site';
import { getAllGames, getGameSummary } from '@/lib/games';
import { getLastUpdated } from '@/lib/codes';
import { buildMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return editors.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const editor = editors.find((e) => e.slug === slug);
  if (!editor) return {};
  return buildMetadata({
    title: `${editor.name} — ${editor.role} at ${siteConfig.name}`,
    description: editor.shortBio,
    path: `/editors/${editor.slug}`,
    type: 'article',
  });
}

export default async function EditorPage({ params }: PageProps) {
  const { slug } = await params;
  const editor = editors.find((e) => e.slug === slug);
  if (!editor) notFound();

  const games = getAllGames();
  const articles = games.flatMap((g) => {
    const lastUpdated = getLastUpdated(g);
    const summary = getGameSummary(g);
    return [
      {
        href: `/${g.slug}`,
        title: `${g.name} Codes (${new Date(lastUpdated).toLocaleString('en', { month: 'long', year: 'numeric' })})`,
        kicker: 'Codes hub',
        game: g.name,
        date: lastUpdated,
        activeCount: summary.activeCount,
      },
      ...(g.slug === 'blox-fruits'
        ? [
            {
              href: `/${g.slug}/tier-list`,
              title: `${g.name} Tier List — all 25 active fruits ranked`,
              kicker: 'Tier list',
              game: g.name,
              date: lastUpdated,
              activeCount: summary.activeCount,
            },
            {
              href: `/${g.slug}/which-fruit`,
              title: `Which ${g.name} fruit should I buy? — interactive decision quiz`,
              kicker: 'Interactive tool',
              game: g.name,
              date: lastUpdated,
              activeCount: summary.activeCount,
            },
          ]
        : []),
    ];
  });

  articles.sort((a, b) => (a.date < b.date ? 1 : -1));

  const [from, to] = editor.avatarGradient;
  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: editor.name,
    url: absoluteUrl(`/editors/${editor.slug}`),
    jobTitle: editor.role,
    description: editor.longBio,
    knowsAbout: editor.beatTags,
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <Container className="space-y-8 py-10">
      <JsonLd id="ld-editor" data={personLd} />

      <nav className="text-xs text-slate-500">
        <Link href="/" className="font-bold text-slate-500 hover:text-slate-900">
          Home
        </Link>
        <span aria-hidden className="mx-2">/</span>
        <Link href="/about" className="font-bold text-slate-500 hover:text-slate-900">
          About
        </Link>
        <span aria-hidden className="mx-2">/</span>
        <span className="font-bold text-slate-900">{editor.name}</span>
      </nav>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className="flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:items-start sm:text-left"
          style={{
            background: `linear-gradient(135deg, ${from}10 0%, ${to}10 100%)`,
          }}
        >
          <span
            aria-hidden
            className="relative inline-flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-extrabold text-white shadow-lg ring-4 ring-white"
            style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
          >
            {editor.avatarInitials}
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-600 ring-2 ring-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {editor.role}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {editor.name}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {editor.longBio}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {editor.beatTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200"
                >
                  {tag}
                </span>
              ))}
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                Editor since {editor.joinedYear}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-extrabold text-slate-900">
          Latest from {editor.name.split(' ')[0]}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Every code list and redeem guide on this site is maintained by {editor.name.split(' ')[0]}, updated as drops happen.
        </p>
        <ul className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {articles.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="group flex items-center justify-between gap-4 p-4 transition hover:bg-slate-50"
              >
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                    {a.kicker} · {a.game}
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-900 group-hover:text-brand-700">
                    {a.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Updated{' '}
                    <time dateTime={a.date}>
                      {new Date(a.date).toLocaleDateString('en', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    {a.activeCount > 0 && (
                      <>
                        {' · '}
                        <span className="font-bold text-emerald-700">
                          {a.activeCount} live codes
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
