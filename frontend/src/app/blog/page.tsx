export const revalidate = 60; // Revalidate every 60 seconds

import { getBlogPosts, getCategories } from "@/lib/api";
import BlogContent from "@/components/BlogContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Coffee Blog - Expert Tips, Reviews & Brewing Guides',
  description: 'Discover expert coffee insights, detailed equipment reviews, brewing tips, and industry news. Stay updated with the latest in coffee culture and techniques.',
  keywords: 'coffee blog, coffee reviews, brewing tips, coffee news, coffee culture, barista tips, coffee equipment',
  openGraph: {
    title: 'Coffee Blog - Expert Tips, Reviews & Brewing Guides',
    description: 'Discover expert coffee insights, detailed equipment reviews, brewing tips, and industry news.',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  // Fetch blog posts and categories from Strapi
  let blogPosts: import("@/lib/api").BlogPost[] = [];
  let categories: import("@/lib/api").Category[] = [];
  let totalPosts = 0;

  try {
    const [postsResponse, categoriesResponse] = await Promise.all([
      getBlogPosts({ limit: 50 }),
      getCategories()
    ]);
    
    blogPosts = Array.isArray(postsResponse?.data) ? postsResponse.data : [];
    totalPosts = postsResponse?.meta?.pagination?.total || blogPosts.length;
    const strapiCategories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];
    categories = [{ id: 0, name: "All", slug: "all" } as import("@/lib/api").Category, ...strapiCategories];
  } catch (error) {
    console.error('Error fetching blog data:', error);
    // Fallback to just the "All" category if Strapi is not available
    categories = [{ id: 0, name: "All", slug: "all" } as import("@/lib/api").Category];
  }
  return (
    <div className="bg-white">
      <BlogContent initialPosts={blogPosts} categories={categories} initialLimit={50} totalPosts={totalPosts} />
    </div>
  );
}