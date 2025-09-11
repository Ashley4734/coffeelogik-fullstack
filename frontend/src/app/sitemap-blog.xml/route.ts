// frontend/src/app/sitemap-blog.xml/route.ts
import { getBlogPosts, getCategories, BlogPost, Category } from '@/lib/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  try {
    const [blogResponse, categoriesResponse] = await Promise.allSettled([
      getBlogPosts({ limit: 1000 }),
      getCategories(),
    ]);

    const blogPosts: BlogPost[] = blogResponse.status === 'fulfilled' ? blogResponse.value?.data || [] : [];
    const categories: Category[] = categoriesResponse.status === 'fulfilled' ? categoriesResponse.value?.data || [] : [];

    const urls = [];

    // Add blog posts
    blogPosts.forEach((post: BlogPost) => {
      const isRecent = new Date(post.publishedAt || post.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      let priority = '0.6';
      
      if (post.featured) priority = '0.8';
      else if (isRecent) priority = '0.7';

      urls.push(`
  <url>
    <loc>${baseUrl}/blog/${post.slug || post.id}</loc>
    <lastmod>${new Date(post.updatedAt || post.publishedAt || post.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`);
    });

    // Add category pages
    categories.forEach((category: Category) => {
      urls.push(`
  <url>
    <loc>${baseUrl}/blog/category/${category.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>`);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
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

// frontend/src/app/sitemap-products.xml/route.ts
import { getProducts, CoffeeProduct } from '@/lib/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  try {
    const productsResponse = await getProducts({ limit: 1000 });
    const products: CoffeeProduct[] = productsResponse?.data || [];

    const urls = products.map((product: CoffeeProduct) => `
  <url>
    <loc>${baseUrl}/products/${product.slug || product.id}</loc>
    <lastmod>${new Date(product.updatedAt || product.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${product.featured ? '0.75' : '0.65'}</priority>
  </url>`);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
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
