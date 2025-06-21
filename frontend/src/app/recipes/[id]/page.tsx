import Link from "next/link";
import { ArrowLeftIcon, ClockIcon, UsersIcon, AcademicCapIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { getRecipe, getStrapiMedia } from "@/lib/api";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Metadata } from "next";
import { generateRecipeStructuredData } from "@/components/SEO";

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

// Generate metadata for each recipe
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const recipe = await getRecipe(id);
    const imageUrl = recipe.featured_image ? getStrapiMedia(recipe.featured_image.url) : null;
    const url = `/recipes/${recipe.slug || id}`;
    
    return {
      title: `${recipe.name} - Coffee Recipe`,
      description: recipe.description || `Learn how to make ${recipe.name} with our detailed ${recipe.brew_method} recipe guide. Perfect for ${recipe.difficulty_level.toLowerCase()} coffee enthusiasts.`,
      keywords: `${recipe.name}, ${recipe.brew_method}, coffee recipe, ${recipe.difficulty_level}, brewing guide`,
      authors: recipe.author ? [{ name: recipe.author.name }] : undefined,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${recipe.name} - Coffee Recipe`,
        description: recipe.description || `Learn how to make ${recipe.name} with our detailed ${recipe.brew_method} recipe guide.`,
        url: url,
        type: 'article',
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: recipe.name,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${recipe.name} - Coffee Recipe`,
        description: recipe.description || `Learn how to make ${recipe.name} with our detailed ${recipe.brew_method} recipe guide.`,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for recipe:', error);
    return {
      title: 'Coffee Recipe - CoffeeLogik',
      description: 'Discover detailed coffee brewing recipes and techniques.',
    };
  }
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let recipe: import("@/lib/api").CoffeeRecipe | null = null;

  try {
    recipe = await getRecipe(id);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    notFound();
  }

  if (!recipe) {
    notFound();
  }
  
  // Generate structured data for the recipe
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.map(ing => {
    if (typeof ing === "object" && ing !== null && "item" in ing) {
      const item = ing as {item: string; amount?: string};
      return item.item + (item.amount ? ` - ${item.amount}` : "");
    }
    return String(ing);
  }) : [];
  
  const structuredData = generateRecipeStructuredData({
    name: recipe.name,
    description: recipe.description || `A delicious ${recipe.brew_method} coffee recipe`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com'}/recipes/${recipe.slug || id}`,
    imageUrl: recipe.featured_image ? getStrapiMedia(recipe.featured_image.url) : undefined,
    prepTime: recipe.prep_time,
    totalTime: recipe.total_time,
    servings: recipe.servings,
    ingredients,
    instructions: recipe.instructions,
    authorName: recipe.author?.name,
  });
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/recipes"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${getDifficultyColor(recipe.difficulty_level)}`}>
                  {recipe.difficulty_level}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-4">
                {recipe.name}
              </h1>
              
              <p className="text-xl leading-8 text-gray-600 mb-6">
                {recipe.description}
              </p>
              
              {/* Recipe Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  <span>{recipe.total_time ? `${recipe.total_time} min` : "Quick"}</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="mr-2 h-4 w-4" />
                  <span>{recipe.servings} serving{recipe.servings > 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center">
                  <AcademicCapIcon className="mr-2 h-4 w-4" />
                  <span>{recipe.brew_method}</span>
                </div>
              </div>
            </div>

            {/* Recipe Image */}
            <div className="mb-12">
              <div className="aspect-[2/1] w-full rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
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
            </div>

            {/* Instructions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: marked(recipe.instructions) }} />
            </div>

            {/* Tips */}
            {recipe.tips && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pro Tips</h2>
                <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: marked(recipe.tips) }} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="mt-12 lg:mt-0">
            {/* Recipe Details */}
            <div className="bg-amber-50 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Details</h3>
              <div className="space-y-4 text-sm">
                {recipe.coffee_amount && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Coffee Amount:</span>
                    <span className="font-bold text-gray-900 text-amber-700 bg-amber-50 px-3 py-1 rounded-full">{recipe.coffee_amount}</span>
                  </div>
                )}
                {recipe.water_amount && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Water Amount:</span>
                    <span className="font-bold text-gray-900 text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{recipe.water_amount}</span>
                  </div>
                )}
                {recipe.grind_size && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Grind Size:</span>
                    <span className="font-bold text-gray-900 text-green-700 bg-green-50 px-3 py-1 rounded-full">{recipe.grind_size}</span>
                  </div>
                )}
                {recipe.water_temperature && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Water Temp:</span>
                    <span className="font-bold text-gray-900 text-red-700 bg-red-50 px-3 py-1 rounded-full">{recipe.water_temperature}</span>
                  </div>
                )}
                {recipe.prep_time && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">Prep Time:</span>
                    <span className="font-bold text-gray-900 text-purple-700 bg-purple-50 px-3 py-1 rounded-full">{recipe.prep_time} min</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                <ul className="space-y-2 text-sm">
                  {recipe.ingredients.map((ingredient, index) => {
                    let displayText = "";
                    if (typeof ingredient === "object" && ingredient !== null && "item" in ingredient) {
                      const item = ingredient as {item: string; amount?: string};
                      displayText = item.item + (item.amount ? ` - ${item.amount}` : "");
                    } else {
                      displayText = String(ingredient);
                    }
                    
                    return (
                      <li key={index} className="flex gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{displayText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Equipment */}
            {recipe.equipment_needed && Array.isArray(recipe.equipment_needed) && recipe.equipment_needed.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Needed</h3>
                <ul className="space-y-2 text-sm">
                  {recipe.equipment_needed.map((item, index) => {
                    let displayText = "";
                    if (typeof item === "object" && item !== null && "item" in item) {
                      const equipment = item as {item: string; essential?: boolean};
                      displayText = equipment.item + (equipment.essential === false ? " (optional)" : "");
                    } else {
                      displayText = String(item);
                    }
                    
                    return (
                      <li key={index} className="flex gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{displayText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
