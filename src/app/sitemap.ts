import type { MetadataRoute } from 'next';
import { getAllGames } from '@/lib/games';
import { getLastUpdated } from '@/lib/codes';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const games = getAllGames();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/privacy'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  for (const game of games) {
    const lastModified = new Date(getLastUpdated(game));
    entries.push(
      {
        url: absoluteUrl(`/${game.slug}`),
        lastModified,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: absoluteUrl(`/${game.slug}/latest`),
        lastModified,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: absoluteUrl(`/${game.slug}/expired`),
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      {
        url: absoluteUrl(`/${game.slug}/redeem-guide`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    );
  }

  return entries;
}
