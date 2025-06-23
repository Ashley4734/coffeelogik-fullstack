'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error monitoring service
    console.error('Next.js Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="flex items-center justify-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-400" />
          </div>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Something went wrong
              </h1>
              <p className="mt-1 text-base text-gray-500">
                We apologize for the inconvenience. This might be a temporary issue.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                      Error details (development only)
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 text-xs text-red-600">
                      {error.message}
                      {error.digest && `\nError digest: ${error.digest}`}
                      {error.stack && `\n\nStack trace:\n${error.stack}`}
                    </pre>
                  </details>
                </div>
              )}
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <button
                onClick={reset}
                className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Try again
              </button>
              <a
                href="/"
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Go back home
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}