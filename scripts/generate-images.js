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

// Brewing guide data for image generation
const brewingGuides = [
  {
    title: 'Perfect Pour Over Coffee',
    method: 'Pour Over',
    documentId: 'no6ibsvomcd1r3umyoha26ws',
    featuredPrompt: 'Professional coffee photography, V60 pour over dripper with gooseneck kettle pouring hot water in circular motion, steam rising, coffee beans scattered around, warm lighting, coffee shop aesthetic, ultra high quality, 4K',
    stepPrompts: [
      'Close-up of coffee filter being rinsed in V60 dripper with hot water',
      'Coffee beans being measured on digital scale, 22 grams',
      'Coffee grinder with medium-fine ground coffee, coffee beans in background',
      'Hot water being poured over coffee grounds in circular bloom motion, timer showing 30 seconds',
      'Steady pour over brewing process, coffee dripping into cup below'
    ]
  },
  {
    title: 'French Press Mastery',
    method: 'French Press',
    documentId: 'zzilr5av1giij2sriaym5jdw',
    featuredPrompt: 'Elegant French press coffee maker on wooden table, freshly brewed coffee with rich crema, coarse coffee grounds visible, morning light streaming through window, artisanal coffee setup, professional photography',
    stepPrompts: [
      'Thermometer showing 200°F water temperature next to French press',
      'Coarse coffee grounds being added to empty French press chamber',
      'Hot water being poured into French press with coffee grounds',
      'French press plunger being slowly pressed down with steady pressure',
      'Freshly brewed French press coffee being poured into ceramic mug'
    ]
  },
  {
    title: 'Espresso Excellence',
    method: 'Espresso',
    documentId: 'v2k0k1snjmii9h82f2r7jqcy',
    featuredPrompt: 'Professional espresso machine pulling perfect shot with golden crema, espresso cup underneath, coffee beans and tamper nearby, Italian café atmosphere, dramatic lighting, commercial coffee photography',
    stepPrompts: [
      'Espresso machine warming up with steam and group head visible',
      'Coffee being dosed and distributed in portafilter basket',
      'Coffee tamper compressing grounds with 30 pounds of pressure',
      'Espresso extraction in progress with golden crema flowing into cup',
      'Perfect espresso shot with thick golden crema layer on top'
    ]
  },
  {
    title: 'Cold Brew Concentrate',
    method: 'Cold Brew',
    documentId: 'wmbhw45puv93w2y65xgw89pd',
    featuredPrompt: 'Large glass jar with cold brew concentrate, coarse coffee grounds steeping in water, ice cubes nearby, summer morning light, refreshing beverage photography, clean minimalist aesthetic',
    stepPrompts: [
      'Very coarse coffee grounds spread out, breadcrumb-like texture visible',
      'Coffee grounds being combined with room temperature water in large jar',
      'Sealed jar steeping at room temperature, timer showing 12 hours',
      'Fine mesh strainer filtering cold brew concentrate into clean container',
      'Cold brew concentrate being stored in refrigerator, glass bottles'
    ]
  },
  {
    title: 'Chemex Classic Technique',
    method: 'Chemex',
    documentId: 'gngcf8iqr5pribq1toptvr9b',
    featuredPrompt: 'Elegant Chemex glass coffee maker with thick paper filter, gooseneck kettle, laboratory glassware aesthetic, bright clean coffee, scientific precision, artisanal brewing setup',
    stepPrompts: [
      'Chemex filter being unfolded with triple-fold facing the spout',
      'Medium-coarse coffee grounds in Chemex filter with small well in center',
      'Hot water being poured in slow spiral pattern over coffee grounds',
      'Coffee slowly dripping through Chemex filter into lower chamber',
      'Finished Chemex coffee being served, clean and bright appearance'
    ]
  },
  {
    title: 'AeroPress Championship Recipe',
    method: 'AeroPress',
    documentId: 't4778rbtvt1n08undf8r2pkq',
    featuredPrompt: 'AeroPress coffee maker in inverted position, compact and portable brewing device, travel coffee setup, championship-level precision, modern coffee brewing innovation',
    stepPrompts: [
      'AeroPress assembled in inverted position with plunger 1cm inserted',
      'Medium-fine coffee grounds being added to inverted AeroPress chamber',
      'Hot water being poured into AeroPress with timer showing brewing time',
      'AeroPress being flipped onto cup for final extraction phase',
      'AeroPress being pressed down with steady pressure for 30 seconds'
    ]
  },
  {
    title: 'Moka Pot Mastery',
    method: 'Moka Pot',
    documentId: 'ztyawazwhobnvfjjex0p30en',
    featuredPrompt: 'Classic aluminum Moka pot on stovetop, Italian coffee tradition, octagonal design, steam pressure brewing, authentic Italian kitchen atmosphere, vintage coffee making',
    stepPrompts: [
      'Moka pot bottom chamber being filled with water up to safety valve',
      'Medium-coarse coffee grounds filling filter basket, leveled gently',
      'Moka pot assembled and placed on medium heat stovetop',
      'Coffee gurgling and flowing into upper chamber, lid open for monitoring',
      'Finished Moka pot coffee being poured into small Italian espresso cups'
    ]
  },
  {
    title: 'Authentic Turkish Coffee',
    method: 'Turkish Coffee',
    documentId: 'qkgl44qyqvspb8d5dpsc0h96',
    featuredPrompt: 'Traditional copper cezve (Turkish coffee pot) on low flame, extremely fine coffee powder, foam rising, UNESCO cultural heritage brewing method, ornate Turkish setting',
    stepPrompts: [
      'Coffee beans being ground to powder consistency, finer than espresso',
      'Cold water, coffee powder, and sugar being mixed in copper cezve',
      'Cezve placed on very low heat with gentle stirring motion',
      'Foam beginning to rise in cezve, critical timing moment',
      'Turkish coffee being poured with foam crown, traditional serving cups'
    ]
  },
  {
    title: 'Siphon Coffee Artistry',
    method: 'Siphon',
    documentId: 'urv0jkncajxq5k1ebawfq814',
    featuredPrompt: 'Elegant glass siphon coffee maker with two chambers, vacuum brewing in action, scientific glassware, theatrical coffee brewing performance, laboratory precision',
    stepPrompts: [
      'Siphon coffee maker assembled with cloth filter in upper chamber',
      'Water heating in lower chamber, beginning to rise to upper chamber',
      'Coffee grounds being added to upper chamber with bamboo paddle',
      'Coffee brewing in upper chamber for 90 seconds with gentle stirring',
      'Vacuum effect drawing finished coffee back to lower chamber'
    ]
  },
  {
    title: 'Vietnamese Phin Coffee',
    method: 'Vietnamese Phin',
    documentId: 'ezv32025dz49fwouvpt4o88z',
    featuredPrompt: 'Traditional Vietnamese phin filter on glass cup with condensed milk, slow drip coffee process, authentic Vietnamese coffee culture, Southeast Asian café atmosphere',
    stepPrompts: [
      'Sweetened condensed milk being placed in bottom of glass cup',
      'Coarse coffee grounds being added to phin filter chamber',
      'Gravity press being placed on coffee grounds with gentle pressure',
      'Small amount of hot water blooming coffee for 30 seconds',
      'Slow drip extraction through phin filter taking 4-5 minutes'
    ]
  },
  {
    title: 'Percolator Classic Brew',
    method: 'Percolator',
    documentId: 'n3muf7i1dtize6u4yzy36b33',
    featuredPrompt: 'Classic coffee percolator on stovetop, traditional American coffee brewing, camping coffee setup, glass knob showing percolation, nostalgic coffee making method',
    stepPrompts: [
      'Cold filtered water being poured into percolator to measurement marks',
      'Percolator basket and tube assembly being inserted into pot',
      'Coarse coffee grounds being added to percolator basket',
      'Percolator on medium heat with coffee beginning to bubble in glass knob',
      'Finished percolator coffee being served after 7-10 minutes brewing'
    ]
  },
  {
    title: 'Cold Brew French Press',
    method: 'Cold Brew French Press',
    documentId: 'd45mstdntj4271vqpufmn6c6',
    featuredPrompt: 'French press being used for cold brew preparation, coarse coffee grounds steeping in cold water, extended brewing time, alternative cold brewing method',
    stepPrompts: [
      'Very coarse coffee grounds, breadcrumb consistency for cold extraction',
      'Cold filtered water being poured over coffee grounds in French press',
      'French press with plunger up, steeping for 12-24 hours',
      'Plunger being slowly pressed down after long steeping period',
      'Cold brew concentrate being served over ice with dilution options'
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

async function generateImage(prompt, filename) {
  try {
    console.log(`Generating image: ${filename}`);
    console.log(`Prompt: ${prompt}`);
    
    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: prompt,
          width: 1024,
          height: 768,
          output_format: "jpg",
          output_quality: 90,
          safety_tolerance: 5
        }
      }
    );

    // Download the generated image
    const imagePath = path.join(__dirname, 'temp_images', filename);
    await downloadImage(output, imagePath);
    
    // Upload to Strapi
    const uploadedFile = await uploadToStrapi(imagePath, filename);
    
    // Clean up temp file
    fs.unlinkSync(imagePath);
    
    return uploadedFile;
  } catch (error) {
    console.error(`Error generating image ${filename}:`, error);
    return null;
  }
}

