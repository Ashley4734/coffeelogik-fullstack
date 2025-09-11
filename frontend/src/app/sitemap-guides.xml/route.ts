// frontend/src/app/sitemap-guides.xml/route.ts
import { getBrewingGuides, BrewingGuide } from '@/lib/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  try {
    const guidesResponse = await getBrewingGuides({ limit: 1000 });
    const guides: BrewingGuide[] = guidesResponse?.data || [];

    const urls = guides.map((guide: BrewingGuide) => `
  <url>
    <loc>${baseUrl}/brewing-guides/${guide.slug || guide.id}</loc>
    <lastmod>${new Date(guide.updatedAt || guide.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${guide.featured ? '0.8' : '0.7'}</priority>
  </url>`);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      },
    });
  } catch (error) {
    console.error('Error generating guides sitemap:', error);
    
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/brewing-guides</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
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
