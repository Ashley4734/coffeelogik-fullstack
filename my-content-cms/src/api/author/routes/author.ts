export default {
  routes: [
    {
      method: "GET",
      path: "/authors",
      handler: "author.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/authors/:id",
      handler: "author.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/authors",
      handler: "author.create",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/authors/:id",
      handler: "author.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/authors/:id",
      handler: "author.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
