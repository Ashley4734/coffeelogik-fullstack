// src/api/blog-post/content-types/blog-post/lifecycles.js

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;
    
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
