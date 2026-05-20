import sitemap from '../sitemap';

export const dynamic = 'force-static';

export function GET() {
  const entries = sitemap();

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map((entry) => {
        const lastmod =
          entry.lastModified instanceof Date
            ? entry.lastModified.toISOString()
            : entry.lastModified;
        return (
          `<url>\n` +
          `<loc>${entry.url}</loc>\n` +
          (lastmod ? `<lastmod>${lastmod}</lastmod>\n` : '') +
          (entry.changeFrequency
            ? `<changefreq>${entry.changeFrequency}</changefreq>\n`
            : '') +
          (entry.priority !== undefined
            ? `<priority>${entry.priority}</priority>\n`
            : '') +
          `</url>`
        );
      })
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
