export const revalidate = 60; // Revalidate every 60 seconds

import { getRecipes } from "@/lib/api";
import RecipeContent from "@/components/RecipeContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Coffee Recipes - Step-by-Step Brewing Guides',
  description: 'Master coffee brewing with our collection of detailed recipes for espresso, pour over, French press, and more. Perfect guides for beginners to experts.',
  keywords: 'coffee recipes, brewing guides, espresso recipes, pour over, french press, cold brew, coffee instructions',
  openGraph: {
    title: 'Coffee Recipes - Step-by-Step Brewing Guides',
    description: 'Master coffee brewing with our collection of detailed recipes for espresso, pour over, French press, and more.',
    type: 'website',
  },
  alternates: {
    canonical: '/recipes',
  },
};

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