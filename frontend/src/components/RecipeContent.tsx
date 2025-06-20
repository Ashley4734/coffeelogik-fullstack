'use client';

import { useState } from 'react';
import Link from "next/link";
import { ClockIcon, AcademicCapIcon, UsersIcon, FireIcon, BeakerIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { getStrapiMedia } from "@/lib/api";
import RecipeSearch from './RecipeSearch';

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
  featured_image?: { 
    url: string; 
    alternativeText?: string; 
  } | null;
}

interface RecipeContentProps {
  initialRecipes: CoffeeRecipe[];
  brewMethods: string[];
  difficulties: string[];
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "Intermediate":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "Advanced":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
}

export default function RecipeContent({ initialRecipes, brewMethods, difficulties }: RecipeContentProps) {
  const [filteredRecipes, setFilteredRecipes] = useState(initialRecipes);
  const [searchActive, setSearchActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ method: 'All Methods', difficulty: 'All Levels' });

  // Popular brewing methods (limit to 6)
  const popularMethods = brewMethods.slice(0, 6);
  
  const featuredRecipes = filteredRecipes.filter(recipe => recipe.featured).slice(0, 3);
  const totalRecipes = initialRecipes.length;
  const filteredCount = filteredRecipes.length;

  // Get unique brew methods and difficulty levels from recipes
  const uniqueMethods = [...new Set(initialRecipes.map(r => r.brew_method).filter(Boolean))];
  const uniqueDifficulties = [...new Set(initialRecipes.map(r => r.difficulty_level).filter(Boolean))];

  const handleFilteredRecipes = (recipes: CoffeeRecipe[]) => {
    setFilteredRecipes(recipes);
    setSearchActive(recipes.length !== initialRecipes.length || recipes !== initialRecipes);
  };

  const handleMethodFilter = (method: string) => {
    let filtered = initialRecipes;
    
    if (method !== 'All Methods') {
      filtered = filtered.filter(recipe => recipe.brew_method === method);
    }
    
    if (activeFilters.difficulty !== 'All Levels') {
      filtered = filtered.filter(recipe => recipe.difficulty_level === activeFilters.difficulty);
    }
    
    setActiveFilters(prev => ({ ...prev, method }));
    handleFilteredRecipes(filtered);
  };

  const handleDifficultyFilter = (difficulty: string) => {
    let filtered = initialRecipes;
    
    if (difficulty !== 'All Levels') {
      filtered = filtered.filter(recipe => recipe.difficulty_level === difficulty);
    }
    
    if (activeFilters.method !== 'All Methods') {
      filtered = filtered.filter(recipe => recipe.brew_method === activeFilters.method);
    }
    
    setActiveFilters(prev => ({ ...prev, difficulty }));
    handleFilteredRecipes(filtered);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.04%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%223%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <BeakerIcon className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                  {searchActive ? `${filteredCount} of ${totalRecipes}` : `${totalRecipes}`} Recipes {searchActive && 'Found'}
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl font-playfair mb-6">
              Coffee <span className="text-amber-600">Recipes</span>
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              Master the art of coffee brewing with step-by-step guides for every skill level and brewing method. From beginner-friendly techniques to advanced barista secrets.
            </p>
            
            {/* Search Bar */}
            <RecipeSearch recipes={initialRecipes} onFilteredRecipes={handleFilteredRecipes} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Quick Stats & Popular Methods */}
        <div className="-mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mx-auto max-w-5xl p-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <BeakerIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{searchActive ? filteredCount : totalRecipes}</div>
                <div className="text-sm text-gray-600">{searchActive ? 'Filtered' : 'Total'} Recipes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <FireIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{featuredRecipes.length}</div>
                <div className="text-sm text-gray-600">Featured Recipes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-3">
                  <AcademicCapIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{uniqueMethods.length}</div>
                <div className="text-sm text-gray-600">Brew Methods</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{uniqueDifficulties.length}</div>
                <div className="text-sm text-gray-600">Skill Levels</div>
              </div>
            </div>
            
            {/* Popular Methods */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Brewing Methods</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {popularMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => handleMethodFilter(method)}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      activeFilters.method === method
                        ? 'bg-amber-100 text-amber-800 border-2 border-amber-200 shadow-sm' 
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
                {brewMethods.length > 6 && (
                  <button className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                    +{brewMethods.length - 6} more
                  </button>
                )}
              </div>
            </div>

            {/* Difficulty Levels */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Levels</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => handleDifficultyFilter(difficulty)}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      activeFilters.difficulty === difficulty
                        ? 'bg-amber-100 text-amber-800 border-2 border-amber-200 shadow-sm' 
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
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
                onClick={() => {
                  handleFilteredRecipes(initialRecipes);
                  setActiveFilters({ method: 'All Methods', difficulty: 'All Levels' });
                }}
                className="ml-3 text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Featured Recipes */}
        {featuredRecipes.length > 0 && (
          <div className="mx-auto mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Featured Recipes</h2>
            <div className="grid gap-8 lg:grid-cols-3">
              {featuredRecipes.map((recipe) => (
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
                  
                  <div className="mb-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getDifficultyColor(recipe.difficulty_level || '')}`}>
                      {recipe.difficulty_level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                    <Link href={`/recipes/${recipe.slug || recipe.id}`}>
                      <span className="absolute inset-0" />
                      {recipe.name}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="mr-1 h-3 w-3" />
                      <span>{recipe.total_time ? `${recipe.total_time} min` : 'Quick'}</span>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="mr-1 h-3 w-3" />
                      <span>{recipe.servings} serving{(recipe.servings || 1) > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <AcademicCapIcon className="mr-1 h-3 w-3" />
                      <span>{recipe.brew_method}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Recipes */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
            {searchActive ? 'Search Results' : 'All Recipes'}
          </h2>
          {filteredRecipes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="group relative bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                    {recipe.featured_image ? (
                      <img
                        src={getStrapiMedia(recipe.featured_image.url)}
                        alt={recipe.name}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-6xl">☕</span>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getDifficultyColor(recipe.difficulty_level || '')}`}>
                      {recipe.difficulty_level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                    <Link href={`/recipes/${recipe.slug || recipe.id}`}>
                      <span className="absolute inset-0" />
                      {recipe.name}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="mr-1 h-3 w-3" />
                      <span>{recipe.total_time ? `${recipe.total_time} min` : 'Quick'}</span>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="mr-1 h-3 w-3" />
                      <span>{recipe.servings} serving{(recipe.servings || 1) > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <AcademicCapIcon className="mr-1 h-3 w-3" />
                      <span>{recipe.brew_method}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-3 text-center py-12">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search terms or browse all recipes.</p>
              <button
                onClick={() => {
                  handleFilteredRecipes(initialRecipes);
                  setActiveFilters({ method: 'All Methods', difficulty: 'All Levels' });
                }}
                className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
              >
                View All Recipes
              </button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!searchActive && (
          <div className="mx-auto mt-20 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-gray-600 mb-8">
              Submit a recipe request and our coffee experts will create a custom brewing guide just for you.
            </p>
            <button className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors">
              Request a Recipe
            </button>
          </div>
        )}
      </div>
    </>
  );
}