import { MetadataRoute } from 'next';
import { getBlogPosts, getRecipes, getBrewingGuides, getProducts } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';
  
  // Static pages
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
      priority: 0.9,
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
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Fetch dynamic content
    const [blogResponse, recipesResponse, guidesResponse, productsResponse] = await Promise.all([
      getBlogPosts({ limit: 1000 }),
      getRecipes({ limit: 1000 }),
      getBrewingGuides({ limit: 1000 }),
      getProducts({ limit: 1000 }),
    ]);

    // Blog posts
    const blogPages: MetadataRoute.Sitemap = blogResponse.data.map((post) => ({
      url: `${baseUrl}/blog/${post.slug || post.id}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.8 : 0.6,
    }));

    // Recipes
    const recipePages: MetadataRoute.Sitemap = recipesResponse.data.map((recipe) => ({
      url: `${baseUrl}/recipes/${recipe.slug || recipe.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: recipe.featured ? 0.8 : 0.7,
    }));

    // Brewing guides
    const guidePages: MetadataRoute.Sitemap = guidesResponse.data.map((guide) => ({
      url: `${baseUrl}/brewing-guides/${guide.slug || guide.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: guide.featured ? 0.8 : 0.7,
    }));

    // Products
    const productPages: MetadataRoute.Sitemap = productsResponse.data.map((product) => ({
      url: `${baseUrl}/products/${product.slug || product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: product.featured ? 0.7 : 0.6,
    }));

    return [
      ...staticPages,
      ...blogPages,
      ...recipePages,
      ...guidePages,
      ...productPages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages if dynamic content fails
    return staticPages;
  }
}