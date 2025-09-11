// frontend/src/app/not-found.tsx
import Link from 'next/link';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="flex items-center justify-center">
            <div className="text-8xl sm:text-9xl">☕</div>
          </div>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-amber-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair">
                404 - Page Not Found
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Looks like this page got lost in the coffee grind! The page you&apos;re looking for doesn&apos;t exist.
              </p>
              <p className="mt-2 text-base text-gray-500">
                But don&apos;t worry, there&apos;s plenty of great coffee content to explore.
              </p>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Go back home
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                Browse articles
              </Link>
            </div>
            
            {/* Quick Links */}
            <div className="mt-8 sm:border-l sm:border-transparent sm:pl-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Popular Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/recipes" className="text-sm text-amber-600 hover:text-amber-700">
                    Coffee Recipes
                  </Link>
                </li>
                <li>
                  <Link href="/brewing-guides" className="text-sm text-amber-600 hover:text-amber-700">
                    Brewing Guides
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm text-amber-600 hover:text-amber-700">
                    Product Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="text-sm text-amber-600 hover:text-amber-700">
                    Coffee Calculator
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
