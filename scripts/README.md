# Coffee Brewing Guide Image Generator

This script uses Replicate's AI image generation API to create high-quality images for coffee brewing guides, including featured images and step-by-step process images.

## Setup

1. Install dependencies:
```bash
cd scripts
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual API tokens
```

3. Get API tokens:
   - **Replicate API Token**: Sign up at [replicate.com](https://replicate.com) and get your API token
   - **Strapi API Token**: Use your existing Strapi API token

## Usage

### Generate all images
```bash
npm run generate
```

This will:
- Generate 1 featured image per brewing guide (12 total)
- Generate 5 step images per brewing guide (60 total)
- Upload all images to Strapi's media library
- Associate images with the corresponding brewing guides

### Environment Variables

- `REPLICATE_API_TOKEN`: Your Replicate API token for image generation
- `STRAPI_API_TOKEN`: Your Strapi API token for uploading images
- `NEXT_PUBLIC_STRAPI_URL`: Your Strapi instance URL

## Image Generation Details

### Featured Images
- **Model**: black-forest-labs/flux-1.1-pro
- **Resolution**: 1024x768
- **Format**: JPG (90% quality)
- **Style**: Professional coffee photography with warm lighting

### Step Images
- **Model**: black-forest-labs/flux-1.1-pro  
- **Resolution**: 1024x768
- **Format**: JPG (90% quality)
- **Content**: Detailed step-by-step brewing process photos

## Generated Images

The script will generate images for these brewing methods:

1. **Pour Over Coffee** (6 images: 1 featured + 5 steps)
2. **French Press** (6 images: 1 featured + 5 steps)
3. **Espresso** (6 images: 1 featured + 5 steps)
4. **Cold Brew** (6 images: 1 featured + 5 steps)
5. **Chemex** (6 images: 1 featured + 5 steps)
6. **AeroPress** (6 images: 1 featured + 5 steps)
7. **Moka Pot** (6 images: 1 featured + 5 steps)
8. **Turkish Coffee** (6 images: 1 featured + 5 steps)
9. **Siphon Coffee** (6 images: 1 featured + 5 steps)
10. **Vietnamese Phin** (6 images: 1 featured + 5 steps)
11. **Percolator** (6 images: 1 featured + 5 steps)
12. **Cold Brew French Press** (6 images: 1 featured + 5 steps)

**Total**: 72 high-quality coffee brewing images

## Cost Estimation

Using Flux 1.1 Pro on Replicate:
- Cost per image: ~$0.04
- Total images: 72
- **Estimated total cost: ~$2.88**

## Error Handling

The script includes:
- Retry logic for failed generations
- Graceful error handling
- Rate limiting between requests
- Cleanup of temporary files
- Detailed logging of progress

## File Structure

```
scripts/
├── generate-images.js      # Main image generation script
├── package.json           # Node.js dependencies
├── .env.example           # Environment variables template
├── README.md             # This documentation
└── temp_images/          # Temporary directory (auto-created)
```