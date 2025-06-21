import Head from 'next/head';
import { getStrapiMedia } from '@/lib/api';

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
  structuredData?: Record<string, any>;
  noindex?: boolean;
}

const defaultSEO = {
  title: 'CoffeeLogik - Expert Coffee Brewing Guides & Reviews',
  description: 'Discover expert coffee brewing guides, detailed equipment reviews, and delicious recipes. Master the art of coffee with CoffeeLogik\'s comprehensive resources.',
  siteName: 'CoffeeLogik',
  domain: 'https://coffeelogik.com',
};

export default function SEO({
  title,
  description = defaultSEO.description,
  canonical,
  ogImage,
  ogType = 'website',
  article,
  structuredData,
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.title;
  const fullCanonical = canonical ? `${defaultSEO.domain}${canonical}` : undefined;
  const fullOgImage = ogImage ? getStrapiMedia(ogImage) : `${defaultSEO.domain}/og-image.jpg`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={fullCanonical} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#d97706" />
      
      {/* Open Graph Tags */}
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {canonical && <meta property="og:url" content={fullCanonical} />}
      
      {/* Article specific Open Graph */}
      {article && ogType === 'article' && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="CoffeeLogik" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
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