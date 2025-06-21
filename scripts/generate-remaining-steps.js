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

// Remaining brewing guides with step images
const remainingStepGuides = [
  {
    title: 'Cold Brew Concentrate',
    documentId: 'wmbhw45puv93w2y65xgw89pd',
    method: 'cold-brew',
    stepPrompts: [
      'Very coarse coffee grounds spread out on surface, breadcrumb-like texture clearly visible, professional coffee photography',
      'Coffee grounds being combined with room temperature water in large glass jar, saturation process',
      'Sealed jar steeping at room temperature, timer showing 12 hours, minimalist kitchen setting',
      'Fine mesh strainer filtering cold brew concentrate into clean glass container, golden liquid flowing',
      'Cold brew concentrate being stored in refrigerator, glass bottles with labels, organized storage'
    ]
  },
  {
    title: 'Chemex Classic Technique',
    documentId: 'gngcf8iqr5pribq1toptvr9b',
    method: 'chemex',
    stepPrompts: [
      'Chemex filter being unfolded with triple-fold facing the spout, paper filter preparation technique',
      'Medium-coarse coffee grounds in Chemex filter with small well in center, perfect preparation',
      'Hot water being poured in slow spiral pattern over coffee grounds, gooseneck kettle technique',
      'Coffee slowly dripping through Chemex filter into lower chamber, controlled extraction process',
      'Finished Chemex coffee being served in elegant glassware, clean and bright appearance'
    ]
  },
  {
    title: 'AeroPress Championship Recipe',
    documentId: 't4778rbtvt1n08undf8r2pkq',
    method: 'aeropress',
    stepPrompts: [
      'AeroPress assembled in inverted position with plunger 1cm inserted, championship setup technique',
      'Medium-fine coffee grounds being added to inverted AeroPress chamber, precise measurement',
      'Hot water being poured into AeroPress with timer showing brewing time, temperature control',
      'AeroPress being flipped onto cup for final extraction phase, championship brewing technique',
      'AeroPress being pressed down with steady pressure for 30 seconds, perfect extraction timing'
    ]
  },
  {
    title: 'Moka Pot Mastery',
    documentId: 'ztyawazwhobnvfjjex0p30en',
    method: 'moka-pot',
    stepPrompts: [
      'Moka pot bottom chamber being filled with water up to safety valve, Italian brewing tradition',
      'Medium-coarse coffee grounds filling filter basket, leveled gently without pressing down',
      'Moka pot assembled and placed on medium heat stovetop, classic Italian kitchen setting',
      'Coffee gurgling and flowing into upper chamber, lid open for monitoring brewing process',
      'Finished Moka pot coffee being poured into small Italian espresso cups, traditional serving'
    ]
  },
  {
    title: 'Authentic Turkish Coffee',
    documentId: 'qkgl44qyqvspb8d5dpsc0h96',
    method: 'turkish-coffee',
    stepPrompts: [
      'Coffee beans being ground to powder consistency, finer than espresso, traditional hand grinder',
      'Cold water, coffee powder, and sugar being mixed in copper cezve, smooth mixture preparation',
      'Cezve placed on very low heat with gentle stirring motion, traditional brewing technique',
      'Foam beginning to rise in cezve, critical timing moment, UNESCO heritage brewing method',
      'Turkish coffee being poured with foam crown into traditional serving cups, cultural presentation'
    ]
  },
  {
    title: 'Siphon Coffee Artistry',
    documentId: 'urv0jkncajxq5k1ebawfq814',
    method: 'siphon',
    stepPrompts: [
      'Siphon coffee maker assembled with cloth filter secured in upper chamber, scientific setup',
      'Water heating in lower chamber, beginning to rise to upper chamber, vacuum effect demonstration',
      'Coffee grounds being added to upper chamber with bamboo paddle, precise brewing technique',
      'Coffee brewing in upper chamber for 90 seconds with gentle stirring, temperature control',
      'Vacuum effect drawing finished coffee back to lower chamber, theatrical brewing finale'
    ]
  },
  {
    title: 'Vietnamese Phin Coffee',
    documentId: 'ezv32025dz49fwouvpt4o88z',
    method: 'vietnamese-phin',
    stepPrompts: [
      'Sweetened condensed milk being placed in bottom of glass cup, traditional Vietnamese preparation',
      'Coarse coffee grounds being added to phin filter chamber, level distribution technique',
      'Gravity press being placed on coffee grounds with gentle pressure, proper compression',
      'Small amount of hot water blooming coffee for 30 seconds, initial extraction phase',
      'Slow drip extraction through phin filter taking 4-5 minutes, patient brewing process'
    ]
  },
  {
    title: 'Percolator Classic Brew',
    documentId: 'n3muf7i1dtize6u4yzy36b33',
    method: 'percolator',
    stepPrompts: [
      'Cold filtered water being poured into percolator to measurement marks, classic American brewing',
      'Percolator basket and tube assembly being inserted into pot, traditional setup',
      'Coarse coffee grounds being added to percolator basket, proper grind size demonstration',
      'Percolator on medium heat with coffee beginning to bubble in glass knob, brewing indication',
      'Finished percolator coffee being served after 7-10 minutes brewing, nostalgic presentation'
    ]
  },
  {
    title: 'Cold Brew French Press',
    documentId: 'd45mstdntj4271vqpufmn6c6',
    method: 'cold-brew-french-press',
    stepPrompts: [
      'Very coarse coffee grounds with breadcrumb consistency for cold extraction, texture detail',
      'Cold filtered water being poured over coffee grounds in French press, saturation process',
      'French press with plunger up, steeping for 12-24 hours, extended brewing time',
      'Plunger being slowly pressed down after long steeping period, gentle extraction technique',
      'Cold brew concentrate being served over ice with dilution options, refreshing presentation'
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

async function generateAllRemainingStepImages() {
  console.log('🎬 Starting step image generation for remaining brewing guides...\n');
  
  let totalImages = 0;
  let processedGuides = 0;
  
  for (const guide of remainingStepGuides) {
    try {
      const stepImages = await generateStepImagesForGuide(guide);
      await updateGuideWithStepImages(guide, stepImages);
      
      totalImages += stepImages.length;
      processedGuides++;
      
      // Add delay between guides
      if (processedGuides < remainingStepGuides.length) {
        console.log('\n⏳ Waiting 5 seconds before next guide...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`Error processing ${guide.title}:`, error.message);
    }
  }
  
  console.log('\n🎉 All remaining step image generation complete!');
  console.log(`📊 Processed ${processedGuides} brewing methods`);
  console.log(`📷 Generated ${totalImages} step images`);
  console.log(`🎯 Total brewing guides now have step images: ${processedGuides + 3}`);
}

// Run if called directly
if (require.main === module) {
  generateAllRemainingStepImages().catch(console.error);
}

module.exports = { generateAllRemainingStepImages, remainingStepGuides };