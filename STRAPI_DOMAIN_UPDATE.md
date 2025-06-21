# Strapi Backend Domain Update Guide

## 🔧 Required Strapi Environment Variables

Add these environment variables to your Strapi backend service in Coolify:

### **Critical Environment Variables:**
```bash
# Server Configuration
HOST=0.0.0.0
PORT=1337

# Domain Configuration
STRAPI_URL=https://api.coffeelogik.com
FRONTEND_URL=https://coffeelogik.com

# CORS Configuration (if needed)
CORS_ORIGIN=https://coffeelogik.com,https://www.coffeelogik.com

# Keep your existing security keys
APP_KEYS=your-existing-app-keys
API_TOKEN_SALT=your-existing-token-salt
ADMIN_JWT_SECRET=your-existing-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-existing-transfer-token-salt
JWT_SECRET=your-existing-jwt-secret
ENCRYPTION_KEY=your-existing-encryption-key
```

## 📝 Configuration Files to Update

### 1. Update CORS Configuration (if needed)
If you experience CORS issues, update `/config/middlewares.ts`:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://coffeelogik.com',
            'https://api.coffeelogik.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://coffeelogik.com',
            'https://api.coffeelogik.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      header: '*',
      origin: [
        'https://coffeelogik.com',
        'https://www.coffeelogik.com',
        'http://localhost:3000', // for development
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 2. Update Server Configuration (if needed)
Your `/config/server.ts` should remain the same:

```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('STRAPI_URL'), // This will use the environment variable
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
```

## 🚀 Deployment Steps in Coolify

### 1. Update Environment Variables
1. Go to your Coolify dashboard
2. Navigate to your Strapi backend service
3. Go to "Environment" tab
4. Add/update the environment variables listed above
5. **Important**: Keep all your existing security keys (APP_KEYS, JWT_SECRET, etc.)

### 2. Update Domain Settings
1. In Coolify, go to your Strapi service settings
2. Update the domain from `y0o4w84ckoockck8o0ss8s48.tealogik.com` to `api.coffeelogik.com`
3. Ensure SSL certificate is configured for the new domain

### 3. Redeploy the Service
1. Click "Redeploy" in Coolify
2. Monitor the deployment logs for any errors
3. Verify the service starts successfully

## 🔍 Testing After Deployment

### Test these endpoints:
1. **Admin Access**: `https://api.coffeelogik.com/admin`
2. **API Health**: `https://api.coffeelogik.com/api/blog-posts`
3. **Image Uploads**: Verify images load from the new domain
4. **CORS**: Test frontend can fetch data from new API domain

### Verify in Frontend:
1. Check that blog posts load
2. Check that recipes load
3. Check that product reviews load
4. Verify images display correctly

## 📊 Database Considerations

### Your database should NOT need changes because:
- Content URLs in Strapi are typically relative (`/uploads/...`)
- The `getStrapiMedia()` function in frontend handles URL construction
- Database content remains domain-agnostic

### However, if you have hardcoded URLs in content:
1. Check blog posts for any hardcoded old domain references
2. Update any absolute URLs in your content manually through Strapi admin

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Add CORS_ORIGIN environment variable
   - Update middlewares.ts CORS configuration

2. **Images Not Loading**
   - Verify Next.js image domains in frontend
   - Check Strapi public folder permissions

3. **Admin Panel Not Accessible**
   - Check STRAPI_URL environment variable
   - Verify SSL certificate for api.coffeelogik.com

4. **API Not Responding**
   - Check Coolify logs
   - Verify PORT and HOST environment variables
   - Test direct API endpoint access

### Quick Rollback:
If issues occur, you can quickly rollback by:
1. Reverting domain in Coolify to old tealogik subdomain
2. Removing new environment variables
3. Redeploying the service

## 📱 Strapi Admin URL

After migration, access your Strapi admin at:
**https://api.coffeelogik.com/admin**

## 🔄 API Endpoints

Your API endpoints will change from:
- `https://y0o4w84ckoockck8o0ss8s48.tealogik.com/api/blog-posts`

To:
- `https://api.coffeelogik.com/api/blog-posts`

The frontend code is already updated to handle this change via environment variables.