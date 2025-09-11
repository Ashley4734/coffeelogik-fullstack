import Link from "next/link";
import { ArrowLeftIcon, ClockIcon, CalendarIcon, UserIcon, ShareIcon, BookmarkIcon } from "@heroicons/react/24/outline";
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
  console.log('Blog post ID:', id);

  let blogPost: import("@/lib/api").BlogPost | null = null;
  let relatedPosts: import("@/lib/api").BlogPost[] = [];

  try {
    blogPost = await getBlogPost(id);
    const relatedResponse = await getBlogPosts({ limit: 3 });
    relatedPosts = relatedResponse.data.filter(post => post.id !== blogPost?.id).slice(0, 3);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }

  if (!blogPost) {
    notFound();
  }

  const postData = blogPost;
  const showAmazonDisclaimer = hasAmazonLinks(postData.content);
  
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
      
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-16 left-1/2 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
          {/* Navigation */}
          <div className="mb-12">
            <Link
              href="/blog"
              className="group inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800 transition-all duration-200 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            {/* Category Badge */}
            {postData.categories?.[0] && (
              <div className="mb-8">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-lg">
                  {postData.categories[0].name}
                </span>
              </div>
            )}
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 font-playfair mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-amber-800 to-orange-800 bg-clip-text text-transparent">
                {postData.title}
              </span>
            </h1>
            
            {/* Excerpt */}
            <p className="text-xl md:text-2xl leading-relaxed text-gray-700 mb-12 max-w-3xl mx-auto">
              {postData.excerpt || postData.content.substring(0, 200) + '...'}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <UserIcon className="mr-2 h-4 w-4 text-amber-600" />
                <span className="font-medium">{postData.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <CalendarIcon className="mr-2 h-4 w-4 text-amber-600" />
                <time dateTime={postData.publishedAt} className="font-medium">
                  {postData.publishedAt ? formatDate(postData.publishedAt) : 'No date'}
                </time>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <ClockIcon className="mr-2 h-4 w-4 text-amber-600" />
                <span className="font-medium">
                  {postData.reading_time ? `${postData.reading_time} min read` : calculateReadingTime(postData.content)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-4xl">
            {/* Featured Image with Overlay */}
            <div className="relative mb-16 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative">
                {postData.featured_image ? (
                  <img
                    src={getStrapiMedia(postData.featured_image.url)}
                    alt={postData.featured_image.alternativeText || postData.title}
                    className="aspect-[16/9] w-full rounded-2xl object-cover shadow-2xl"
                  />
                ) : (
                  <div className="aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 flex items-center justify-center shadow-2xl">
                    <span className="text-9xl">☕</span>
                  </div>
                )}
                
                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110">
                    <ShareIcon className="h-5 w-5 text-gray-700" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110">
                    <BookmarkIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Amazon Disclaimer */}
            {showAmazonDisclaimer && (
              <div className="mb-12">
                <AmazonDisclaimer />
              </div>
            )}

            {/* Article Content */}
            <article className="relative">
              {/* Progress Bar */}
              <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out" style={{width: '0%'}}></div>
              </div>

              <div 
                className="prose prose-lg prose-amber max-w-none
                  prose-headings:font-playfair prose-headings:text-gray-900
                  prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-amber-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-amber-700
                  prose-blockquote:border-l-4 prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: marked(postData.content) }}
              />
            </article>

            {/* Enhanced Author Bio */}
            {postData.author && (
              <div className="mt-20 p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-100">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                      {postData.author.avatar ? (
                        <img
                          src={getStrapiMedia(postData.author.avatar.url)}
                          alt={postData.author.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {postData.author.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 font-playfair">{postData.author.name}</h3>
                      <span className="text-sm text-amber-600 font-medium bg-amber-100 px-3 py-1 rounded-full">Author</span>
                    </div>
                    {postData.author.bio && (
                      <p className="text-gray-700 leading-relaxed">{postData.author.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mx-auto max-w-7xl mt-32">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-playfair mb-4">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Continue Reading
                  </span>
                </h2>
                <p className="text-xl text-gray-600">Discover more coffee insights and brewing tips</p>
              </div>
              
              <div className="grid gap-8 lg:grid-cols-3">
                {relatedPosts.map((post, index) => (
                  <article key={post.id} className="group relative">
                    {/* Floating card effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                    
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                      {/* Image */}
                      <div className="aspect-[16/9] w-full overflow-hidden">
                        {post.featured_image ? (
                          <img
                            src={getStrapiMedia(post.featured_image.url)}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <span className="text-6xl">☕</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            Article {index + 1}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.reading_time ? `${post.reading_time} min read` : calculateReadingTime(post.content)}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 mb-3 font-playfair transition-colors duration-200">
                          <Link href={`/blog/${post.slug}`} className="block">
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {post.excerpt || post.content.substring(0, 120) + '...'}
                        </p>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors duration-200"
                        >
                          Read more
                          <ArrowLeftIcon className="ml-1 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
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
