import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "CoffeeLogik - Expert Coffee Brewing Guides & Reviews",
  description: "Discover expert coffee brewing guides, detailed equipment reviews, and delicious recipes. Master the art of coffee with CoffeeLogik's comprehensive resources.",
  keywords: "coffee brewing, coffee recipes, coffee equipment reviews, barista guides, espresso, pour over, french press, coffee techniques",
  authors: [{ name: "CoffeeLogik Team" }],
  creator: "CoffeeLogik",
  publisher: "CoffeeLogik",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeelogik.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CoffeeLogik - Expert Coffee Brewing Guides & Reviews",
    description: "Discover expert coffee brewing guides, detailed equipment reviews, and delicious recipes. Master the art of coffee with CoffeeLogik's comprehensive resources.",
    url: '/',
    siteName: 'CoffeeLogik',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CoffeeLogik - Coffee Brewing Guides',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CoffeeLogik - Expert Coffee Brewing Guides & Reviews",
    description: "Discover expert coffee brewing guides, detailed equipment reviews, and delicious recipes. Master the art of coffee with CoffeeLogik's comprehensive resources.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white`}
      >
        <ErrorBoundary>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
