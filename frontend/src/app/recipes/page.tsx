import Link from "next/link";
import { ClockIcon, AcademicCapIcon, UsersIcon } from "@heroicons/react/24/outline";
import { getRecipes, getStrapiMedia } from "@/lib/api";

const brewMethods = [
  "All Methods",
  "Espresso",
  "Pour Over",
  "French Press",
  "AeroPress",
  "Cold Brew",
  "Chemex"
];

const difficulties = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced"
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "Intermediate":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "Advanced":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
}

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
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair">
            Coffee Recipes
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Master the art of coffee brewing with our step-by-step guides for every skill level and brewing method.
          </p>
        </div>

        {/* Filters */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-6">
            {/* Brew Method Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Brewing Method</h3>
              <div className="flex flex-wrap gap-2">
                {brewMethods.map((method) => (
                  <button
                    key={method}
                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Difficulty Level</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Recipes */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Featured Recipes</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {recipes.filter(recipe => recipe.featured).length > 0 ? recipes.filter(recipe => recipe.featured).map((recipe) => (
              <div key={recipe.id} className="group relative bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6">
                  {recipe.featured_image ? (
                    <img
                      src={getStrapiMedia(recipe.featured_image.url)}
                      alt={recipe.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-8xl">☕</span>
                  )}
                </div>
                
                <div className="mb-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getDifficultyColor(recipe.difficulty_level)}`}>
                    {recipe.difficulty_level}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                  <Link href={`/recipes/${recipe.slug}`}>
                    <span className="absolute inset-0" />
                    {recipe.name}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="mr-1 h-3 w-3" />
                    <span>{recipe.total_time ? `${recipe.total_time} min` : 'Quick'}</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="mr-1 h-3 w-3" />
                    <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="mr-1 h-3 w-3" />
                    <span>{recipe.brew_method}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-8xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured recipes yet</h3>
                <p className="text-gray-600">Create some coffee recipes in Strapi and mark them as featured to see them here.</p>
              </div>
            )}
          </div>
        </div>

        {/* All Recipes */}
        <div className="mx-auto mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">All Recipes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.length > 0 ? recipes.map((recipe) => (
              <div key={recipe.id} className="group relative bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                  {recipe.featured_image ? (
                    <img
                      src={getStrapiMedia(recipe.featured_image.url)}
                      alt={recipe.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-6xl">☕</span>
                  )}
                </div>
                
                <div className="mb-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getDifficultyColor(recipe.difficulty_level)}`}>
                    {recipe.difficulty_level}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                  <Link href={`/recipes/${recipe.slug}`}>
                    <span className="absolute inset-0" />
                    {recipe.name}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="mr-1 h-3 w-3" />
                    <span>{recipe.total_time ? `${recipe.total_time} min` : 'Quick'}</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="mr-1 h-3 w-3" />
                    <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <AcademicCapIcon className="mr-1 h-3 w-3" />
                    <span>{recipe.brew_method}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <span className="text-6xl mb-4 block">☕</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes yet</h3>
                <p className="text-gray-600">Create some coffee recipes in Strapi to see them here.</p>
                <Link href="http://localhost:1337/admin" target="_blank" className="inline-flex items-center mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                  Go to Strapi Admin
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-20 max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-gray-600 mb-8">
            Submit a recipe request and our coffee experts will create a custom brewing guide just for you.
          </p>
          <button className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors">
            Request a Recipe
          </button>
        </div>
      </div>
    </div>
  );
}