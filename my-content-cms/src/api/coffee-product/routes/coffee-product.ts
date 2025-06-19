export default {
  routes: [
    {
      method: "GET",
      path: "/coffee-products",
      handler: "coffee-product.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET", 
      path: "/coffee-products/:id",
      handler: "coffee-product.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/coffee-products",
      handler: "coffee-product.create",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/coffee-products/:id",
      handler: "coffee-product.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/coffee-products/:id",
      handler: "coffee-product.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
