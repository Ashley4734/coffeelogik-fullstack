// frontend/src/app/sitemap-authors.xml/route.ts
import { getAuthors, Author } from '@/lib/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  try {
    const authorsResponse = await getAuthors();
    const authors: Author[] = authorsResponse?.data || [];

    const urls = authors.map((author: Author) => `
  <url>
    <loc>${baseUrl}/authors/${author.slug}</loc>
    <lastmod>${new Date(author.updatedAt || author.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=7200, s-maxage=14400',
      },
    });
  } catch (error) {
    console.error('Error generating authors sitemap:', error);
    
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/authors</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    return new Response(errorSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
