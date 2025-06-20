export const revalidate = 60; // Revalidate every 60 seconds

import { getBlogPosts, getCategories } from "@/lib/api";
import BlogContent from "@/components/BlogContent";

export default async function BlogPage() {
  // Fetch blog posts and categories from Strapi
  let blogPosts: import("@/lib/api").BlogPost[] = [];
  let categories: import("@/lib/api").Category[] = [];

  try {
    const [postsResponse, categoriesResponse] = await Promise.all([
      getBlogPosts({ limit: 50 }),
      getCategories()
    ]);
    
    blogPosts = Array.isArray(postsResponse?.data) ? postsResponse.data : [];
    const strapiCategories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];
    categories = [{ id: 0, name: "All", slug: "all" } as import("@/lib/api").Category, ...strapiCategories];
  } catch (error) {
    console.error('Error fetching blog data:', error);
    // Fallback to just the "All" category if Strapi is not available
    categories = [{ id: 0, name: "All", slug: "all" } as import("@/lib/api").Category];
  }
  return (
    <div className="bg-white">
      <BlogContent initialPosts={blogPosts} categories={categories} />
    </div>
  );
}