import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { JsonLd } from '@/components/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `About ${siteConfig.name}`,
  description: `Learn how ${siteConfig.name} sources, verifies and publishes game codes, and the editorial standards we follow.`,
  path: '/about',
});

export default function AboutPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${siteConfig.name}`,
    url: absoluteUrl('/about'),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url,
      email: siteConfig.contactEmail,
    },
  };

  return (
    <Container className="prose-slate max-w-3xl py-12">
      <JsonLd id="ld-about" data={ld} />
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        About {siteConfig.name}
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        {siteConfig.name} is an independent reference site for game redeem
        codes. We collect, verify and publish working codes for popular online
        games so players can claim free rewards without sifting through stale
        forum threads.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">Our mission</h2>
      <p className="mt-2 text-slate-700">
        Search results for game codes are full of outdated lists, copied
        articles and pages buried under pop-ups. We exist to be the opposite of
        that: every code we publish has been redeemed and confirmed working by
        a human before it goes live, and we move codes to our Expired archive
        the moment they stop working.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        How we source codes
      </h2>
      <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-700">
        <li>
          Official developer accounts (X / Twitter, Discord, YouTube
          livestreams).
        </li>
        <li>Patch notes and in-game announcements.</li>
        <li>
          Community submissions, which we always verify before publishing.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Editorial standards
      </h2>
      <p className="mt-2 text-slate-700">
        Every code is tested in-game on a real account before publication. When
        a code is reported broken we re-test within the day; if confirmed
        expired, it is moved to the Expired Codes archive with the date it
        stopped working. We never paywall codes, never make readers wait
        behind countdowns, and never republish a code we couldn’t verify.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Affiliation disclaimer
      </h2>
      <p className="mt-2 text-slate-700">
        {siteConfig.name} is an independent fan resource. We are not
        affiliated with, endorsed by or sponsored by any game studio, publisher
        or platform mentioned on this site. All game names, logos, screenshots
        and trademarks are the property of their respective owners and are
        used here for identification and reference purposes only.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        How we make money
      </h2>
      <p className="mt-2 text-slate-700">
        The site is supported by display advertising (including Google
        AdSense) and may include affiliate links to gaming-related products.
        Advertising never influences which codes we publish or how we describe
        them. For details on what data advertising partners may collect, see
        our{' '}
        <Link href="/privacy" className="text-brand-700 underline">
          Privacy Policy
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">Contact</h2>
      <p className="mt-2 text-slate-700">
        Found a working code we’ve missed, or a broken code we still have
        listed? Drop us a line — see the{' '}
        <Link href="/contact" className="text-brand-700 underline">
          Contact page
        </Link>{' '}
        for details.
      </p>
    </Container>
  );
}
