import Link from 'next/link';

const footerNavigation = {
  coffee: [
    { name: 'Blog', href: '/blog' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Product Reviews', href: '/products' },
    { name: 'Brewing Guides', href: '/brewing-guides' },
  ],
  company: [
    { name: 'Authors', href: '/authors' },
    { name: 'All Guides', href: '/brewing-guides' },
    { name: 'Coffee Tips', href: '/blog' },
    { name: 'Equipment Reviews', href: '/products' },
  ],
  social: [
    { name: 'Instagram', href: '#', icon: '📸' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'YouTube', href: '#', icon: '📺' },
    { name: 'Pinterest', href: '#', icon: '📌' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-amber-50 border-t border-amber-100">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">☕</span>
              <span className="text-2xl font-bold text-amber-800">Coffee Logik</span>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              Your ultimate destination for coffee knowledge, recipes, and reviews. 
              From bean to cup, we&apos;re here to enhance your coffee journey.
            </p>
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-amber-600 transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="sr-only">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Coffee</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.coffee.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-amber-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-amber-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-1">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Subscribe to our newsletter</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Get the latest coffee tips, recipes, and product reviews delivered to your inbox.
                </p>
                <div className="mt-6 sm:flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    required
                    className="w-full min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                    placeholder="Enter your email"
                  />
                  <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-amber-200 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-500">
              &copy; 2024 Coffee Logik. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              <Link href="/privacy" className="text-xs leading-5 text-gray-500 hover:text-gray-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs leading-5 text-gray-500 hover:text-gray-600">
                Terms of Service
              </Link>
              <Link href="/affiliate-disclosure" className="text-xs leading-5 text-gray-500 hover:text-gray-600">
                Affiliate Disclosure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}