async function generateImagesForGuide(guide) {
  console.log(`\n=== Generating images for ${guide.title} ===`);
  
  const images = {
    featured: null,
    steps: []
  };

  // Create temp directory if it doesn't exist
  const tempDir = path.join(__dirname, 'temp_images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Generate featured image
  const featuredFilename = `${guide.method.toLowerCase().replace(/\s+/g, '-')}-featured.jpg`;
  images.featured = await generateImage(guide.featuredPrompt, featuredFilename);
  
  // Generate step images
  for (let i = 0; i < guide.stepPrompts.length; i++) {
    const stepFilename = `${guide.method.toLowerCase().replace(/\s+/g, '-')}-step-${i + 1}.jpg`;
    const stepImage = await generateImage(guide.stepPrompts[i], stepFilename);
    if (stepImage) {
      images.steps.push(stepImage);
    }
  }

  return images;
}

async function updateGuideWithImages(guide, images) {
  try {
    const updateData = {};
    
    if (images.featured) {
      updateData.featured_image = images.featured.id;
    }
    
    if (images.steps.length > 0) {
      updateData.step_images = images.steps.map(img => img.id);
    }

    const response = await axios.put(
      `${STRAPI_URL}/api/brewing-guides/${guide.documentId}`,
      { data: updateData },
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Updated ${guide.title} with ${images.steps.length} step images and featured image`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating ${guide.title}:`, error.response?.data || error.message);
    return null;
  }
}

async function generateAllImages() {
  console.log('🎨 Starting image generation for all brewing guides...\n');
  
  for (const guide of brewingGuides) {
    try {
      const images = await generateImagesForGuide(guide);
      await updateGuideWithImages(guide, images);
      
      // Add delay between guides to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error processing ${guide.title}:`, error);
    }
  }
  
  console.log('\n🎉 Image generation complete!');
}

// Run if called directly
if (require.main === module) {
  generateAllImages().catch(console.error);
}

module.exports = {
  generateAllImages,
  generateImagesForGuide,
  brewingGuides
};