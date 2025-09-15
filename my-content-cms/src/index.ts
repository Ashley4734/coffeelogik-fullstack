export default {
  register(/* { strapi } */) {
    // Register global lifecycle hooks for all content types
  },

  bootstrap({ strapi }) {
    // List of content types that should have meta description optimization
    const contentTypesWithMeta = [
      'api::blog-post.blog-post',
      'api::category.category', 
      'api::coffee-product.coffee-product',
      'api::coffee-recipe.coffee-recipe',
      'api::brewing-guide.brewing-guide'
    ];

    // Add lifecycle hooks to each content type
    contentTypesWithMeta.forEach(contentType => {
      strapi.db.lifecycles.subscribe({
        models: [contentType],
        
        async beforeCreate(event) {
          const { data } = event.params;
          
          if (data.meta_description && data.meta_description.length > 160) {
            data.meta_description = optimizeMetaDescription(data.meta_description);
            console.log(`Auto-optimized meta description for ${contentType}: ${data.meta_description.length} chars`);
          }
        },

        async beforeUpdate(event) {
          const { data } = event.params;
          
          if (data.meta_description && data.meta_description.length > 160) {
            data.meta_description = optimizeMetaDescription(data.meta_description);
            console.log(`Auto-optimized meta description for ${contentType}: ${data.meta_description.length} chars`);
          }
        }
      });
    });
  },
};

/**
 * Optimizes meta description to be under 160 characters while preserving meaning
 */
function optimizeMetaDescription(description) {
  if (description.length <= 160) return description;
  
  let optimized = description;
  
  // Remove common filler phrases
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
  
  // Replace wordy phrases with shorter alternatives
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
  
  // Clean up extra spaces
  optimized = optimized.replace(/\s+/g, ' ').trim();
  
  // If still too long, truncate intelligently
  if (optimized.length > 160) {
    // Try to cut at sentence boundary first
    const sentences = optimized.split('. ');
    let result = sentences[0];
    
    for (let i = 1; i < sentences.length && (result + '. ' + sentences[i]).length <= 157; i++) {
      result += '. ' + sentences[i];
    }
    
    // If first sentence is still too long, cut at word boundary
    if (result.length > 157) {
      const words = optimized.split(' ');
      result = '';
      for (let i = 0; i < words.length; i++) {
        const testLength = (result + (result ? ' ' : '') + words[i]).length;
        if (testLength <= 157) {
          result += (result ? ' ' : '') + words[i];
        } else {
          break;
        }
      }
    }
    
    // Add ellipsis if we cut the description
    if (result.length < optimized.length) {
      result += (result.endsWith('.') ? '..' : '...');
    }
    
    optimized = result;
  }
  
  return optimized.trim();
}
