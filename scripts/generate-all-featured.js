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

// All brewing guides with featured image prompts
const allFeaturedImages = [
  {
    title: 'Cold Brew Concentrate',
    documentId: 'wmbhw45puv93w2y65xgw89pd',
    filename: 'cold-brew-featured.jpg',
    prompt: 'Large glass jar with cold brew concentrate, coarse coffee grounds steeping in water, ice cubes nearby, summer morning light, refreshing beverage photography, clean minimalist aesthetic'
  },
  {
    title: 'Chemex Classic Technique',
    documentId: 'gngcf8iqr5pribq1toptvr9b',
    filename: 'chemex-featured.jpg',
    prompt: 'Elegant Chemex glass coffee maker with thick paper filter, gooseneck kettle, laboratory glassware aesthetic, bright clean coffee, scientific precision, artisanal brewing setup'
  },
  {
    title: 'AeroPress Championship Recipe',
    documentId: 't4778rbtvt1n08undf8r2pkq',
    filename: 'aeropress-featured.jpg',
    prompt: 'AeroPress coffee maker in inverted position, compact and portable brewing device, travel coffee setup, championship-level precision, modern coffee brewing innovation'
  },
  {
    title: 'Siphon Coffee Artistry',
    documentId: 'urv0jkncajxq5k1ebawfq814',
    filename: 'siphon-featured.jpg',
    prompt: 'Elegant glass siphon coffee maker with two chambers, vacuum brewing in action, scientific glassware, theatrical coffee brewing performance, laboratory precision'
  },
  {
    title: 'Vietnamese Phin Coffee',
    documentId: 'ezv32025dz49fwouvpt4o88z',
    filename: 'vietnamese-phin-featured.jpg',
    prompt: 'Traditional Vietnamese phin filter on glass cup with condensed milk, slow drip coffee process, authentic Vietnamese coffee culture, Southeast Asian café atmosphere'
  },
  {
    title: 'Percolator Classic Brew',
    documentId: 'n3muf7i1dtize6u4yzy36b33',
    filename: 'percolator-featured.jpg',
    prompt: 'Classic coffee percolator on stovetop, traditional American coffee brewing, camping coffee setup, glass knob showing percolation, nostalgic coffee making method'
  },
  {
    title: 'Cold Brew French Press',
    documentId: 'd45mstdntj4271vqpufmn6c6',
    filename: 'cold-brew-french-press-featured.jpg',
    prompt: 'French press being used for cold brew preparation, coarse coffee grounds steeping in cold water, extended brewing time, alternative cold brewing method'
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

async function generateAllFeaturedImages() {
  console.log('🚀 Starting remaining featured image generation...\n');
  
  for (const guide of allFeaturedImages) {
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
  
  console.log('🎉 All featured image generation complete!');
}

// Run if called directly
if (require.main === module) {
  generateAllFeaturedImages().catch(console.error);
}