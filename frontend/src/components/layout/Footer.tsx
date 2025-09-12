// frontend/src/components/layout/Footer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const footerNavigation = {
  coffee: [
    { name: 'Blog', href: '/blog', description: 'Expert coffee articles' },
    { name: 'Recipes', href: '/recipes', description: 'Step-by-step brewing guides' },
    { name: 'Calculator', href: '/calculator', description: 'Perfect coffee ratios' },
    { name: 'Brewing Guides', href: '/brewing-guides', description: 'Comprehensive tutorials' },
    { name: 'Product Reviews', href: '/products', description: 'Equipment reviews' },
  ],
  company: [
    { name: 'About Us', href: '/about', description: 'Our coffee story' },
    { name: 'Authors', href: '/authors', description: 'Meet our experts' },
    { name: 'Apply to Write', href: '/apply-to-write', description: 'Join our team' },
    { name: 'Contact', href: '/contact', description: 'Get in touch' },
  ],
  categories: [
    { name: 'Brewing Methods', href: '/blog/category/brewing-methods' },
    { name: 'Coffee Origins', href: '/blog/category/coffee-origins' },
    { name: 'Equipment Reviews', href: '/blog/category/equipment-reviews' },
    { name: 'Beginner Guides', href: '/blog/category/beginner-guides' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
  ],
  social: [
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/coffeelogik', 
      icon: '📸',
      external: true 
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/coffeelogik', 
      icon: '🐦',
      external: true 
    },
    { 
      name: 'YouTube', 
      href: 'https://youtube.com/@coffeelogik', 
      icon: '📺',
      external: true 
    },
    { 
      name: 'Pinterest', 
      href: 'https://pinterest.com/coffeelogik', 
      icon: '📌',
      external: true 
    },
  ],
};

const quickStats = [
  { label: 'Articles Published', value: '200+' },
  { label: 'Coffee Recipes', value: '50+' },
  { label: 'Product Reviews', value: '100+' },
  { label: 'Happy Readers', value: '10K+' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    
    try {
      // Simulate newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mailto link as fallback
      const subject = encodeURIComponent('Newsletter Subscription - Coffee Logik');
      const body = encodeURIComponent(`Please add ${email} to the Coffee Logik newsletter.`);
      window.location.href = `mailto:newsletter@coffeelogik.com?subject=${subject}&body=${body}`;
      
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-amber-50 to-orange-50 border-t border-amber-100">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        {/* Quick Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {quickStats.map((stat) => (
              <div key={stat.label} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-200">
                <div className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">☕</span>
              <div>
                <span className="text-3xl font-bold text-amber-800 font-playfair">Coffee Logik</span>
                <div className="text-sm text-gray-600">Brewing Knowledge Daily</div>
              </div>
            </div>
            
            <p className="text-sm leading-6 text-gray-700 max-w-md">
              Your ultimate destination for coffee knowledge, recipes, and reviews. 
              From bean to cup, we&apos;re here to enhance your coffee journey with expert insights, 
              detailed guides, and honest product recommendations.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : "_self"}
                  rel={item.external ? "noopener noreferrer" : ""}
                  className="group flex items-center justify-center w-10 h-10 bg-white/60 hover:bg-white rounded-full transition-all duration-200 hover:scale-110"
                  title={item.name}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {item.external && (
                    <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              ))}
            </div>

            {/* Coffee Quote */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
              <blockquote className="text-sm italic text-gray-700">
                &quot;Coffee is a language in itself.&quot;
              </blockquote>
              <cite className="text-xs text-gray-500 mt-1 block">- Jackie Chan</cite>
            </div>
          </div>
          
          {/* Navigation Grid */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Coffee Content */}
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-6">Coffee Content</h3>
                <ul role="list" className="space-y-4">
                  {footerNavigation.coffee.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group text-sm leading-6 text-gray-600 hover:text-amber-600 transition-colors"
                      >
                        <div className="font-medium group-hover:text-amber-700">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Company */}
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-6">Company</h3>
                <ul role="list" className="space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group text-sm leading-6 text-gray-600 hover:text-amber-600 transition-colors"
                      >
                        <div className="font-medium group-hover:text-amber-700">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Newsletter Section */}
            <div className="md:grid md:grid-cols-1">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-4">
                  Stay Updated
                </h3>
                <p className="text-sm leading-6 text-gray-600 mb-6">
                  Get the latest coffee tips, recipes, and product reviews delivered to your inbox weekly.
                </p>
                
                {isSubscribed ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-800">Thanks for subscribing!</div>
                    <div className="text-xs text-green-600 mt-1">Check your email to confirm.</div>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="sm:flex sm:max-w-md">
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email-address"
                        id="email-address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                        placeholder="Enter your email"
                      />
                      <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex w-full items-center justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 transition-colors"
                        >
                          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                      </div>
                    </div>
                    
                    {/* Newsletter Benefits */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>Weekly coffee tips and recipes</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>Exclusive product reviews</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>No spam, unsubscribe anytime</span>
                      </div>
                    </div>
                  </form>
                )}
                
                {/* Popular Categories */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Popular Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {footerNavigation.categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white hover:text-amber-600 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-16 border-t border-amber-200 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Copyright and Links */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:space-x-8">
              <p className="text-xs leading-5 text-gray-500 mb-4 sm:mb-0">
                &copy; {new Date().getFullYear()} Coffee Logik. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {footerNavigation.legal.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className="text-xs leading-5 text-gray-500 hover:text-amber-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Made with Love */}
            <div className="mt-4 lg:mt-0">
              <div className="flex items-center text-xs text-gray-500">
                <span>Made with</span>
                <HeartIcon className="h-3 w-3 text-red-500 mx-1" />
                <span>and lots of ☕</span>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 lg:mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
              <div>
                <p>Brewing knowledge since 2024 • Based in Springfield, GA</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <Link 
                  href="/contact" 
                  className="hover:text-amber-600 transition-colors"
                >
                  Questions? Contact us at hello@coffeelogik.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
