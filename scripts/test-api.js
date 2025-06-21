require('dotenv').config();
const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function testAPI() {
  console.log('Testing Replicate API connection...');
  console.log('API Token (first 10 chars):', process.env.REPLICATE_API_TOKEN?.substring(0, 10));
  
  try {
    // Test with a simple text-to-image model
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: "A simple coffee cup on a white background",
          width: 512,
          height: 512,
          output_format: "jpg"
        }
      }
    );
    
    console.log('✅ API test successful!');
    console.log('Generated image URL:', output);
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    return false;
  }
}

testAPI();