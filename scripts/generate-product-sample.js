require('dotenv').config();
const Replicate = require('replicate');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Strapi configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://y0o4w84ckoockck8o0ss8s48.tealogik.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Sample coffee product data
const sampleProduct = {
  name: "Ethiopian Yirgacheffe Single Origin",
  slug: "ethiopian-yirgacheffe-single-origin",
  brand: "Blue Bottle Coffee",
  product_type: "Coffee Beans",
  origin: "Yirgacheffe, Ethiopia",
  roast_level: "Light",
  flavor_notes: ["Blueberry", "Lemon", "Floral", "Tea-like", "Bright acidity"],
  description: "Our Ethiopian Yirgacheffe is a stunning example of what makes this region so special. Grown at high altitudes in the birthplace of coffee, these beans showcase the distinctive terroir that has made Yirgacheffe famous among coffee enthusiasts worldwide.\n\nThis light roast preserves the bean's natural characteristics, revealing bright blueberry notes, zesty lemon acidity, and delicate floral aromatics. The cup has a tea-like body that's clean and refreshing, making it perfect for pour-over, Chemex, or any brewing method that highlights clarity and brightness.\n\nSourced directly from smallholder farmers in the Gedeo Zone, this coffee represents the pinnacle of Ethiopian coffee craftsmanship. Each batch is carefully processed using the traditional washed method, resulting in a clean, vibrant cup that tells the story of its origin.",
  price: 24.95,
  rating: 4.7,
  pros: [
    "Exceptional clarity and brightness",
    "Complex fruit and floral notes", 
    "Ethically sourced from origin",
    "Perfect for light roast enthusiasts",
    "Excellent for filter brewing methods"
  ],
  cons: [
    "May be too bright for some palates",
    "Not suitable for espresso",
    "Premium pricing"
  ],
  affiliate_link: "https://amzn.to/3YirgacheffeBlueBottle",
  featured: true
};

// Image prompts for the product
const productImagePrompts = [
  "Professional product photography of Ethiopian coffee beans in elegant packaging, Blue Bottle Coffee branding, clean white background, premium coffee aesthetic, studio lighting",
  "Close-up macro photography of Ethiopian Yirgacheffe coffee beans, light roast, visible oil sheen, natural texture and color variation, professional food photography",
  "Coffee beans scattered artistically with small bowl containing ground coffee, Ethiopian origin theme, warm lighting, rustic wooden background"
];

async function downloadImage(url, filepath) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });
  
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function uploadToStrapi(imagePath, filename) {
  const FormData = require('form-data');
  const formData = new FormData();
  
  formData.append('files', fs.createReadStream(imagePath), {
    filename: filename,
    contentType: 'image/jpeg'
  });

  const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
    headers: {
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      ...formData.getHeaders()
    }
  });

  return response.data[0];
}

async function generateProductImage(prompt, filename) {
  try {
    console.log(`🎨 Generating product image: ${filename}`);
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
          output_format: "jpg",
          num_outputs: 1
        }
      }
    );

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, 'temp_images');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Download the generated image
    const imagePath = path.join(tempDir, filename);
    await downloadImage(output[0], imagePath);
    
    console.log(`📥 Downloaded: ${filename}`);
    
    // Upload to Strapi
    const uploadedFile = await uploadToStrapi(imagePath, filename);
    
    console.log(`☁️ Uploaded to Strapi: ${filename}`);
    
    // Clean up temp file
    fs.unlinkSync(imagePath);
    
    return uploadedFile;
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return null;
  }
}

async function generateProductImages() {
  console.log('📸 Generating product images...\n');
  
  const productImages = [];
  
  for (let i = 0; i < productImagePrompts.length; i++) {
    const filename = `ethiopian-yirgacheffe-${i + 1}.jpg`;
    
    try {
      const image = await generateProductImage(productImagePrompts[i], filename);
      if (image) {
        productImages.push(image);
      }
      
      // Add delay between images
      if (i < productImagePrompts.length - 1) {
        console.log('⏳ Waiting 3 seconds...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`Error generating image ${i + 1}:`, error.message);
    }
  }
  
  return productImages;
}

async function createSampleProduct(images) {
  try {
    console.log('📦 Creating sample coffee product...');
    
    const productData = {
      ...sampleProduct,
      images: images.map(img => img.id)
    };
    
    const response = await axios.post(
      `${STRAPI_URL}/api/coffee-products`,
      { data: productData },
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Created sample product: ${response.data.data.name}`);
    console.log(`🔗 Product ID: ${response.data.data.id}`);
    console.log(`📊 Rating: ${response.data.data.rating}/5`);
    console.log(`💰 Price: $${response.data.data.price}`);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error creating product:', error.response?.data || error.message);
    return null;
  }
}

async function generateSampleCoffeeProduct() {
  console.log('🚀 Starting sample coffee product generation...\n');
  
  try {
    // Generate product images
    const images = await generateProductImages();
    
    if (images.length > 0) {
      // Create the product with images
      const product = await createSampleProduct(images);
      
      if (product) {
        console.log('\n🎉 Sample coffee product creation complete!');
        console.log(`📷 Generated ${images.length} product images`);
        console.log('🛍️ Product is ready for review and purchase');
      }
    } else {
      console.log('❌ No images were generated, creating product without images...');
      await createSampleProduct([]);
    }
  } catch (error) {
    console.error('Error in sample product generation:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  generateSampleCoffeeProduct().catch(console.error);
}

module.exports = { generateSampleCoffeeProduct, sampleProduct };