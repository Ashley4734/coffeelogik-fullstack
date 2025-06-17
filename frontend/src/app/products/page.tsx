export const revalidate = 60; // Revalidate every 60 seconds

import Link from "next/link";
import { StarIcon, ShoppingBagIcon, LinkIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { getProducts, getStrapiMedia } from "@/lib/api";

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
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair">
            Coffee Products & Reviews
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover the best coffee gear, beans, and equipment with our honest, detailed reviews from coffee experts.
          </p>
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

        {/* Featured Products */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Editor&apos;s Picks</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {products.filter(product => product.featured).length > 0 ? products.filter(product => product.featured).map((product) => (
              <div key={product.id} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
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
                  <div className="mb-2">
                    <span className="text-sm text-amber-600 font-medium">{product.brand}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                    <Link href={`/products/${product.slug}`}>
                      <span className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  {product.rating && (
                    <div className="mb-4">
                      <StarRating rating={product.rating} />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {product.price && <span className="text-2xl font-bold text-gray-900">${product.price}</span>}
                    <div className="flex gap-2">
                      {product.affiliate_link ? (
                        <Link href={product.affiliate_link} target="_blank" className="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                          <ShoppingBagIcon className="mr-1 h-4 w-4" />
                          Buy
                        </Link>
                      ) : (
                        <button className="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                          <ShoppingBagIcon className="mr-1 h-4 w-4" />
                          Buy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-6xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured products yet</h3>
                <p className="text-gray-600">Create some coffee products in Strapi and mark them as featured to see them here.</p>
              </div>
            )}
          </div>
        </div>

        {/* All Products */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">All Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? products.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img
                      src={getStrapiMedia(product.images[0].url)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl">☕</span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-amber-600 font-medium">{product.brand}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {product.product_type}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                    <Link href={`/products/${product.slug}`}>
                      <span className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  {product.rating && (
                    <div className="mb-3">
                      <StarRating rating={product.rating} />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {product.price && <span className="text-xl font-bold text-gray-900">${product.price}</span>}
                    {product.affiliate_link ? (
                      <Link href={product.affiliate_link} target="_blank" className="inline-flex items-center text-amber-600 hover:text-amber-500 text-sm font-medium">
                        <LinkIcon className="mr-1 h-4 w-4" />
                        View Deal
                      </Link>
                    ) : (
                      <button className="inline-flex items-center text-amber-600 hover:text-amber-500 text-sm font-medium">
                        <LinkIcon className="mr-1 h-4 w-4" />
                        View Deal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-5xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600">Create some coffee products in Strapi to see them here.</p>
                <Link href={`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin`} target="_blank" className="inline-flex items-center mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                  Go to Strapi Admin
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mx-auto mt-20 max-w-2xl text-center bg-amber-50 rounded-3xl p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
            Never miss a deal
          </h2>
          <p className="text-gray-600 mb-6">
            Get notified about the latest coffee gear reviews, exclusive discounts, and new product launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button className="rounded-md bg-amber-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}