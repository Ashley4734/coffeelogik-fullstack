import { MetadataRoute } from 'next';
import { getBlogPosts, getRecipes, getBrewingGuides, getProducts, getAuthors, getCategories } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  // Static pages with proper priorities and frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brewing-guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apply-to-write`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/affiliate-disclosure`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Fetch dynamic content with better error handling
    const [blogResponse, recipesResponse, guidesResponse, productsResponse, authorsResponse, categoriesResponse] = await Promise.allSettled([
      getBlogPosts({ limit: 1000 }),
      getRecipes({ limit: 1000 }),
      getBrewingGuides({ limit: 1000 }),
      getProducts({ limit: 1000 }),
      getAuthors(),
      getCategories(),
    ]);

    // Helper function to safely extract data from settled promises
    const extractData = (result: PromiseSettledResult<any>) => 
      result.status === 'fulfilled' ? result.value?.data || [] : [];

    const blogPosts = extractData(blogResponse);
    const recipes = extractData(recipesResponse);
    const guides = extractData(guidesResponse);
    const products = extractData(productsResponse);
    const authors = extractData(authorsResponse);
    const categories = extractData(categoriesResponse);

    // Blog posts with smart prioritization
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: any) => {
      // Determine priority based on recency and featured status
      const isRecent = new Date(post.publishedAt || post.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
      let priority = 0.6;
      
      if (post.featured) priority = 0.8;
      else if (isRecent) priority = 0.7;
      
      return {
        url: `${baseUrl}/blog/${post.slug || post.id}`,
        lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
        changeFrequency: 'monthly' as const,
        priority,
      };
    });

    // Recipes with prioritization
    const recipePages: MetadataRoute.Sitemap = recipes.map((recipe: any) => ({
      url: `${baseUrl}/recipes/${recipe.slug || recipe.id}`,
      lastModified: new Date(recipe.updatedAt || recipe.createdAt),
      changeFrequency: 'monthly' as const,
      priority: recipe.featured ? 0.8 : 0.7,
    }));

    // Brewing guides
    const guidePages: MetadataRoute.Sitemap = guides.map((guide: any) => ({
      url: `${baseUrl}/brewing-guides/${guide.slug || guide.id}`,
      lastModified: new Date(guide.updatedAt || guide.createdAt),
      changeFrequency: 'monthly' as const,
      priority: guide.featured ? 0.8 : 0.7,
    }));

    // Products
    const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.slug || product.id}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly' as const,
      priority: product.featured ? 0.75 : 0.65,
    }));

    // Author pages
    const authorPages: MetadataRoute.Sitemap = authors.map((author: any) => ({
      url: `${baseUrl}/authors/${author.slug}`,
      lastModified: new Date(author.updatedAt || author.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Category pages (if you decide to create them)
    const categoryPages: MetadataRoute.Sitemap = categories.map((category: any) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }));

    // Combine all pages and sort by priority
    const allPages = [
      ...staticPages,
      ...blogPages,
      ...recipePages,
      ...guidePages,
      ...productPages,
      ...authorPages,
      ...categoryPages,
    ].sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Ensure we don't exceed sitemap limits (50,000 URLs)
    if (allPages.length > 50000) {
      console.warn(`Sitemap contains ${allPages.length} URLs, which exceeds the 50,000 limit. Consider creating sitemap index files.`);
      return allPages.slice(0, 50000);
    }

    return allPages;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return at least static pages if dynamic content fails
    return staticPages;
  }
}
