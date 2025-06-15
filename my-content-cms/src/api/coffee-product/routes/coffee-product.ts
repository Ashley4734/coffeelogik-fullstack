export default {
  routes: [
    {
      method: 'GET',
      path: '/coffee-products',
      handler: 'coffee-product.find',
    },
    {
      method: 'GET',
      path: '/coffee-products/:id',
      handler: 'coffee-product.findOne',
    },
  ],
};