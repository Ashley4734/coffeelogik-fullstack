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

// Sample brewing guides with step images (starting with 3 popular methods)
const stepImageGuides = [
  {
    title: 'Perfect Pour Over Coffee',
    documentId: 'no6ibsvomcd1r3umyoha26ws',
    method: 'pour-over',
    stepPrompts: [
      'Close-up of coffee filter being rinsed in V60 dripper with hot water, steam rising, professional coffee photography',
      'Coffee beans being measured on digital scale showing exactly 22 grams, coffee brewing setup background',
      'Coffee grinder with medium-fine ground coffee visible, coffee beans scattered around, warm lighting',
      'Hot water being poured over coffee grounds in circular bloom motion, timer showing 30 seconds, gooseneck kettle',
      'Steady pour over brewing process, golden coffee dripping into glass carafe below, perfect extraction'
    ]
  },
  {
    title: 'French Press Mastery',
    documentId: 'zzilr5av1giij2sriaym5jdw',
    method: 'french-press',
    stepPrompts: [
      'Thermometer showing exactly 200°F water temperature next to French press, steam visible, coffee setup',
      'Coarse coffee grounds being poured into empty French press chamber, breadcrumb texture visible',
      'Hot water being poured into French press with coffee grounds, saturation process, morning light',
      'French press plunger being slowly pressed down with steady pressure, hands visible, coffee extraction',
      'Freshly brewed French press coffee being poured into ceramic mug, rich dark coffee, steam rising'
    ]
  },
  {
    title: 'Espresso Excellence',
    documentId: 'v2k0k1snjmii9h82f2r7jqcy',
    method: 'espresso',
    stepPrompts: [
      'Professional espresso machine warming up with steam and group head visible, Italian café atmosphere',
      'Coffee being precisely dosed and distributed in portafilter basket, professional barista technique',
      'Coffee tamper compressing grounds with perfect pressure, 30 pounds force, level tamping technique',
      'Espresso extraction in progress with golden crema flowing into cup, perfect timing, rich extraction',
      'Perfect espresso shot with thick golden crema layer on top, Italian espresso cup, café setting'
    ]
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

async function generateStepImage(prompt, filename, stepNumber, method) {
  try {
    console.log(`🎨 Generating ${method} step ${stepNumber}: ${filename}`);
    
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

async function generateStepImagesForGuide(guide) {
  console.log(`\n=== Generating step images for ${guide.title} ===`);
  
  const stepImages = [];

  for (let i = 0; i < guide.stepPrompts.length; i++) {
    const stepNumber = i + 1;
    const filename = `${guide.method}-step-${stepNumber}.jpg`;
    
    try {
      const stepImage = await generateStepImage(
        guide.stepPrompts[i], 
        filename, 
        stepNumber, 
        guide.method
      );
      
      if (stepImage) {
        stepImages.push(stepImage);
      }
      
      // Add delay between step images
      if (i < guide.stepPrompts.length - 1) {
        console.log('⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Error generating step ${stepNumber}:`, error.message);
    }
  }

  return stepImages;
}

async function updateGuideWithStepImages(guide, stepImages) {
  if (stepImages.length === 0) return null;
  
  try {
    const stepImageIds = stepImages.map(img => img.id);
    
    const response = await axios.put(
      `${STRAPI_URL}/api/brewing-guides/${guide.documentId}`,
      { 
        data: { 
          step_images: stepImageIds
        } 
      },
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Updated ${guide.title} with ${stepImages.length} step images`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating ${guide.title}:`, error.response?.data || error.message);
    return null;
  }
}

async function generateAllStepImages() {
  console.log('🎬 Starting step image generation for brewing guides...\n');
  
  for (const guide of stepImageGuides) {
    try {
      const stepImages = await generateStepImagesForGuide(guide);
      await updateGuideWithStepImages(guide, stepImages);
      
      // Add delay between guides
      console.log('\n⏳ Waiting 5 seconds before next guide...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`Error processing ${guide.title}:`, error.message);
    }
  }
  
  console.log('🎉 Step image generation complete!');
  console.log(`📊 Generated step images for ${stepImageGuides.length} brewing methods`);
  console.log(`📷 Total step images: ${stepImageGuides.length * 5} images`);
}

// Run if called directly
if (require.main === module) {
  generateAllStepImages().catch(console.error);
}

module.exports = { generateAllStepImages, stepImageGuides };