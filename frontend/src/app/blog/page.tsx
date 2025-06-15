import Link from "next/link";
import { getBlogPosts, getCategories, getStrapiMedia, calculateReadingTime, formatDate } from "@/lib/api";

export default async function BlogPage() {
  // Fetch blog posts and categories from Strapi
  let blogPosts: import("@/lib/api").BlogPost[] = [];
  let categories: import("@/lib/api").Category[] = [];

  try {
    const [postsResponse, categoriesResponse] = await Promise.all([
      getBlogPosts({ limit: 50 }),
      getCategories()
    ]);
    
    blogPosts = Array.isArray(postsResponse?.data) ? postsResponse.data : [];
    const strapiCategories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];
    categories = [{ id: 0, name: "All", slug: "all" } as import("@/lib/api").Category, ...strapiCategories];
  } catch (error) {
    console.error('Error fetching blog data:', error);
    // Fallback to just the "All" category if Strapi is not available
    categories = [{ id: 0, name: "All", slug: "all" } as import("@/lib/api").Category];
  }
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair">
            Coffee Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover the latest insights, guides, and reviews from coffee enthusiasts around the world.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.filter(category => category.name).map((category, index) => (
              <button
                key={index}
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2">
            {blogPosts.filter(post => post.featured).length > 0 ? (
              blogPosts.filter(post => post.featured).map((post) => (
                <article key={post.id} className="flex flex-col items-start">
                  <div className="relative w-full">
                    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover">
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
                      <time dateTime={post.publishedAt} className="text-gray-500">
                        {post.publishedAt ? formatDate(post.publishedAt) : 'No date'}
                      </time>
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
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <span className="text-6xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured posts yet</h3>
                <p className="text-gray-600">Create some blog posts in Strapi and mark them as featured.</p>
              </div>
            )}
          </div>
        </div>

        {/* All Posts */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">All Articles</h2>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {blogPosts.length > 0 ? blogPosts.filter(post => post.title).map((post) => (
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
                        <span className="text-4xl">☕</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime={post.publishedAt} className="text-gray-500">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'No date'}
                    </time>
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
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-amber-800">
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
              <div className="col-span-3 text-center py-12">
                <span className="text-6xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
                <p className="text-gray-600">Create some blog posts in Strapi to see them here.</p>
                <Link href="http://localhost:1337/admin" target="_blank" className="inline-flex items-center mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                  Go to Strapi Admin
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );
}