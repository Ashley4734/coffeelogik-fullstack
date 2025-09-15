// scripts/bulk-update-meta-descriptions.js
// Run this script from your Strapi project root: node scripts/bulk-update-meta-descriptions.js

/**
 * Optimizes meta description to be under 160 characters
 */
function optimizeMetaDescription(description) {
  if (!description || description.length <= 160) return description;
  
  let optimized = description;
  
  // Remove filler phrases
  const fillerPhrases = [
    ', expertly crafted',
    ' comprehensive',
    ' in-depth',
    ' complete guide to',
    ' ultimate guide to',
    ' detailed guide to',
    ' step-by-step guide to',
    ' and much more',
    ' detailed',
    ' extensive',
    ' everything you need to know about',
    ' all you need to know about'
  ];
  
  fillerPhrases.forEach(phrase => {
    optimized = optimized.replace(new RegExp(phrase, 'gi'), '');
  });
  
  // Replace wordy phrases
  const replacements = [
    [' and discover how to ', ' and '],
    [' learn how to ', ' '],
    [' find out how to ', ' '],
    [' understand how to ', ' '],
    [' explore the world of ', ' explore '],
    [' dive deep into ', ' explore '],
    [' take a deep dive into ', ' explore ']
  ];
  
  replacements.forEach(([search, replace]) => {
    optimized = optimized.replace(new RegExp(search, 'gi'), replace);
  });
  
  optimized = optimized.replace(/\s+/g, ' ').trim();
  
  // Truncate at word boundary if still too long
  if (optimized.length > 160) {
    const sentences = optimized.split('. ');
    let result = sentences[0];
    
    for (let i = 1; i < sentences.length && (result + '. ' + sentences[i]).length <= 157; i++) {
      result += '. ' + sentences[i];
    }
    
    if (result.length > 157) {
      const words = optimized.split(' ');
      result = '';
      for (let i = 0; i < words.length; i++) {
        if ((result + (result ? ' ' : '') + words[i]).length <= 157) {
          result += (result ? ' ' : '') + words[i];
        } else {
          break;
        }
      }
    }
    
    if (result.length < optimized.length) {
      result += (result.endsWith('.') ? '..' : '...');
    }
    
    optimized = result;
  }
  
  return optimized.trim();
}

async function updateMetaDescriptions() {
  let strapi;
  
  try {
    console.log('🚀 Starting Strapi...');
    
    // Import Strapi dynamically for v5 compatibility
    const { createStrapi } = await import('@strapi/strapi');
    strapi = createStrapi();
    await strapi.load();
    
    console.log('📝 Fetching blog posts with long meta descriptions...');
    
    // Get all blog posts using the v5 API
    const blogPosts = await strapi.documents('api::blog-post.blog-post').findMany({
      status: 'published'
    });
    
    console.log(`Found ${blogPosts.length} blog posts to check`);
    
    let updatedCount = 0;
    const updates = [];
    
    for (const post of blogPosts) {
      if (post.meta_description && post.meta_description.length > 160) {
        const originalLength = post.meta_description.length;
        const optimizedDescription = optimizeMetaDescription(post.meta_description);
        
        updates.push({
          id: post.id,
          documentId: post.documentId,
          title: post.title,
          original: post.meta_description,
          originalLength,
          optimized: optimizedDescription,
          optimizedLength: optimizedDescription.length,
          saved: originalLength - optimizedDescription.length
        });
      }
    }
    
    console.log(`\n📊 Found ${updates.length} posts with meta descriptions that need optimization:\n`);
    
    // Display what will be updated
    updates.forEach(update => {
      console.log(`📄 ${update.title}`);
      console.log(`   Original (${update.originalLength} chars): ${update.original.substring(0, 80)}...`);
      console.log(`   Optimized (${update.optimizedLength} chars): ${update.optimized}`);
      console.log(`   💾 Saved: ${update.saved} characters\n`);
    });
    
    // Ask for confirmation (you can remove this and set proceed = true for auto-update)
    if (updates.length > 0) {
      console.log('Do you want to proceed with these updates? Change "proceed = false" to "proceed = true" in the script to auto-update.');
      
      const proceed = false; // Change this to true to auto-update
      
      if (proceed) {
        console.log('⚡ Updating meta descriptions...');
        
        for (const update of updates) {
          try {
            // Use the v5 documents API for updates
            await strapi.documents('api::blog-post.blog-post').update({
              documentId: update.documentId,
              data: {
                meta_description: update.optimized
              }
            });
            
            updatedCount++;
            console.log(`✅ Updated: ${update.title}`);
          } catch (error) {
            console.error(`❌ Failed to update ${update.title}:`, error.message);
          }
        }
        
        console.log(`\n🎉 Successfully updated ${updatedCount} blog post meta descriptions!`);
        console.log(`📊 Total characters saved: ${updates.reduce((sum, u) => sum + u.saved, 0)}`);
      } else {
        console.log('❌ Update cancelled. To proceed, change "proceed = false" to "proceed = true" in the script.');
      }
    } else {
      console.log('✅ All meta descriptions are already within the optimal length!');
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    if (strapi) {
      console.log('👋 Closing Strapi...');
      await strapi.destroy();
    }
    process.exit(0);
  }
}

// Run the script
updateMetaDescriptions();
