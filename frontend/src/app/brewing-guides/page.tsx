export const revalidate = 60; // Revalidate every 60 seconds

import { getBrewingGuides } from "@/lib/api";
import BrewingGuidesContent from "@/components/BrewingGuidesContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Coffee Brewing Guides - Master Every Method',
  description: 'Learn professional coffee brewing techniques with our comprehensive guides. From pour over to espresso, master every brewing method with expert instruction.',
  keywords: 'coffee brewing guides, brewing methods, pour over guide, espresso guide, french press guide, coffee techniques',
  openGraph: {
    title: 'Coffee Brewing Guides - Master Every Method',
    description: 'Learn professional coffee brewing techniques with our comprehensive guides.',
    type: 'website',
  },
  alternates: {
    canonical: '/brewing-guides',
  },
};

export default async function BrewingGuidesPage() {
  // Fetch brewing guides from Strapi
  let brewingGuides: import("@/lib/api").BrewingGuide[] = [];

  try {
    const guidesResponse = await getBrewingGuides({ limit: 50 });
    brewingGuides = Array.isArray(guidesResponse?.data) ? guidesResponse.data : [];
  } catch (error) {
    console.error('Error fetching brewing guides:', error);
    // Fallback to empty array if Strapi is not available
  }

  return (
    <div className="bg-white">
      <BrewingGuidesContent initialGuides={brewingGuides} />
    </div>
  );
}