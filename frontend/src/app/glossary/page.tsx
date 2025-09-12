// frontend/src/app/glossary/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { MagnifyingGlassIcon, BookOpenIcon } from '@heroicons/react/24/outline';

// Note: In a real app, you'd want to move the metadata to a separate file
// since this is a client component. For now, we'll include it as a comment.
/*
export const metadata: Metadata = {
  title: 'Coffee Glossary - Coffee Terms & Definitions',
  description: 'Complete glossary of coffee terms, brewing terminology, and definitions. Learn the language of coffee with our comprehensive guide.',
  keywords: 'coffee glossary, coffee terms, coffee definitions, brewing terminology, coffee vocabulary',
  alternates: {
    canonical: '/glossary',
  },
};
*/

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'brewing' | 'equipment' | 'coffee-types' | 'processing' | 'tasting' | 'general';
  relatedTerms?: string[];
}

const glossaryTerms: GlossaryTerm[] = [
  // Brewing Terms
  {
    term: "Bloom",
    definition: "The initial phase of pour-over brewing where hot water is poured over coffee grounds to release CO2, causing the coffee to 'bloom' or expand. Usually takes 30-45 seconds.",
    category: "brewing",
    relatedTerms: ["Pour Over", "Extraction", "Degassing"]
  },
  {
    term: "Extraction",
    definition: "The process of dissolving desirable compounds from coffee grounds using water. Proper extraction balances sweetness, acidity, and bitterness for optimal flavor.",
    category: "brewing",
    relatedTerms: ["Over-extraction", "Under-extraction", "Brewing Time"]
  },
  {
    term: "Brewing Ratio",
    definition: "The proportion of coffee to water used in brewing, typically expressed as 1:15 (1 gram coffee to 15 grams water) or similar ratios depending on the brewing method.",
    category: "brewing",
    relatedTerms: ["Golden Ratio", "Strength", "Concentration"]
  },
  {
    term: "Crema",
    definition: "The golden-brown foam that forms on top of espresso shots, created by emulsified oils and CO2 released during extraction under pressure.",
    category: "brewing",
    relatedTerms: ["Espresso", "Pressure", "Fresh Coffee"]
  },
  {
    term: "Tamping",
    definition: "The process of compressing ground coffee in an espresso portafilter using a tamper to create an even, level surface for consistent water extraction.",
    category: "brewing",
    relatedTerms: ["Espresso", "Portafilter", "Pressure", "Extraction"]
  },

  // Equipment Terms
  {
    term: "Portafilter",
    definition: "The handled metal basket that holds ground coffee in an espresso machine. It locks into the group head and directs water through the coffee.",
    category: "equipment",
    relatedTerms: ["Espresso Machine", "Tamping", "Basket", "Group Head"]
  },
  {
    term: "Burr Grinder",
    definition: "A coffee grinder that uses two revolving abrasive surfaces (burrs) to crush coffee beans into uniform particles, providing consistent grind size.",
    category: "equipment",
    relatedTerms: ["Blade Grinder", "Grind Size", "Consistency"]
  },
  {
    term: "Group Head",
    definition: "The part of an espresso machine where water is dispensed onto the coffee grounds. It houses the portafilter and controls water temperature and pressure.",
    category: "equipment",
    relatedTerms: ["Espresso Machine", "Portafilter", "Pressure", "Temperature"]
  },
  {
    term: "Gooseneck Kettle",
    definition: "A specialized kettle with a long, curved spout that provides precise control over water flow rate and direction, essential for pour-over brewing.",
    category: "equipment",
    relatedTerms: ["Pour Over", "Water Control", "Brewing", "V60"]
  },

  // Coffee Types & Processing
  {
    term: "Single Origin",
    definition: "Coffee beans sourced from a single geographic location, such as a specific farm, region, or country, highlighting unique terroir characteristics.",
    category: "coffee-types",
    relatedTerms: ["Blend", "Terroir", "Traceability", "Specialty Coffee"]
  },
  {
    term: "Blend",
    definition: "A combination of coffee beans from different origins, roasted separately or together to create a specific flavor profile or consistent taste.",
    category: "coffee-types",
    relatedTerms: ["Single Origin", "Roasting", "Flavor Profile"]
  },
  {
    term: "Washed Process",
    definition: "A coffee processing method where the cherry is removed from the bean before drying, typically producing cleaner, brighter flavors with pronounced acidity.",
    category: "processing",
    relatedTerms: ["Natural Process", "Honey Process", "Processing", "Acidity"]
  },
  {
    term: "Natural Process",
    definition: "A coffee processing method where beans are dried inside the fruit, often resulting in sweeter, fruitier flavors with more body.",
    category: "processing",
    relatedTerms: ["Washed Process", "Honey Process", "Fruit-forward", "Body"]
  },
  {
    term: "Honey Process",
    definition: "A processing method that removes the skin but leaves some mucilage on the bean during drying, creating flavors between washed and natural processes.",
    category: "processing",
    relatedTerms: ["Washed Process", "Natural Process", "Mucilage", "Sweetness"]
  },

  // Tasting Terms
  {
    term: "Acidity",
    definition: "The bright, tangy quality in coffee that provides liveliness and complexity. Often described as citrusy, wine-like, or crisp.",
    category: "tasting",
    relatedTerms: ["Brightness", "pH", "Citrus", "Tasting Notes"]
  },
  {
    term: "Body",
    definition: "The weight, thickness, or mouthfeel of coffee on the palate, ranging from light and tea-like to heavy and syrupy.",
    category: "tasting",
    relatedTerms: ["Mouthfeel", "Texture", "Weight", "Viscosity"]
  },
  {
    term: "Finish",
    definition: "The lingering taste and sensations that remain in the mouth after swallowing coffee, also called the aftertaste.",
    category: "tasting",
    relatedTerms: ["Aftertaste", "Lingering", "Tasting", "Flavor"]
  },
  {
    term: "Cupping",
    definition: "A standardized method for tasting and evaluating coffee quality, involving steeping coarsely ground coffee in hot water and tasting with a spoon.",
    category: "tasting",
    relatedTerms: ["Tasting", "Evaluation", "Quality", "Slurping"]
  },
  {
    term: "Terroir",
    definition: "The complete natural environment where coffee is grown, including soil, climate, altitude, and farming practices, which influences flavor characteristics.",
    category: "tasting",
    relatedTerms: ["Origin", "Environment", "Flavor Profile", "Geography"]
  },

  // General Terms
  {
    term: "Specialty Coffee",
    definition: "High-quality coffee that scores 80+ points on a 100-point scale according to Specialty Coffee Association standards, representing the top tier of coffee.",
    category: "general",
    relatedTerms: ["SCA", "Quality", "Grading", "Third Wave"]
  },
  {
    term: "Third Wave Coffee",
    definition: "A movement treating coffee as artisanal craft similar to wine or craft beer, emphasizing origin, processing, brewing methods, and overall experience.",
    category: "general",
    relatedTerms: ["Artisanal", "Craft Coffee", "Specialty Coffee", "Coffee Culture"]
  },
  {
    term: "Degassing",
    definition: "The release of CO2 from freshly roasted coffee beans over time. Proper degassing (usually 2-14 days post-roast) is important for optimal extraction.",
    category: "general",
    relatedTerms: ["Fresh Coffee", "Roast Date", "CO2", "Extraction"]
  },
  {
    term: "Coffee Cherry",
    definition: "The fruit of the coffee plant that contains coffee beans (actually seeds). The cherry must be processed to extract the green coffee beans inside.",
    category: "general",
    relatedTerms: ["Processing", "Green Coffee", "Fruit", "Harvest"]
  },
  {
    term: "Green Coffee",
    definition: "Unroasted coffee beans in their natural state after processing. Green beans can be stored for months and are roasted to develop flavor.",
    category: "general",
    relatedTerms: ["Roasting", "Storage", "Coffee Cherry", "Raw"]
  }
];

