// frontend/src/components/SearchResults.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getBlogPosts, getRecipes, getStrapiMedia, formatDate } from '@/lib/api';
// Remove unused imports - they're already imported in api.ts
// import type { BlogPost, CoffeeRecipe } from '@/lib/api';

interface SearchResult {
  type: 'blog' | 'recipe';
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: { url: string; alternativeText?: string } | null;
  publishedAt?: string;
  author?: { name: string } | null;
  brew_method?: string;
  difficulty_level?: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const [blogResponse, recipeResponse] = await Promise.all([
        getBlogPosts({ limit: 100 }),
        getRecipes({ limit: 100 })
      ]);

      const blogPosts = blogResponse.data || [];
      const recipes = recipeResponse.data || [];

      // Search blog posts
      const blogResults: SearchResult[] = blogPosts
        .filter(post => 
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(post => ({
          type: 'blog' as const,
          id: post.id,
          title: post.title,
          slug: post.slug || post.id.toString(),
          excerpt: post.excerpt,
          featured_image: post.featured_image,
          publishedAt: post.publishedAt,
          author: post.author
        }));

      // Search recipes
      const recipeResults: SearchResult[] = recipes
        .filter(recipe => 
          recipe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.brew_method?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(recipe => ({
          type: 'recipe' as const,
          id: recipe.id,
          title: recipe.name,
          slug: recipe.slug,
          excerpt: recipe.description,
          featured_image: recipe.featured_image,
          brew_method: recipe.brew_method,
          difficulty_level: recipe.difficulty_level
        }));

      // Combine and sort results
      const allResults = [...blogResults, ...recipeResults];
      setResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchInput.trim());
      window.history.pushState({}, '', url.toString());
      performSearch(searchInput.trim());
    }
  };

  return (
    <>
      {/* Search Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
          Search Results
        </h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search coffee content..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
        </form>
        
        {query && (
          <p className="mt-4 text-gray-600">
            {loading ? 'Searching...' : `${results.length} results found for "${query}"`}
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      ) : query && results.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find anything matching &quot;{query}&quot;. Try different keywords or browse our categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/blog" className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
              Browse All Articles
            </Link>
            <Link href="/recipes" className="rounded-md border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50">
              Explore Recipes
            </Link>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-2">
          {results.map((result) => (
            <article key={`${result.type}-${result.id}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex">
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  {result.featured_image ? (
                    <img
                      src={getStrapiMedia(result.featured_image.url)}
                      alt={result.featured_image.alternativeText || result.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">☕</span>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="mb-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      result.type === 'blog' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {result.type === 'blog' ? 'Article' : 'Recipe'}
                    </span>
                    {result.brew_method && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        {result.brew_method}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-600 mb-2">
                    <Link href={`/${result.type === 'blog' ? 'blog' : 'recipes'}/${result.slug}`}>
                      {result.title}
                    </Link>
                  </h3>
                  
                  {result.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {result.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-500">
                    {result.author && (
                      <span className="mr-3">{result.author.name}</span>
                    )}
                    {result.publishedAt && (
                      <span>{formatDate(result.publishedAt)}</span>
                    )}
                    {result.difficulty_level && (
                      <span className="ml-3">{result.difficulty_level}</span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : !query ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibual text-gray-900 mb-2">Start your search</h3>
          <p className="text-gray-600">
            Enter a search term above to find articles, recipes, and guides.
          </p>
        </div>
      ) : null}
    </>
  );
}
