// frontend/src/app/blog/category/[slug]/page.tsx
export const revalidate = 60;

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getBlogPosts, getCategories, getStrapiMedia, calculateReadingTime, formatDate } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Generate metadata for each category page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const categoriesResponse = await getCategories();
    const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];
    const category = categories.find(cat => cat.slug === slug);
    
    if (!category) {
      return {
        title: 'Category Not Found - CoffeeLogik',
        description: 'The requested category could not be found.',
      };
    }
    
    return {
      title: `${category.name} - Coffee Articles & Guides`,
      description: category.description || `Discover all our ${category.name.toLowerCase()} articles, guides, and coffee content.`,
      keywords: `${category.name}, coffee, brewing, guides, tips`,
      openGraph: {
        title: `${category.name} - Coffee Articles & Guides`,
        description: category.description || `Discover all our ${category.name.toLowerCase()} articles and guides.`,
        type: 'website',
      },
      alternates: {
        canonical: `/blog/category/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for category:', error);
    return {
      title: 'Coffee Category - CoffeeLogik',
      description: 'Explore coffee articles and guides by category.',
    };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch category and posts
  let category: import("@/lib/api").Category | null = null;
  let categoryPosts: import("@/lib/api").BlogPost[] = [];
  let allCategories: import("@/lib/api").Category[] = [];

  try {
    const [categoriesResponse, postsResponse] = await Promise.all([
      getCategories(),
      getBlogPosts({ limit: 100 })
    ]);
    
    const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];
    const posts = Array.isArray(postsResponse?.data) ? postsResponse.data : [];
    
    category = categories.find(cat => cat.slug === slug) || null;
    allCategories = categories;
    
    if (category) {
      categoryPosts = posts.filter(post => 
        post.categories?.some(cat => cat.slug === slug)
      );
    }
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Category Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <div className="mb-6">
            <span 
              className="inline-flex items-center rounded-full px-6 py-3 text-lg font-semibold text-white"
              style={{ backgroundColor: category.color || '#f59e0b' }}
            >
              {category.name}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
            {category.name} Articles
          </h1>
          {category.description && (
            <p className="text-xl leading-8 text-gray-600 mb-8">
              {category.description}
            </p>
          )}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>{categoryPosts.length} article{categoryPosts.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Articles Grid */}
        {categoryPosts.length > 0 ? (
          <div className="mx-auto max-w-2xl grid grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {categoryPosts.map((post) => (
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
                    <time dateTime={post.publishedAt} className="text-gray-500">
                      {post.publishedAt ? formatDate(post.publishedAt) : 'No date'}
                    </time>
                    <span className="text-gray-500">
                      {post.reading_time ? `${post.reading_time} min read` : calculateReadingTime(post.content)}
                    </span>
                    {post.categories?.filter(cat => cat.slug !== slug).slice(0, 1).map(cat => (
                      <Link
                        key={cat.id}
                        href={`/blog/category/${cat.slug}`}
                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                      >
                        {cat.name}
                      </Link>
                    ))}
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
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {post.author?.avatar ? (
                        <img
                          src={getStrapiMedia(post.author.avatar.url)}
                          alt={post.author.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-amber-800">
                          {post.author?.name?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        {post.author?.name || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t published any articles in the {category.name} category yet.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
            >
              Browse All Articles
            </Link>
          </div>
        )}

        {/* Other Categories */}
        {allCategories.length > 1 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Explore Other Categories</h2>
            <div className="flex flex-wrap gap-3">
              {allCategories.filter(cat => cat.slug !== slug).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className="inline-flex items-center rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
