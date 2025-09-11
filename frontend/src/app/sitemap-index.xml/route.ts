// frontend/src/app/sitemap-index.xml/route.ts
import { getBlogPosts, getRecipes, getBrewingGuides, getProducts } from '@/lib/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  try {
    // Get counts to determine if we need separate sitemaps
    const [blogResponse, recipesResponse, guidesResponse, productsResponse] = await Promise.allSettled([
      getBlogPosts({ limit: 1 }), // Just get meta for count
      getRecipes({ limit: 1 }),
      getBrewingGuides({ limit: 1 }),
      getProducts({ limit: 1 }),
    ]);

    const blogCount = blogResponse.status === 'fulfilled' ? blogResponse.value?.meta?.pagination?.total || 0 : 0;
    const recipesCount = recipesResponse.status === 'fulfilled' ? recipesResponse.value?.meta?.pagination?.total || 0 : 0;
    const guidesCount = guidesResponse.status === 'fulfilled' ? guidesResponse.value?.meta?.pagination?.total || 0 : 0;
    const productsCount = productsResponse.status === 'fulfilled' ? productsResponse.value?.meta?.pagination?.total || 0 : 0;

    const sitemaps = [];
    const now = new Date().toISOString();

    // Always include main sitemap for static pages
    sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemap-static.xml</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`);

    // Add separate sitemaps if we have content
    if (blogCount > 0) {
      sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemap-blog.xml</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`);
    }

    if (recipesCount > 0) {
      sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemap-recipes.xml</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`);
    }

    if (guidesCount > 0) {
      sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemap-guides.xml</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`);
    }

    if (productsCount > 0) {
      sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemap-products.xml</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`);
    }

    // Add authors sitemap
    sitemaps.push(`
    <sitemap>
      <loc>${baseUrl}/sitemap-authors.xml</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`);

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('')}
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    
    // Fallback to basic sitemap index
    const basicSitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${baseUrl}/sitemap.xml</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
</sitemapindex>`;

    return new Response(basicSitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
