'use client';

import { useState } from 'react';
import Link from "next/link";
import { FireIcon, ClockIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { getStrapiMedia, calculateReadingTime, formatDate } from "@/lib/api";
import BlogSearch from './BlogSearch';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featured?: boolean;
  featured_image?: { url: string; alternativeText?: string };
  categories?: Array<{ name: string }>;
  author?: { 
    name: string;
    avatar?: { url: string };
  };
  publishedAt?: string;
  reading_time?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BlogContentProps {
  initialPosts: BlogPost[];
  categories: Category[];
}

export default function BlogContent({ initialPosts, categories }: BlogContentProps) {
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [searchActive, setSearchActive] = useState(false);

  // Group categories by type for better organization
  const mainCategories = categories.filter(cat => 
    ['All', 'Brewing Methods', 'Coffee Origins', 'Equipment Reviews', 'Beginner Guides'].includes(cat.name)
  ).slice(0, 5);
  
  const featuredPosts = filteredPosts.filter(post => post.featured).slice(0, 2);
  const totalPosts = initialPosts.length;
  const filteredCount = filteredPosts.length;

  const handleFilteredPosts = (posts: BlogPost[]) => {
    setFilteredPosts(posts);
    setSearchActive(posts.length !== initialPosts.length || posts !== initialPosts);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <FireIcon className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                  {searchActive ? `${filteredCount} of ${totalPosts}` : `${totalPosts}`} Articles {searchActive && 'Found'}
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl font-playfair mb-6">
              Coffee <span className="text-amber-600">Chronicles</span>
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              From bean to cup, discover expert brewing guides, equipment reviews, and coffee culture insights that elevate your daily ritual.
            </p>
            
            {/* Search Bar */}
            <BlogSearch posts={initialPosts} onFilteredPosts={handleFilteredPosts} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Quick Stats & Category Filter */}
        <div className="-mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mx-auto max-w-4xl p-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{searchActive ? filteredCount : totalPosts}</div>
                <div className="text-sm text-gray-600">{searchActive ? 'Filtered' : 'Total'} Articles</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{featuredPosts.length}</div>
                <div className="text-sm text-gray-600">Featured Posts</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-3">
                  <FireIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{mainCategories.length - 1}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
            
            {/* Popular Categories */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {mainCategories.map((category, index) => (
                  <button
                    key={index}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      category.name === 'All' 
                        ? 'bg-amber-100 text-amber-800 border-2 border-amber-200 shadow-sm' 
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
                {categories.length > 5 && (
                  <button className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                    +{categories.length - 5} more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Notice */}
        {searchActive && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              <span className="text-amber-800 text-sm">
                Showing {filteredCount} result{filteredCount !== 1 ? 's' : ''} 
              </span>
              <button 
                onClick={() => handleFilteredPosts(initialPosts)}
                className="ml-3 text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mx-auto mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2">
              {featuredPosts.map((post) => (
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
          </div>
        )}

        {/* All Posts */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
            {searchActive ? 'Search Results' : 'All Articles'}
          </h2>
          {filteredPosts.length > 0 ? (
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {filteredPosts.filter(post => post.title).map((post) => (
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
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {post.author?.avatar ? (
                          <img
                            src={getStrapiMedia(post.author.avatar.url)}
                            alt={post.author.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-amber-800">
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
            <div className="col-span-3 text-center py-12">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search terms or browse all articles.</p>
              <button
                onClick={() => handleFilteredPosts(initialPosts)}
                className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
              >
                View All Articles
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredPosts.length > 0 && !searchActive && (
          <div className="mt-16 text-center">
            <button className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </>
  );
}