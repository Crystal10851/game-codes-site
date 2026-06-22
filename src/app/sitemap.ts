import type { MetadataRoute } from 'next';
import { getAllGames } from '@/lib/games';
import { getLastUpdated } from '@/lib/codes';
import { absoluteUrl, editors } from '@/lib/site';
import bloxFruitsTierList from '../../data/games/blox-fruits/tier-list.json';

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
    ...editors.map((e) => ({
      url: absoluteUrl(`/editors/${e.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];

  entries.push(
    {
      url: absoluteUrl('/blox-fruits/tier-list'),
      lastModified: new Date(bloxFruitsTierList.meta.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blox-fruits/which-fruit'),
      lastModified: new Date(bloxFruitsTierList.meta.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  );

  for (const game of games) {
    entries.push({
      url: absoluteUrl(`/${game.slug}`),
      lastModified: new Date(getLastUpdated(game)),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  return entries;
}
