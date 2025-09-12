// frontend/src/app/about/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  HeartIcon, 
  LightBulbIcon, 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  CoffeeIcon as CupIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About Coffee Logik - Our Coffee Story & Mission',
  description: 'Learn about Coffee Logik\'s mission to help coffee enthusiasts brew better coffee through expert guides, reviews, and recipes. Discover our story and values.',
  keywords: 'about coffee logik, coffee experts, coffee education, brewing guides, coffee mission',
  openGraph: {
    title: 'About Coffee Logik - Our Coffee Story & Mission',
    description: 'Learn about Coffee Logik\'s mission to help coffee enthusiasts brew better coffee through expert guides, reviews, and recipes.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

const values = [
  {
    icon: AcademicCapIcon,
    title: 'Expert Knowledge',
    description: 'We share only well-researched, tested coffee knowledge from experienced professionals and passionate enthusiasts.',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: HeartIcon,
    title: 'Passion-Driven',
    description: 'Our love for coffee drives everything we do. We believe great coffee brings people together and enhances daily life.',
    color: 'text-red-600 bg-red-100'
  },
  {
    icon: CheckCircleIcon,
    title: 'Honest Reviews',
    description: 'We provide unbiased, thorough product reviews to help you make informed decisions about your coffee equipment.',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: GlobeAltIcon,
    title: 'Community Focused',
    description: 'We\'re building a community where coffee lovers can learn, share experiences, and grow their brewing skills together.',
    color: 'text-purple-600 bg-purple-100'
  }
];

const milestones = [
  {
    year: '2024',
    title: 'Coffee Logik Founded',
    description: 'Started with a simple mission: make great coffee accessible to everyone through education and honest guidance.'
  },
  {
    year: '2024',
    title: 'Expert Team Assembly',
    description: 'Brought together coffee professionals, baristas, and passionate home brewers to create comprehensive content.'
  },
  {
    year: '2024',
    title: 'Community Growth',
    description: 'Reached thousands of coffee enthusiasts seeking better brewing techniques and equipment guidance.'
  },
  {
    year: 'Future',
    title: 'Continued Innovation',
    description: 'Expanding our content, tools, and community resources to serve the growing coffee culture worldwide.'
  }
];

const stats = [
  { number: '200+', label: 'Expert Articles' },
  { number: '50+', label: 'Brewing Recipes' },
  { number: '100+', label: 'Product Reviews' },
  { number: '10K+', label: 'Coffee Enthusiasts' }
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <span className="text-4xl">☕</span>
                <span className="text-sm font-medium text-amber-700">
                  Brewing Knowledge Since 2024
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl font-playfair mb-6">
              About <span className="text-amber-600">Coffee Logik</span>
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              We're passionate coffee enthusiasts on a mission to help you brew better coffee. 
              From beginner-friendly guides to expert techniques, we're here to elevate your coffee journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                Read Our Content
              </Link>
              <Link href="/authors" className="rounded-md border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50">
                Meet Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Stats Section */}
        <div className="-mt-12 relative z-10 mb-20">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mx-auto max-w-4xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-playfair mb-6">
                Our Coffee Story
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                  <span className="text-8xl">☕</span>
                </div>
              </div>
              <div className="prose prose-amber prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700">
                  Coffee Logik was born from a simple observation: great coffee shouldn't be complicated or intimidating. 
                  Too many coffee enthusiasts felt overwhelmed by conflicting advice, expensive equipment recommendations, 
                  and complex brewing methods.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  We started Coffee Logik to bridge that gap. Our team of coffee professionals, experienced baristas, 
                  and passionate home brewers came together with one goal: make exceptional coffee accessible to everyone, 
                  regardless of experience level or budget.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  Today, we're proud to be a trusted resource for thousands of coffee lovers who rely on our honest reviews, 
                  detailed guides, and tested recipes to enhance their daily coffee experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Values Section */}
        <div className="py-16 bg-gray-50 -mx-6 lg:-mx-8 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-playfair mb-4">
                Our Mission & Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything we do is guided by our commitment to coffee education, community building, and honest expertise.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${value.color}`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-playfair mb-6">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600">
                From a simple idea to a thriving coffee community
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-orange-400 transform md:-translate-x-0.5"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-amber-500 rounded-full transform md:-translate-x-1.5 z-10"></div>
                    
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                    }`}>
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="text-2xl font-bold text-amber-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What Sets Us Apart Section */}
        <div className="py-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-playfair mb-6">
                What Sets Us Apart
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LightBulbIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Practical Expertise</h3>
                <p className="text-gray-600">
                  Our content is created by real coffee professionals who understand both the science and art of coffee brewing.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserGroupIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Community First</h3>
                <p className="text-gray-600">
                  We listen to our readers and create content that addresses real questions and challenges faced by coffee enthusiasts.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClockIcon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Always Current</h3>
                <p className="text-gray-600">
                  We continuously update our content and reviews to reflect the latest developments in coffee equipment and techniques.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-8 lg:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
              <HeartIcon className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Join Our Coffee Community
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're just starting your coffee journey or you're a seasoned enthusiast, 
              we have something to help you brew better coffee every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                Start Learning
              </Link>
              <Link href="/apply-to-write" className="rounded-md border border-amber-600 px-8 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50">
                Write With Us
              </Link>
              <Link href="/contact" className="rounded-md border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
