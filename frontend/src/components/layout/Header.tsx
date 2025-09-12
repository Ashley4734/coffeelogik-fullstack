// frontend/src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  HomeIcon,
  BookOpenIcon,
  BeakerIcon,
  CalculatorIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  UserGroupIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { getBlogPosts } from '@/lib/api';
import type { BlogPost } from '@/lib/api';

const navigation = [
  { 
    name: 'Home', 
    href: '/', 
    icon: HomeIcon,
    description: 'Welcome to Coffee Logik' 
  },
  { 
    name: 'Blog', 
    href: '/blog', 
    icon: BookOpenIcon,
    description: 'Expert coffee articles and guides',
    hasDropdown: true,
    dropdownItems: [
      { name: 'All Articles', href: '/blog', description: 'Browse all our coffee content' },
      { name: 'Brewing Methods', href: '/blog/category/brewing-methods', description: 'Learn different brewing techniques' },
      { name: 'Coffee Origins', href: '/blog/category/coffee-origins', description: 'Explore coffee from around the world' },
      { name: 'Equipment Reviews', href: '/blog/category/equipment-reviews', description: 'In-depth product reviews' },
      { name: 'Beginner Guides', href: '/blog/category/beginner-guides', description: 'Perfect for coffee newcomers' },
    ]
  },
  { 
    name: 'Recipes', 
    href: '/recipes', 
    icon: DocumentTextIcon,
    description: 'Step-by-step brewing recipes' 
  },
  { 
    name: 'Calculator', 
    href: '/calculator', 
    icon: CalculatorIcon,
    description: 'Perfect coffee ratios' 
  },
  { 
    name: 'Guides', 
    href: '/brewing-guides', 
    icon: BeakerIcon,
    description: 'Comprehensive brewing guides' 
  },
  { 
    name: 'Reviews', 
    href: '/products', 
    icon: ShoppingBagIcon,
    description: 'Coffee product reviews' 
  },
  { 
    name: 'More', 
    href: '#', 
    icon: ChevronDownIcon,
    description: 'Additional pages',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Authors', href: '/authors', description: 'Meet our coffee experts' },
      { name: 'Apply to Write', href: '/apply-to-write', description: 'Join our writing team' },
      { name: 'Contact Us', href: '/contact', description: 'Get in touch' },
      { name: 'Search', href: '/search', description: 'Find specific content' },
    ]
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Handle search
  useEffect(() => {
    const searchPosts = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await getBlogPosts({ limit: 50 });
        const posts = response.data || [];
        
        const filtered = posts.filter(post => 
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(searchPosts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle clicking outside search and dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
      setSearchTerm('');
    }
  };

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <span className="text-3xl">☕</span>
            <span className="text-2xl font-bold text-amber-800 font-playfair">Coffee Logik</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8" ref={dropdownRef}>
          {navigation.slice(0, -1).map((item) => (
            <div key={item.name} className="relative">
              {item.hasDropdown ? (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                  className={`flex items-center text-sm font-semibold leading-6 transition-colors ${
                    isActiveLink(item.href) 
                      ? 'text-amber-600' 
                      : 'text-gray-900 hover:text-amber-600'
                  }`}
                >
                  {item.name}
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${
                    activeDropdown === item.name ? 'rotate-180' : ''
                  }`} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-semibold leading-6 transition-colors ${
                    isActiveLink(item.href) 
                      ? 'text-amber-600' 
                      : 'text-gray-900 hover:text-amber-600'
                  }`}
                >
                  {item.name}
                </Link>
              )}
              
              {/* Dropdown Menu */}
              {item.hasDropdown && activeDropdown === item.name && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="font-medium">{dropdownItem.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
              className="flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-amber-600 transition-colors"
            >
              More
              <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${
                activeDropdown === 'more' ? 'rotate-180' : ''
              }`} />
            </button>
            
            {activeDropdown === 'more' && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {navigation[navigation.length - 1].dropdownItems?.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center">
                <input
                  type="search"
                  placeholder="Search coffee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                  className="rounded-full border border-gray-300 px-4 py-2 pr-10 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 w-64"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-1 text-gray-400 hover:text-amber-600"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setShowResults(false);
                          setSearchTerm('');
                        }}
                      >
                        <div className="font-medium text-gray-900 text-sm line-clamp-1">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {post.excerpt}
                          </div>
                        )}
                      </Link>
                    ))}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                      >
                        View all results for &quot;{searchTerm}&quot;
                      </button>
                    </div>
                  </div>
                ) : searchTerm.length >= 2 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No posts found for &quot;{searchTerm}&quot;
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <span className="text-2xl">☕</span>
                <span className="text-xl font-bold text-amber-800 font-playfair">Coffee Logik</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            {/* Mobile Search */}
            <div className="mt-6">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search coffee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  />
                </div>
              </form>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.slice(0, -1).map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={`-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                          isActiveLink(item.href)
                            ? 'text-amber-600 bg-amber-50'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                      {item.hasDropdown && item.dropdownItems && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-amber-600"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* More items in mobile */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 mb-2">
                      More Pages
                    </div>
                    {navigation[navigation.length - 1].dropdownItems?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name === 'Authors' && <UserGroupIcon className="h-5 w-5 mr-3" />}
                        {item.name === 'Apply to Write' && <DocumentTextIcon className="h-5 w-5 mr-3" />}
                        {item.name === 'Contact Us' && <EnvelopeIcon className="h-5 w-5 mr-3" />}
                        {item.name === 'Search' && <MagnifyingGlassIcon className="h-5 w-5 mr-3" />}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
