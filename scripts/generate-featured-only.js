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

// Featured image prompts for each brewing method
const featuredImages = [
  {
    title: 'Perfect Pour Over Coffee',
    documentId: 'no6ibsvomcd1r3umyoha26ws',
    filename: 'pour-over-featured.jpg',
    prompt: 'Professional coffee photography, V60 pour over dripper with gooseneck kettle pouring hot water in circular motion, steam rising, coffee beans scattered around, warm lighting, coffee shop aesthetic, ultra high quality'
  },
  {
    title: 'French Press Mastery',
    documentId: 'zzilr5av1giij2sriaym5jdw',
    filename: 'french-press-featured.jpg',
    prompt: 'Elegant French press coffee maker on wooden table, freshly brewed coffee with rich crema, coarse coffee grounds visible, morning light streaming through window, artisanal coffee setup, professional photography'
  },
  {
    title: 'Espresso Excellence',
    documentId: 'v2k0k1snjmii9h82f2r7jqcy',
    filename: 'espresso-featured.jpg',
    prompt: 'Professional espresso machine pulling perfect shot with golden crema, espresso cup underneath, coffee beans and tamper nearby, Italian café atmosphere, dramatic lighting'
  },
  {
    title: 'Moka Pot Mastery',
    documentId: 'ztyawazwhobnvfjjex0p30en',
    filename: 'moka-pot-featured.jpg',
    prompt: 'Classic aluminum Moka pot on stovetop, Italian coffee tradition, octagonal design, steam pressure brewing, authentic Italian kitchen atmosphere, vintage coffee making'
  },
  {
    title: 'Turkish Coffee',
    documentId: 'qkgl44qyqvspb8d5dpsc0h96',
    filename: 'turkish-coffee-featured.jpg',
    prompt: 'Traditional copper cezve Turkish coffee pot on low flame, extremely fine coffee powder, foam rising, UNESCO cultural heritage brewing method, ornate Turkish setting'
  }
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

async function generateImage(prompt, filename) {
  try {
    console.log(`🎨 Generating: ${filename}`);
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          width: 1024,
          height: 768,
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

async function updateGuideWithFeaturedImage(guide, image) {
  if (!image) return null;
  
  try {
    const response = await axios.put(
      `${STRAPI_URL}/api/brewing-guides/${guide.documentId}`,
      { 
        data: { 
          featured_image: image.id 
        } 
      },
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Updated ${guide.title} with featured image`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating ${guide.title}:`, error.response?.data || error.message);
    return null;
  }
}

async function generateFeaturedImages() {
  console.log('🚀 Starting featured image generation...\n');
  
  for (const guide of featuredImages) {
    try {
      const image = await generateImage(guide.prompt, guide.filename);
      await updateGuideWithFeaturedImage(guide, image);
      
      // Add delay between generations to avoid rate limiting
      console.log('⏳ Waiting 3 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Error processing ${guide.title}:`, error.message);
    }
  }
  
  console.log('🎉 Featured image generation complete!');
}

// Run if called directly
if (require.main === module) {
  generateFeaturedImages().catch(console.error);
}

module.exports = { generateFeaturedImages };