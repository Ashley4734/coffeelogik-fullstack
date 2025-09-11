import { Metadata } from "next";
import CoffeeRatioCalculator from "@/components/CoffeeRatioCalculator";

export const metadata: Metadata = {
  title: 'Coffee Ratio Calculator - Perfect Brewing Ratios',
  description: 'Calculate the perfect coffee-to-water ratio for any brewing method. Get precise measurements for pour over, French press, espresso, and more.',
  keywords: 'coffee ratio calculator, brewing calculator, coffee measurements, perfect coffee ratio, brewing guide',
  openGraph: {
    title: 'Coffee Ratio Calculator - Perfect Brewing Ratios',
    description: 'Calculate the perfect coffee-to-water ratio for any brewing method.',
    type: 'website',
  },
  alternates: {
    canonical: '/calculator',
  },
};

export default function CalculatorPage() {
  return <CoffeeRatioCalculator />;
}
