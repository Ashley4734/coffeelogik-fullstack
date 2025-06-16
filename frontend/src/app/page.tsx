export const revalidate = 60; // Revalidate every 60 seconds

import Link from "next/link";
import { getBlogPosts, getRecipes, getStrapiMedia, calculateReadingTime } from "@/lib/api";

export default async function Home() {
  // Fetch featured content from Strapi
  let featuredPosts: import("@/lib/api").BlogPost[] = [];
  let featuredRecipes: import("@/lib/api").CoffeeRecipe[] = [];

  try {
    const [postsResponse, recipesResponse] = await Promise.all([
      getBlogPosts({ featured: true, limit: 3 }),
      getRecipes({ featured: true, limit: 3 })
    ]);
    
    featuredPosts = Array.isArray(postsResponse?.data) ? postsResponse.data : [];
    featuredRecipes = Array.isArray(recipesResponse?.data) ? recipesResponse.data : [];
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    // Fallback to empty arrays if Strapi is not available
  }
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-playfair">
              Welcome to{" "}
              <span className="text-amber-600">Coffee Logik</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Your ultimate destination for coffee knowledge. From brewing techniques to product reviews, 
              we&apos;re here to elevate your coffee experience one cup at a time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/blog"
                className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors"
              >
                Explore Blog
              </Link>
              <Link
                href="/recipes"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-amber-600 transition-colors"
              >
                Try Recipes <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-playfair">
              Latest Coffee Insights
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Stay updated with our latest articles, guides, and coffee discoveries.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredPosts.length > 0 ? featuredPosts.filter(post => post.title).map((post) => (
              <article key={post.id} className="flex flex-col items-start">
                <div className="relative w-full">
                  <div className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]">
                    {post.featured_image ? (
                      <img
                        src={getStrapiMedia(post.featured_image.url)}
                        alt={post.featured_image.alternativeText || post.title}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
                        <span className="text-6xl">☕</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <span className="text-gray-500">
                      {post.reading_time ? `${post.reading_time} min read` : calculateReadingTime(post.content)}
                    </span>
                    {post.categories?.[0] && (
                      <span className="relative z-10 rounded-full bg-amber-50 px-3 py-1.5 font-medium text-amber-600 hover:bg-amber-100">
                        {post.categories[0].name}
                      </span>
                    )}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-amber-600">
                      <Link href={`/blog/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-amber-800">
                        {post.author?.name?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                      </span>
                    </div>
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        {post.author?.name || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              // Fallback content when no posts are available
              <div className="col-span-3 text-center py-12">
                <span className="text-6xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured posts yet</h3>
                <p className="text-gray-600">Create some blog posts in Strapi and mark them as featured to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="bg-amber-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-playfair">
              Popular Recipes
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Master these essential brewing methods with our step-by-step guides.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredRecipes.length > 0 ? featuredRecipes.filter(recipe => recipe.name).map((recipe) => (
              <div key={recipe.id} className="group relative bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6">
                  {recipe.featured_image ? (
                    <img
                      src={getStrapiMedia(recipe.featured_image.url)}
                      alt={recipe.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-8xl">☕</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600">
                  <Link href={`/recipes/${recipe.slug}`}>
                    <span className="absolute inset-0" />
                    {recipe.name}
                  </Link>
                </h3>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    {recipe.difficulty_level}
                  </span>
                  <span>{recipe.total_time ? `${recipe.total_time} min` : 'Quick'}</span>
                </div>
              </div>
            )) : (
              // Fallback content when no recipes are available
              <div className="col-span-3 text-center py-12">
                <span className="text-8xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured recipes yet</h3>
                <p className="text-gray-600">Create some coffee recipes in Strapi and mark them as featured to see them here.</p>
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/recipes"
              className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors"
            >
              View All Recipes
              <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-playfair">
              Join the Coffee Community
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Get weekly coffee tips, exclusive recipes, and the latest product reviews delivered to your inbox.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/blog"
                className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                Read Our Blog
              </Link>
              <Link
                href="/authors"
                className="text-sm font-semibold leading-6 text-white hover:text-amber-400"
              >
                Meet Our Authors <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
