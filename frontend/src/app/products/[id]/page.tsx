import Link from "next/link";
import { ArrowLeftIcon, StarIcon, ShoppingBagIcon, CheckCircleIcon, XMarkIcon, ShieldCheckIcon, TrophyIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon, HeartIcon } from "@heroicons/react/24/outline";
import { getProduct, getStrapiMedia } from "@/lib/api";
import { notFound } from "next/navigation";
import { marked } from "marked";
import ShareButton from "./ShareButton";
import { Metadata } from "next";
import { generateArticleStructuredData } from "@/components/SEO";
import AmazonDisclaimer from "@/components/AmazonDisclaimer";

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

// Helper function to extract plain text from markdown and limit characters
function getQuickVerdictText(markdown: string, maxLength: number = 150): string {
  if (!markdown) return '';
  
  // Simple markdown-to-text conversion without using marked()
  // This handles basic markdown syntax for the quick verdict
  let text = markdown
    // Remove headers
    .replace(/#{1,6}\s*/g, '')
    // Remove bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove other markdown syntax
    .replace(/`([^`]+)`/g, '$1')
    // Clean up extra whitespace and newlines
    .replace(/\s+/g, ' ')
    .trim();
  
  // Truncate to maxLength
  if (text.length <= maxLength) return text;
  
  // Find the last complete sentence or word within the limit
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > maxLength * 0.8 
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

// Generate metadata for each product review
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const product = await getProduct(id);
    const imageUrl = product.images?.[0] ? getStrapiMedia(product.images[0].url) : null;
    const url = `/products/${product.slug || id}`;
    
    return {
      title: `${product.name} Review - ${product.brand} | CoffeeLogik`,
      description: product.description ? 
        product.description.substring(0, 160).replace(/<[^>]*>/g, '') : 
        `Comprehensive review of ${product.name} by ${product.brand}. Read our expert analysis, pros and cons, and buying recommendations.`,
      keywords: `${product.name}, ${product.brand}, coffee review, ${product.product_type}, coffee equipment review`,
      openGraph: {
        title: `${product.name} Review - ${product.brand}`,
        description: product.description ? 
          product.description.substring(0, 160).replace(/<[^>]*>/g, '') : 
          `Expert review of ${product.name} by ${product.brand}`,
        url: url,
        type: 'article',
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          }
        ] : undefined,
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for product:', error);
    return {
      title: 'Product Review - CoffeeLogik',
      description: 'Expert coffee product reviews and recommendations.',
    };
  }
}

export default async function ProductReviewPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Generate structured data for the product review
  const structuredData = generateArticleStructuredData({
    title: `${product.name} Review`,
    description: product.description ? product.description.substring(0, 160).replace(/<[^>]*>/g, '') : `Expert review of ${product.name}`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com'}/products/${product.slug || id}`,
    imageUrl: product.images?.[0] ? getStrapiMedia(product.images[0].url) : undefined,
    authorName: "CoffeeLogik Review Team",
    categoryName: product.product_type,
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="bg-white">
        {/* Hero Section with Product Overview */}
        <div className="bg-gradient-to-b from-amber-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                href="/products"
                className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Reviews
              </Link>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
              {/* Product Images */}
              <div>
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6 shadow-lg">
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
                      <div key={index} className="aspect-square rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-md">
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

              {/* Review Header */}
              <div>
                {/* Review Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                    <TrophyIcon className="mr-2 h-4 w-4" />
                    Expert Review
                  </span>
                </div>
                
                {/* Brand and Category */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber-600 font-medium">{product.brand}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{product.product_type}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
                  {product.name} Review
                </h1>
                
                {/* Review Score Card */}
                {product.rating && (
                  <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-amber-600 mb-2">{product.rating}</div>
                      <StarRating rating={product.rating} />
                      <div className="text-sm text-gray-600 mt-2">Overall Rating</div>
                      <div className="text-xs text-gray-500 mt-1">Based on expert testing</div>
                    </div>
                  </div>
                )}
                
                {/* Quick Verdict */}
                <div className="bg-amber-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <ShieldCheckIcon className="mr-2 h-5 w-5 text-amber-600" />
                    Quick Verdict
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description ? 
                      getQuickVerdictText(product.description, 150) :
                      `The ${product.name} by ${product.brand} offers excellent value in the ${product.product_type.toLowerCase()} category.`
                    }
                  </p>
                </div>

                {/* Buy Button */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  
                  {product.affiliate_link ? (
                    <Link
                      href={product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center rounded-lg bg-amber-600 px-6 py-4 text-lg font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors mb-3"
                    >
                      <ShoppingBagIcon className="inline mr-2 h-5 w-5" />
                      View on Amazon
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center rounded-lg bg-gray-400 px-6 py-4 text-lg font-semibold text-white shadow-sm cursor-not-allowed mb-3"
                    >
                      <ShoppingBagIcon className="inline mr-2 h-5 w-5" />
                      Link Not Available
                    </button>
                  )}
                  
                  <div className="flex gap-2">
                    <button className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <HeartIcon className="mr-2 h-4 w-4" />
                      Save
                    </button>
                    <ShareButton productName={product.name} productSlug={product.slug} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Review Content */}
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
          {/* Product Specifications */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Product Specifications</h2>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Type:</span>
                    <span className="text-gray-600">{product.product_type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Brand:</span>
                    <span className="text-gray-600">{product.brand}</span>
                  </div>
                  {product.origin && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Origin:</span>
                      <span className="text-gray-600">{product.origin}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {product.roast_level && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Roast Level:</span>
                      <span className="text-gray-600">{product.roast_level}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-900">Rating:</span>
                    <div className="flex items-center gap-2">
                      <StarRating rating={product.rating || 0} />
                      <span className="text-gray-600">({product.rating || 'N/A'})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amazon Disclaimer */}
          <AmazonDisclaimer />

          {/* Flavor Profile */}
          {product.flavor_notes && Array.isArray(product.flavor_notes) && product.flavor_notes.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Flavor Profile</h2>
              <div className="bg-amber-50 rounded-2xl p-8">
                <p className="text-gray-700 mb-6">Our experts identified these distinct flavor notes:</p>
                <div className="flex flex-wrap gap-3">
                  {product.flavor_notes.map((note, index) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 border border-amber-200">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Review */}
          {product.description && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Expert Review</h2>
              <div className="prose prose-lg prose-amber max-w-none">
                <div dangerouslySetInnerHTML={{ __html: marked(product.description) }} />
              </div>
            </div>
          )}

          {/* Pros and Cons Analysis */}
          {((product.pros && Array.isArray(product.pros) && product.pros.length > 0) || 
            (product.cons && Array.isArray(product.cons) && product.cons.length > 0)) && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Pros & Cons Analysis</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {product.pros && Array.isArray(product.pros) && product.pros.length > 0 && (
                  <div className="bg-green-50 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                      What We Loved
                    </h3>
                    <ul className="space-y-3">
                      {product.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {product.cons && Array.isArray(product.cons) && product.cons.length > 0 && (
                  <div className="bg-red-50 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <XMarkIcon className="h-6 w-6 text-red-500 mr-3" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-3">
                      {product.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <XMarkIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Recommendation */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                  <TrophyIcon className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Final Verdict
                </h2>
                <div className="max-w-2xl mx-auto">
                  {product.rating && (
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <StarRating rating={product.rating} />
                      <span className="text-2xl font-bold text-amber-600">{product.rating}/5</span>
                    </div>
                  )}
                  <p className="text-lg text-gray-700 mb-8">
                    {product.rating && product.rating >= 4.5 ? "Highly Recommended" :
                     product.rating && product.rating >= 4.0 ? "Recommended" :
                     product.rating && product.rating >= 3.5 ? "Good Choice" :
                     "Consider Alternatives"}
                     {" - "}
                    The {product.name} by {product.brand} is a solid choice in the {product.product_type.toLowerCase()} category.
                  </p>
                  {product.affiliate_link && (
                    <Link
                      href={product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-xl bg-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-all transform hover:scale-105"
                    >
                      <ShoppingBagIcon className="mr-3 h-6 w-6" />
                      View on Amazon
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Reviews CTA */}
          <div className="bg-gray-900 rounded-3xl p-8 lg:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Looking for More Reviews?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover more expert coffee product reviews, brewing guides, and equipment recommendations from our coffee specialists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="rounded-xl bg-white px-8 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-100">
                More Reviews
              </Link>
              <Link href="/blog" className="rounded-xl border-2 border-white px-8 py-3 text-lg font-semibold text-white hover:bg-white hover:text-gray-900 transition-colors">
                Expert Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
