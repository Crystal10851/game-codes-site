import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { GameHeader } from '@/components/GameHeader';
import { JsonLd } from '@/components/JsonLd';
import { AuthorByline } from '@/components/AuthorByline';
import { getGame } from '@/lib/games';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';
import tierListData from '../../../../data/games/blox-fruits/tier-list.json';
import FruitQuiz from './FruitQuiz';

export function generateMetadata(): Metadata {
  const year = new Date().getFullYear();
  return buildMetadata({
    title: `Which Blox Fruit Should I Buy? (${year}) — Interactive Quiz`,
    description: `Answer four questions about your budget, playstyle, experience, and party and get the top three Blox Fruits that fit you. Updated for ${year}.`,
    path: '/blox-fruits/which-fruit',
    type: 'website',
    keywords: [
      'which blox fruit should i buy',
      'best blox fruit for me',
      'blox fruits quiz',
      `blox fruits ${year}`,
      'blox fruits recommendation',
      'first blox fruit',
    ],
  });
}

export default function BloxFruitsWhichFruitPage() {
  const game = getGame('blox-fruits');
  if (!game) notFound();

  const lastUpdated = tierListData.meta.lastUpdated;
  const fruitCount = tierListData.fruits.length;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blox Fruits Codes',
        item: absoluteUrl('/blox-fruits'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Which Fruit Quiz',
        item: absoluteUrl('/blox-fruits/which-fruit'),
      },
    ],
  };

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to pick your next Blox Fruit',
    description:
      'A four-question decision flow that recommends the top three Blox Fruits matching your budget, playstyle, experience, and party setup.',
    totalTime: 'PT2M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Set your Robux budget',
        text: 'Choose between no Robux, up to ~1.5K Robux, or 2K+ Robux. This filters out fruits priced above your ceiling.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Pick your primary goal',
        text: 'Choose the single thing you most want from this fruit: PvP fights, grinding levels, soloing bosses, or just having fun.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Declare your experience',
        text: 'New, returning, or veteran. Beginner-friendly fruits get a bonus for new players; high-ceiling kits favor veterans.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Pick your party size',
        text: 'Solo, duo, or group. Self-sustain fruits win for solo; AOE crowd-control wins for groups.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Review your top three',
        text: 'Each recommendation links to the full tier-list entry with pros, cons, and best combos.',
      },
    ],
  };

  return (
    <Container className="space-y-8 py-8">
      <JsonLd id="ld-which-fruit" data={[breadcrumbLd, howToLd]} />
      <GameHeader game={game} active="/which-fruit" />
      <AuthorByline verifiedOn={lastUpdated} />

      <section className="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-600 to-fuchsia-600 p-8 text-white shadow-xl sm:p-12">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-tr from-brand-500/0 via-sky-400/25 to-emerald-400/30" aria-hidden />
        <div className="absolute -right-12 -top-12 h-48 w-48 animate-float rounded-full bg-amber-300/30 blur-3xl" aria-hidden />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 animate-float rounded-full bg-rose-300/25 blur-3xl" style={{ animationDelay: '1.5s' }} aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm ring-1 ring-white/30">
            <span aria-hidden>🧭</span>
            Interactive quiz · 4 questions
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight drop-shadow-sm sm:text-5xl">
            Which Blox Fruit <span className="block text-amber-200">Should You Buy?</span>
          </h1>
          <p className="mt-3 text-sm font-medium text-white/85">
            A four-question quiz across {fruitCount} active fruits · Updated weekly
          </p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/95">
            Picking your first Blox Fruit (or your third, or a Mythical upgrade) is
            a Robux and Beli decision you don't want to redo. This helper walks
            through four short questions about your budget, what you want the
            fruit to do, your experience, and your party setup, then ranks the top
            three matches from the full{' '}
            <Link
              href="/blox-fruits/tier-list"
              className="font-bold text-amber-200 underline-offset-2 hover:underline"
            >
              Blox Fruits tier list
            </Link>
            . Every answer is independent — you can retake the quiz at any time.
            New to redeeming? Start with the{' '}
            <Link
              href="/blox-fruits/redeem-guide"
              className="font-bold text-amber-200 underline-offset-2 hover:underline"
            >
              redeem guide
            </Link>{' '}
            for the in-game code box, then come back here to plan your fruit
            purchase.
          </p>
        </div>
      </section>

      <FruitQuiz />

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          How the recommendation works
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>
            <strong className="text-slate-900">Budget filter:</strong> any fruit
            priced above your declared ceiling is removed from contention. A
            fruit at exactly your ceiling scores higher than one well under it,
            because the higher-rarity options usually carry more raw power.
          </li>
          <li>
            <strong className="text-slate-900">Role match:</strong> each fruit
            is tagged with the playstyles it actually delivers on (PvP,
            grinding, boss, trading, fun). Matching the role you picked is the
            single largest score contribution.
          </li>
          <li>
            <strong className="text-slate-900">Experience adjustment:</strong>{' '}
            new players get a bonus toward forgiving kits; veterans get a small
            bonus toward high-skill-ceiling fruits.
          </li>
          <li>
            <strong className="text-slate-900">Party fit:</strong> fruits whose
            kits scale to your party size (solo sustain, duo combo extension,
            group AOE) score additional points.
          </li>
          <li>
            <strong className="text-slate-900">Tier tiebreaker:</strong> when
            two fruits tie on the above, the higher-tier fruit wins.
          </li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          All tier calls and quiz signals are editorial and refreshed every
          Sunday alongside the main tier list.
        </p>
      </section>

      <section className="rounded-xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Picked a fruit? Stack a code on top.
        </h2>
        <p className="mt-2 text-slate-700">
          XP codes compound especially well when you're grinding a fresh
          Mythical or paying down the awakening fragment cost. Check the{' '}
          <Link
            href="/blox-fruits/latest"
            className="font-semibold text-brand-700 hover:underline"
          >
            latest Blox Fruits codes
          </Link>{' '}
          for active 2x XP promos.
        </p>
      </section>
    </Container>
  );
}
