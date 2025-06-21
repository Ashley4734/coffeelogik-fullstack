import Link from "next/link";
import { ArrowLeftIcon, ClockIcon, UserIcon, AcademicCapIcon, BeakerIcon } from "@heroicons/react/24/outline";
import { getBrewingGuide, getStrapiMedia } from "@/lib/api";
import { notFound } from "next/navigation";
import { marked } from "marked";

// Helper function to convert Strapi rich text to markdown string
interface RichTextChild {
  text?: string;
}

interface RichTextBlock {
  type: string;
  children?: RichTextChild[];
  format?: string;
  level?: number;
}

function strapiRichTextToMarkdown(richText: string | RichTextBlock[]): string {
  if (typeof richText === 'string') {
    return richText;
  }
  
  if (!richText || !Array.isArray(richText)) {
    return '';
  }
  
  return richText.map((block: RichTextBlock) => {
    if (block.type === 'paragraph') {
      return block.children?.map((child: RichTextChild) => child.text || '').join('') || '';
    } else if (block.type === 'list') {
      const items = block.children?.map((item: RichTextChild | RichTextBlock) => {
        const text = (item as RichTextBlock).children?.map((child: RichTextChild) => child.text || '').join('') || '';
        return block.format === 'ordered' ? `1. ${text}` : `- ${text}`;
      }).join('\n') || '';
      return items;
    } else if (block.type === 'heading') {
      const level = '#'.repeat(Math.min(block.level || 1, 6));
      const text = block.children?.map((child: RichTextChild) => child.text || '').join('') || '';
      return `${level} ${text}`;
    }
    return '';
  }).filter(Boolean).join('\n\n');
}

export default async function BrewingGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let guide: import("@/lib/api").BrewingGuide | null = null;

  try {
    // Fetch the specific brewing guide by slug
    guide = await getBrewingGuide(id);
  } catch (error) {
    // Log error but don't spam console with repeated messages
    if (process.env.NODE_ENV === 'development') {
      console.error(`Brewing guide not found for slug: ${id}`);
    }
    notFound();
  }

  if (!guide) {
    notFound();
  }

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/brewing-guides"
            className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Brewing Guides
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          {/* Method and Difficulty */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-600">
              {guide.method}
            </span>
            <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
              guide.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-800' :
              guide.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <AcademicCapIcon className="mr-1 h-4 w-4" />
              {guide.difficulty_level}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
            {guide.title}
          </h1>

          {guide.description && (
            <p className="text-xl text-gray-600 mb-8">
              {guide.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            {guide.prep_time && (
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4" />
                <span>Prep: {guide.prep_time} min</span>
              </div>
            )}
            {guide.total_time && (
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4" />
                <span>Total: {guide.total_time} min</span>
              </div>
            )}
            <div className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>{guide.servings} serving{guide.servings > 1 ? 's' : ''}</span>
            </div>
            {guide.author && (
              <div className="flex items-center">
                <span>By {guide.author.name}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {guide.featured_image && (
            <div className="aspect-[16/9] w-full rounded-2xl bg-gray-100 overflow-hidden mb-8">
              <img
                src={getStrapiMedia(guide.featured_image.url)}
                alt={guide.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            {guide.overview && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: marked(strapiRichTextToMarkdown(guide.overview)) }} />
              </div>
            )}

            {/* Steps */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Instructions</h2>
              <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: marked(strapiRichTextToMarkdown(guide.steps)) }} />
            </div>

            {/* Tips */}
            {guide.tips && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pro Tips</h2>
                <div className="bg-amber-50 rounded-lg p-6">
                  <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: marked(strapiRichTextToMarkdown(guide.tips)) }} />
                </div>
              </div>
            )}

            {/* Step Images */}
            {guide.step_images && guide.step_images.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Visual Guide</h2>
                <div className="grid grid-cols-2 gap-4">
                  {guide.step_images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                      <img
                        src={getStrapiMedia(image.url)}
                        alt={`Step ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Equipment */}
              {guide.equipment && Array.isArray(guide.equipment) && guide.equipment.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BeakerIcon className="mr-2 h-5 w-5" />
                    Equipment Needed
                  </h3>
                  <ul className="space-y-2">
                    {guide.equipment.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              {guide.ingredients && Array.isArray(guide.ingredients) && guide.ingredients.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {guide.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span className="text-gray-700 text-sm">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-amber-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium text-gray-900">{guide.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium text-gray-900">{guide.difficulty_level}</span>
                  </div>
                  {guide.total_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Time:</span>
                      <span className="font-medium text-gray-900">{guide.total_time} min</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Servings:</span>
                    <span className="font-medium text-gray-900">{guide.servings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Guides CTA */}
        <div className="mt-20">
          <div className="bg-amber-50 rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              Explore More Brewing Methods
            </h2>
            <p className="text-gray-600 mb-6">
              Master different brewing techniques and discover your perfect cup with our comprehensive guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/brewing-guides" className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                View All Guides
              </Link>
              <Link href="/products" className="rounded-md border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50">
                Shop Equipment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}