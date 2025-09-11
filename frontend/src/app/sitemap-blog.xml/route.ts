// frontend/src/app/sitemap-blog.xml/route.ts
import { getBlogPosts, getCategories } from '@/lib/api';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  try {
    const [blogResponse, categoriesResponse] = await Promise.allSettled([
      getBlogPosts({ limit: 1000 }),
      getCategories(),
    ]);

    const blogPosts = blogResponse.status === 'fulfilled' ? blogResponse.value?.data || [] : [];
    const categories = categoriesResponse.status === 'fulfilled' ? categoriesResponse.value?.data || [] : [];

    const urls = [];

    // Add blog posts
    blogPosts.forEach((post: any) => {
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

    // Add category pages (if you implement them)
    categories.forEach((category: any) => {
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
        'Cache-Control': 'public, max-age=1800, s-maxage=3600', // 30 min cache
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
