import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { JsonLd } from '@/components/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { siteConfig, absoluteUrl } from '@/lib/site';
import { formatDate } from '@/lib/codes';

const LAST_UPDATED = '2026-05-13';

export const metadata: Metadata = buildMetadata({
  title: `Privacy Policy — ${siteConfig.name}`,
  description: `How ${siteConfig.name} collects, uses and protects your information, including details about advertising cookies and analytics.`,
  path: '/privacy',
  modifiedTime: LAST_UPDATED,
});

export default function PrivacyPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Privacy Policy — ${siteConfig.name}`,
    url: absoluteUrl('/privacy'),
    dateModified: LAST_UPDATED,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
  };

  return (
    <Container className="max-w-3xl py-12">
      <JsonLd id="ld-privacy" data={ld} />
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated {formatDate(LAST_UPDATED)}
      </p>
      <p className="mt-4 text-lg text-slate-600">
        This Privacy Policy explains what information {siteConfig.name} (“we”,
        “us”, “our”) collects when you visit{' '}
        <Link href="/" className="text-brand-700 underline">
          {siteConfig.url.replace(/^https?:\/\//, '')}
        </Link>{' '}
        (the “Site”), how we use that information, and the choices you have.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Information we collect
      </h2>
      <p className="mt-2 text-slate-700">
        We do not require you to create an account to use the Site, and we do
        not knowingly collect personal information that directly identifies
        you. We do, however, automatically receive the following information
        through standard web technologies:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
        <li>Device, browser type, language and operating system.</li>
        <li>IP address and approximate location (country / region).</li>
        <li>Pages visited, referring URL and time spent on each page.</li>
        <li>Interactions with on-page features such as the copy button.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Cookies and similar technologies
      </h2>
      <p className="mt-2 text-slate-700">
        We use cookies and similar technologies to operate the Site, remember
        preferences, measure traffic and deliver advertising. You can clear or
        block cookies at any time through your browser settings; some features
        of the Site may not function properly if cookies are disabled.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Advertising — Google AdSense and third-party vendors
      </h2>
      <p className="mt-2 text-slate-700">
        Third-party vendors, including Google, use cookies to serve ads based
        on your prior visits to this and other websites. Google’s use of
        advertising cookies enables it and its partners to serve ads to you
        based on your visit to our Site and/or other sites on the Internet.
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
        <li>
          You may opt out of personalised advertising by visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            className="text-brand-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          You may opt out of a third-party vendor’s use of cookies for
          personalised advertising by visiting{' '}
          <a
            href="https://www.aboutads.info"
            className="text-brand-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>
          .
        </li>
        <li>
          European Economic Area, United Kingdom and Swiss visitors may also
          use{' '}
          <a
            href="https://www.youronlinechoices.eu"
            className="text-brand-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            youronlinechoices.eu
          </a>
          .
        </li>
      </ul>
      <p className="mt-3 text-slate-700">
        Where required by law (for example under the EU GDPR or the UK GDPR),
        we will request your consent before setting non-essential cookies,
        including advertising cookies.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">Analytics</h2>
      <p className="mt-2 text-slate-700">
        We use privacy-respecting analytics — currently Vercel Web Analytics
        and/or Plausible Analytics — to understand how visitors find and
        navigate the Site. These tools are cookieless, do not track you
        across other websites, and do not collect data that personally
        identifies you. We use the aggregated reports solely to improve
        our content, performance and reliability.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        How we use information
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
        <li>To operate, maintain and improve the Site.</li>
        <li>To prevent abuse, fraud and security incidents.</li>
        <li>To serve and measure advertising.</li>
        <li>To comply with our legal obligations.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Sharing of information
      </h2>
      <p className="mt-2 text-slate-700">
        We do not sell personal information. We share information only with
        service providers necessary to operate the Site (such as hosting and
        advertising partners), and only to the extent required to provide
        their services, or when required by law.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Your rights
      </h2>
      <p className="mt-2 text-slate-700">
        Depending on where you live, you may have the right to access, correct
        or delete personal information we hold about you, to object to or
        restrict certain processing, and to lodge a complaint with your local
        data protection authority. To exercise any of these rights, contact us
        using the details below.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">Children</h2>
      <p className="mt-2 text-slate-700">
        The Site is not directed at children under 13 (or under 16 in the EEA
        and UK), and we do not knowingly collect personal information from
        them. If you believe a child has provided us with personal
        information, please contact us so we can delete it.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">
        Changes to this policy
      </h2>
      <p className="mt-2 text-slate-700">
        We may update this Privacy Policy from time to time. When we do, we
        will revise the “Last updated” date above. Material changes will be
        flagged on the Site where appropriate.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">Contact</h2>
      <p className="mt-2 text-slate-700">
        Questions about this policy? Email{' '}
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="text-brand-700 underline"
        >
          {siteConfig.contactEmail}
        </a>{' '}
        or see our{' '}
        <Link href="/contact" className="text-brand-700 underline">
          Contact page
        </Link>
        .
      </p>
    </Container>
  );
}
