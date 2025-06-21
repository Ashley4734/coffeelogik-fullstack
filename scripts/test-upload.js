require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://y0o4w84ckoockck8o0ss8s48.tealogik.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function testUpload() {
  try {
    const FormData = require('form-data');
    const formData = new FormData();
    
    const imagePath = path.join(__dirname, 'temp_images', 'pour-over-featured.jpg');
    
    if (!fs.existsSync(imagePath)) {
      console.log('❌ Image file not found:', imagePath);
      return;
    }
    
    formData.append('files', fs.createReadStream(imagePath), {
      filename: 'pour-over-featured.jpg',
      contentType: 'image/jpeg'
    });

    console.log('🔑 Using API Token:', STRAPI_API_TOKEN.substring(0, 20) + '...');
    console.log('📤 Uploading to:', `${STRAPI_URL}/api/upload`);

    const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        ...formData.getHeaders()
      }
    });

    console.log('✅ Upload successful!');
    console.log('📷 Uploaded file:', response.data[0]);
    return response.data[0];
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('🔍 Token seems invalid. Checking token format...');
      console.log('Token length:', STRAPI_API_TOKEN?.length);
      console.log('Token starts with correct format:', STRAPI_API_TOKEN?.match(/^[a-f0-9]{64}$/));
    }
  }
}

testUpload();