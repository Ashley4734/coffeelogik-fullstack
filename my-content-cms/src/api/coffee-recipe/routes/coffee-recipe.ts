export default {
  routes: [
    {
      method: 'GET',
      path: '/coffee-recipes',
      handler: 'coffee-recipe.find',
    },
    {
      method: 'GET',
      path: '/coffee-recipes/:id',
      handler: 'coffee-recipe.findOne',
    },
  ],
};