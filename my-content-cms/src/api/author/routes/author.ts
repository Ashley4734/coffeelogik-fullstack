export default {
  routes: [
    {
      method: 'GET',
      path: '/authors',
      handler: 'author.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/authors/:id',
      handler: 'author.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};