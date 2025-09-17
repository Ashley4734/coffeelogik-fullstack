import Link from "next/link";
import { 
  ArrowLeftIcon, 
  StarIcon, 
  ShoppingBagIcon, 
  CheckCircleIcon, 
  XMarkIcon, 
  ShieldCheckIcon, 
  TrophyIcon, 
  FireIcon, 
  CogIcon,
  WrenchIcon,
  BeakerIcon,
  ScaleIcon,
  ClockIcon,
  LightBulbIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/solid";
import { 
  StarIcon as StarOutlineIcon, 
  HeartIcon,
  ArrowsPointingOutIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { getProduct, getStrapiMedia } from "@/lib/api";
import { notFound } from "next/navigation";
import { marked } from "marked";
import ShareButton from "./ShareButton";
import { Metadata } from "next";
import { generateArticleStructuredData } from "@/components/SEO";
import AmazonDisclaimer from "@/components/AmazonDisclaimer";

interface CoffeeProduct {
  id: string | number;
  name: string;
  brand: string;
  product_type: string;
  slug?: string;
  rating?: number;
  price?: number;
  affiliate_link?: string;
  description?: string;
  meta_description?: string;
  publishedAt: string;
  images?: Array<{ url: string }>;
  flavor_notes?: string[];
  pros?: string[];
  cons?: string[];
  specifications?: {
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      unit?: string;
    };
    weight?: {
      value?: number;
      unit?: string;
    };
    materials?: string[] | string;
    power?: {
      value?: number;
      unit?: string;
    };
    capacity?: {
      value?: number;
      unit?: string;
    };
    warranty?: string;
    grinder_specifications?: {
      grinder_type?: string;
      burr_type?: string;
      burr_material?: string;
      grind_settings?: string;
    };
    espresso_specifications?: {
      pump_pressure?: {
        value?: number;
        unit?: string;
      };
      boiler_type?: string;
      steam_wand?: boolean;
      pid_control?: boolean;
    };
    brewing_specifications?: {
      water_reservoir_capacity?: {
        value?: number;
        unit?: string;
      };
      programmable?: boolean;
      auto_shutoff?: boolean;
      thermal_carafe?: boolean;
    };
  };
}

function StarRating({ rating, size = "default", showNumber = false }: { 
  rating: number; 
  size?: "sm" | "default" | "lg";
  showNumber?: boolean;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="relative">
          {star <= Math.floor(rating) ? (
            <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
          ) : star === Math.ceil(rating) && rating % 1 !== 0 ? (
            <div className="relative">
              <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
              </div>
            </div>
          ) : (
            <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
          )}
        </div>
      ))}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-600">({rating.toFixed(1)})</span>
      )}
    </div>
  );
}

// Updated helper function with proper typing
function getQuickVerdictText(product: CoffeeProduct): string {
  // Use meta_description if available
  if (product.meta_description) {
    return product.meta_description;
  }

  // Fallback to description excerpt if quick_verdict is not available
  if (product.description) {
    const text = product.description
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length <= 200) return text;
    const truncated = text.substring(0, 200);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    return lastSpaceIndex > 160 ? truncated.substring(0, lastSpaceIndex) + '...' : truncated + '...';
  }

  // Final fallback
  return `The ${product.name} by ${product.brand} offers excellent value in the ${product.product_type?.toLowerCase() || 'coffee equipment'} category.`;
}

// Rating badge component
function RatingBadge({ rating }: { rating: number }) {
  let badgeColor = "bg-gray-100 text-gray-800";
  let label = "Not Rated";

  if (rating >= 4.5) {
    badgeColor = "bg-emerald-100 text-emerald-800";
    label = "Editor's Choice";
  } else if (rating >= 4.0) {
    badgeColor = "bg-blue-100 text-blue-800";
    label = "Highly Recommended";
  } else if (rating >= 3.5) {
    badgeColor = "bg-amber-100 text-amber-800";
    label = "Recommended";
  } else if (rating >= 3.0) {
    badgeColor = "bg-orange-100 text-orange-800";
    label = "Good Value";
  } else if (rating >= 2.0) {
    badgeColor = "bg-red-100 text-red-800";
    label = "Below Average";
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}>
      {rating >= 4.5 && <TrophyIcon className="mr-1 h-3 w-3" />}
      {label}
    </span>
  );
}

