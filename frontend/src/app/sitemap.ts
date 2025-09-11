// frontend/src/app/sitemap.ts - Fixed with proper types
import { MetadataRoute } from 'next';
import { getBlogPosts, getRecipes, getBrewingGuides, getProducts, getAuthors, getCategories, BlogPost, CoffeeRecipe, BrewingGuide, CoffeeProduct, Author, Category } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  // Static pages with optimized priorities
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
    // Legal pages - lower priority
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
    // Use Promise.allSettled for better error handling
    const [blogResponse, recipesResponse, guidesResponse, productsResponse, authorsResponse, categoriesResponse] = await Promise.allSettled([
      getBlogPosts({ limit: 500 }), // Reduced limit for fallback
      getRecipes({ limit: 200 }),
      getBrewingGuides({ limit: 200 }),
      getProducts({ limit: 200 }),
      getAuthors(),
      getCategories(),
    ]);

    // Helper function to safely extract data
    const extractData = <T>(result: PromiseSettledResult<{ data: T[] }>): T[] => 
      result.status === 'fulfilled' ? result.value?.data || [] : [];

    const blogPosts: BlogPost[] = extractData(blogResponse);
    const recipes: CoffeeRecipe[] = extractData(recipesResponse);
    const guides: BrewingGuide[] = extractData(guidesResponse);
    const products: CoffeeProduct[] = extractData(productsResponse);
    const authors: Author[] = extractData(authorsResponse);
    const categories: Category[] = extractData(categoriesResponse);

    // Blog posts with smart prioritization
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: BlogPost) => {
      const isRecent = new Date(post.publishedAt || post.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
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

    // Recipes
    const recipePages: MetadataRoute.Sitemap = recipes.map((recipe: CoffeeRecipe) => ({
      url: `${baseUrl}/recipes/${recipe.slug || recipe.id}`,
      lastModified: new Date(recipe.updatedAt || recipe.createdAt),
      changeFrequency: 'monthly' as const,
      priority: recipe.featured ? 0.8 : 0.7,
    }));

    // Brewing guides
    const guidePages: MetadataRoute.Sitemap = guides.map((guide: BrewingGuide) => ({
      url: `${baseUrl}/brewing-guides/${guide.slug || guide.id}`,
      lastModified: new Date(guide.updatedAt || guide.createdAt),
      changeFrequency: 'monthly' as const,
      priority: guide.featured ? 0.8 : 0.7,
    }));

    // Products
    const productPages: MetadataRoute.Sitemap = products.map((product: CoffeeProduct) => ({
      url: `${baseUrl}/products/${product.slug || product.id}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly' as const,
      priority: product.featured ? 0.75 : 0.65,
    }));

    // Author pages
    const authorPages: MetadataRoute.Sitemap = authors.map((author: Author) => ({
      url: `${baseUrl}/authors/${author.slug}`,
      lastModified: new Date(author.updatedAt || author.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Category pages (optional - implement if you create category landing pages)
    const categoryPages: MetadataRoute.Sitemap = categories.map((category: Category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }));

    // Combine all pages
    const allPages = [
      ...staticPages,
      ...blogPages,
      ...recipePages,
      ...guidePages,
      ...productPages,
      ...authorPages,
      ...categoryPages,
    ];

    // Sort by priority (highest first) for better crawling
    const sortedPages = allPages.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Ensure we don't exceed sitemap limits (50,000 URLs)
    if (sortedPages.length > 50000) {
      console.warn(`Sitemap contains ${sortedPages.length} URLs, exceeding 50,000 limit. Truncating to 50,000.`);
      return sortedPages.slice(0, 50000);
    }

    return sortedPages;
  } catch (error) {
    console.error('Error generating fallback sitemap:', error);
    
    // Return at least static pages if everything fails
    return staticPages;
  }
}
