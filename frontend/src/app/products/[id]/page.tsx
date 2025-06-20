import Link from "next/link";
import { ArrowLeftIcon, StarIcon, ShoppingBagIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { getProduct, getStrapiMedia } from "@/lib/api";
import { notFound } from "next/navigation";
import { marked } from "marked";
import ShareButton from "./ShareButton";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="relative">
          {star <= Math.floor(rating) ? (
            <StarIcon className="h-5 w-5 text-yellow-400" />
          ) : star === Math.ceil(rating) && rating % 1 !== 0 ? (
            <div className="relative">
              <StarOutlineIcon className="h-5 w-5 text-gray-300" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                <StarIcon className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          ) : (
            <StarOutlineIcon className="h-5 w-5 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let product: import("@/lib/api").CoffeeProduct | null = null;

  try {
    // Fetch the specific product by slug
    product = await getProduct(id);
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6">
              {product.images?.[0] ? (
                <img
                  src={getStrapiMedia(product.images[0].url)}
                  alt={product.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-8xl">☕</span>
              )}
            </div>
            
            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <img
                      src={getStrapiMedia(image.url)}
                      alt={`${product.name} ${index + 2}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="mb-2">
                <span className="text-sm text-amber-600 font-medium">{product.brand}</span>
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-playfair mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={product.rating} />
                  <span className="text-lg font-semibold text-gray-900">{product.rating}</span>
                </div>
              )}
              
              {/* Price */}
              {product.price && (
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: marked(product.description) }} />
              </div>
            )}

            {/* Product Details */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">{product.product_type}</span>
                </div>
                {product.origin && (
                  <div>
                    <span className="text-gray-600">Origin:</span>
                    <span className="ml-2 font-medium">{product.origin}</span>
                  </div>
                )}
                {product.roast_level && (
                  <div>
                    <span className="text-gray-600">Roast Level:</span>
                    <span className="ml-2 font-medium">{product.roast_level}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Flavor Notes */}
            {product.flavor_notes && Array.isArray(product.flavor_notes) && product.flavor_notes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Flavor Notes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.flavor_notes.map((note, index) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pros and Cons */}
            {((product.pros && Array.isArray(product.pros) && product.pros.length > 0) || 
              (product.cons && Array.isArray(product.cons) && product.cons.length > 0)) && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.pros && Array.isArray(product.pros) && product.pros.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {product.pros.map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {product.cons && Array.isArray(product.cons) && product.cons.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {product.cons.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <XMarkIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buy Button */}
            <div className="mb-8">
              {product.affiliate_link ? (
                <Link
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors mr-4"
                >
                  <ShoppingBagIcon className="mr-2 h-5 w-5" />
                  Buy Now
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center rounded-md bg-gray-400 px-6 py-3 text-base font-semibold text-white shadow-sm cursor-not-allowed mr-4"
                >
                  <ShoppingBagIcon className="mr-2 h-5 w-5" />
                  Link Not Available
                </button>
              )}
              
              <ShareButton productName={product.name} productSlug={product.slug} />
            </div>

            {/* Product Type Badge */}
            <div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                {product.product_type}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="mt-20">
          <div className="bg-amber-50 rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              Have questions about this product?
            </h2>
            <p className="text-gray-600 mb-6">
              Our coffee experts are here to help you make the best choice for your brewing setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/blog" className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                Read Reviews
              </Link>
              <Link href="/authors" className="rounded-md border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50">
                Contact Experts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}