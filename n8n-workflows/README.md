# n8n Coffee Product Automation

This project contains n8n workflows for automatically managing coffee products from Amazon to Strapi CMS.

## Overview

The automation system:
1. Fetches product data from Amazon using ASIN numbers
2. Uses AI to rewrite descriptions and generate pros/cons
3. Creates/updates products in Strapi
4. Monitors prices every 24 hours
5. Handles errors and provides logging

## Workflows

### 1. Amazon Product Importer
- **File**: `amazon-product-importer.json`
- **Trigger**: Manual/Webhook (ASIN input)
- **Purpose**: Import new products from Amazon

### 2. Price Monitor
- **File**: `price-monitor.json` 
- **Trigger**: Cron (daily at 6 AM)
- **Purpose**: Update product prices every 24 hours

### 3. Content Generator
- **File**: `content-generator.json`
- **Trigger**: Called by other workflows
- **Purpose**: Generate AI content for products

## Setup Requirements

### Amazon Advertising API
1. Register for Amazon Advertising API access
2. Obtain credentials:
   - Access Key ID
   - Secret Access Key
   - Advertising Account ID
   - Marketplace ID (US: ATVPDKIKX0DER)

### AI Services
- OpenAI API key for content generation
- Alternative: Anthropic Claude API

### Strapi Configuration
- API endpoint URL
- Authentication token with product creation/update permissions

### n8n Environment Variables
```env
AMAZON_ACCESS_KEY_ID=your_access_key
AMAZON_SECRET_ACCESS_KEY=your_secret_key
AMAZON_ADVERTISING_ACCOUNT_ID=your_account_id
AMAZON_MARKETPLACE_ID=ATVPDKIKX0DER
OPENAI_API_KEY=your_openai_key
STRAPI_URL=https://y0o4w84ckoockck8o0ss8s48.tealogik.com
STRAPI_API_TOKEN=your_strapi_token
```

## Workflow Details

### Data Flow
```
ASIN Input → Amazon API → Product Data → AI Processing → Strapi Upload
     ↓
Price Monitor → Check Prices → Update if Changed → Strapi Update
```

### AI Content Generation
- Rewrites Amazon descriptions for SEO
- Generates pros and cons lists
- Extracts flavor notes for coffee products
- Creates coffee-specific metadata

### Error Handling
- API rate limiting
- Invalid ASIN handling
- Network failures
- Strapi validation errors

## Installation

1. Import workflows into n8n
2. Configure credentials
3. Set environment variables
4. Test with sample ASIN
5. Schedule price monitoring

## Usage

### Import New Product
1. Trigger "Amazon Product Importer" workflow
2. Provide ASIN number
3. Workflow automatically:
   - Fetches Amazon data
   - Generates AI content
   - Creates Strapi product
   - Returns success/error status

### Monitor Prices
- Automatic daily execution
- Checks all products with Amazon ASINs
- Updates prices if changed by >5%
- Logs all price changes

## Monitoring

### Success Metrics
- Products imported successfully
- Price updates processed
- AI content generation success rate

### Error Tracking
- Failed Amazon API calls
- AI generation failures
- Strapi upload errors
- Rate limiting incidents

## Best Practices

1. **Rate Limiting**: Respect Amazon API limits
2. **Error Recovery**: Implement retry logic
3. **Data Validation**: Verify product data before upload
4. **Logging**: Track all operations for debugging
5. **Testing**: Use sandbox ASINs for development