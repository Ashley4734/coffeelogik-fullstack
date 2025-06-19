export default {
  routes: [
    {
      method: "GET",
      path: "/coffee-recipes",
      handler: "coffee-recipe.find",
    },
    {
      method: "GET",
      path: "/coffee-recipes/:id",
      handler: "coffee-recipe.findOne",
    },
    {
      method: "POST",
      path: "/coffee-recipes",
      handler: "coffee-recipe.create",
    },
    {
      method: "PUT",
      path: "/coffee-recipes/:id",
      handler: "coffee-recipe.update",
    },
    {
      method: "DELETE",
      path: "/coffee-recipes/:id",
      handler: "coffee-recipe.delete",
    },
  ],
};
