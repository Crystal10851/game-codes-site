export const siteConfig = {
  name: 'GameCodes Hub',
  shortName: 'GameCodes',
  description:
    'Up-to-date working codes, expired codes archive and redeem guides for the most popular games.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
  locale: 'en_US',
  twitter: '@gamecodeshub',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'yuanbin_web@163.com',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? 'yuanbin',
  established: '2026',
  adsense: {
    enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true',
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-XXXXXXXXXXXXXXXX',
  },
  analytics: {
    provider: (process.env.NEXT_PUBLIC_ANALYTICS ?? 'none') as
      | 'none'
      | 'vercel'
      | 'plausible',
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? '',
    plausibleHost:
      process.env.NEXT_PUBLIC_PLAUSIBLE_HOST ?? 'https://plausible.io',
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
