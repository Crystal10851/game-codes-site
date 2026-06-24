import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://game-codes-site.vercel.app';

const bf = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data/games/blox-fruits.json'), 'utf8'),
);
const tierList = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, 'data/games/blox-fruits/tier-list.json'),
    'utf8',
  ),
);

function getLastUpdated(game) {
  const dates = game.codes.map((c) => c.addedOn);
  if (game.lastVerifiedOn) dates.push(game.lastVerifiedOn);
  dates.sort();
  return dates[dates.length - 1] ?? new Date().toISOString().slice(0, 10);
}

const bfLastmod = new Date(getLastUpdated(bf)).toISOString();
const tierLastmod = new Date(tierList.meta.lastUpdated).toISOString();

const entries = [
  { url: '/', lastmod: bfLastmod, changefreq: 'daily', priority: '1.0' },
  { url: '/about', lastmod: bfLastmod, changefreq: 'yearly', priority: '0.4' },
  { url: '/methodology', lastmod: bfLastmod, changefreq: 'monthly', priority: '0.6' },
  { url: '/changelog', lastmod: bfLastmod, changefreq: 'monthly', priority: '0.5' },
  { url: '/contact', lastmod: bfLastmod, changefreq: 'yearly', priority: '0.4' },
  { url: '/privacy', lastmod: bfLastmod, changefreq: 'yearly', priority: '0.3' },
  { url: '/editors/ben-yu', lastmod: bfLastmod, changefreq: 'monthly', priority: '0.5' },
  { url: '/blox-fruits', lastmod: bfLastmod, changefreq: 'daily', priority: '0.9' },
  { url: '/blox-fruits/tier-list', lastmod: tierLastmod, changefreq: 'weekly', priority: '0.8' },
  { url: '/blox-fruits/which-fruit', lastmod: tierLastmod, changefreq: 'weekly', priority: '0.7' },
];

const body =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  entries
    .map(
      (e) =>
        `  <url>\n` +
        `    <loc>${SITE_URL}${e.url}</loc>\n` +
        `    <lastmod>${e.lastmod}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n') +
  '\n</urlset>\n';

for (const filename of ['sitemap.xml', 'sitemap-feed.xml']) {
  fs.writeFileSync(path.join(ROOT, 'public', filename), body, 'utf8');
}
console.log(
  `✓ sitemap.xml + sitemap-feed.xml written (${entries.length} entries, bf=${bfLastmod.slice(0, 10)}, tier=${tierLastmod.slice(0, 10)})`,
);
