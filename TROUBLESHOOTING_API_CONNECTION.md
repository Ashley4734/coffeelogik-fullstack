# Troubleshooting: Strapi Content Not Showing on Frontend

## 🔍 Quick Diagnostic Steps

### 1. Check Current Environment Variables
In your Coolify frontend service, verify these environment variables are set:

```bash
NEXT_PUBLIC_STRAPI_URL=https://api.coffeelogik.com
NEXT_PUBLIC_SITE_URL=https://coffeelogik.com
```

### 2. Test API Accessibility
Try accessing these URLs directly in your browser:

- **Strapi Admin**: https://api.coffeelogik.com/admin
- **API Health**: https://api.coffeelogik.com/api/blog-posts
- **Old Domain (if still working)**: https://y0o4w84ckoockck8o0ss8s48.tealogik.com/api/blog-posts

### 3. Check Frontend Diagnostic
The homepage now has a yellow diagnostic box that shows:
- Current Strapi URL being used
- API connection test results
- Environment variables status
- Detailed error messages

## 🚨 Common Issues & Solutions

### Issue 1: Domain Not Configured Yet
**Symptoms**: SSL errors, connection timeouts
**Solution**: You may still need to set up the `api.coffeelogik.com` domain in Coolify

**Quick Fix**: Temporarily revert to old domain
```bash
# In Coolify frontend environment variables:
NEXT_PUBLIC_STRAPI_URL=https://y0o4w84ckoockck8o0ss8s48.tealogik.com
```

### Issue 2: CORS Errors
**Symptoms**: "Access to fetch blocked by CORS policy"
**Solution**: Check Strapi CORS configuration

**Quick Fix**: Add to Strapi environment variables:
```bash
CORS_ORIGIN=https://coffeelogik.com,https://www.coffeelogik.com
```

### Issue 3: Environment Variables Not Set
**Symptoms**: Diagnostic shows "Not set (using default)"
**Solution**: Add environment variables in Coolify

### Issue 4: SSL Certificate Issues
**Symptoms**: SSL/TLS errors, certificate warnings
**Solution**: Ensure SSL is properly configured for api.coffeelogik.com

### Issue 5: Strapi Service Down
**Symptoms**: Connection refused, 502/503 errors
**Solution**: Check Strapi service status in Coolify

## 🛠️ Step-by-Step Fixes

### Fix 1: Verify Strapi is Running
1. Go to Coolify dashboard
2. Check your Strapi service status
3. Look at service logs for any errors
4. Try restarting the service if needed

### Fix 2: Check Domain Configuration
1. Verify `api.coffeelogik.com` points to your Coolify server
2. Check SSL certificate covers the API subdomain
3. Test DNS resolution: `nslookup api.coffeelogik.com`

### Fix 3: Update Environment Variables
**Frontend Service:**
```bash
NEXT_PUBLIC_STRAPI_URL=https://api.coffeelogik.com
NEXT_PUBLIC_SITE_URL=https://coffeelogik.com
```

**Backend Service:**
```bash
STRAPI_URL=https://api.coffeelogik.com
FRONTEND_URL=https://coffeelogik.com
CORS_ORIGIN=https://coffeelogik.com,https://www.coffeelogik.com
```

### Fix 4: Test API Directly
```bash
# Test if API responds
curl https://api.coffeelogik.com/api/blog-posts

# Test old domain (for comparison)
curl https://y0o4w84ckoockck8o0ss8s48.tealogik.com/api/blog-posts
```

## 🚀 Quick Rollback

If you need to quickly restore functionality:

1. **Revert Frontend Environment Variables:**
   ```bash
   NEXT_PUBLIC_STRAPI_URL=https://y0o4w84ckoockck8o0ss8s48.tealogik.com
   ```

2. **Redeploy Frontend Service** in Coolify

3. **Verify Site Works** with old domain

## 🔧 Advanced Debugging

### Check Browser Network Tab
1. Open browser dev tools (F12)
2. Go to Network tab
3. Reload the page
4. Look for failed API requests
5. Check request/response details

### Check Coolify Logs
1. Go to your frontend service in Coolify
2. Check "Logs" tab for build errors
3. Go to your backend service
4. Check for Strapi startup errors

### Test API from Server
```bash
# From your server, test API connectivity
curl -v https://api.coffeelogik.com/api/blog-posts
curl -v https://y0o4w84ckoockck8o0ss8s48.tealogik.com/api/blog-posts
```

## 📝 Diagnostic Information to Collect

When reporting issues, please provide:

1. **Frontend diagnostic output** (from yellow box on homepage)
2. **Browser console errors** (F12 → Console tab)
3. **Network request failures** (F12 → Network tab)
4. **Coolify service status** (both frontend and backend)
5. **Current environment variables** (sanitized)

## 🎯 Most Likely Cause

Based on the domain migration, the most likely issue is that **`api.coffeelogik.com` is not properly configured yet**. 

**Immediate Solution**: Use the old domain temporarily until DNS/SSL is configured:
```bash
NEXT_PUBLIC_STRAPI_URL=https://y0o4w84ckoockck8o0ss8s48.tealogik.com
```

## 🔄 Next Steps

1. **Check the diagnostic** on your homepage
2. **Try the quick rollback** if needed
3. **Configure `api.coffeelogik.com`** in Coolify when ready
4. **Test the new domain** thoroughly before switching