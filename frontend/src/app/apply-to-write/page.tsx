export const revalidate = 60; // Revalidate every 60 seconds

import { Metadata } from "next";
import WriterApplicationForm from "@/components/WriterApplicationForm";

export const metadata: Metadata = {
  title: 'Apply to Write for Coffee Logik - Join Our Team',
  description: 'Apply to become a writer for Coffee Logik. Share your coffee expertise and passion with our community of coffee enthusiasts.',
  keywords: 'coffee writer, coffee expert, coffee blog writer, join coffee team, coffee writing opportunities',
  openGraph: {
    title: 'Apply to Write for Coffee Logik - Join Our Team',
    description: 'Apply to become a writer for Coffee Logik. Share your coffee expertise and passion with our community.',
    type: 'website',
  },
  alternates: {
    canonical: '/apply-to-write',
  },
};

export default function ApplyToWritePage() {
  return (
    <div className="bg-white">
      <WriterApplicationForm />
    </div>
  );
}