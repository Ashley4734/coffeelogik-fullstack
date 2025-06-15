import Link from "next/link";
import { ClockIcon, UserIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { getBrewingGuides, getStrapiMedia } from "@/lib/api";

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

export default async function BrewingGuidesPage() {
  // Fetch brewing guides from Strapi
  let brewingGuides: import("@/lib/api").BrewingGuide[] = [];

  try {
    const guidesResponse = await getBrewingGuides({ limit: 50 });
    brewingGuides = Array.isArray(guidesResponse?.data) ? guidesResponse.data : [];
  } catch (error) {
    console.error('Error fetching brewing guides:', error);
    // Fallback to empty array if Strapi is not available
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair">
            Brewing Guides
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Master the art of coffee brewing with our comprehensive step-by-step guides. From beginner-friendly methods to advanced techniques.
          </p>
        </div>

        {/* Filters */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Method Filter */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">Brewing Method</label>
              <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500">
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
              <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500">
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Guides */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Featured Guides</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {brewingGuides.filter(guide => guide.featured).length > 0 ? brewingGuides.filter(guide => guide.featured).map((guide) => (
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
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600">
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
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
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
                      <span>{guide.servings} serving{guide.servings > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-6xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured guides yet</h3>
                <p className="text-gray-600">Create some brewing guides in Strapi and mark them as featured to see them here.</p>
              </div>
            )}
          </div>
        </div>

        {/* All Guides */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">All Brewing Guides</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brewingGuides.length > 0 ? brewingGuides.map((guide) => (
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
                    <span className="text-sm text-amber-600 font-medium">{guide.method}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      guide.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-600' :
                      guide.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {guide.difficulty_level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
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
                      <span>{guide.servings} serving{guide.servings > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-5xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No brewing guides yet</h3>
                <p className="text-gray-600">Create some brewing guides in Strapi to see them here.</p>
                <Link href={`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin`} target="_blank" className="inline-flex items-center mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                  Go to Strapi Admin
                </Link>
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
    </div>
  );
}