// src/api/blog-post/content-types/blog-post/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    
    // Auto-optimize meta description if it's too long
    if (data.meta_description && data.meta_description.length > 160) {
      data.meta_description = optimizeMetaDescription(data.meta_description);
      console.log(`Auto-optimized meta description: ${data.meta_description.length} chars`);
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    
    // Auto-optimize meta description if it's too long
    if (data.meta_description && data.meta_description.length > 160) {
      data.meta_description = optimizeMetaDescription(data.meta_description);
      console.log(`Auto-optimized meta description: ${data.meta_description.length} chars`);
    }
    
    // If this is just a meta update (only meta_title and/or meta_description being changed)
    // preserve the original publishedAt timestamp
    const updateFields = Object.keys(data);
    const isMetaOnlyUpdate = updateFields.every(field => 
      ['meta_title', 'meta_description'].includes(field)
    );
    
    if (isMetaOnlyUpdate) {
      // Fetch the existing record to get the current publishedAt
      const existingRecord = await strapi.db.query('api::blog-post.blog-post').findOne({
        where: where,
        select: ['publishedAt']
      });
      
      if (existingRecord && existingRecord.publishedAt) {
        // Preserve the original publishedAt timestamp
        data.publishedAt = existingRecord.publishedAt;
      }
    }
  }
};

/**
 * Optimizes meta description to be under 160 characters while preserving meaning
 * @param {string} description - Original meta description
 * @returns {string} - Optimized meta description
 */
function optimizeMetaDescription(description) {
  if (description.length <= 160) return description;
  
  let optimized = description;
  
  // Remove common filler phrases that don't add SEO value
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