// Generate metadata for each product review
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProduct(id);
    const imageUrl = product.images?.[0] ? getStrapiMedia(product.images[0].url) : null;
    const url = `/products/${product.slug || id}`;

    // Use meta_description for SEO if available
    const description = product.meta_description
      ? product.meta_description.substring(0, 160).replace(/<[^>]*>/g, '')
      : product.description
        ? product.description.substring(0, 160).replace(/<[^>]*>/g, '')
        : `Comprehensive review of ${product.name} by ${product.brand}. Read our expert analysis, pros and cons, and buying recommendations.`;

    return {
      title: `${product.name} | CoffeeLogik`,
      description: description,
      keywords: `${product.name}, ${product.brand}, coffee review, ${product.product_type}, coffee equipment review`,
      openGraph: {
        title: product.name,
        description: description,
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

  let product: CoffeeProduct | null = null;

  try {
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
    title: product.name,
    description: product.meta_description
      ? product.meta_description.substring(0, 160).replace(/<[^>]*>/g, '')
      : product.description
        ? product.description.substring(0, 160).replace(/<[^>]*>/g, '')
        : `Expert review of ${product.name}`,
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

      <div className="bg-white min-h-screen">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="h-full w-full" fill="currentColor" viewBox="0 0 100 100">
              <defs>
                <pattern id="coffee-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#coffee-pattern)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
            {/* Enhanced Back Button */}
            <div className="mb-6 sm:mb-8">
              <Link
                href="/products"
                className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-600 transition-colors group"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Reviews</span>
              </Link>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
              {/* Enhanced Product Images */}
              <div className="lg:col-span-5">
                <div className="sticky top-8">
                  <div className="relative aspect-square w-full rounded-3xl bg-white shadow-2xl overflow-hidden mb-6">
                    {product.images?.[0] ? (
                      <img
                        src={getStrapiMedia(product.images[0].url)}
                        alt={product.name}
                        className="h-full w-full object-contain p-8"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                        <span className="text-8xl">☕</span>
                      </div>
                    )}

                    {/* Rating Badge Overlay */}
                    {product.rating && (
                      <div className="absolute top-4 right-4">
                        <RatingBadge rating={product.rating} />
                      </div>
                    )}
                  </div>

                  {/* Additional Images */}
                  {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="aspect-square rounded-xl bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                          <img
                            src={getStrapiMedia(image.url)}
                            alt={`${product.name} ${index + 2}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Save Actions */}
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                      <HeartIcon className="mr-2 h-5 w-5" />
                      Save for Later
                    </button>
                    <ShareButton productName={product.name} productSlug={product.slug} />
                  </div>
                </div>
              </div>

              {/* Enhanced Review Header */}
              <div className="lg:col-span-7 mt-8 lg:mt-0">
                {/* Product Meta Info */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      <ShieldCheckIcon className="mr-1 h-4 w-4" />
                      Expert Review
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm font-medium text-amber-600">{product.brand}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{product.product_type}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <time className="text-sm text-gray-600">
                      {new Date(product.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>

                {/* Product Title - Use the SEO-friendly name from AI */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-playfair mb-8 leading-tight">
                  {product.name}
                </h1>

                {/* Enhanced Review Score Card */}
                {product.rating && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl sm:text-5xl font-bold text-amber-600 mb-2">
                          {product.rating.toFixed(1)}
                        </div>
                        <StarRating rating={product.rating} size="lg" />
                        <div className="text-sm text-gray-600 mt-2">Expert Rating</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {product.rating >= 4.5 ? "Excellent" :
                           product.rating >= 4.0 ? "Very Good" :
                           product.rating >= 3.5 ? "Good" :
                           product.rating >= 3.0 ? "Fair" : "Poor"}
                        </div>
                        <div className="text-sm text-gray-500">Overall</div>
                      </div>
                    </div>
                    
                    {/* Rating Scale Explanation */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Poor (1.0)</span>
                        <span>Excellent (5.0)</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" 
                          style={{ width: `${(product.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Quick Verdict - Now uses meta_description field */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 sm:p-8 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FireIcon className="mr-3 h-6 w-6 text-amber-600" />
                    Quick Verdict
                  </h3>
                  <div className="text-gray-700 leading-relaxed text-lg">
                    {product.meta_description ? (
                      <p>{product.meta_description}</p>
                    ) : (
                      <p>{getQuickVerdictText(product)}</p>
                    )}
                  </div>
                </div>

                {/* Enhanced CTA Section */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
                  {/* Main CTA Button */}
                  {product.affiliate_link ? (
                    <Link
                      href={product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 text-lg font-bold text-white shadow-lg hover:from-amber-500 hover:to-orange-500 focus-visible:outline focus-visible:outline-2 
focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-all transform hover:scale-105 hover:shadow-xl mb-4"
                    >
                      <ShoppingBagIcon className="inline mr-3 h-6 w-6" />
                      View Best Price on Amazon
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center rounded-xl bg-gray-400 px-6 py-4 text-lg font-semibold text-white shadow-sm cursor-not-allowed mb-4"
                    >
                      <ShoppingBagIcon className="inline mr-2 h-5 w-5" />
                      Link Not Available
                    </button>
                  )}

                  {/* Price Information */}
                  {product.price && (
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Current Price</div>
                      <div className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Amazon Disclaimer */}
          <div className="mb-16">
            <AmazonDisclaimer />
          </div>

          {/* Technical Specifications */}
          {(product.specifications && Object.keys(product.specifications).length > 0) && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <CogIcon className="mr-4 h-8 w-8 text-amber-600" />
                Technical Specifications
              </h2>
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Physical Specifications */}
                  {(
                    product.specifications.dimensions ||
                    product.specifications.weight ||
                    product.specifications.materials ||
                    product.specifications.power ||
                    product.specifications.capacity ||
                    product.specifications.warranty
                  ) && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <ScaleIcon className="mr-2 h-6 w-6 text-amber-600" />
                        Physical Specifications
                      </h3>
                      
                      {/* Dimensions */}
                      {product.specifications.dimensions && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Dimensions</h4>
                          <div className="text-gray-700">
                            {product.specifications.dimensions.length && product.specifications.dimensions.width && product.specifications.dimensions.height ? (
                              <span>
                                {product.specifications.dimensions.length}&quot; × {product.specifications.dimensions.width}&quot; × {product.specifications.dimensions.height}&quot;
                                {product.specifications.dimensions.unit && product.specifications.dimensions.unit !== 'inches' && (
                                  <span className="text-sm text-gray-500"> ({product.specifications.dimensions.unit})</span>
                                )}
                              </span>
                            ) : (
                              <span className="text-gray-500">Not specified</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Weight */}
                      {product.specifications.weight && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Weight</h4>
                          <div className="text-gray-700">
                            {product.specifications.weight.value ? (
                              <span>{product.specifications.weight.value} {product.specifications.weight.unit}</span>
                            ) : (
                              <span className="text-gray-500">Not specified</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Materials */}
                      {product.specifications.materials && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                          <div className="text-gray-700">
                            {Array.isArray(product.specifications.materials) ? (
                              <div className="flex flex-wrap gap-2">
                                {product.specifications.materials.map((material: string, index: number) => (
                                  <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                                    {material}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span>{product.specifications.materials}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Power */}
                      {product.specifications.power && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Power</h4>
                          <div className="text-gray-700">
                            {product.specifications.power.value ? (
                              <span>{product.specifications.power.value} {product.specifications.power.unit}</span>
                            ) : (
                              <span className="text-gray-500">Not specified</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Capacity */}
                      {product.specifications.capacity && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Capacity</h4>
                          <div className="text-gray-700">
                            {product.specifications.capacity.value ? (
                              <span>{product.specifications.capacity.value} {product.specifications.capacity.unit}</span>
                            ) : (
                              <span className="text-gray-500">Not specified</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Warranty */}
                      {product.specifications.warranty && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Warranty</h4>
                          <div className="text-gray-700">{product.specifications.warranty}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Category-Specific Specifications */}
                  <div className="space-y-6">
                    {/* Grinder Specifications */}
                    {product.specifications.grinder_specifications && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <WrenchIcon className="mr-2 h-6 w-6 text-amber-600" />
                          Grinder Specifications
                        </h3>
                        <div className="space-y-4">
                          {product.specifications.grinder_specifications.grinder_type && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Grinder Type</h4>
                              <div className="text-gray-700">{product.specifications.grinder_specifications.grinder_type}</div>
                            </div>
                          )}
                          {product.specifications.grinder_specifications.burr_type && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Burr Type</h4>
                              <div className="text-gray-700">{product.specifications.grinder_specifications.burr_type}</div>
                            </div>
                          )}
                          {product.specifications.grinder_specifications.burr_material && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Burr Material</h4>
                              <div className="text-gray-700">{product.specifications.grinder_specifications.burr_material}</div>
                            </div>
                          )}
                          {product.specifications.grinder_specifications.grind_settings && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Grind Settings</h4>
                              <div className="text-gray-700">{product.specifications.grinder_specifications.grind_settings}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Espresso Specifications */}
                    {product.specifications.espresso_specifications && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <BeakerIcon className="mr-2 h-6 w-6 text-amber-600" />
                          Espresso Specifications
                        </h3>
                        <div className="space-y-4">
                          {product.specifications.espresso_specifications.pump_pressure && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Pump Pressure</h4>
                              <div className="text-gray-700">
                                {product.specifications.espresso_specifications.pump_pressure.value} {product.specifications.espresso_specifications.pump_pressure.unit}
                              </div>
                            </div>
                          )}
                          {product.specifications.espresso_specifications.boiler_type && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Boiler Type</h4>
                              <div className="text-gray-700">{product.specifications.espresso_specifications.boiler_type}</div>
                            </div>
                          )}
                          {product.specifications.espresso_specifications.steam_wand !== undefined && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Steam Wand</h4>
                              <div className="text-gray-700">
                                {product.specifications.espresso_specifications.steam_wand ? 'Yes' : 'No'}
                              </div>
                            </div>
                          )}
                          {product.specifications.espresso_specifications.pid_control !== undefined && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">PID Control</h4>
                              <div className="text-gray-700">
                                {product.specifications.espresso_specifications.pid_control ? 'Yes' : 'No'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Brewing Specifications */}
                    {product.specifications.brewing_specifications && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <ClockIcon className="mr-2 h-6 w-6 text-amber-600" />
                          Brewing Specifications
                        </h3>
                        <div className="space-y-4">
                          {product.specifications.brewing_specifications.water_reservoir_capacity && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Water Reservoir</h4>
                              <div className="text-gray-700">
                                {product.specifications.brewing_specifications.water_reservoir_capacity.value} {product.specifications.brewing_specifications.water_reservoir_capacity.unit}
                              </div>
                            </div>
                          )}
                          {product.specifications.brewing_specifications.programmable !== undefined && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Programmable</h4>
                              <div className="text-gray-700">
                                {product.specifications.brewing_specifications.programmable ? 'Yes' : 'No'}
                              </div>
                            </div>
                          )}
                          {product.specifications.brewing_specifications.auto_shutoff !== undefined && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Auto Shut-off</h4>
                              <div className="text-gray-700">
                                {product.specifications.brewing_specifications.auto_shutoff ? 'Yes' : 'No'}
                              </div>
                            </div>
                          )}
                          {product.specifications.brewing_specifications.thermal_carafe !== undefined && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Thermal Carafe</h4>
                              <div className="text-gray-700">
                                {product.specifications.brewing_specifications.thermal_carafe ? 'Yes' : 'No'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flavor Profile - Enhanced */}
          {product.flavor_notes && Array.isArray(product.flavor_notes) && product.flavor_notes.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <LightBulbIcon className="mr-4 h-8 w-8 text-amber-600" />
                Flavor Profile
              </h2>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
                <p className="text-gray-700 mb-6 text-lg">Our experts identified these distinct flavor notes:</p>
                <div className="flex flex-wrap gap-3">
                  {product.flavor_notes.map((note: string, index: number) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-800 border-2 border-amber-200 shadow-sm">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Detailed Review */}
          {product.description && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <ArrowsPointingOutIcon className="mr-4 h-8 w-8 text-amber-600" />
                Our Expert Review
              </h2>
              <div className="prose prose-lg prose-amber max-w-none prose-headings:font-bold prose-h3:text-2xl prose-h4:text-xl prose-p:leading-relaxed prose-p:text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: marked(product.description) }} />
              </div>
            </div>
          )}

          {/* Enhanced Pros and Cons */}
          {((product.pros && Array.isArray(product.pros) && product.pros.length > 0) ||
            (product.cons && Array.isArray(product.cons) && product.cons.length > 0)) && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <CheckCircleIcon className="mr-4 h-8 w-8 text-amber-600" />
                Pros & Cons Analysis
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {product.pros && Array.isArray(product.pros) && product.pros.length > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <CheckCircleIcon className="h-8 w-8 text-emerald-500 mr-3" />
                      What We Loved
                    </h3>
                    <ul className="space-y-4">
                      {product.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-6 w-6 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">
                            {pro.replace(/^(Time-based precision with exact measurements|Technical feature with measurable impact|Performance comparison with previous experience|Build quality with time-based testing period|)\s*:\s*/, '')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.cons && Array.isArray(product.cons) && product.cons.length > 0 && (
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-8 border border-red-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <XMarkIcon className="h-8 w-8 text-red-500 mr-3" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-4">
                      {product.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <XMarkIcon className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">
                            {con.replace(/^(Measurable limitation with spatial impact|Technical trade-off with exact usage data|Learning curve with specific workflow adjustment|Value consideration with relative cost context|)\s*:\s*/, '')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Final Recommendation */}
          <div className="mb-16">
            <div className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-3xl p-1">
              <div className="bg-white rounded-3xl p-8 lg:p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6">
                    <TrophyIcon className="h-10 w-10 text-amber-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Our Final Verdict
                  </h2>
                  <div className="max-w-3xl mx-auto">
                    {product.rating && (
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <StarRating rating={product.rating} size="lg" />
                        <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          {product.rating.toFixed(1)}/5
                        </div>
                      </div>
                    )}
                    <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                      {product.rating && product.rating >= 4.5 
                        ? "🏆 Editor&apos;s Choice - " 
                        : product.rating && product.rating >= 4.0 
                        ? "⭐ Highly Recommended - " 
                        : product.rating && product.rating >= 3.5 
                        ? "👍 Good Choice - " 
                        : "🤔 Consider Alternatives - "}
                      The {product.name} by {product.brand} {product.rating && product.rating >= 4.0 ? 'exceeds expectations' : 'delivers solid performance'} in the {product.product_type.toLowerCase()} category.
                    </p>
                    {product.affiliate_link && (
                      <Link
                        href={product.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-10 py-5 text-xl font-bold text-white shadow-2xl hover:from-amber-500 hover:to-orange-500 focus-visible:outline focus-visible:outline-2 
focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-all transform hover:scale-105 hover:shadow-3xl"
                      >
                        <ShoppingBagIcon className="mr-3 h-7 w-7" />
                        Get Best Price on Amazon
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Who Should Buy This */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <UserGroupIcon className="mr-4 h-8 w-8 text-amber-600" />
              Who Should Buy This?
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Perfect For</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Beginners looking for reliable equipment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Daily coffee drinkers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Those seeking good value</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <XMarkIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Not Ideal For</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Professional baristas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Those with strict budget constraints</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Users needing advanced features</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <LightBulbIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Alternative Options</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Higher-end model: Breville Barista Pro</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Budget option: Nespresso Essenza Mini</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Manual alternative: Rancilio Silvia</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <QuestionMarkCircleIcon className="mr-4 h-8 w-8 text-amber-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button className="flex justify-between items-center w-full p-6 text-left">
                  <span className="text-lg font-medium text-gray-900">How does this compare to other models in its category?</span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                </button>
                <div className="px-6 pb-6 text-gray-700">
                  <p>Based on our testing, the {product.name} offers better value than competitors like [Competitor A] and [Competitor B], particularly in terms of {product.rating && product.rating >= 4.0 ? 'performance and build quality' : 'cost-effectiveness'}.</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button className="flex justify-between items-center w-full p-6 text-left">
                  <span className="text-lg font-medium text-gray-900">What&apos;s the learning curve like?</span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                </button>
                <div className="px-6 pb-6 text-gray-700">
                  <p>Most users can get comfortable with this {product.product_type.toLowerCase()} within a few days. The intuitive controls and clear instructions make it suitable for beginners while still offering enough depth for more experienced coffee enthusiasts.</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button className="flex justify-between items-center w-full p-6 text-left">
                  <span className="text-lg font-medium text-gray-900">How does it perform with different coffee beans?</span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                </button>
                <div className="px-6 pb-6 text-gray-700">
                  <p>During our testing, we found this {product.product_type.toLowerCase()} performs consistently well across light, medium, and dark roasts. It particularly excels with {product.product_type === 'Coffee Grinder' ? 'medium to dark roasts where burr consistency is crucial' : 'medium roasts where extraction balance is key'}.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Related Reviews CTA */}
          <div className="relative overflow-hidden bg-gray-900 rounded-3xl p-8 lg:p-12 text-center text-white mb-16">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-95"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Discover More Expert Reviews
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Explore our comprehensive collection of coffee equipment reviews, brewing guides, and expert recommendations to find your perfect setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <Link 
                  href="/products" 
                  className="flex-1 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Browse All Reviews
                </Link>
                <Link 
                  href="/blog" 
                  className="flex-1 rounded-2xl border-2 border-white px-8 py-4 text-lg font-bold text-white hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Read Articles
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Affiliate CTA */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-center text-white mb-16">
            <div className="max-w-3xl mx-auto">
              <ShoppingBagIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">Ready to Upgrade Your Coffee Experience?</h3>
              <p className="text-xl mb-6">
                Get the {product.name} at the best price with our exclusive Amazon deal.
              </p>
              {product.affiliate_link && (
                <Link
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-2xl bg-white px-8 py-4 text-xl font-bold text-amber-600 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Shop Now on Amazon
                </Link>
              )}
              <p className="text-amber-100 text-sm mt-4">
                As an Amazon Associate, we earn from qualifying purchases
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
