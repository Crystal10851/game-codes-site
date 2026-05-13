import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { JsonLd } from '@/components/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `Contact ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name} — report a broken code, submit a new code, or send a partnership enquiry.`,
  path: '/contact',
});

const REASONS = [
  {
    title: 'Submit a working code',
    detail:
      'Found a fresh code that isn’t on our list yet? Send the code, the game and where you saw it announced — we’ll verify and credit you if you’d like.',
  },
  {
    title: 'Report a broken code',
    detail:
      'If a code we list no longer works, let us know which game and which code and we’ll re-test the same day.',
  },
  {
    title: 'Request a new game',
    detail:
      'Tell us which game you’d like us to track. We prioritise titles with frequent code drops and a clear redemption flow.',
  },
  {
    title: 'Press, partnerships and advertising',
    detail:
      'For sponsorships, direct ad placements or media enquiries, please include your company, audience and proposal in the first email.',
  },
  {
    title: 'Privacy or legal',
    detail:
      'For privacy requests, DMCA notices or other legal matters, include the relevant URLs and a clear description of the issue.',
  },
];

export default function ContactPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${siteConfig.name}`,
    url: absoluteUrl('/contact'),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url,
      email: siteConfig.contactEmail,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: siteConfig.contactEmail,
        availableLanguage: ['English'],
      },
    },
  };

  return (
    <Container className="max-w-3xl py-12">
      <JsonLd id="ld-contact" data={ld} />
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Contact {siteConfig.name}
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        The fastest way to reach the team is email. We read every message and
        usually reply within 1–2 business days.
      </p>

      <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          Email us
        </p>
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="mt-2 inline-block text-2xl font-bold text-brand-700 hover:underline"
        >
          {siteConfig.contactEmail}
        </a>
        <p className="mt-3 text-sm text-slate-600">
          Please include the game name and, if relevant, the exact code you’re
          asking about. Screenshots help a lot.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        What to write about
      </h2>
      <ul className="mt-4 space-y-4">
        {REASONS.map((r) => (
          <li
            key={r.title}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <h3 className="font-semibold text-slate-900">{r.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{r.detail}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Editorial corrections
      </h2>
      <p className="mt-2 text-slate-700">
        We take accuracy seriously. If you spot an error in a reward
        description, redeem step or expiration date, we’ll fix it as soon as
        we’ve confirmed the correction. See our{' '}
        <Link href="/about" className="text-brand-700 underline">
          About page
        </Link>{' '}
        for our editorial standards.
      </p>
    </Container>
  );
}
