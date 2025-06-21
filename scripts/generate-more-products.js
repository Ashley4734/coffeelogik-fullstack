require('dotenv').config();
const axios = require('axios');

// Strapi configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://y0o4w84ckoockck8o0ss8s48.tealogik.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Additional sample coffee products
const additionalProducts = [
  {
    name: "Breville Barista Express Espresso Machine",
    slug: "breville-barista-express-espresso-machine",
    brand: "Breville",
    product_type: "Espresso Machine",
    origin: null,
    roast_level: null,
    flavor_notes: [],
    description: "The Breville Barista Express is the perfect entry-level espresso machine for home baristas. With its built-in conical burr grinder, 15-bar pressure pump, and precise temperature control, you can create café-quality espresso drinks at home. Features include adjustable grind size, dose control, and a powerful steam wand for milk texturing.",
    price: 699.95,
    rating: 4.5,
    pros: [
      "Built-in conical burr grinder",
      "15-bar pressure pump", 
      "Precise temperature control",
      "Great value for money",
      "Easy to use for beginners"
    ],
    cons: [
      "Can be loud when grinding",
      "Limited water tank capacity",
      "Plastic construction on some parts"
    ],
    affiliate_link: "https://amzn.to/3BrevilleBarista",
    featured: true
  },
  {
    name: "Colombian Supremo Dark Roast",
    slug: "colombian-supremo-dark-roast", 
    brand: "Lavazza",
    product_type: "Coffee Beans",
    origin: "Colombia",
    roast_level: "Dark",
    flavor_notes: ["Chocolate", "Caramel", "Nutty", "Low acidity", "Full body"],
    description: "Lavazza's Colombian Supremo showcases the rich, full-bodied character that Colombian coffee is famous for. This dark roast brings out deep chocolate and caramel notes while maintaining the bean's natural smoothness. Perfect for espresso, French press, or any brewing method where you want a bold, satisfying cup with minimal acidity.",
    price: 18.99,
    rating: 4.3,
    pros: [
      "Rich, full-bodied flavor",
      "Low acidity",
      "Great for espresso",
      "Consistent quality",
      "Affordable premium coffee"
    ],
    cons: [
      "May be too dark for some",
      "Limited origin complexity",
      "Not ideal for filter methods"
    ],
    affiliate_link: "https://amzn.to/3ColombianSupremo",
    featured: false
  },
  {
    name: "Baratza Encore Conical Burr Grinder",
    slug: "baratza-encore-conical-burr-grinder",
    brand: "Baratza",
    product_type: "Coffee Grinder",
    origin: null,
    roast_level: null,
    flavor_notes: [],
    description: "The Baratza Encore is the gold standard for entry-level coffee grinders. With 40 individual grind settings and a powerful DC motor, it delivers consistent particle size for any brewing method. The conical burr design minimizes heat and ensures uniform extraction, while the simple operation makes it perfect for both beginners and experienced coffee enthusiasts.",
    price: 169.00,
    rating: 4.6,
    pros: [
      "40 grind settings",
      "Consistent particle size",
      "Conical burr design",
      "Easy to clean",
      "Excellent customer support"
    ],
    cons: [
      "Can be messy",
      "Some retention of grounds",
      "Plastic hopper"
    ],
    affiliate_link: "https://amzn.to/3BaratzaEncore",
    featured: false
  },
  {
    name: "Hario V60 Ceramic Coffee Dripper",
    slug: "hario-v60-ceramic-coffee-dripper",
    brand: "Hario",
    product_type: "Brewing Equipment",
    origin: "Japan",
    roast_level: null,
    flavor_notes: [],
    description: "The iconic Hario V60 has revolutionized pour-over coffee brewing worldwide. Its unique 60-degree angle, spiral ribs, and large drainage hole work together to provide optimal water flow and extraction. Made from high-quality ceramic that retains heat well, this dripper is perfect for highlighting the nuanced flavors of single-origin coffees.",
    price: 23.50,
    rating: 4.8,
    pros: [
      "Excellent heat retention",
      "Optimal extraction design",
      "Easy to clean",
      "Durable ceramic construction",
      "Classic Japanese craftsmanship"
    ],
    cons: [
      "Requires specific technique",
      "Can break if dropped",
      "Learning curve for beginners"
    ],
    affiliate_link: "https://amzn.to/3HarioV60",
    featured: false
  },
  {
    name: "Jamaican Blue Mountain Peaberry",
    slug: "jamaican-blue-mountain-peaberry",
    brand: "Wallenford Estate",
    product_type: "Coffee Beans",
    origin: "Blue Mountain, Jamaica",
    roast_level: "Medium",
    flavor_notes: ["Mild", "Sweet", "Smooth", "Chocolate hints", "No bitterness"],
    description: "Considered one of the world's finest coffees, Jamaican Blue Mountain Peaberry represents the pinnacle of coffee excellence. Grown in the misty Blue Mountains at elevations above 3,000 feet, these rare peaberry beans (only 5% of the harvest) offer an exceptionally smooth, mild flavor with subtle chocolate undertones and zero bitterness. A true luxury coffee experience.",
    price: 89.95,
    rating: 4.9,
    pros: [
      "World's finest coffee reputation",
      "Extremely smooth and mild",
      "Zero bitterness",
      "Rare peaberry beans",
      "Perfect balance"
    ],
    cons: [
      "Very expensive",
      "Mild flavor may disappoint bold coffee lovers",
      "Limited availability"
    ],
    affiliate_link: "https://amzn.to/3JamaicanBlueMountain",
    featured: true
  }
];

async function createProduct(productData) {
  try {
    console.log(`📦 Creating product: ${productData.name}`);
    
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

    console.log(`✅ Created: ${response.data.data.name} - $${response.data.data.price} (${response.data.data.rating}⭐)`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error creating ${productData.name}:`, error.response?.data || error.message);
    return null;
  }
}

async function generateMoreProducts() {
  console.log('🛍️ Creating additional sample coffee products...\n');
  
  let successCount = 0;
  
  for (const product of additionalProducts) {
    try {
      const result = await createProduct(product);
      if (result) {
        successCount++;
      }
      
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${product.name}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Product creation complete!`);
  console.log(`📊 Successfully created ${successCount}/${additionalProducts.length} products`);
  console.log(`🛒 Product catalog now includes:`);
  console.log(`  • Coffee beans (3 origins)`);
  console.log(`  • Espresso machine (1 model)`);
  console.log(`  • Coffee grinder (1 model)`);
  console.log(`  • Brewing equipment (1 dripper)`);
}

// Run if called directly
if (require.main === module) {
  generateMoreProducts().catch(console.error);
}

module.exports = { generateMoreProducts, additionalProducts };