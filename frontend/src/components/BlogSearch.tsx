'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  featured?: boolean;
  categories?: Array<{ name: string }>;
  author?: { name: string } | null;
}

interface BlogSearchProps {
  posts: BlogPost[];
  onFilteredPosts: (posts: BlogPost[]) => void;
}

export default function BlogSearch({ posts, onFilteredPosts }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      onFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
      post.categories?.some(cat => cat.name.toLowerCase().includes(query.toLowerCase())) ||
      post.author?.name.toLowerCase().includes(query.toLowerCase())
    );

    onFilteredPosts(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="mx-auto max-w-md relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search coffee topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              onFilteredPosts(posts);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="mt-2 text-center">
          <button
            onClick={() => handleSearch(searchQuery)}
            className="bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
}