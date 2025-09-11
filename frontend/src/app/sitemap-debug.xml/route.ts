// frontend/src/app/sitemap-debug.xml/route.ts
import { NextResponse } from 'next/server';

type DebugInfo = {
  timestamp: string;
  env: {
    NODE_ENV?: string;
    STRAPI_URL?: string;
    HAS_API_TOKEN: boolean;
    BASE_URL: string;
  };
  apiTest: string;
  error: string | null;
};

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com';

  const debugInfo: DebugInfo = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
      HAS_API_TOKEN: !!process.env.STRAPI_API_TOKEN,
      BASE_URL: baseUrl,
    },
    apiTest: 'not_tested',
    error: null,
  };

  try {
    // Test API connection
    const strapi = (await import('@/lib/strapi')).default;
    const response = await strapi.get('/blog-posts?pagination[limit]=1');
    debugInfo.apiTest = `success - ${response.data?.data?.length || 0} posts found`;
  } catch (err: unknown) {
    debugInfo.apiTest = 'failed';
    if (err instanceof Error) {
      debugInfo.error = err.message;
    } else {
      debugInfo.error = String(err);
    }
  }

  const debugSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- DEBUG INFO:
${JSON.stringify(debugInfo, null, 2)}
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${debugInfo.timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${debugInfo.timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  return new NextResponse(debugSitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
