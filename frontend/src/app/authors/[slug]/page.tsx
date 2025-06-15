import Link from "next/link";
import { ArrowLeftIcon, UserIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { getAuthors, getBlogPosts, getStrapiMedia, formatDate } from "@/lib/api";
import { notFound } from "next/navigation";

async function getAuthorBySlug(slug: string) {
  try {
    const authorsResponse = await getAuthors();
    const authors = Array.isArray(authorsResponse?.data) ? authorsResponse.data : [];
    return authors.find(author => author.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
}

async function getAuthorPosts(authorId: number) {
  try {
    const postsResponse = await getBlogPosts({ limit: 50 });
    const posts = Array.isArray(postsResponse?.data) ? postsResponse.data : [];
    return posts.filter(post => post.author?.id === authorId);
  } catch (error) {
    console.error('Error fetching author posts:', error);
    return [];
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const author = await getAuthorBySlug(slug);
  
  if (!author) {
    notFound();
  }

  const authorPosts = await getAuthorPosts(author.id);

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/authors"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Authors
          </Link>
        </div>

        {/* Author Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start gap-8">
            {/* Author Image */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
                {author.avatar ? (
                  <img
                    src={getStrapiMedia(author.avatar.url)}
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-16 w-16 text-amber-600" />
                )}
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-playfair mb-2">
                  {author.name}
                </h1>
                {author.expertise && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-600">
                    {author.expertise}
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <ChatBubbleLeftRightIcon className="mr-2 h-4 w-4" />
                  <span>{author.email}</span>
                </div>
                {authorPosts.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DocumentTextIcon className="mr-2 h-4 w-4" />
                    <span>{authorPosts.length} article{authorPosts.length !== 1 ? 's' : ''} published</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {author.social_links && typeof author.social_links === 'object' && Object.keys(author.social_links).length > 0 && (
                <div className="flex gap-4">
                  {Object.entries(author.social_links).map(([platform, url]) => (
                    <Link
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 capitalize"
                    >
                      {platform}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Author Bio */}
        {author.bio && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {author.name}</h2>
            <div className="prose prose-amber prose-lg max-w-none">
              <p className="text-gray-600 leading-7">{author.bio}</p>
            </div>
          </div>
        )}

        {/* Author Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Articles by {author.name}
            {authorPosts.length > 0 && (
              <span className="ml-2 text-lg font-normal text-gray-500">({authorPosts.length})</span>
            )}
          </h2>

          {authorPosts.length > 0 ? (
            <div className="space-y-8">
              {authorPosts.map((post) => (
                <article key={post.id} className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Article Image */}
                    <div className="flex-shrink-0">
                      <div className="h-32 w-full sm:w-48 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
                        {post.featured_image ? (
                          <img
                            src={getStrapiMedia(post.featured_image.url)}
                            alt={post.featured_image.alternativeText || post.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl">☕</span>
                        )}
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                          </div>
                          {post.reading_time && (
                            <span>{post.reading_time} min read</span>
                          )}
                          {post.categories?.[0] && (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                              {post.categories[0].name}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                          <Link href={`/blog/${post.slug}`}>
                            <span className="absolute inset-0" />
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 line-clamp-2">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600">
                {author.name} hasn't published any articles yet. Check back soon for new content!
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-amber-50 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
            Explore More Coffee Content
          </h2>
          <p className="text-gray-600 mb-6">
            Discover articles from our other coffee experts or browse our brewing guides and recipes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/blog" className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
              Browse All Articles
            </Link>
            <Link href="/authors" className="rounded-md border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50">
              Meet Other Authors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}