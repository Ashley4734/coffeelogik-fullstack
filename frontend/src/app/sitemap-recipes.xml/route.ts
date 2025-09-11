// frontend/src/app/sitemap-recipes.xml/route.ts
import { getRecipes, CoffeeRecipe } from '@/lib/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  try {
    const recipesResponse = await getRecipes({ limit: 1000 });
    const recipes: CoffeeRecipe[] = recipesResponse?.data || [];

    const urls = recipes.map((recipe: CoffeeRecipe) => `
  <url>
    <loc>${baseUrl}/recipes/${recipe.slug || recipe.id}</loc>
    <lastmod>${new Date(recipe.updatedAt || recipe.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${recipe.featured ? '0.8' : '0.7'}</priority>
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
    console.error('Error generating recipes sitemap:', error);
    
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/recipes</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
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
