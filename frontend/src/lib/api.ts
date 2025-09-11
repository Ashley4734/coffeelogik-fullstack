import strapi from "./strapi";

// Types for Strapi responses
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface BlogPost {
  id: number;
  documentId?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featured_image?: {
    url: string;
    alternativeText?: string;
  } | null;
  publishedAt?: string;
  reading_time?: number;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  author?: {
    id: number;
    name: string;
    bio?: string;
    avatar?: {
      url: string;
    } | null;
  } | null;
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
    color?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  avatar?: {
    url: string;
  } | null;
  email: string;
  social_links?: Record<string, string>;
  expertise?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoffeeRecipe {
  id: number;
  name: string;
  slug: string;
  description?: string;
  brew_method: string;
  difficulty_level: string;
  prep_time?: number;
  total_time?: number;
  servings: number;
  coffee_amount?: string;
  water_amount?: string;
  grind_size?: string;
  water_temperature?: string;
  ingredients?: Array<{item: string; amount?: string}> | string[];
  instructions: string;
  tips?: string;
  featured_image?: {
    url: string;
  } | null;
  equipment_needed?: Array<{item: string; essential?: boolean}> | string[];
  featured: boolean;
  author?: Author | null;
  createdAt: string;
  updatedAt: string;
}

export interface CoffeeProduct {
  id: number;
  name: string;
  slug: string;
  brand: string;
  product_type: string;
  origin?: string;
  roast_level?: string;
  flavor_notes?: string[];
  description?: string;
  price?: number;
  rating?: number;
  pros?: string[];
  cons?: string[];
  images?: Array<{
    url: string;
  }>;
  affiliate_link?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrewingGuide {
  id: number;
  title: string;
  slug: string;
  method: string;
  difficulty_level: string;
  prep_time?: number;
  total_time?: number;
  servings: number;
  description?: string;
  overview?: string;
  equipment?: string[];
  ingredients?: string[];
  steps: string;
  tips?: string;
  featured_image?: {
    url: string;
  } | null;
  step_images?: Array<{
    url: string;
  }>;
  featured: boolean;
  author?: Author | null;
  createdAt: string;
  updatedAt: string;
}

// API functions
export async function getBlogPosts(options: {
  featured?: boolean;
  limit?: number;
  populate?: string[];
} = {}) {
  try {
    const params = new URLSearchParams();
    
    if (options.featured) {
      params.append("filters[featured][$eq]", "true");
    }
    
    if (options.limit) {
      params.append("pagination[limit]", options.limit.toString());
    }
    
    // Default populate
    const populate = options.populate || ["author.avatar", "categories", "featured_image"];
    populate.forEach(field => {
      params.append("populate[]", field);
    });
    
    params.append("sort[0]", "publishedAt:desc");
    
    const response = await strapi.get(`/blog-posts?${params.toString()}`);
    return response.data as StrapiResponse<BlogPost>;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
  }
}

export async function getBlogPost(slug: string) {
  try {
    const params = new URLSearchParams();
    params.append("filters[slug][$eq]", slug);
    params.append("populate[]", "author.avatar");
    params.append("populate[]", "categories");
    params.append("populate[]", "featured_image");
    
    const response = await strapi.get(`/blog-posts?${params.toString()}`);
    const data = response.data as StrapiResponse<BlogPost>;
    
    if (data.data.length === 0) {
      throw new Error(`Blog post not found: ${slug}`);
    }
    
    return data.data[0];
  } catch (error) {
    // Only log errors in development to reduce console spam in production
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching blog post "${slug}":`, error);
    }
    throw error;
  }
}

export async function getRecipes(options: {
  featured?: boolean;
  limit?: number;
  brewMethod?: string;
  difficulty?: string;
} = {}) {
  try {
    const params = new URLSearchParams();
    
    if (options.featured) {
      params.append("filters[featured][$eq]", "true");
    }
    
    if (options.brewMethod && options.brewMethod !== "All Methods") {
      params.append("filters[brew_method][$eq]", options.brewMethod);
    }
    
    if (options.difficulty && options.difficulty !== "All Levels") {
      params.append("filters[difficulty_level][$eq]", options.difficulty);
    }
    
    if (options.limit) {
      params.append("pagination[limit]", options.limit.toString());
    }
    
    params.append("populate[]", "featured_image");
    params.append("populate[]", "author");
    params.append("sort[0]", "publishedAt:desc");
    
    const response = await strapi.get(`/coffee-recipes?${params.toString()}`);
    return response.data as StrapiResponse<CoffeeRecipe>;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
  }
}

export async function getRecipe(slug: string) {
  try {
    const params = new URLSearchParams();
    params.append("filters[slug][$eq]", slug);
    params.append("populate[]", "featured_image");
    params.append("populate[]", "step_images");
    params.append("populate[]", "author");
    
    const response = await strapi.get(`/coffee-recipes?${params.toString()}`);
    const data = response.data as StrapiResponse<CoffeeRecipe>;
    
    if (data.data.length === 0) {
      throw new Error("Recipe not found");
    }
    
    return data.data[0];
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }
}

export async function getProducts(options: {
  featured?: boolean;
  limit?: number;
  productType?: string;
} = {}) {
  try {
    const params = new URLSearchParams();
    
    if (options.featured) {
      params.append("filters[featured][$eq]", "true");
    }
    
    if (options.productType && options.productType !== "All Products") {
      params.append("filters[product_type][$eq]", options.productType);
    }
    
    if (options.limit) {
      params.append("pagination[limit]", options.limit.toString());
    }
    
    params.append("populate[]", "images");
    params.append("sort[0]", "publishedAt:desc");
    
    const response = await strapi.get(`/coffee-products?${params.toString()}`);
    return response.data as StrapiResponse<CoffeeProduct>;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
  }
}

export async function getProduct(slug: string) {
  try {
    const params = new URLSearchParams();
    params.append("filters[slug][$eq]", slug);
    params.append("populate[]", "images");
    
    const response = await strapi.get(`/coffee-products?${params.toString()}`);
    const data = response.data as StrapiResponse<CoffeeProduct>;
    
    if (data.data.length === 0) {
      throw new Error("Product not found");
    }
    
    return data.data[0];
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function getAuthors() {
  try {
    const params = new URLSearchParams();
    params.append("populate[]", "avatar");
    
    const response = await strapi.get(`/authors?${params.toString()}`);
    return response.data as StrapiResponse<Author>;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const response = await strapi.get("/categories");
    return response.data as StrapiResponse<Category>;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
  }
}

export async function getBrewingGuides(options: {
  featured?: boolean;
  limit?: number;
  method?: string;
  difficulty?: string;
} = {}) {
  try {
    const params = new URLSearchParams();
    
    if (options.featured) {
      params.append("filters[featured][$eq]", "true");
    }
    
    if (options.method && options.method !== "All Methods") {
      params.append("filters[method][$eq]", options.method);
    }
    
    if (options.difficulty && options.difficulty !== "All Levels") {
      params.append("filters[difficulty_level][$eq]", options.difficulty);
    }
    
    if (options.limit) {
      params.append("pagination[limit]", options.limit.toString());
    }
    
    params.append("populate[]", "featured_image");
    params.append("populate[]", "author");
    params.append("sort[0]", "publishedAt:desc");
    
    const response = await strapi.get(`/brewing-guides?${params.toString()}`);
    return response.data as StrapiResponse<BrewingGuide>;
  } catch (error) {
    console.error("Error fetching brewing guides:", error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
  }
}

export async function getBrewingGuide(slug: string) {
  try {
    const params = new URLSearchParams();
    params.append("filters[slug][$eq]", slug);
    params.append("populate[]", "featured_image");
    params.append("populate[]", "step_images");
    params.append("populate[]", "author");
    
    const response = await strapi.get(`/brewing-guides?${params.toString()}`);
    const data = response.data as StrapiResponse<BrewingGuide>;
    
    if (data.data.length === 0) {
      throw new Error(`Brewing guide not found: ${slug}`);
    }
    
    return data.data[0];
  } catch (error) {
    // Only log errors in development to reduce console spam
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching brewing guide "${slug}":`, error);
    }
    throw error;
  }
}

// Helper function to get full image URL
export function getStrapiMedia(url: string | undefined): string {
  if (!url) return "/placeholder-image.jpg";
  
  if (url.startsWith("http")) {
    return url;
  }
  
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "https://api.coffeelogik.com";
  return `${strapiUrl}${url}`;
}

// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// Helper function to calculate reading time
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(" ").length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
