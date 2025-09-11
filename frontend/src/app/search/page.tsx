// frontend/src/app/search/page.tsx
import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results - CoffeeLogik',
  description: 'Search results for coffee articles, recipes, and guides.',
  robots: {
    index: false, // Don't index search pages
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Suspense fallback={<SearchLoading />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="text-center py-12">
      <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-600">Searching...</p>
    </div>
  );
}
