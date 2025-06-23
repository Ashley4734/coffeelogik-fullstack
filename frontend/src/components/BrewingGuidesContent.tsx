'use client';

import { useState } from 'react';
import Link from "next/link";
import { ClockIcon, UserIcon, AcademicCapIcon, BeakerIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { getStrapiMedia } from "@/lib/api";

interface BrewingGuide {
  id: number;
  title: string;
  description?: string;
  slug?: string;
  featured?: boolean;
  method?: string;
  difficulty_level?: string;
  total_time?: number;
  servings?: number;
  featured_image?: { 
    url: string; 
    alternativeText?: string; 
  } | null;
  publishedAt?: string;
}

interface BrewingGuidesContentProps {
  initialGuides: BrewingGuide[];
}

const methods = [
  "All Methods",
  "Pour Over",
  "French Press",
  "Espresso",
  "AeroPress",
  "Cold Brew",
  "Chemex",
  "V60",
  "Moka Pot"
];

const difficultyLevels = [
  "All Levels",
  "Beginner",
  "Intermediate", 
  "Advanced"
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "difficulty", label: "Difficulty (Easy to Hard)" },
  { value: "time", label: "Brewing Time" }
];

export default function BrewingGuidesContent({ initialGuides }: BrewingGuidesContentProps) {
  const [filteredGuides, setFilteredGuides] = useState(initialGuides);
  const [activeFilters, setActiveFilters] = useState({
    method: 'All Methods',
    difficulty: 'All Levels',
    sort: 'newest'
  });

  const applyFiltersAndSort = (method: string, difficulty: string, sortBy: string) => {
    let filtered = [...initialGuides];

    // Apply method filter
    if (method !== 'All Methods') {
      filtered = filtered.filter(guide => guide.method === method);
    }

    // Apply difficulty filter
    if (difficulty !== 'All Levels') {
      filtered = filtered.filter(guide => guide.difficulty_level === difficulty);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt || '').getTime() - new Date(b.publishedAt || '').getTime();
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'difficulty':
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return (difficultyOrder[a.difficulty_level as keyof typeof difficultyOrder] || 4) - 
                 (difficultyOrder[b.difficulty_level as keyof typeof difficultyOrder] || 4);
        case 'time':
          return (a.total_time || 0) - (b.total_time || 0);
        case 'newest':
        default:
          return new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime();
      }
    });

    setFilteredGuides(filtered);
  };

  const handleMethodChange = (method: string) => {
    const newFilters = { ...activeFilters, method };
    setActiveFilters(newFilters);
    applyFiltersAndSort(method, activeFilters.difficulty, activeFilters.sort);
  };

  const handleDifficultyChange = (difficulty: string) => {
    const newFilters = { ...activeFilters, difficulty };
    setActiveFilters(newFilters);
    applyFiltersAndSort(activeFilters.method, difficulty, activeFilters.sort);
  };

  const handleSortChange = (sort: string) => {
    const newFilters = { ...activeFilters, sort };
    setActiveFilters(newFilters);
    applyFiltersAndSort(activeFilters.method, activeFilters.difficulty, sort);
  };

  const featuredGuides = filteredGuides.filter(guide => guide.featured);
  const isFiltered = activeFilters.method !== 'All Methods' || activeFilters.difficulty !== 'All Levels';

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <BeakerIcon className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {isFiltered ? `${filteredGuides.length} of ${initialGuides.length}` : `${initialGuides.length}`} Brewing Guides {isFiltered && 'Found'}
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl font-playfair mb-6">
              Brewing <span className="text-emerald-600">Guides</span>
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              Master the art of coffee brewing with our comprehensive step-by-step guides. From beginner-friendly methods to advanced barista techniques.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Quick Stats & Filter Card */}
        <div className="-mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mx-auto max-w-4xl p-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3">
                  <BeakerIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{isFiltered ? filteredGuides.length : initialGuides.length}</div>
                <div className="text-sm text-gray-600">{isFiltered ? 'Filtered' : 'Total'} Guides</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{featuredGuides.length}</div>
                <div className="text-sm text-gray-600">Featured Guides</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-3">
                  <ChartBarIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{[...new Set(initialGuides.map(g => g.method))].length}</div>
                <div className="text-sm text-gray-600">Brewing Methods</div>
              </div>
            </div>
            
            {/* Filters & Sorting */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter & Sort Guides</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {/* Method Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Brewing Method</label>
                  <select 
                    value={activeFilters.method}
                    onChange={(e) => handleMethodChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {methods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Difficulty Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Difficulty Level</label>
                  <select 
                    value={activeFilters.difficulty}
                    onChange={(e) => handleDifficultyChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {difficultyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Sort By</label>
                  <select 
                    value={activeFilters.sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Clear Filters */}
              {isFiltered && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setActiveFilters({ method: 'All Methods', difficulty: 'All Levels', sort: 'newest' });
                      setFilteredGuides(initialGuides);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Guides */}
        {featuredGuides.length > 0 && (
          <div className="mx-auto mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Featured Guides</h2>
            <div className="grid gap-8 lg:grid-cols-3">
              {featuredGuides.map((guide) => (
                <div key={guide.id} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] w-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    {guide.featured_image ? (
                      <img
                        src={getStrapiMedia(guide.featured_image.url)}
                        alt={guide.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">☕</span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                        {guide.method}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        guide.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        guide.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <AcademicCapIcon className="mr-1 h-3 w-3" />
                        {guide.difficulty_level}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 mb-2">
                      <Link href={`/brewing-guides/${guide.slug}`}>
                        <span className="absolute inset-0" />
                        {guide.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="mr-1 h-4 w-4" />
                        <span>{guide.total_time ? `${guide.total_time} min` : 'Quick'}</span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="mr-1 h-4 w-4" />
                        <span>{guide.servings} serving{guide.servings && guide.servings > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Guides */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
            {isFiltered ? 'Filtered Results' : 'All Brewing Guides'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.length > 0 ? filteredGuides.map((guide) => (
              <div key={guide.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  {guide.featured_image ? (
                    <img
                      src={getStrapiMedia(guide.featured_image.url)}
                      alt={guide.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl">☕</span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-emerald-600 font-medium">{guide.method}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      guide.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-600' :
                      guide.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {guide.difficulty_level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 mb-2">
                    <Link href={`/brewing-guides/${guide.slug}`}>
                      <span className="absolute inset-0" />
                      {guide.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{guide.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="mr-1 h-4 w-4" />
                      <span>{guide.total_time ? `${guide.total_time} min` : 'Quick'}</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="mr-1 h-4 w-4" />
                      <span>{guide.servings} serving{guide.servings && guide.servings > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-5xl mb-4 block">🔍</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No guides found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or browse all guides.</p>
                <button
                  onClick={() => {
                    setActiveFilters({ method: 'All Methods', difficulty: 'All Levels', sort: 'newest' });
                    setFilteredGuides(initialGuides);
                  }}
                  className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                >
                  View All Guides
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-20 max-w-2xl text-center bg-amber-50 rounded-3xl p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
            Perfect Your Brewing
          </h2>
          <p className="text-gray-600 mb-6">
            Have questions about brewing? Check out our blog for more coffee tips and techniques, or explore our product reviews for the best equipment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/blog" className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
              Read Coffee Blog
            </Link>
            <Link href="/products" className="rounded-md border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50">
              Shop Equipment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}