const categories = [
  { key: 'all', label: 'All Terms', color: 'bg-gray-100 text-gray-700' },
  { key: 'brewing', label: 'Brewing', color: 'bg-blue-100 text-blue-700' },
  { key: 'equipment', label: 'Equipment', color: 'bg-green-100 text-green-700' },
  { key: 'coffee-types', label: 'Coffee Types', color: 'bg-amber-100 text-amber-700' },
  { key: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-700' },
  { key: 'tasting', label: 'Tasting', color: 'bg-red-100 text-red-700' },
  { key: 'general', label: 'General', color: 'bg-indigo-100 text-indigo-700' }
];

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('all');

  // Filter terms based on search, category, and letter
  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesLetter = selectedLetter === 'all' || term.term.toLowerCase().startsWith(selectedLetter);
    
    return matchesSearch && matchesCategory && matchesLetter;
  });

  // Sort terms alphabetically
  const sortedTerms = filteredTerms.sort((a, b) => a.term.localeCompare(b.term));

  // Get unique first letters
  const availableLetters = Array.from(new Set(glossaryTerms.map(term => term.term.charAt(0).toLowerCase()))).sort();

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3 bg-indigo-100 rounded-full px-6 py-3">
              <BookOpenIcon className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Coffee Education</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
            Coffee Glossary
          </h1>
          <p className="text-lg leading-8 text-gray-600">
            Master the language of coffee with our comprehensive guide to coffee terms, brewing terminology, and definitions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search coffee terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      selectedCategory === category.key
                        ? category.color + ' ring-2 ring-offset-1 ring-indigo-500'
                        : category.color + ' opacity-70 hover:opacity-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Browse by Letter</h3>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedLetter('all')}
                  className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                    selectedLetter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {availableLetters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                      selectedLetter === letter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {letter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all' || selectedLetter !== 'all' 
              ? `Showing ${sortedTerms.length} of ${glossaryTerms.length} terms`
              : `${glossaryTerms.length} coffee terms defined`
            }
          </p>
        </div>

        {/* Glossary Terms */}
        {sortedTerms.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {sortedTerms.map((term) => (
              <div key={term.term} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{term.term}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(term.category)}`}>
                    {categories.find(c => c.key === term.category)?.label}
                  </span>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  {term.definition}
                </p>
                
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Related terms:</p>
                    <div className="flex flex-wrap gap-1">
                      {term.relatedTerms.map((relatedTerm) => (
                        <span 
                          key={relatedTerm}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                          onClick={() => setSearchTerm(relatedTerm)}
                        >
                          {relatedTerm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-xl p-8">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No terms found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLetter('all');
                }}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Put Your Knowledge to Use?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Now that you've learned the terminology, discover our brewing guides and find the perfect coffee for your taste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guides"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Brewing Guides
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Shop Coffee
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
