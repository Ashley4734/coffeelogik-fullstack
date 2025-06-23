'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Application Error
                  </h1>
                  <p className="mt-1 text-base text-gray-500">
                    A critical error occurred. Please refresh the page or try again later.
                  </p>
                  {process.env.NODE_ENV === 'development' && error && (
                    <div className="mt-4">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                          Error details (development only)
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 text-xs text-red-600">
                          {error.message}
                          {error.digest && `\nError digest: ${error.digest}`}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <button
                    onClick={reset}
                    className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700"
                  >
                    Try again
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Go to homepage
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}