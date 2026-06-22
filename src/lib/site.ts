export interface Editor {
  slug: string;
  name: string;
  role: string;
  shortBio: string;
  longBio: string;
  avatarInitials: string;
  avatarGradient: [string, string];
  joinedYear: number;
  beatTags: string[];
}

export const editors: Editor[] = [
  {
    slug: 'ben-yu',
    name: 'Ben Yu',
    role: 'Founder & codes editor',
    shortBio:
      'Tracks Roblox and HoYoverse code drops in real time, then verifies each one in the live game before publishing.',
    longBio:
      'Ben started GameCodes Hub in 2024 after spending hours sifting through stale code lists himself. He follows every official developer Twitter, Discord and livestream the games on this site publish to, and cross-checks each drop against the long-standing aggregators before adding it here. Every code on the site has been redeemed on a real account before publication; codes that stop working get moved to the Expired archive within 24 hours of the first failed report.',
    avatarInitials: 'BY',
    avatarGradient: ['#1b3aa5', '#0ea5e9'],
    joinedYear: 2024,
    beatTags: ['Roblox', 'HoYoverse', 'Blox Fruits'],
  },
];

export const primaryEditor: Editor = editors[0];

export const siteConfig = {
  name: 'GameCodes Hub',
  shortName: 'GameCodes',
  description:
    'Hand-verified Blox Fruits codes, a 25-fruit tier list, and an interactive Fruit Decision quiz — maintained by a single editor since 2024.',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? '',
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
