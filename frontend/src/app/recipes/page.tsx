export const revalidate = 60; // Revalidate every 60 seconds

import { getRecipes } from "@/lib/api";
import RecipeContent from "@/components/RecipeContent";

const brewMethods = [
  "All Methods",
  "Espresso",
  "Pour Over",
  "French Press",
  "AeroPress",
  "Cold Brew",
  "Chemex",
  "V60",
  "Moka Pot",
  "Turkish"
];

const difficulties = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced"
];

export default async function RecipesPage() {
  // Fetch recipes from Strapi
  let recipes: import("@/lib/api").CoffeeRecipe[] = [];

  try {
    const recipesResponse = await getRecipes({ limit: 50 });
    recipes = Array.isArray(recipesResponse?.data) ? recipesResponse.data : [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    // Fallback to empty array if Strapi is not available
  }
  return (
    <div className="bg-white">
      <RecipeContent 
        initialRecipes={recipes} 
        brewMethods={brewMethods} 
        difficulties={difficulties} 
      />
    </div>
  );
}