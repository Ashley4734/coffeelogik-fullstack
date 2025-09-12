// frontend/src/app/sitemap-html/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CalculatorIcon,
  BeakerIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Sitemap - Coffee Logik',
  description: 'Complete sitemap of all pages and content available on Coffee Logik.',
  alternates: {
    canonical: '/sitemap-html',
  },
};

const mainPages = [
  {
    title: 'Home',
    href: '/',
    icon: HomeIcon,
    description: 'Welcome to Coffee Logik - your coffee knowledge hub'
  },
  {
    title: 'About Us',
    href: '/about',
    icon: InformationCircleIcon,
    description: 'Learn about our mission and coffee expertise'
  },
  {
    title: 'Contact',
    href: '/contact',
    icon: EnvelopeIcon,
    description: 'Get in touch with our coffee experts'
  }
];

const contentPages = [
  {
    title: 'Coffee Blog',
    href: '/blog',
    icon: BookOpenIcon,
    description: 'Expert articles, guides, and coffee insights',
    subPages: [
      { title: 'All Articles', href: '/blog' },
      { title: 'Brewing Methods', href: '/blog/category/brewing-methods' },
      { title: 'Coffee Origins', href: '/blog/category/coffee-origins' },
      { title: 'Equipment Reviews', href: '/blog/category/equipment-reviews' },
      { title: 'Beginner Guides', href: '/blog/category/beginner-guides' }
    ]
  },
  {
    title: 'Coffee Recipes',
    href: '/recipes',
    icon: DocumentTextIcon,
    description: 'Step-by-step brewing recipes for every method',
    subPages: [
      { title: 'All Recipes', href: '/recipes' },
      { title: 'Pour Over Recipes', href: '/recipes?method=pour-over' },
      { title: 'Espresso Recipes', href: '/recipes?method=espresso' },
      { title: 'French Press Recipes', href: '/recipes?method=french-press' }
    ]
  },
  {
    title: 'Brewing Guides',
    href: '/brewing-guides',
    icon: BeakerIcon,
    description: 'Comprehensive brewing tutorials and techniques'
  },
  {
    title: 'Product Reviews',
    href: '/products',
    icon: ShoppingBagIcon,
    description: 'Honest reviews of coffee equipment and gear'
  },
  {
    title: 'Coffee Calculator',
    href: '/calculator',
    icon: CalculatorIcon,
    description: 'Perfect coffee-to-water ratios for any brewing method'
  }
];

const communityPages = [
  {
    title: 'Our Authors',
    href: '/authors',
    icon: UserGroupIcon,
    description: 'Meet our coffee experts and writers'
  },
  {
    title: 'Apply to Write',
    href: '/apply-to-write',
    icon: PencilIcon,
    description: 'Join our team of coffee writers'
  }
];

const resourcePages = [
  {
    title: 'Coffee Glossary',
    href: '/glossary',
    description: 'Complete guide to coffee terminology'
  },
  {
    title: 'FAQ',
    href: '/faq',
    description: 'Frequently asked questions about coffee'
  },
  {
    title: 'Search',
    href: '/search',
    description: 'Find specific coffee content'
  }
];

const legalPages = [
  {
    title: 'Privacy Policy',
    href: '/privacy',
    description: 'How we handle your personal information'
  },
  {
    title: 'Terms of Service',
    href: '/terms',
    description: 'Terms and conditions for using our website'
  },
  {
    title: 'Affiliate Disclosure',
    href: '/affiliate-disclosure',
    description: 'Our affiliate partnerships and disclosures'
  }
];

export default function SitemapPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3 bg-blue-100 rounded-full px-6 py-3">
              <span className="text-2xl">🗺️</span>
              <span className="text-sm font-medium text-blue-700">Website Navigation</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
            Site Map
          </h1>
          <p className="text-lg leading-8 text-gray-600">
            Explore all the coffee knowledge, guides, and resources available on Coffee Logik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main Pages */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <HomeIcon className="h-6 w-6 mr-3 text-blue-600" />
              Main Pages
            </h2>
            <div className="space-y-6">
              {mainPages.map((page) => (
                <div key={page.href} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
                  <Link href={page.href} className="group">
                    <div className="flex items-start">
                      <page.icon className="h-6 w-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                          {page.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{page.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Content Pages */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-3 text-amber-600" />
              Coffee Content
            </h2>
            <div className="space-y-6">
              {contentPages.map((page) => (
                <div key={page.href} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100 hover:shadow-md transition-shadow">
                  <Link href={page.href} className="group block mb-4">
                    <div className="flex items-start">
                      <page.icon className="h-6 w-6 text-amber-600 mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                          {page.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{page.description}</p>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Sub-pages */}
                  {page.subPages && (
                    <div className="ml-10 pt-4 border-t border-amber-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {page.subPages.map((subPage) => (
                          <Link
                            key={subPage.href}
                            href={subPage.href}
                            className="text-sm text-gray-600 hover:text-amber-600 py-1"
                          >
                            → {subPage.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community & Resources */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Community */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <UserGroupIcon className="h-6 w-6 mr-3 text-green-600" />
              Community
            </h2>
            <div className="space-y-4">
              {communityPages.map((page) => (
                <div key={page.href} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                  <Link href={page.href} className="group flex items-start">
                    <page.icon className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600 mb-1">
                        {page.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{page.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <InformationCircleIcon className="h-6 w-6 mr-3 text-purple-600" />
              Resources
            </h2>
            <div className="space-y-4">
              {resourcePages.map((page) => (
                <div key={page.href} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
                  <Link href={page.href} className="group flex items-start">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 mb-1">
                        {page.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{page.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Pages */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-3 text-gray-600" />
            Legal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legalPages.map((page) => (
              <div key={page.href} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Link href={page.href} className="group block">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 mb-2">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{page.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* XML Sitemaps */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">XML Sitemaps for Search Engines</h2>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              For search engines and automated crawlers, we provide XML sitemaps:
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <Link href="/sitemap.xml" className="text-blue-600 hover:text-blue-800 font-mono">
                  /sitemap.xml
                </Link>
                <span className="text-gray-600 ml-2">- Main XML sitemap</span>
              </div>
              <div>
                <Link href="/sitemap-index.xml" className="text-blue-600 hover:text-blue-800 font-mono">
                  /sitemap-index.xml
                </Link>
                <span className="text-gray-600 ml-2">- Sitemap index file</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cannot Find What You Are Looking For?
            </h3>
            <p className="text-gray-600 mb-6">
              Use our search feature to find specific coffee content, or contact us for help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/search" className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                Search Coffee Content
              </Link>
              <Link href="/contact" className="rounded-md border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
