export const revalidate = 60; // Revalidate every 60 seconds

import Link from "next/link";
import { UserIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { getAuthors, getStrapiMedia } from "@/lib/api";

export default async function AuthorsPage() {
  // Fetch authors from Strapi
  let authors: import("@/lib/api").Author[] = [];

  try {
    const authorsResponse = await getAuthors();
    authors = Array.isArray(authorsResponse?.data) ? authorsResponse.data : [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    // Fallback to empty array if Strapi is not available
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair">
            Coffee Experts & Writers
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Meet the passionate coffee professionals who share their knowledge, experiences, and expertise with our community.
          </p>
        </div>

        {/* Authors Grid */}
        <div className="mx-auto mt-20">
          {authors.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {authors.map((author) => (
                <div key={author.id} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Author Image */}
                  <div className="aspect-square w-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    {author.avatar ? (
                      <img
                        src={getStrapiMedia(author.avatar.url)}
                        alt={author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-24 w-24 text-amber-600" />
                    )}
                  </div>
                  
                  <div className="p-6">
                    {/* Name & Expertise */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                        <Link href={`/authors/${author.slug}`}>
                          <span className="absolute inset-0" />
                          {author.name}
                        </Link>
                      </h3>
                      {author.expertise && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600">
                          {author.expertise}
                        </span>
                      )}
                    </div>
                    
                    {/* Bio */}
                    {author.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {author.bio}
                      </p>
                    )}
                    
                    {/* Email */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <ChatBubbleLeftRightIcon className="mr-2 h-4 w-4" />
                      <span>{author.email}</span>
                    </div>
                    
                    {/* Social Links */}
                    {author.social_links && typeof author.social_links === 'object' && Object.keys(author.social_links).length > 0 && (
                      <div className="flex gap-3 mt-4">
                        {Object.entries(author.social_links).map(([platform, url]) => (
                          <Link
                            key={platform}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium capitalize"
                          >
                            {platform}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No authors yet</h3>
              <p className="text-gray-600 mb-6">Create some author profiles in Strapi to see them here.</p>
              <Link href={`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin`} target="_blank" className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                Go to Strapi Admin
              </Link>
            </div>
          )}
        </div>

        {/* CTA Section */}
        {authors.length > 0 && (
          <div className="mx-auto mt-20 max-w-2xl text-center bg-amber-50 rounded-3xl p-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              Join Our Team
            </h2>
            <p className="text-gray-600 mb-6">
              Are you a coffee expert? We&apos;re always looking for passionate writers to share their knowledge with our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/apply-to-write" className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 text-center">
                Apply to Write
              </Link>
              <Link href="/blog" className="rounded-md border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50">
                Read Our Articles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}