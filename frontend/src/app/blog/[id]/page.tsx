import Link from "next/link";
import { ArrowLeftIcon, ClockIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import { getBlogPost, getBlogPosts, getStrapiMedia, calculateReadingTime, formatDate } from "@/lib/api";
import { notFound } from "next/navigation";
import { marked } from "marked";
import AmazonDisclaimer from "@/components/AmazonDisclaimer";
import { hasAmazonLinks } from "@/lib/amazon";
import { Metadata } from "next";
import { generateArticleStructuredData } from "@/components/SEO";

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const blogPost = await getBlogPost(id);
    const imageUrl = blogPost.featured_image ? getStrapiMedia(blogPost.featured_image.url) : null;
    const url = `/blog/${blogPost.slug || id}`;
    
    return {
      title: blogPost.meta_title || blogPost.title,
      description: blogPost.meta_description || blogPost.excerpt || blogPost.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      keywords: blogPost.categories?.map(cat => cat.name).join(', '),
      authors: blogPost.author ? [{ name: blogPost.author.name }] : undefined,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: blogPost.title,
        description: blogPost.excerpt || blogPost.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        url: url,
        type: 'article',
        publishedTime: blogPost.publishedAt,
        modifiedTime: blogPost.updatedAt,
        authors: blogPost.author ? [blogPost.author.name] : undefined,
        section: blogPost.categories?.[0]?.name,
        tags: blogPost.categories?.map(cat => cat.name),
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blogPost.featured_image?.alternativeText || blogPost.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: blogPost.title,
        description: blogPost.excerpt || blogPost.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for blog post:', error);
    return {
      title: 'Blog Post - CoffeeLogik',
      description: 'Discover expert coffee insights and brewing tips.',
    };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // In a real app, you would use the id to fetch the specific blog post from Strapi
  console.log('Blog post ID:', id);

  let blogPost: import("@/lib/api").BlogPost | null = null;
  let relatedPosts: import("@/lib/api").BlogPost[] = [];

  try {
    // Fetch the specific blog post by slug
    blogPost = await getBlogPost(id);
    
    // Fetch related posts (same category, excluding current post)
    const relatedResponse = await getBlogPosts({ limit: 3 });
    relatedPosts = relatedResponse.data.filter(post => post.id !== blogPost?.id).slice(0, 3);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }

  if (!blogPost) {
    notFound();
  }

  // Use actual data from Strapi - flat structure in v5
  const postData = blogPost;
  
  // Check if the post content contains Amazon links
  const showAmazonDisclaimer = hasAmazonLinks(postData.content);
  
  // Generate structured data for the article
  const structuredData = generateArticleStructuredData({
    title: postData.title,
    description: postData.excerpt || postData.content.substring(0, 160).replace(/<[^>]*>/g, ''),
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com'}/blog/${postData.slug || id}`,
    imageUrl: postData.featured_image ? getStrapiMedia(postData.featured_image.url) : undefined,
    publishedDate: postData.publishedAt,
    modifiedDate: postData.updatedAt,
    authorName: postData.author?.name,
    categoryName: postData.categories?.[0]?.name,
  });
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              {postData.categories?.[0] && (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600">
                  {postData.categories[0].name}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
              {postData.title}
            </h1>
            
            <p className="text-xl leading-8 text-gray-600 mb-8">
              {postData.excerpt || postData.content.substring(0, 200) + '...'}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-8">
              <div className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>{postData.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <time dateTime={postData.publishedAt}>
                  {postData.publishedAt ? formatDate(postData.publishedAt) : 'No date'}
                </time>
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4" />
                <span>{postData.reading_time ? `${postData.reading_time} min read` : calculateReadingTime(postData.content)}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-12">
            {postData.featured_image ? (
              <img
                src={getStrapiMedia(postData.featured_image.url)}
                alt={postData.featured_image.alternativeText || postData.title}
                className="aspect-[2/1] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="aspect-[2/1] w-full rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <span className="text-8xl">☕</span>
              </div>
            )}
          </div>

          {/* Amazon Disclaimer */}
          {showAmazonDisclaimer && <AmazonDisclaimer />}

          {/* Content */}
          <div 
            className="prose prose-amber max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(postData.content) }}
          />

          {/* Author Bio */}
          {postData.author && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {postData.author.avatar ? (
                    <img
                      src={getStrapiMedia(postData.author.avatar.url)}
                      alt={postData.author.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-amber-800">
                      {postData.author.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{postData.author.name}</h3>
                  {postData.author.bio && (
                    <p className="text-gray-600 mt-1">{postData.author.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mx-auto max-w-7xl mt-24">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12 font-playfair">
              Related Articles
            </h2>
            <div className="grid gap-8 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <article key={post.id} className="group">
                  <div className="aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6">
                    {post.featured_image ? (
                      <img
                        src={getStrapiMedia(post.featured_image.url)}
                        alt={post.title}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-4xl">☕</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {post.excerpt || post.content.substring(0, 100) + '...'}
                  </p>
                  <span className="text-xs text-gray-500">
                    {post.reading_time ? `${post.reading_time} min read` : calculateReadingTime(post.content)}
                  </span>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}