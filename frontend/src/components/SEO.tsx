// Removed unused import: getStrapiMedia

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  structuredData?: Record<string, unknown>;
  noindex?: boolean;
}

const defaultSEO = {
  title: 'CoffeeLogik - Expert Coffee Brewing Guides & Reviews',
  description: 'Discover expert coffee brewing guides, detailed equipment reviews, and delicious recipes. Master the art of coffee with CoffeeLogik\'s comprehensive resources.',
  siteName: 'CoffeeLogik',
  domain: 'https://coffeelogik.com',
};

// This component is deprecated in favor of Next.js 13+ metadata API
// It's kept for backward compatibility but should not be used in new code
export default function SEO() {
  // In Next.js 13+ App Router, SEO should be handled via metadata API in page components
  // This component is deprecated and should not be used
  if (process.env.NODE_ENV === 'development') {
    console.warn('SEO component is deprecated. Use Next.js metadata API instead.');
  }
  
  // Return null to avoid rendering anything that could conflict with Server Components
  return null;
}

// Helper function to generate structured data for articles
export function generateArticleStructuredData({
  title,
  description,
  url,
  imageUrl,
  publishedDate,
  modifiedDate,
  authorName,
  categoryName,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedDate?: string;
  modifiedDate?: string;
  authorName?: string;
  categoryName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url,
    "datePublished": publishedDate,
    "dateModified": modifiedDate || publishedDate,
    "author": {
      "@type": "Person",
      "name": authorName || "CoffeeLogik Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CoffeeLogik",
      "logo": {
        "@type": "ImageObject",
        "url": `${defaultSEO.domain}/logo.png`
      }
    },
    "image": imageUrl ? {
      "@type": "ImageObject",
      "url": imageUrl,
      "width": 1200,
      "height": 630
    } : undefined,
    "articleSection": categoryName,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
}

// Helper function to generate structured data for recipes
export function generateRecipeStructuredData({
  name,
  description,
  url,
  imageUrl,
  prepTime,
  totalTime,
  servings,
  ingredients,
  instructions,
  authorName,
}: {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  prepTime?: number;
  totalTime?: number;
  servings?: number;
  ingredients?: string[];
  instructions?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": name,
    "description": description,
    "url": url,
    "image": imageUrl ? [imageUrl] : undefined,
    "prepTime": prepTime ? `PT${prepTime}M` : undefined,
    "totalTime": totalTime ? `PT${totalTime}M` : undefined,
    "recipeYield": servings?.toString(),
    "recipeIngredient": ingredients,
    "recipeInstructions": instructions ? [{
      "@type": "HowToStep",
      "text": instructions
    }] : undefined,
    "author": {
      "@type": "Person",
      "name": authorName || "CoffeeLogik Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CoffeeLogik",
      "logo": {
        "@type": "ImageObject",
        "url": `${defaultSEO.domain}/logo.png`
      }
    }
  };
}