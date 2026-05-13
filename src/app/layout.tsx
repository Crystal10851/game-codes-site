import type { Metadata, Viewport } from 'next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { AdSenseScript } from '@/components/AdSenseScript';
import { Analytics } from '@/components/Analytics';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig, absoluteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Working game codes, updated daily`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#3563ff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <JsonLd id="ld-website" data={orgLd} />
        <AdSenseScript />
        <Analytics />
      </body>
    </html>
  );
}
