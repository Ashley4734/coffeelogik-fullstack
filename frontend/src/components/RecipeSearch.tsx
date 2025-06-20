'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface CoffeeRecipe {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  featured?: boolean;
  brew_method?: string;
  difficulty_level?: string;
  total_time?: number;
  servings?: number;
  instructions?: string;
}

interface RecipeSearchProps {
  recipes: CoffeeRecipe[];
  onFilteredRecipes: (recipes: CoffeeRecipe[]) => void;
}

export default function RecipeSearch({ recipes, onFilteredRecipes }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      onFilteredRecipes(recipes);
      return;
    }

    const filtered = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(query.toLowerCase()) ||
      recipe.brew_method?.toLowerCase().includes(query.toLowerCase()) ||
      recipe.difficulty_level?.toLowerCase().includes(query.toLowerCase()) ||
      recipe.instructions?.toLowerCase().includes(query.toLowerCase())
    );

    onFilteredRecipes(filtered);
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
          placeholder="Search recipes & methods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              onFilteredRecipes(recipes);
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