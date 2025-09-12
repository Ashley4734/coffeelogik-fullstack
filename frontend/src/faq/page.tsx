// frontend/src/app/faq/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  QuestionMarkCircleIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  LightBulbIcon,
  BeakerIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Note: Since this is a client component, metadata would need to be handled differently
// For now, I'll include it as a comment for when converted to server component


export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Coffee Logik',
  description: 'Find answers to common questions about coffee brewing, equipment, recipes, and more. Get expert answers from the Coffee Logik team.',
  keywords: 'coffee FAQ, coffee questions, brewing help, coffee equipment questions, coffee tips',
  openGraph: {
    title: 'Frequently Asked Questions - Coffee Logik',
    description: 'Find answers to common questions about coffee brewing, equipment, recipes, and more.',
    type: 'website',
  },
  alternates: {
    canonical: '/faq',
  },
};


interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Coffee Basics
  {
    id: 'coffee-ratio',
    question: 'What is the perfect coffee-to-water ratio?',
    answer: 'The golden ratio is typically 1:15 to 1:17 (1 gram of coffee to 15-17 grams of water). However, this varies by brewing method. For espresso, use 1:2 to 1:2.5. For pour over, 1:15 to 1:16 works well. French press can handle 1:12 to 1:15. Use our coffee calculator for precise measurements based on your preferred brewing method.',
    category: 'Basics'
  },
  {
    id: 'grind-size',
    question: 'How does grind size affect coffee taste?',
    answer: 'Grind size dramatically impacts extraction and flavor. Finer grinds extract faster and can become bitter if over-extracted. Coarser grinds extract slower and may taste sour if under-extracted. Espresso needs fine grounds, pour over uses medium-fine, drip coffee uses medium, and French press requires coarse grounds.',
    category: 'Basics'
  },
  {
    id: 'water-temperature',
    question: 'What temperature should my brewing water be?',
    answer: 'The optimal water temperature is 195-205°F (90-96°C) for most brewing methods. Water that is too hot (over 205°F) can over-extract and create bitter flavors, while cooler water may under-extract, resulting in weak or sour coffee. Let boiling water sit for 30-60 seconds before brewing.',
    category: 'Basics'
  },
  {
    id: 'coffee-storage',
    question: 'How should I store coffee beans?',
    answer: 'Store coffee beans in an airtight container at room temperature, away from light, heat, and moisture. Avoid the refrigerator or freezer as condensation can damage the beans. Use beans within 2-4 weeks of the roast date for optimal freshness. Only grind beans right before brewing for best flavor.',
    category: 'Basics'
  },
  {
    id: 'roast-levels',
    question: 'What is the difference between light, medium, and dark roasts?',
    answer: 'Light roasts preserve more origin flavors and acidity, with floral and fruity notes. Medium roasts balance origin characteristics with roast flavors, offering chocolate and nutty notes. Dark roasts emphasize roast flavors over origin, with smoky, bitter, and sometimes burnt notes. Lighter roasts have more caffeine than darker roasts.',
    category: 'Basics'
  },

  // Brewing Methods
  {
    id: 'pour-over-vs-drip',
    question: 'What is the difference between pour over and drip coffee?',
    answer: 'Pour over gives you complete control over water temperature, timing, and pouring technique, resulting in a cleaner, more nuanced cup. Drip coffee makers automate the process but may lack precision in temperature and timing. Pour over typically produces brighter, more complex flavors, while drip coffee is more convenient for daily brewing.',
    category: 'Brewing'
  },
  {
    id: 'espresso-vs-coffee',
    question: 'Is espresso stronger than regular coffee?',
    answer: 'Espresso has a higher concentration of coffee per ounce (about 63mg caffeine per ounce) compared to drip coffee (12-16mg per ounce). However, a typical espresso shot is 1-2 ounces, while a cup of coffee is 8-12 ounces, so a full cup of coffee actually contains more total caffeine than a single espresso shot.',
    category: 'Brewing'
  },
  {
    id: 'french-press-timing',
    question: 'How long should I steep French press coffee?',
    answer: 'Steep French press coffee for 4 minutes with coarse grounds and water just off the boil (200°F). Add coffee, pour hot water, stir gently, then place the lid with plunger up. After 4 minutes, slowly press down the plunger. Serve immediately to prevent over-extraction.',
    category: 'Brewing'
  },
  {
    id: 'cold-brew-concentrate',
    question: 'How do I make cold brew coffee?',
    answer: 'Use a 1:4 to 1:8 ratio of coarse coffee grounds to cold water. Steep for 12-24 hours at room temperature or in the refrigerator. Strain through a fine mesh or coffee filter. The result is a concentrate that can be diluted with water, milk, or served over ice. Store in the refrigerator for up to 2 weeks.',
    category: 'Brewing'
  },
  {
    id: 'aeropress-technique',
    question: 'What is the best AeroPress technique?',
    answer: 'Use medium-fine grounds, 200°F water, and a 1:14 ratio. Add coffee to the chamber, pour water, stir for 10 seconds, then steep for 1-2 minutes. Insert plunger and press slowly over 30 seconds. Experiment with inverted method for longer steeping times. The AeroPress is forgiving and allows for many variations.',
    category: 'Brewing'
  },

  // Equipment
  {
    id: 'burr-vs-blade-grinder',
    question: 'Should I buy a burr grinder or blade grinder?',
    answer: 'Burr grinders are superior because they produce uniform particle sizes, which leads to even extraction and better-tasting coffee. Blade grinders chop beans unevenly, creating both fine particles and larger chunks that extract at different rates. While burr grinders cost more, they are essential for quality coffee brewing.',
    category: 'Equipment'
  },
  {
    id: 'espresso-machine-types',
    question: 'What type of espresso machine should I buy?',
    answer: 'Manual machines offer full control but require skill. Semi-automatic machines control pressure while you control timing. Automatic machines control both pressure and timing. Super-automatic machines do everything including grinding. For beginners, semi-automatic offers the best balance of control and convenience.',
    category: 'Equipment'
  },
  {
    id: 'coffee-scale-necessity',
    question: 'Do I really need a coffee scale?',
    answer: 'Yes! A scale ensures consistency and proper ratios. Coffee beans vary in density, so measuring by volume (scoops) is inaccurate. A scale allows you to replicate great brews and troubleshoot bad ones. Look for a scale that measures to 0.1g precision and has a timer function for pour over brewing.',
    category: 'Equipment'
  },
  {
    id: 'gooseneck-kettle',
    question: 'Why do I need a gooseneck kettle for pour over?',
    answer: 'A gooseneck kettle provides precise control over water flow rate and direction, essential for even saturation in pour over brewing. Regular kettles pour too fast and unevenly, leading to uneven extraction. The controlled pour allows for proper blooming and spiral pouring techniques that enhance flavor extraction.',
    category: 'Equipment'
  },
  {
    id: 'filter-papers',
    question: 'Are expensive filter papers worth it?',
    answer: 'Quality filter papers can improve your coffee by providing better filtration and fewer papery flavors. Cheap filters may impart off-flavors or allow grounds to pass through. However, the difference is subtle. More important is rinsing any filter before use to remove papery taste and preheating your brewing vessel.',
    category: 'Equipment'
  },

  // Coffee Selection
  {
    id: 'single-origin-vs-blend',
    question: 'Should I buy single-origin or blended coffee?',
    answer: 'Single-origin coffees highlight unique characteristics of their growing region and processing method, offering distinct flavors that change seasonally. Blends combine beans to create consistent flavor profiles year-round and often work better with milk. Try both to discover your preferences - single-origins for exploration, blends for consistency.',
    category: 'Selection'
  },
  {
    id: 'organic-fair-trade',
    question: 'What do organic and fair trade certifications mean?',
    answer: 'Organic coffee is grown without synthetic pesticides, herbicides, or fertilizers. Fair trade ensures farmers receive fair wages and work in safe conditions. Both certifications cost more but support sustainable farming and ethical labor practices. They do not guarantee better taste, but many consumers value the environmental and social benefits.',
    category: 'Selection'
  },
  {
    id: 'roast-date-importance',
    question: 'How important is the roast date?',
    answer: 'Very important! Coffee is best consumed 2-30 days after roasting. Within 2 days, coffee releases too much CO2 for even extraction. After 30 days, coffee becomes stale and loses flavor complexity. Always check roast dates and avoid coffee without them. Pre-ground coffee goes stale much faster than whole beans.',
    category: 'Selection'
  },
  {
    id: 'decaf-process',
    question: 'How is decaf coffee made?',
    answer: 'Decaf coffee uses processes like Swiss Water, CO2, or solvent methods to remove 97% of caffeine. Swiss Water is chemical-free but may remove more flavor compounds. CO2 method preserves flavor well. Solvent methods are efficient but may leave trace chemicals. Quality decaf can taste great when processed well and roasted properly.',
    category: 'Selection'
  },

  // Troubleshooting
  {
    id: 'bitter-coffee-fix',
    question: 'Why does my coffee taste bitter?',
    answer: 'Bitter coffee usually indicates over-extraction. Try using a coarser grind, shorter brewing time, cooler water (195°F instead of 205°F), or less coffee. Also check if your beans are over-roasted or stale. Clean your equipment regularly as coffee oils can become rancid and create bitter flavors.',
    category: 'Troubleshooting'
  },
  {
    id: 'sour-coffee-fix',
    question: 'Why does my coffee taste sour or weak?',
    answer: 'Sour or weak coffee indicates under-extraction. Try using a finer grind, longer brewing time, hotter water, or more coffee. Ensure your water is hot enough (195-205°F) and that you are using the proper coffee-to-water ratio for your brewing method. Light roasts naturally have more acidity.',
    category: 'Troubleshooting'
  },
  {
    id: 'inconsistent-results',
    question: 'Why are my results inconsistent?',
    answer: 'Inconsistent results usually come from variable measurements or technique. Use a scale for precise measurements, maintain consistent water temperature, time your brews, and use the same pouring technique. Also ensure your grinder produces uniform particles and that your beans are fresh and consistent.',
    category: 'Troubleshooting'
  },
  {
    id: 'cleaning-equipment',
    question: 'How often should I clean my coffee equipment?',
    answer: 'Clean daily-use equipment after each use with hot water. Deep clean weekly with specialized cleaners: descale espresso machines monthly, clean grinder burrs monthly, wash French press parts thoroughly after each use, and replace filters regularly. Build-up of coffee oils and mineral deposits significantly affects taste.',
    category: 'Troubleshooting'
  },

  // About Coffee Logik
  {
    id: 'coffee-logik-mission',
    question: 'What is Coffee Logik about?',
    answer: 'Coffee Logik is dedicated to making great coffee accessible to everyone through education, honest reviews, and comprehensive guides. We provide expert-tested recipes, unbiased product reviews, and detailed brewing tutorials for coffee enthusiasts of all levels, from beginners to advanced home baristas.',
    category: 'About Us'
  },
  {
    id: 'writing-for-coffee-logik',
    question: 'Can I write for Coffee Logik?',
    answer: 'Yes! We welcome experienced coffee professionals and passionate enthusiasts to join our writing team. Check out our "Apply to Write" page for requirements and application details. We look for writers with coffee expertise, strong writing skills, and a passion for sharing knowledge with our community.',
    category: 'About Us'
  },
  {
    id: 'product-review-requests',
    question: 'Do you accept products for review?',
    answer: 'We consider product review requests on a case-by-case basis. Contact us with details about your coffee-related product, including specifications, availability, and any unique features. We maintain editorial independence and provide honest reviews regardless of how we obtain products.',
    category: 'About Us'
  },
  {
    id: 'affiliate-links',
    question: 'Do you use affiliate links?',
    answer: 'Yes, Coffee Logik participates in affiliate programs including Amazon Associates. We earn small commissions from qualifying purchases at no extra cost to you. This helps support our content creation while maintaining editorial independence. All affiliate relationships are clearly disclosed on relevant pages.',
    category: 'About Us'
  }
];

