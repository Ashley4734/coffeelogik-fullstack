# n8n Amazon Coffee Product Automation Setup Guide

## Prerequisites

### 1. Amazon Advertising API Access
**Important**: You need Amazon Advertising API access, not just the regular Product Advertising API.

#### Steps to get access:
1. **Register as Amazon Advertiser**
   - Create an Amazon Seller or Vendor account
   - Set up advertising campaigns (minimum spend may be required)
   - Wait for approval (can take 1-2 weeks)

2. **Apply for API Access**
   - Go to: https://advertising.amazon.com/API/docs/en-us/get-started/apply-for-access
   - Complete the application form
   - Provide business justification
   - Wait for approval (can take 2-4 weeks)

3. **Get Credentials**
   - Access Key ID
   - Secret Access Key  
   - Client ID
   - Advertising Account ID

### 2. Alternative: Amazon Product Advertising API
If you can't get Advertising API access, you can use the Product Advertising API (PA API 5.0):

#### Modified API calls for PA API:
```javascript
// Instead of Advertising API endpoint
"https://webservices.amazon.com/paapi5/getitems"

// With different authentication (AWS Signature V4)
// And different request format
```

### 3. AI Service Setup
Choose one:
- **OpenAI**: Get API key from https://platform.openai.com
- **Anthropic Claude**: Get API key from https://console.anthropic.com
- **Local AI**: Use Ollama with llama2/mistral

## Installation Steps

### Step 1: Import Workflows to n8n

1. **Copy workflow files to your n8n instance**
2. **Import each JSON file**:
   - Go to n8n dashboard
   - Click "Import from file"
   - Upload `amazon-product-importer.json`
   - Upload `price-monitor.json`

### Step 2: Configure Environment Variables

Add these to your n8n environment:

```env
# Amazon API (choose one set)
# Option A: Advertising API
AMAZON_ACCESS_KEY_ID=your_access_key_here
AMAZON_SECRET_ACCESS_KEY=your_secret_key_here
AMAZON_CLIENT_ID=your_client_id_here
AMAZON_ADVERTISING_ACCOUNT_ID=your_account_id_here

# Option B: Product Advertising API  
AMAZON_ACCESS_KEY_ID=your_access_key_here
AMAZON_SECRET_ACCESS_KEY=your_secret_key_here
AMAZON_PARTNER_TAG=your_associate_tag_here
AMAZON_PARTNER_TYPE=Associates

# AI Service (choose one)
OPENAI_API_KEY=your_openai_key_here
# OR
ANTHROPIC_API_KEY=your_claude_key_here

# Strapi Configuration
STRAPI_URL=https://y0o4w84ckoockck8o0ss8s48.tealogik.com
STRAPI_API_TOKEN=your_current_strapi_token

# Optional: Notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url_here
```

### Step 3: Test the Workflows

#### Test Product Import:
```bash
# Send POST request to your n8n webhook
curl -X POST "https://your-n8n-instance.com/webhook/import-product" \
  -H "Content-Type: application/json" \
  -d '{"asin": "B00FLYWNYQ"}'  # Sample coffee product ASIN
```

#### Test Price Monitor:
1. Ensure you have products with ASIN numbers in Strapi
2. Manually trigger the "Amazon Price Monitor" workflow
3. Check logs for price comparison results

## Strapi Schema Updates

You may need to add these fields to your coffee-product schema:

```json
{
  "amazon_asin": {
    "type": "string",
    "maxLength": 20
  },
  "amazon_last_updated": {
    "type": "datetime"
  },
  "amazon_availability": {
    "type": "string",
    "maxLength": 50
  }
}
```

## Usage Examples

### Import a Coffee Product:
```bash
curl -X POST "https://your-n8n-instance.com/webhook/import-product" \
  -H "Content-Type: application/json" \
  -d '{
    "asin": "B07CQJBQVH"  # Example: Ethiopian coffee beans
  }'
```

### Bulk Import Multiple Products:
Create a simple script or use n8n's bulk processing:

```javascript
const asins = [
  "B07CQJBQVH", // Ethiopian coffee
  "B001E5E888", // French roast
  "B00I7R4392", // Coffee grinder
  "B07BR7DHNF"  // Espresso machine
];

// Loop through and import each
```

### Monitor Price Changes:
The price monitor runs automatically daily at 6 AM, but you can also:
1. Trigger manually from n8n dashboard
2. Use a webhook to trigger on-demand
3. Set up multiple schedules (e.g., weekly for expensive items)

## Troubleshooting

### Common Issues:

1. **Amazon API 403 Errors**
   - Check your credentials
   - Verify API access approval
   - Ensure correct marketplace ID

2. **AI Content Generation Fails**
   - Check API key validity
   - Monitor rate limits
   - Verify JSON response format

3. **Strapi Upload Errors**
   - Check field validation
   - Verify required fields are present
   - Ensure proper authentication

4. **Price Monitor Not Working**
   - Check products have ASIN fields
   - Verify Strapi query returns data
   - Monitor API rate limits

### Monitoring and Logs:

1. **Enable n8n logging**
2. **Set up Slack notifications**
3. **Monitor execution history**
4. **Track success/failure rates**

## Optimization Tips

### Performance:
1. **Batch API requests** (max 5-10 ASINs per call)
2. **Implement retry logic** for failed requests
3. **Use caching** for frequently accessed data
4. **Rate limit** to avoid API throttling

### Cost Management:
1. **Monitor AI API usage** (OpenAI charges per token)
2. **Cache AI-generated content** when possible
3. **Implement smart price monitoring** (only check high-value items daily)
4. **Use webhook triggers** instead of polling when possible

### Content Quality:
1. **Review AI-generated content** before publishing
2. **Use product-specific prompts** for different categories
3. **Implement content validation** rules
4. **A/B test different content formats**

## Next Steps

1. **Start with manual testing** using sample ASINs
2. **Import 5-10 products** to test the full workflow
3. **Monitor price changes** for a few days
4. **Optimize AI prompts** based on content quality
5. **Scale up** to bulk imports and automated monitoring
6. **Add image processing** workflow for product photos
7. **Implement content moderation** and approval workflows