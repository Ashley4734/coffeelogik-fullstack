export const revalidate = 60; // Revalidate every 60 seconds

import Link from "next/link";
import { StarIcon, TrophyIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon, ShieldCheckIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { getProducts, getStrapiMedia } from "@/lib/api";
import { Metadata } from "next";
import AmazonDisclaimer from "@/components/AmazonDisclaimer";

export const metadata: Metadata = {
  title: 'Coffee Product Reviews - Expert Testing & Recommendations',
  description: 'Read comprehensive coffee product reviews from our experts. In-depth testing of coffee beans, equipment, and accessories with honest pros, cons, and recommendations.',
  keywords: 'coffee reviews, coffee product reviews, coffee equipment reviews, coffee bean reviews, expert coffee testing',
  openGraph: {
    title: 'Coffee Product Reviews - Expert Testing & Recommendations',
    description: 'Read comprehensive coffee product reviews from our experts. In-depth testing of coffee beans, equipment, and accessories.',
    type: 'website',
  },
  alternates: {
    canonical: '/products',
  },
};

const categories = [
  "All Products",
  "Coffee Beans",
  "Espresso Machine",
  "Coffee Grinder",
  "Brewing Equipment",
  "Accessories"
];

const sortOptions = [
  "Featured",
  "Highest Rated",
  "Most Reviews",
  "Newest First",
  "Oldest First"
];

// Utility function to strip markdown formatting
function stripMarkdown(text: string | undefined) {
  if (!text) return '';
  
  return text
    .replace(/^#{1,6}\s+/gm, '') // Remove headers (##, ###, etc.)
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold (**text**)
    .replace(/\*(.*?)\*/g, '$1') // Remove italic (*text*)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links [text](url)
    .replace(/`([^`]+)`/g, '$1') // Remove code blocks
    .replace(/\s+/g, ' ') // Clean up extra whitespace
    .trim();
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {star <= Math.floor(rating) ? (
              <StarIcon className="h-4 w-4 text-yellow-400" />
            ) : star === Math.ceil(rating) && rating % 1 !== 0 ? (
              <div className="relative">
                <StarOutlineIcon className="h-4 w-4 text-gray-300" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                </div>
              </div>
            ) : (
              <StarOutlineIcon className="h-4 w-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>
      {reviewCount && <span className="text-sm text-gray-600">({reviewCount})</span>}
    </div>
  );
}

export default async function ProductsPage() {
  // Fetch products from Strapi
  let products: import("@/lib/api").CoffeeProduct[] = [];

  try {
    const productsResponse = await getProducts({ limit: 50 });
    products = Array.isArray(productsResponse?.data) ? productsResponse.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to empty array if Strapi is not available
  }
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {products.length} Expert Reviews
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl font-playfair mb-6">
              Product <span className="text-blue-600">Reviews</span>
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              In-depth, unbiased reviews of coffee equipment, beans, and accessories. Our experts test everything so you can make informed decisions.
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
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-3">
                  <TrophyIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{products.filter(product => product.featured).length}</div>
                <div className="text-sm text-gray-600">Editor&apos;s Choice</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{[...new Set(products.map(p => p.product_type))].length}</div>
                <div className="text-sm text-gray-600">Product Categories</div>
              </div>
            </div>
            
            {/* Quality Badges */}
            <div className="text-center mb-8">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  Expert Tested
                </div>
                <div className="flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  Updated Weekly
                </div>
                <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <TrophyIcon className="mr-2 h-4 w-4" />
                  Unbiased Reviews
                </div>
              </div>
            </div>

            {/* Filters and Sorting */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter & Sort Reviews</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 max-w-lg mx-auto">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Category</label>
                  <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    {categories.map((category) => (
                      <option key={category} value={category} className="text-gray-900">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Sort by</label>
                  <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    {sortOptions.map((option) => (
                      <option key={option} value={option} className="text-gray-900">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amazon Disclaimer */}
        <div className="mt-12">
          <AmazonDisclaimer />
        </div>

        {/* Featured Reviews - Editor's Choice */}
        <div className="mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Editor&apos;s Choice Reviews</h2>
            <p className="text-lg text-gray-600">Our top-rated products that passed rigorous testing</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {products.filter(product => product.featured).length > 0 ? products.filter(product => product.featured).map((product) => (
              <article key={product.id} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Award Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                    <TrophyIcon className="mr-1 h-3 w-3" />
                    Editor&apos;s Choice
                  </span>
                </div>
                
                {/* FIXED: Changed aspect ratio and object-fit to prevent cropping */}
                <div className="h-64 w-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center p-4">
                  {product.images?.[0] ? (
                    <img
                      src={getStrapiMedia(product.images[0].url)}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-6xl">☕</span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-amber-600 font-medium">{product.brand}</span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 mb-3 leading-tight">
                    <Link href={`/products/${product.slug}`} className="hover:text-amber-600">
                      {product.name}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{stripMarkdown(product.description)}</p>
                  
                  {product.rating && (
                    <div className="mb-4">
                      <StarRating rating={product.rating} />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 transition-colors"
                    >
                      Read Review
                    </Link>
                    {product.affiliate_link && (
                      <Link 
                        href={product.affiliate_link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-lg border border-amber-600 px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        View on Amazon
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-6xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured reviews yet</h3>
                <p className="text-gray-600">Create some coffee products in Strapi and mark them as featured to see them here.</p>
              </div>
            )}
          </div>
        </div>

        {/* All Reviews */}
        <div className="mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">All Product Reviews</h2>
            <p className="text-lg text-gray-600">Browse our complete collection of expert product reviews</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? products.map((product) => (
              <article key={product.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] w-full bg-white flex items-center justify-center relative">
                  {product.images?.[0] ? (
                    <img
                      src={getStrapiMedia(product.images[0].url)}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-5xl">☕</span>
                  )}
                  {product.rating && product.rating >= 4.5 && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        <CheckCircleIcon className="mr-1 h-3 w-3" />
                        Recommended
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-amber-600 font-medium">{product.brand}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {product.product_type}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2 leading-tight">
                    <Link href={`/products/${product.slug}`} className="hover:text-amber-600">
                      {product.name}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stripMarkdown(product.description)}</p>
                  
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <StarRating rating={product.rating} />
                      <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/products/${product.slug}`}
                      className="flex-1 text-center rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
                    >
                      Read Review
                    </Link>
                    {product.affiliate_link && (
                      <Link 
                        href={product.affiliate_link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-amber-600 px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        View on Amazon
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-5xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">Create some coffee products in Strapi to see reviews here.</p>
                <Link href={`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin`} target="_blank" className="inline-flex items-center mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                  Go to Strapi Admin
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mx-auto mt-20 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-8 lg:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
              <ClockIcon className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Stay Updated on Latest Reviews
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get notified when we publish new product reviews, comparison guides, and exclusive buying recommendations from our coffee experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="rounded-lg bg-amber-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 transition-colors">
                Get Reviews
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center">
                <CheckCircleIcon className="mr-1 h-3 w-3 text-green-500" />
                Weekly updates
              </span>
              <span className="flex items-center">
                <CheckCircleIcon className="mr-1 h-3 w-3 text-green-500" />
                No spam
              </span>
              <span className="flex items-center">
                <CheckCircleIcon className="mr-1 h-3 w-3 text-green-500" />
                Unsubscribe anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
