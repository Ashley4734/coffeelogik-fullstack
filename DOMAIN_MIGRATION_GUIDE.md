# Domain Migration Guide: coffeelogik.com

This guide outlines the necessary steps to migrate from the Tealogik subdomain to the new coffeelogik.com domain.

## 📋 Code Changes Made

### 1. Frontend Configuration Updates
- ✅ Updated `next.config.ts` image domains
- ✅ Updated `src/lib/api.ts` default Strapi URL
- ✅ Updated `src/lib/strapi.ts` default Strapi URL
- ✅ Created `.env.example` with proper domain configuration

### 2. SEO & Metadata
- ✅ All SEO metadata uses `NEXT_PUBLIC_SITE_URL` environment variable
- ✅ Sitemap generation uses the environment variable
- ✅ Structured data uses the environment variable
- ✅ Canonical URLs are dynamically generated

## 🔧 Environment Variables Required

### In Coolify/Docker Environment:
```bash
NEXT_PUBLIC_SITE_URL=https://coffeelogik.com
NEXT_PUBLIC_STRAPI_URL=https://api.coffeelogik.com
STRAPI_API_TOKEN=your-strapi-api-token
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
```

## 🌐 DNS Configuration Needed

### A. Main Website (coffeelogik.com)
- Point `coffeelogik.com` to your Coolify frontend service
- Point `www.coffeelogik.com` to your Coolify frontend service (optional redirect)

### B. API Subdomain (api.coffeelogik.com)
- Point `api.coffeelogik.com` to your Strapi backend service
- Ensure SSL certificate covers both `coffeelogik.com` and `api.coffeelogik.com`

## 📦 Deployment Steps

### 1. Update Environment Variables in Coolify
1. Go to your Coolify dashboard
2. Navigate to your frontend service
3. Update environment variables with the new domain values
4. Redeploy the frontend service

### 2. Update Strapi Configuration
1. Update Strapi's allowed origins to include `https://coffeelogik.com`
2. Update any CORS settings in Strapi
3. Update Strapi's URL configuration if needed

### 3. DNS Setup
1. Configure DNS records to point to your Coolify services
2. Verify SSL certificates are working for both domains
3. Test API connectivity from the new domain

### 4. SEO Migration
1. Set up Google Search Console for coffeelogik.com
2. Add the new sitemap: `https://coffeelogik.com/sitemap.xml`
3. Consider 301 redirects from old domain (if needed)

## 🔍 Testing Checklist

After deployment, verify:

- [ ] Main site loads at `https://coffeelogik.com`
- [ ] All images load correctly from Strapi
- [ ] Blog posts, recipes, and product pages work
- [ ] API calls to Strapi are successful
- [ ] Sitemap is accessible: `https://coffeelogik.com/sitemap.xml`
- [ ] Robots.txt is working: `https://coffeelogik.com/robots.txt`
- [ ] Social sharing shows correct meta tags
- [ ] Google Search Console can crawl the site

## 🚨 Important Notes

1. **Strapi Admin**: Make sure you can still access Strapi admin at `https://api.coffeelogik.com/admin`

2. **Environment Variables**: The code now defaults to the new domain, but setting environment variables is recommended for production.

3. **SSL Certificates**: Ensure SSL is working for both the main domain and API subdomain.

4. **Old Domain**: If you want to redirect the old domain, set up 301 redirects at the DNS/server level.

## 🛠️ Rollback Plan

If issues occur, you can quickly rollback by:
1. Reverting the environment variables to the old domain
2. Redeploying the services
3. The code changes are backwards compatible with environment variable overrides

## 📞 Support

If you encounter issues during migration:
1. Check Coolify logs for frontend service
2. Check Strapi logs for API connectivity
3. Verify DNS propagation with tools like `nslookup` or online DNS checkers