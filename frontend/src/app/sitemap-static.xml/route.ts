// frontend/src/app/sitemap-static.xml/route.ts
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  const now = new Date().toISOString();
  
  const staticPages = [
    { url: baseUrl, priority: '1.0', changefreq: 'daily' },
    { url: `${baseUrl}/blog`, priority: '0.95', changefreq: 'daily' },
    { url: `${baseUrl}/recipes`, priority: '0.9', changefreq: 'daily' },
    { url: `${baseUrl}/brewing-guides`, priority: '0.9', changefreq: 'weekly' },
    { url: `${baseUrl}/products`, priority: '0.85', changefreq: 'weekly' },
    { url: `${baseUrl}/calculator`, priority: '0.8', changefreq: 'monthly' },
    { url: `${baseUrl}/authors`, priority: '0.7', changefreq: 'weekly' },
    { url: `${baseUrl}/apply-to-write`, priority: '0.6', changefreq: 'monthly' },
    { url: `${baseUrl}/privacy`, priority: '0.3', changefreq: 'yearly' },
    { url: `${baseUrl}/terms`, priority: '0.3', changefreq: 'yearly' },
    { url: `${baseUrl}/affiliate-disclosure`, priority: '0.3', changefreq: 'yearly' },
  ];

  const urls = staticPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
