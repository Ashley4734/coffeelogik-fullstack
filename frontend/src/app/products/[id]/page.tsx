import Link from "next/link";
import { ArrowLeftIcon, StarIcon, ShoppingBagIcon, CheckCircleIcon, XMarkIcon, ShieldCheckIcon, TrophyIcon, FireIcon, CogIcon, ClockIcon, EyeIcon, ChartBarIcon, SparklesIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon, HeartIcon } from "@heroicons/react/24/outline";
import { getProduct, getStrapiMedia } from "@/lib/api";
import { notFound } from "next/navigation";
import { marked } from "marked";
import ShareButton from "./ShareButton";
import { Metadata } from "next";
import { generateArticleStructuredData } from "@/components/SEO";
import AmazonDisclaimer from "@/components/AmazonDisclaimer";

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
            <StarIcon className={`${sizeClasses[size]} text-yellow-400 drop-shadow-sm`} />
          ) : star === Math.ceil(rating) && rating % 1 !== 0 ? (
            <div className="relative">
              <StarOutlineIcon className={`${sizeClasses[size]} text-gray-300`} />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                <StarIcon className={`${sizeClasses[size]} text-yellow-400 drop-shadow-sm`} />
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

// Enhanced rating badge with animations and gradients
function RatingBadge({ rating }: { rating: number }) {
  let badgeClasses = "bg-gray-100 text-gray-800";
  let label = "Not Rated";
  let icon = null;

  if (rating >= 4.7) {
    badgeClasses = "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-lg";
    label = "Exceptional";
    icon = <SparklesIcon className="mr-1 h-3 w-3" />;
  } else if (rating >= 4.5) {
    badgeClasses = "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg";
    label = "Editor's Choice";
    icon = <TrophyIcon className="mr-1 h-3 w-3" />;
  } else if (rating >= 4.0) {
    badgeClasses = "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md";
    label = "Highly Recommended";
  } else if (rating >= 3.5) {
    badgeClasses = "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md";
    label = "Recommended";
  } else if (rating >= 3.0) {
    badgeClasses = "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md";
    label = "Good Value";
  } else if (rating >= 2.0) {
    badgeClasses = "bg-gradient-to-r from-red-400 to-red-600 text-white shadow-md";
    label = "Below Average";
  }

  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300`}></div>
      <span className={`relative inline-flex items-center rounded-full px-4 py-2 text-xs font-bold ${badgeClasses} transition-all duration-300 hover:scale-105`}>
        {icon}
        {label}
      </span>
    </div>
  );
}

// Floating action button component
function FloatingActionButton({ affiliateLink }: { affiliateLink?: string }) {
  if (!affiliateLink) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <Link
        href={affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-110"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-700 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
        <ShoppingBagIcon className="relative h-7 w-7" />
      </Link>
    </div>
  );
}

// Enhanced testing methodology component
function TestingMethodology({ productType }: { productType: string }) {
  const getTestingMethod = (type: string) => {
    switch(type) {
      case 'Coffee Grinder':
        return {
          duration: "3+ weeks daily use",
          focus: "Grind consistency, noise levels, burr durability",
          scenarios: ["Morning rush", "Weekend brewing", "Different bean types"],
          icon: CogIcon,
          color: "from-blue-500 to-cyan-600"
        };
      case 'Espresso Machine':
        return {
          duration: "4+ weeks testing",
          focus: "Temperature stability, pressure consistency, steam performance",
          scenarios: ["Single shots", "Back-to-back brewing", "Milk steaming"],
          icon: FireIcon,
          color: "from-red-500 to-pink-600"
        };
      case 'Pour-Over Dripper':
        return {
          duration: "2+ weeks testing",
          focus: "Flow control, heat retention, ease of use",
          scenarios: ["Different pour techniques", "Various coffee origins", "Multiple cup sizes"],
          icon: EyeIcon,
          color: "from-green-500 to-emerald-600"
        };
      default:
        return {
          duration: "2+ weeks testing",
          focus: "Performance, build quality, daily use",
          scenarios: ["Real-world conditions", "Stress testing", "Long-term durability"],
          icon: ChartBarIcon,
          color: "from-purple-500 to-indigo-600"
        };
    }
  };

  const method = getTestingMethod(productType);
  const IconComponent = method.icon;

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-xl mb-8">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${method.color}`}></div>
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className={`mr-3 p-2 rounded-full bg-gradient-to-r ${method.color}`}>
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          Our Testing Process
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group">
            <div className="flex items-center mb-2">
              <ClockIcon className="mr-2 h-5 w-5 text-blue-500" />
              <div className="font-semibold text-gray-900">Testing Duration</div>
            </div>
            <div className="text-gray-600 group-hover:text-gray-900 transition-colors">{method.duration}</div>
          </div>
          <div className="group">
            <div className="flex items-center mb-2">
              <ChartBarIcon className="mr-2 h-5 w-5 text-green-500" />
              <div className="font-semibold text-gray-900">Focus Areas</div>
            </div>
            <div className="text-gray-600 group-hover:text-gray-900 transition-colors">{method.focus}</div>
          </div>
          <div className="group">
            <div className="flex items-center mb-2">
              <EyeIcon className="mr-2 h-5 w-5 text-purple-500" />
              <div className="font-semibold text-gray-900">Test Scenarios</div>
            </div>
            <div className="text-gray-600 group-hover:text-gray-900 transition-colors">{method.scenarios.join(", ")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scroll-following product image component with proper sticky behavior
function ScrollingProductImage({ product }: { product: import("@/lib/api").CoffeeProduct }) {
  return (
    <div className="lg:col-span-5">
      {/* Sticky positioning that follows scroll */}
      <div className="sticky top-8 z-20">
        {/* Main Product Image with enhanced effects */}
        <div className="group relative aspect-square w-full rounded-3xl bg-white shadow-2xl overflow-hidden mb-6 transform transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
          {product.images?.[0] ? (
            <img
              src={getStrapiMedia(product.images[0].url)}
              alt={product.name}
              className="relative h-full w-full object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="relative h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
              <span className="text-8xl animate-pulse">☕</span>
            </div>
          )}

          {/* Enhanced overlays */}
          {product.rating && (
            <div className="absolute top-4 right-4 z-10 transform transition-all duration-300 hover:scale-110">
              <RatingBadge rating={product.rating} />
            </div>
          )}

          {product.price && (
            <div className="absolute bottom-4 left-4 z-10 transform transition-all duration-300 hover:scale-105">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center text-lg font-bold text-gray-900">
                  <CurrencyDollarIcon className="mr-1 h-5 w-5 text-green-600" />
                  {product.price.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {product.featured && (
            <div className="absolute top-4 left-4 z-10 transform transition-all duration-300 hover:scale-110">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
                <FireIcon className="inline mr-1 h-3 w-3" />
                FEATURED
              </div>
            </div>
          )}

          {/* Scroll-based parallax effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Enhanced Thumbnail Images */}
        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 transform transition-all duration-300 ease-out">
            {product.images.slice(1, 5).map((image, index) => (
              <div 
                key={index} 
                className="group/thumb aspect-square rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200/50 transform hover:scale-110 hover:-translate-y-1"
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                <img
                  src={getStrapiMedia(image.url)}
                  alt={`${product.name} ${index + 2}`}
                  className="h-full w-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Floating mini-gallery indicator */}
        {product.images && product.images.length > 1 && (
          <div className="mt-4 flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 shadow-md">
              <div className="flex items-center space-x-2">
                {product.images.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === 0 
                        ? 'bg-amber-500 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
                {product.images.length > 5 && (
                  <span className="text-xs text-gray-500 ml-2">+{product.images.length - 5}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getQuickVerdictText(product: import("@/lib/api").CoffeeProduct): string {
  if (product.quick_verdict) {
    return product.quick_verdict;
  }

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

  return `The ${product.name} by ${product.brand} offers excellent value in the ${product.product_type?.toLowerCase() || 'coffee equipment'} category.`;
}

// Enhanced metadata generation
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProduct(id);
    const imageUrl = product.images?.[0] ? getStrapiMedia(product.images[0].url) : null;
    const url = `/products/${product.slug || id}`;

    const title = product.meta_title || `${product.name} Review | CoffeeLogik`;
    const description = product.meta_description || 
      (product.quick_verdict
        ? product.quick_verdict.substring(0, 160).replace(/<[^>]*>/g, '')
        : `Expert review of ${product.name} by ${product.brand}. Read our comprehensive analysis, pros and cons, and buying recommendations.`);

    return {
      title: title,
      description: description,
      keywords: `${product.name}, ${product.brand}, coffee review, ${product.product_type}, coffee equipment review, ${product.slug}`,
      openGraph: {
        title: title,
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

  let product: import("@/lib/api").CoffeeProduct | null = null;

  try {
    product = await getProduct(id);
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const structuredData = generateArticleStructuredData({
    title: product.meta_title || product.name,
    description: product.meta_description || getQuickVerdictText(product),
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

      {/* Floating Action Button */}
      <FloatingActionButton affiliateLink={product.affiliate_link} />

      <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 min-h-screen">
        {/* Hero Section with Advanced Styling */}
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-red-50/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,165,0,0.1),transparent_50%)]"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
            {/* Enhanced Navigation */}
            <div className="mb-8">
              <nav className="flex items-center space-x-2 text-sm">
                <Link href="/" className="text-gray-500 hover:text-amber-600 transition-colors">Home</Link>
                <span className="text-gray-400">/</span>
                <Link href="/products" className="text-gray-500 hover:text-amber-600 transition-colors">Reviews</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">{product.name}</span>
              </nav>
              
              <Link
                href="/products"
                className="group inline-flex items-center mt-4 text-sm font-medium text-amber-700 hover:text-amber-600 transition-all duration-200"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Reviews</span>
              </Link>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              {/* Enhanced Scrolling Product Images */}
              <ScrollingProductImage product={product} />

              {/* Enhanced Product Information */}
              <div className="lg:col-span-7 mt-8 lg:mt-0">
                {/* Product Meta */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                      <ShieldCheckIcon className="mr-2 h-4 w-4" />
                      Expert Review
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-lg font-semibold text-amber-600">{product.brand}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{product.product_type}</span>
                  </div>
                </div>

                {/* Enhanced Product Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 font-playfair mb-8 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  {product.name}
                </h1>

                {/* Enhanced Rating Section - SIMPLIFIED */}
                {product.rating && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 mb-8 relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-3">
                          {product.rating.toFixed(1)}
                        </div>
                        <div className="mb-3">
                          <StarRating rating={product.rating} size="lg" />
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Expert Rating</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {product.rating >= 4.7 ? "Exceptional" :
                           product.rating >= 4.5 ? "Excellent" :
                           product.rating >= 4.0 ? "Very Good" :
                           product.rating >= 3.5 ? "Good" :
                           product.rating >= 3.0 ? "Fair" : "Poor"}
                        </div>
                        <div className="text-sm text-gray-500">Overall Score</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Testing Methodology */}
                <TestingMethodology productType={product.product_type} />

                {/* Enhanced Quick Verdict */}
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-3xl border border-amber-200/50 shadow-lg mb-8 transform transition-all duration-300 hover:scale-[1.01]">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="mr-4 p-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg">
                        <FireIcon className="h-6 w-6 text-white" />
                      </div>
                      Quick Verdict
                    </h3>
                    <div className="text-gray-700 leading-relaxed text-lg font-medium">
                      {product.quick_verdict ? (
                        <div dangerouslySetInnerHTML={{ __html: marked(product.quick_verdict) }} />
                      ) : (
                        <p>{getQuickVerdictText(product)}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced CTA Section */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 relative overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                  <div className="absolute -top-2 -left-2 -right-2 h-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 blur-sm opacity-50"></div>
                  
                  {product.affiliate_link ? (
                    <Link
                      href={product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block w-full text-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 px-8 py-6 text-xl font-bold text-white shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] mb-6"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-red-700 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
                      <div className="relative flex items-center justify-center">
                        <ShoppingBagIcon className="mr-3 h-7 w-7" />
                        View Best Price on Amazon
                      </div>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center rounded-2xl bg-gray-400 px-8 py-6 text-xl font-bold text-white shadow-lg cursor-not-allowed mb-6"
                    >
                      <ShoppingBagIcon className="inline mr-3 h-7 w-7" />
                      Link Not Available
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <button className="group inline-flex items-center justify-center rounded-2xl border-2 border-gray-300 px-6 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105">
                      <HeartIcon className="mr-2 h-5 w-5 group-hover:text-red-500 transition-colors" />
                      Save for Later
                    </button>
                    <ShareButton productName={product.name} productSlug={product.slug} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Enhanced Stats Bar */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 mb-16 relative overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">{product.brand}</div>
                <div className="text-sm text-gray-600 font-medium">Brand</div>
              </div>
              <div className="group">
                <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{product.product_type}</div>
                <div className="text-sm text-gray-600 font-medium">Category</div>
              </div>
              <div className="group">
                <div className="flex justify-center items-center mb-1">
                  <StarRating rating={product.rating || 0} size="default" showNumber={true} />
                </div>
                <div className="text-sm text-gray-600 font-medium">Expert Rating</div>
              </div>
              {product.price && (
                <div className="group">
                  <div className="text-2xl font-bold text-green-600 mb-1 group-hover:text-green-700 transition-colors">${product.price.toFixed(2)}</div>
                  <div className="text-sm text-gray-600 font-medium">Price</div>
                </div>
              )}
            </div>
          </div>

          {/* Amazon Disclaimer */}
          <div className="mb-16">
            <AmazonDisclaimer />
          </div>

          {/* Coffee Profile Section */}
          {(product.origin || product.roast_level || (product.flavor_notes && product.flavor_notes.length > 0)) && (
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 flex items-center">
                <div className="w-2 h-10 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-6"></div>
                Coffee Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {product.origin && (
                  <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-8 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">Origin</h3>
                    <div className="text-2xl font-bold text-amber-800">{product.origin}</div>
                  </div>
                )}
                
                {product.roast_level && (
                  <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-8 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors">Roast Level</h3>
                    <div className="text-2xl font-bold text-orange-800">{product.roast_level}</div>
                  </div>
                )}

                {product.flavor_notes && Array.isArray(product.flavor_notes) && product.flavor_notes.length > 0 && (
                  <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-8 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-400 to-pink-500"></div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors">Flavor Notes</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.flavor_notes.slice(0, 4).map((note, index) => (
                        <span key={index} className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-bold text-red-800 border border-red-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                          {note}
                        </span>
                      ))}
                      {product.flavor_notes.length > 4 && (
                        <span className="text-sm text-red-700 font-medium">+{product.flavor_notes.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Technical Specifications */}
          {product.specifications && (
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 flex items-center">
                <div className="w-2 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-6"></div>
                Technical Specifications
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8 border border-gray-200 shadow-xl transform transition-all duration-300 hover:scale-[1.01]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  
                  {/* Basic Specifications */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="mr-3 p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                        <CogIcon className="h-6 w-6 text-white" />
                      </div>
                      Physical Specifications
                    </h3>
                    
                    {/* Dimensions */}
                    {product.specifications.dimensions && (
                      <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors">Dimensions</h4>
                        <div className="text-gray-700 text-lg">
                          {product.specifications.dimensions.length && product.specifications.dimensions.width && product.specifications.dimensions.height ? (
                            <div className="flex items-center">
                              <span className="font-semibold">
                                {product.specifications.dimensions.length}&quot; × {product.specifications.dimensions.width}&quot; × {product.specifications.dimensions.height}&quot;
                              </span>
                              {product.specifications.dimensions.unit && product.specifications.dimensions.unit !== 'inches' && (
                                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  ({product.specifications.dimensions.unit})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">Not specified</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Weight */}
                    {product.specifications.weight && (
                      <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-green-600 transition-colors">Weight</h4>
                        <div className="text-gray-700 text-lg">
                          {product.specifications.weight.value ? (
                            <span className="font-semibold">{product.specifications.weight.value} {product.specifications.weight.unit}</span>
                          ) : (
                            <span className="text-gray-500 italic">Not specified</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Materials */}
                    {product.specifications.materials && (
                      <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-purple-600 transition-colors">Materials</h4>
                        <div className="text-gray-700">
                          {Array.isArray(product.specifications.materials) ? (
                            <div className="flex flex-wrap gap-2">
                              {product.specifications.materials.map((material, index) => (
                                <span key={index} className="inline-flex items-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 text-sm font-bold text-gray-800 border border-gray-300/50 hover:scale-105 transition-transform duration-200">
                                  {material}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-lg font-semibold">{product.specifications.materials}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Power */}
                    {product.specifications.power && (
                      <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-yellow-600 transition-colors">Power</h4>
                        <div className="text-gray-700 text-lg">
                          {product.specifications.power.value ? (
                            <span className="font-semibold">{product.specifications.power.value} {product.specifications.power.unit}</span>
                          ) : (
                            <span className="text-gray-500 italic">Not specified</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Capacity */}
                    {product.specifications.capacity && (
                      <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-orange-600 transition-colors">Capacity</h4>
                        <div className="text-gray-700 text-lg">
                          {product.specifications.capacity.value ? (
                            <span className="font-semibold">{product.specifications.capacity.value} {product.specifications.capacity.unit}</span>
                          ) : (
                            <span className="text-gray-500 italic">Not specified</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Warranty */}
                    {product.specifications.warranty && (
                      <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-indigo-600 transition-colors">Warranty</h4>
                        <div className="text-gray-700 text-lg font-semibold">{product.specifications.warranty}</div>
                      </div>
                    )}
                  </div>

                  {/* Category-Specific Specifications */}
                  <div className="space-y-8">
                    {/* Grinder Specifications */}
                    {product.specifications.grinder_specifications && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <div className="mr-3 p-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600">
                            <CogIcon className="h-6 w-6 text-white" />
                          </div>
                          Grinder Specifications
                        </h3>
                        <div className="space-y-4">
                          {product.specifications.grinder_specifications.grinder_type && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-amber-600 transition-colors">Grinder Type</h4>
                              <div className="text-gray-700 text-lg font-semibold">{product.specifications.grinder_specifications.grinder_type}</div>
                            </div>
                          )}
                          {product.specifications.grinder_specifications.burr_type && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-amber-600 transition-colors">Burr Type</h4>
                              <div className="text-gray-700 text-lg font-semibold">{product.specifications.grinder_specifications.burr_type}</div>
                            </div>
                          )}
                          {product.specifications.grinder_specifications.burr_material && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-amber-600 transition-colors">Burr Material</h4>
                              <div className="text-gray-700 text-lg font-semibold">{product.specifications.grinder_specifications.burr_material}</div>
                            </div>
                          )}
                          {product.specifications.grinder_specifications.grind_settings && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-amber-600 transition-colors">Grind Settings</h4>
                              <div className="text-gray-700 text-lg font-semibold">{product.specifications.grinder_specifications.grind_settings}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Espresso Specifications */}
                    {product.specifications.espresso_specifications && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <div className="mr-3 p-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600">
                            <FireIcon className="h-6 w-6 text-white" />
                          </div>
                          Espresso Specifications
                        </h3>
                        <div className="space-y-4">
                          {product.specifications.espresso_specifications.pump_pressure && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-red-600 transition-colors">Pump Pressure</h4>
                              <div className="text-gray-700 text-lg font-semibold">
                                {product.specifications.espresso_specifications.pump_pressure.value} {product.specifications.espresso_specifications.pump_pressure.unit}
                              </div>
                            </div>
                          )}
                          {product.specifications.espresso_specifications.boiler_type && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-red-600 transition-colors">Boiler Type</h4>
                              <div className="text-gray-700 text-lg font-semibold">{product.specifications.espresso_specifications.boiler_type}</div>
                            </div>
                          )}
                          {product.specifications.espresso_specifications.steam_wand !== undefined && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-red-600 transition-colors">Steam Wand</h4>
                              <div className={`text-lg font-bold ${product.specifications.espresso_specifications.steam_wand ? 'text-green-600' : 'text-red-600'}`}>
                                {product.specifications.espresso_specifications.steam_wand ? '✓ Yes' : '✗ No'}
                              </div>
                            </div>
                          )}
                          {product.specifications.espresso_specifications.pid_control !== undefined && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-red-600 transition-colors">PID Control</h4>
                              <div className={`text-lg font-bold ${product.specifications.espresso_specifications.pid_control ? 'text-green-600' : 'text-red-600'}`}>
                                {product.specifications.espresso_specifications.pid_control ? '✓ Yes' : '✗ No'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Brewing Specifications */}
                    {product.specifications.brewing_specifications && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <div className="mr-3 p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600">
                            <EyeIcon className="h-6 w-6 text-white" />
                          </div>
                          Brewing Specifications
                        </h3>
                        <div className="space-y-4">
                          {product.specifications.brewing_specifications.water_reservoir_capacity && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors">Water Reservoir</h4>
                              <div className="text-gray-700 text-lg font-semibold">
                                {product.specifications.brewing_specifications.water_reservoir_capacity.value} {product.specifications.brewing_specifications.water_reservoir_capacity.unit}
                              </div>
                            </div>
                          )}
                          {product.specifications.brewing_specifications.programmable !== undefined && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors">Programmable</h4>
                              <div className={`text-lg font-bold ${product.specifications.brewing_specifications.programmable ? 'text-green-600' : 'text-red-600'}`}>
                                {product.specifications.brewing_specifications.programmable ? '✓ Yes' : '✗ No'}
                              </div>
                            </div>
                          )}
                          {product.specifications.brewing_specifications.auto_shutoff !== undefined && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors">Auto Shut-off</h4>
                              <div className={`text-lg font-bold ${product.specifications.brewing_specifications.auto_shutoff ? 'text-green-600' : 'text-red-600'}`}>
                                {product.specifications.brewing_specifications.auto_shutoff ? '✓ Yes' : '✗ No'}
                              </div>
                            </div>
                          )}
                          {product.specifications.brewing_specifications.thermal_carafe !== undefined && (
                            <div className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors">Thermal Carafe</h4>
                              <div className={`text-lg font-bold ${product.specifications.brewing_specifications.thermal_carafe ? 'text-green-600' : 'text-red-600'}`}>
                                {product.specifications.brewing_specifications.thermal_carafe ? '✓ Yes' : '✗ No'}
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

          {/* Enhanced Detailed Review */}
          {product.description && (
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 flex items-center">
                <div className="w-2 h-10 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-6"></div>
                Our Expert Review
              </h2>
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 lg:p-12 relative overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                <div className="prose prose-xl prose-gray max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:leading-relaxed prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg">
                  <div dangerouslySetInnerHTML={{ __html: marked(product.description) }} />
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Pros and Cons */}
          {((product.pros && Array.isArray(product.pros) && product.pros.length > 0) ||
            (product.cons && Array.isArray(product.cons) && product.cons.length > 0)) && (
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 flex items-center">
                <div className="w-2 h-10 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-6"></div>
                Pros & Cons Analysis
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {product.pros && Array.isArray(product.pros) && product.pros.length > 0 && (
                  <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8 border border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                      <div className="mr-4 p-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                        <CheckCircleIcon className="h-8 w-8 text-white" />
                      </div>
                      What We Loved
                    </h3>
                    <ul className="space-y-6">
                      {product.pros.map((pro, index) => (
                        <li key={index} className="flex items-start group/item">
                          <div className="mr-4 p-1 rounded-full bg-emerald-100 group-hover/item:bg-emerald-200 transition-colors duration-200">
                            <CheckCircleIcon className="h-6 w-6 text-emerald-600 group-hover/item:text-emerald-700 transition-colors duration-200" />
                          </div>
                          <span className="text-gray-700 leading-relaxed text-lg font-medium group-hover/item:text-gray-900 transition-colors duration-200">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.cons && Array.isArray(product.cons) && product.cons.length > 0 && (
                  <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-3xl p-8 border border-red-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-400 to-rose-500"></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                      <div className="mr-4 p-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600 shadow-lg">
                        <XMarkIcon className="h-8 w-8 text-white" />
                      </div>
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-6">
                      {product.cons.map((con, index) => (
                        <li key={index} className="flex items-start group/item">
                          <div className="mr-4 p-1 rounded-full bg-red-100 group-hover/item:bg-red-200 transition-colors duration-200">
                            <XMarkIcon className="h-6 w-6 text-red-600 group-hover/item:text-red-700 transition-colors duration-200" />
                          </div>
                          <span className="text-gray-700 leading-relaxed text-lg font-medium group-hover/item:text-gray-900 transition-colors duration-200">{con}</span>
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
            <div className="relative overflow-hidden rounded-3xl transform transition-all duration-300 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative bg-white rounded-3xl m-1 p-12 lg:p-16">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-8 shadow-xl">
                    <TrophyIcon className="h-12 w-12 text-amber-600" />
                  </div>
                  <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    Our Final Verdict
                  </h2>
                  <div className="max-w-4xl mx-auto">
                    {product.rating && (
                      <div className="flex items-center justify-center gap-6 mb-8">
                        <StarRating rating={product.rating} size="lg" />
                        <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          {product.rating.toFixed(1)}/5
                        </div>
                      </div>
                    )}
                    <p className="text-2xl text-gray-700 mb-12 leading-relaxed font-medium">
                      {product.rating && product.rating >= 4.7 ? "🏆 Exceptional Choice - " :
                       product.rating && product.rating >= 4.5 ? "🏆 Editor's Choice - " :
                       product.rating && product.rating >= 4.0 ? "⭐ Highly Recommended - " :
                       product.rating && product.rating >= 3.5 ? "👍 Good Choice - " :
                       "🤔 Consider Alternatives - "}
                      The {product.name} by {product.brand} {product.rating && product.rating >= 4.0 ? "exceeds expectations" : "delivers solid performance"} in the {product.product_type.toLowerCase()} category.
                    </p>
                    {product.affiliate_link && (
                      <Link
                        href={product.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-12 py-6 text-2xl font-bold text-white shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-700 to-red-700 rounded-3xl opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
                        <div className="relative flex items-center">
                          <ShoppingBagIcon className="mr-4 h-8 w-8" />
                          Get Best Price on Amazon
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Related Reviews CTA */}
          <div className="relative overflow-hidden bg-gray-900 rounded-3xl p-12 lg:p-16 text-center text-white transform transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Discover More Expert Reviews
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Explore our comprehensive collection of coffee equipment reviews, brewing guides, and expert recommendations to find your perfect setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                <Link 
                  href="/products" 
                  className="group flex-1 rounded-2xl bg-white px-10 py-5 text-xl font-bold text-gray-900 shadow-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  <span className="group-hover:text-amber-600 transition-colors">Browse All Reviews</span>
                </Link>
                <Link 
                  href="/blog" 
                  className="group flex-1 rounded-2xl border-2 border-white px-10 py-5 text-xl font-bold text-white hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105"
                >
                  Read Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
