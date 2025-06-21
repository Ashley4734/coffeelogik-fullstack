# Step-by-Step n8n Setup Guide

## Step 1: Configure Environment Variables

### Access your n8n Settings:
1. Open your n8n instance
2. Go to **Settings** → **Environment**
3. Add these variables:

### For Amazon Product Advertising API (PA API):
```env
# Amazon PA API Credentials
AMAZON_ACCESS_KEY_ID=your_access_key_here
AMAZON_SECRET_ACCESS_KEY=your_secret_key_here
AMAZON_PARTNER_TAG=your_associate_tag_here
AMAZON_PARTNER_TYPE=Associates

# AI Service
OPENAI_API_KEY=your_openai_key_here

# Strapi Configuration  
STRAPI_URL=https://y0o4w84ckoockck8o0ss8s48.tealogik.com
STRAPI_API_TOKEN=04829998326bb500797f91c28d6bb77901c23759db1e0d6184a14dd8810619c515b36c570a4935d5f1536516eb8d53f559c663ada56347aef2b41a15e13d7fd85e23229bba7bcafff38920a8f56f6664892dd63db73d5407fbdd6a9ea7845d93c48770e6f83dcd96171be86aa73664a4cb22bea3b556d3c46711fbcd446db1ca
```

### For Amazon Advertising API (if you have it):
```env
# Amazon Advertising API Credentials
AMAZON_ACCESS_KEY_ID=your_access_key_here
AMAZON_SECRET_ACCESS_KEY=your_secret_key_here
AMAZON_CLIENT_ID=your_client_id_here
AMAZON_ADVERTISING_ACCOUNT_ID=your_account_id_here

# AI Service
OPENAI_API_KEY=your_openai_key_here

# Strapi Configuration
STRAPI_URL=https://y0o4w84ckoockck8o0ss8s48.tealogik.com
STRAPI_API_TOKEN=04829998326bb500797f91c28d6bb77901c23759db1e0d6184a14dd8810619c515b36c570a4935d5f1536516eb8d53f559c663ada56347aef2b41a15e13d7fd85e23229bba7bcafff38920a8f56f6664892dd63db73d5407fbdd6a9ea7845d93c48770e6f83dcd96171be86aa73664a4cb22bea3b556d3c46711fbcd446db1ca
```

## Step 2: Import Workflows

### Method 1: Copy-Paste JSON
1. In n8n, click **"+ Add Workflow"**
2. Click the **three dots menu** → **Import from file**
3. Choose **"Paste JSON"**
4. Copy the entire JSON content from the workflow files
5. Paste and click **"Import"**

### Method 2: Upload Files
1. In n8n, click **"+ Add Workflow"**
2. Click the **three dots menu** → **Import from file**
3. Choose **"Upload from file"**
4. Select the `.json` workflow file

## Step 3: Configure Credentials

### OpenAI Credential:
1. Go to **Settings** → **Credentials**
2. Click **"+ Add Credential"**
3. Select **"OpenAI"**
4. Enter your OpenAI API key
5. Save as **"OpenAI Coffee Assistant"**

### HTTP Request Authentication:
- The workflows use environment variables, so no additional credentials needed
- Make sure your environment variables are set correctly

## Step 4: Test the Setup

### Test Product Import:
1. Open the **"Amazon Coffee Product Importer"** workflow
2. Click **"Execute Workflow"** 
3. In the webhook trigger, use test data:
   ```json
   {
     "asin": "B00FLYWNYQ"
   }
   ```
4. Check if all nodes execute successfully

### Check for Errors:
- Green nodes = success ✅
- Red nodes = error ❌
- Click on red nodes to see error details

## Step 5: Get Webhook URL

### For Product Import:
1. Open the **"Amazon Coffee Product Importer"** workflow
2. Click on the **"Webhook Trigger"** node
3. Copy the **"Webhook URL"**
4. Save this URL - you'll use it to trigger imports

Example webhook URL:
```
https://your-n8n-instance.com/webhook/import-product
```

## Step 6: Test with Real ASIN

### Using curl:
```bash
curl -X POST "YOUR_WEBHOOK_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{"asin": "B00FLYWNYQ"}'
```

### Using Postman/Insomnia:
- Method: POST
- URL: Your webhook URL
- Body (JSON):
  ```json
  {
    "asin": "B00FLYWNYQ"
  }
  ```

### Expected Response:
```json
{
  "success": true,
  "message": "Product imported successfully",
  "product": {
    "id": 123,
    "name": "Product Name",
    "brand": "Brand Name",
    "price": 29.99,
    "rating": 4.5,
    "asin": "B00FLYWNYQ"
  }
}
```

## Step 7: Schedule Price Monitor

### Activate Price Monitor:
1. Open the **"Amazon Price Monitor"** workflow
2. Click **"Activate"** in the top right
3. The workflow will run daily at 6 AM automatically

### Manual Test:
1. Click **"Execute Workflow"** to test immediately
2. Check logs for price updates

## Troubleshooting Common Issues

### 1. Amazon API Errors:
- **403 Forbidden**: Check your API credentials
- **Invalid Signature**: Verify secret key and timestamp
- **Rate Limit**: Wait and retry, implement delays

### 2. OpenAI Errors:
- **401 Unauthorized**: Check API key
- **Rate Limit**: Upgrade plan or reduce frequency
- **Token Limit**: Shorten prompts

### 3. Strapi Errors:
- **401 Unauthorized**: Check API token
- **Validation Error**: Check required fields
- **404 Not Found**: Verify URL endpoint

### 4. n8n Workflow Errors:
- **Missing Environment Variables**: Check Settings → Environment
- **Node Connection Issues**: Verify node connections
- **Execution Timeout**: Increase timeout in workflow settings

## Next Steps After Setup

1. **Test with 3-5 different ASINs**
2. **Monitor first price update cycle**
3. **Optimize AI prompts if needed**
4. **Set up monitoring/alerting**
5. **Scale to bulk imports**

## Sample ASINs for Testing

Use these coffee-related ASINs for testing:
- `B00FLYWNYQ` - Coffee beans
- `B07CQJBQVH` - Ethiopian coffee
- `B001E5E888` - French roast
- `B00I7R4392` - Coffee grinder
- `B07BR7DHNF` - Espresso machine