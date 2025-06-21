export const revalidate = 60; // Revalidate every 60 seconds

import Link from "next/link";
import { StarIcon, TrophyIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { getProducts, getStrapiMedia } from "@/lib/api";
import { Metadata } from "next";

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
  "Price: Low to High",
  "Price: High to Low",
  "Most Reviews"
];

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
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 mb-6">
            <TrophyIcon className="mr-2 h-4 w-4" />
            Expert Reviews & Testing
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-playfair">
            Coffee Product Reviews
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            In-depth, unbiased reviews of coffee equipment, beans, and accessories. 
            Our experts test everything so you can make informed decisions.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
              Expert Tested
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4 text-amber-500" />
              Updated Weekly
            </div>
            <div className="flex items-center">
              <TrophyIcon className="mr-2 h-4 w-4 text-blue-500" />
              Unbiased Reviews
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">Category</label>
              <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">Sort by</label>
              <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500">
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
                
                <div className="aspect-square w-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img
                      src={getStrapiMedia(product.images[0].url)}
                      alt={product.name}
                      className="h-full w-full object-cover"
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
                    <Link href={`/products/${product.slug}`}>
                      <span className="absolute inset-0" />
                      {product.name} Review
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                  
                  {product.rating && (
                    <div className="mb-4">
                      <StarRating rating={product.rating} />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {product.price && (
                      <div>
                        <span className="text-xs text-gray-500">Best Price</span>
                        <div className="text-lg font-bold text-gray-900">${product.price}</div>
                      </div>
                    )}
                    <Link 
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 transition-colors"
                    >
                      Read Review
                    </Link>
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
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative">
                  {product.images?.[0] ? (
                    <img
                      src={getStrapiMedia(product.images[0].url)}
                      alt={product.name}
                      className="h-full w-full object-cover"
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
                    <Link href={`/products/${product.slug}`}>
                      <span className="absolute inset-0" />
                      {product.name} Review
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    {product.rating && (
                      <div className="flex items-center gap-2">
                        <StarRating rating={product.rating} />
                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                      </div>
                    )}
                    {product.price && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Best Price</div>
                        <div className="text-lg font-bold text-gray-900">${product.price}</div>
                      </div>
                    )}
                  </div>
                  
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
                        className="rounded-lg border border-amber-600 px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        Buy
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
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
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