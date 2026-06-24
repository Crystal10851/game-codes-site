import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { JsonLd } from '@/components/JsonLd';
import { SectionHeading } from '@/components/SectionHeading';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, absoluteUrl, primaryEditor } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `Verification methodology — how ${siteConfig.shortName} sources, tests and publishes codes`,
  description: `The full editorial process behind every Blox Fruits code on this site: where codes come from, the redemption test we run before publishing, how we time the expired-archive move, and what we explicitly do not do.`,
  path: '/methodology',
  type: 'article',
});

export default function MethodologyPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Verification methodology',
    description:
      'The end-to-end editorial process for sourcing, testing, publishing and retiring Blox Fruits codes.',
    url: absoluteUrl('/methodology'),
    author: {
      '@type': 'Person',
      name: primaryEditor.name,
      jobTitle: primaryEditor.role,
      url: absoluteUrl(`/editors/${primaryEditor.slug}`),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
  };

  return (
    <Container className="max-w-3xl py-12">
      <JsonLd id="ld-methodology" data={ld} />

      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
          Editorial standards
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          How {siteConfig.shortName} verifies a Blox Fruits code
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Every code on this site has been redeemed on a live Roblox account
          before it appears in the working list. The goal of this page is to
          show you the full pipeline that sits between a code dropping on a
          partnered-creator stream and it appearing on{' '}
          <Link href="/blox-fruits" className="font-semibold text-brand-700 hover:underline">
            our codes hub
          </Link>{' '}
          — so you can decide whether to trust us.
        </p>
      </header>

      <section aria-labelledby="sources" className="mt-12">
        <SectionHeading id="sources" icon="compass">
          1. Where codes come from
        </SectionHeading>
        <p className="mt-3 text-slate-700 leading-relaxed">
          New Blox Fruits codes never appear from nowhere — they almost always
          drop from one of four narrow channels. We watch each channel in real
          time so we can claim a code before it hits the broad aggregators.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          <li>
            <strong>Partnered-creator livestreams.</strong> Gamer Robot rewards
            Kitt, Daigrock, Officialnoobie, TantaiGaming, UncleKizaru and a
            handful of smaller channels with one-off subscriber codes
            (typically a 20-minute 2x XP boost). These show up at the end of a
            stream and are usually only flagged in the live chat — we monitor
            three of those channels live.
          </li>
          <li>
            <strong>Major update reveals.</strong> Every Blox Fruits update on
            roughly the six-to-ten-week cadence ships one to three milestone
            codes, announced on the official X / Twitter account and in the
            patch-notes Discord channel.
          </li>
          <li>
            <strong>Milestone-event codes.</strong> Likes-target, visits-target
            and "billions of plays" celebrations each unlock a single code —
            usually a Stat Reset, the most valuable code type because it is
            the only way to redistribute Melee / Defense / Sword / Gun / Devil
            Fruit stats without spending Robux.
          </li>
          <li>
            <strong>Bug-fix and apology codes.</strong> Less frequent — drops
            when the developer compensates for a server outage or a broken
            event. These tend to be the most generous (longer 2x XP windows).
          </li>
        </ul>
        <p className="mt-4 text-slate-700 leading-relaxed">
          We do not scrape Reddit, forum threads or YouTube comments for
          codes. Those channels often surface fake or already-expired strings,
          and chasing them dilutes the working list. We do cross-reference our
          shortlist against the two established gaming-code outlets — Pocket
          Tactics and Pro Game Guides — to make sure we have not missed a
          channel they covered first.
        </p>
      </section>

      <section aria-labelledby="redeem-test" className="mt-12">
        <SectionHeading id="redeem-test" icon="steps">
          2. The redemption test we run before publishing
        </SectionHeading>
        <p className="mt-3 text-slate-700 leading-relaxed">
          A code is not added to the working list until it has been redeemed
          on a live Roblox account that has never used it before. The exact
          test:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-700">
          <li>
            Log into a level 1500+ test account that has unredeemed standing
            on the candidate code (Blox Fruits enforces one-redemption-per-account).
          </li>
          <li>
            Open the in-game Twitter-icon panel (located on the main menu
            since the early-2026 UI refresh) and paste the code exactly as
            published — Blox Fruits is case-sensitive at the redemption layer.
          </li>
          <li>
            Confirm the reward appears in the on-screen toast within ten
            seconds. For 2x XP boosts we also wait for the live multiplier
            indicator to show 2.0x in the HUD before counting the code as
            confirmed.
          </li>
          <li>
            Note the exact reward and duration in the JSON entry. We do not
            round — if the code paid a 15-minute 2x XP window rather than the
            standard 20, the reward string says fifteen.
          </li>
        </ol>
        <p className="mt-4 text-slate-700 leading-relaxed">
          If a code fails any of these four checks it never enters the working
          list. We do not publish "candidates" or "rumoured" codes — every
          string in the active table has paid out at least once.
        </p>
      </section>

      <section aria-labelledby="expiry" className="mt-12">
        <SectionHeading id="expiry" icon="archive">
          3. How a code moves from working to expired
        </SectionHeading>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Blox Fruits codes have no published expiry date — the developer
          revokes them at their discretion, usually around a major update or
          after a stream-window closes. We retire codes in two situations:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          <li>
            <strong>Reader report or upstream demotion.</strong> When at least
            one reader reports a code as broken — or when both Pocket Tactics
            and Pro Game Guides move it to their expired lists — we re-test on
            a fresh account. If the re-test fails, the code moves to the
            expired archive within 24 hours.
          </li>
          <li>
            <strong>Weekly cross-check.</strong> Every Sunday we re-verify
            every active code against the upstream lists. Anything that has
            disappeared upstream is retested and demoted if confirmed dead.
          </li>
        </ul>
        <p className="mt-4 text-slate-700 leading-relaxed">
          We keep the expired list visible rather than deleting it. Players
          who land on this page from an out-of-date YouTube tutorial deserve
          to see the same code in the expired archive (with the date it died)
          rather than think they have been pointed at a phantom string.
        </p>
      </section>

      <section aria-labelledby="case-sensitive" className="mt-12">
        <SectionHeading id="case-sensitive" icon="wrench">
          4. The case-sensitivity trap
        </SectionHeading>
        <p className="mt-3 text-slate-700 leading-relaxed">
          The single most common reason a Blox Fruits code fails to redeem is
          that the player typed it instead of pasting it. Blox Fruits enforces
          exact-case matching at the server layer — <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">KITT_RESET</code> is not the same string as <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">kitt_reset</code>,
          and <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">Sub2CaptainMaui</code> rejects if the leading S or C is lower-case. Every code on
          the working list has a Copy button next to it for exactly this
          reason. We also include a "case matters" hint in the notes field of
          any code where the typo risk is unusually high (e.g. <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">kittgaming</code>,
          which is all lowercase against the visual convention of partner
          codes).
        </p>
      </section>

      <section aria-labelledby="not-do" className="mt-12">
        <SectionHeading id="not-do" icon="info">
          5. What we explicitly do not do
        </SectionHeading>
        <p className="mt-3 text-slate-700 leading-relaxed">
          A lot of game-code listicles cut corners that ultimately waste the
          reader's time. The complete list of things {siteConfig.shortName}{' '}
          will never publish:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          <li>
            <strong>AI-generated code lists.</strong> Every active code on
            this site was redeemed by a person before it went live. AI
            hallucinates code strings; a hallucinated string wastes the
            reader's account-level redemption quota.
          </li>
          <li>
            <strong>Codes behind countdown timers.</strong> Some sites delay
            the visible string until the reader scrolls a fake countdown.
            Every code on this hub is in plain text from the first scroll.
          </li>
          <li>
            <strong>Codes behind email opt-ins or "share to unlock".</strong>{' '}
            Codes are not earned by giving up an email address. Either the
            code works for everyone or it does not work at all.
          </li>
          <li>
            <strong>Rumoured or "leaked" codes.</strong> Reddit and YouTube
            comments frequently surface strings that look like real codes but
            have never paid out. We do not publish a string until our redeem
            test confirms it.
          </li>
          <li>
            <strong>Affiliate links inside the code rows.</strong> The active
            list and expired archive are commercially clean. We support the
            site with display advertising clearly labelled in the page
            margins, never inside the code data itself.
          </li>
        </ul>
      </section>

      <section aria-labelledby="cadence" className="mt-12">
        <SectionHeading id="cadence" icon="calendar">
          6. Publishing cadence
        </SectionHeading>
        <p className="mt-3 text-slate-700 leading-relaxed">
          The codes hub is rebuilt automatically every time the underlying
          JSON file changes, and a full weekly refresh runs every Sunday. The
          weekly refresh re-tests every active code on a fresh account,
          updates the verification stamp, retires any code that has been
          demoted upstream, and re-fetches the live tier-list data so the two
          interactive tools stay in sync with the rest of the site.
        </p>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Out-of-cycle updates only happen when a major code drops — a new
          partnered-creator stream code or a milestone-event reward. We do
          not push purely cosmetic updates to the page during the week; the
          weekly cadence is intentionally predictable so returning readers
          know when to come back.
        </p>
      </section>

      <section aria-labelledby="who" className="mt-12">
        <SectionHeading id="who" icon="info">
          7. Who actually does this work
        </SectionHeading>
        <p className="mt-3 text-slate-700 leading-relaxed">
          The methodology above is run by a single editor — {primaryEditor.name},
          who has maintained the site since {primaryEditor.joinedYear}. There
          is no offshore content team, no AI ghost-writer, no rotating cast
          of freelancers. One person, one set of test accounts, the same
          process every week. If a code on this site stops working and you
          are the first to notice, the email at the bottom of this page lands
          on the same desk.
        </p>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Read more about the editor at{' '}
          <Link
            href={`/editors/${primaryEditor.slug}`}
            className="font-semibold text-brand-700 hover:underline"
          >
            the editor profile
          </Link>
          , or jump straight to the{' '}
          <Link
            href="/blox-fruits"
            className="font-semibold text-brand-700 hover:underline"
          >
            current working codes
          </Link>
          .
        </p>
      </section>

      <p className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Spotted a code we missed, or a working code listed as expired?{' '}
        <Link href="/contact" className="font-semibold text-brand-700 hover:underline">
          Email the editor
        </Link>{' '}
        — corrections are usually live within two hours.
      </p>
    </Container>
  );
}