const categories = [
  { name: 'All', icon: QuestionMarkCircleIcon, count: faqData.length },
  { name: 'Basics', icon: LightBulbIcon, count: faqData.filter(faq => faq.category === 'Basics').length },
  { name: 'Brewing', icon: BeakerIcon, count: faqData.filter(faq => faq.category === 'Brewing').length },
  { name: 'Equipment', icon: ShoppingBagIcon, count: faqData.filter(faq => faq.category === 'Equipment').length },
  { name: 'Selection', icon: BookOpenIcon, count: faqData.filter(faq => faq.category === 'Selection').length },
  { name: 'Troubleshooting', icon: MagnifyingGlassIcon, count: faqData.filter(faq => faq.category === 'Troubleshooting').length },
  { name: 'About Us', icon: EnvelopeIcon, count: faqData.filter(faq => faq.category === 'About Us').length }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // Filter FAQs based on category and search
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <QuestionMarkCircleIcon className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">
                  {filteredFAQs.length} Questions Answered
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl font-playfair mb-6">
              Frequently Asked <span className="text-indigo-600">Questions</span>
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              Find answers to common coffee questions from our experts. From brewing basics to equipment recommendations, we have got you covered.
            </p>
            
            {/* Search Bar */}
            <div className="mx-auto max-w-md relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Category Filter */}
        <div className="-mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mx-auto max-w-6xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Browse by Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedCategory === category.name
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <IconComponent className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-gray-500 mt-1">({category.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search Results Notice */}
        {searchQuery && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
              <span className="text-indigo-800 text-sm">
                Showing {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </span>
              <button 
                onClick={() => setSearchQuery('')}
                className="ml-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* FAQ Items */}
        <div className="mx-auto mt-20 max-w-4xl">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 mr-3">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {openItems.has(faq.id) ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {openItems.has(faq.id) && (
                    <div className="px-6 pb-6 -mt-2">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No questions match "${searchQuery}". Try different keywords or browse all categories.`
                  : 'No questions in this category yet.'
                }
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                View All Questions
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Can&apos;t find what you&apos;re looking for? Our coffee experts are here to help you brew better coffee.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <EnvelopeIcon className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-600 text-sm mb-4">Get personalized help from our coffee experts</p>
                <Link href="/contact" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  Send Message →
                </Link>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <BookOpenIcon className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Guides</h3>
                <p className="text-gray-600 text-sm mb-4">Explore our comprehensive brewing tutorials</p>
                <Link href="/brewing-guides" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm">
                  View Guides →
                </Link>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <BeakerIcon className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Use Calculator</h3>
                <p className="text-gray-600 text-sm mb-4">Get perfect coffee ratios for any brewing method</p>
                <Link href="/calculator" className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm">
                  Calculate Ratios →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Resources */}
        <div className="mt-16 mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Resources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/blog" className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm font-medium text-gray-900">Coffee Blog</div>
            </Link>
            <Link href="/recipes" className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium text-gray-900">Recipes</div>
            </Link>
            <Link href="/products" className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-sm font-medium text-gray-900">Reviews</div>
            </Link>
            <Link href="/glossary" className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📖</div>
              <div className="text-sm font-medium text-gray-900">Glossary</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
