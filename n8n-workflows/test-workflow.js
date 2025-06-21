// Test script for n8n Amazon Coffee Product Automation
// Run this to test your workflows before going live

const axios = require('axios');

// Configuration
const config = {
  n8nWebhookUrl: 'https://your-n8n-instance.com/webhook/import-product',
  testAsins: [
    'B00FLYWNYQ', // Sample coffee product
    'B07CQJBQVH', // Ethiopian coffee beans  
    'B001E5E888', // Dark roast coffee
    'B00I7R4392', // Coffee grinder
    'B07BR7DHNF'  // Espresso machine
  ]
};

async function testProductImport(asin) {
  try {
    console.log(`🧪 Testing ASIN: ${asin}`);
    
    const response = await axios.post(config.n8nWebhookUrl, {
      asin: asin
    }, {
      timeout: 60000 // 60 second timeout
    });
    
    if (response.data.success) {
      console.log(`✅ Success: ${response.data.product.name}`);
      console.log(`   Brand: ${response.data.product.brand}`);
      console.log(`   Price: $${response.data.product.price}`);
      console.log(`   Rating: ${response.data.product.rating}⭐`);
      console.log(`   Strapi ID: ${response.data.product.id}`);
    } else {
      console.log(`❌ Failed: ${response.data.error}`);
    }
    
    return response.data;
  } catch (error) {
    console.log(`❌ Error testing ${asin}:`, error.message);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, error.response.data);
    }
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 Starting n8n Coffee Product Automation Tests\\n');
  
  const results = {
    successful: 0,
    failed: 0,
    total: config.testAsins.length
  };
  
  for (const asin of config.testAsins) {
    const result = await testProductImport(asin);
    
    if (result && result.success) {
      results.successful++;
    } else {
      results.failed++;
    }
    
    // Wait between tests to avoid rate limiting
    console.log('⏳ Waiting 5 seconds before next test...\\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('📊 Test Results Summary:');
  console.log(`   Total Tests: ${results.total}`);
  console.log(`   Successful: ${results.successful}`);
  console.log(`   Failed: ${results.failed}`);
  console.log(`   Success Rate: ${((results.successful / results.total) * 100).toFixed(1)}%`);
  
  if (results.successful === results.total) {
    console.log('\\n🎉 All tests passed! Your automation is working correctly.');
  } else if (results.successful > 0) {
    console.log('\\n⚠️  Some tests failed. Check your configuration and try again.');
  } else {
    console.log('\\n❌ All tests failed. Please check your setup:');
    console.log('   1. Verify n8n webhook URL is correct');
    console.log('   2. Check Amazon API credentials');
    console.log('   3. Verify AI service API key');
    console.log('   4. Confirm Strapi API token has proper permissions');
  }
}

async function testSingleAsin(asin) {
  console.log(`🧪 Testing single ASIN: ${asin}\\n`);
  await testProductImport(asin);
}

// Run tests
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Test specific ASIN
    testSingleAsin(args[0]);
  } else {
    // Run all tests
    runAllTests();
  }
}

module.exports = {
  testProductImport,
  runAllTests,
  testSingleAsin
};