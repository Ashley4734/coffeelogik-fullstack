// frontend/src/app/sitemap-html/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CalculatorIcon,
  BeakerIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Sitemap - Coffee Logik',
  description: 'Complete sitemap of all pages and content available on Coffee Logik.',
  alternates: {
    canonical: '/sitemap-html',
  },
};

const mainPages = [
  {
    title: 'Home',
    href: '/',
    icon: HomeIcon,
    description: 'Welcome to Coffee Logik - your coffee knowledge hub'
  },
  {
    title: 'About Us',
    href: '/about',
    icon: InformationCircleIcon,
    description: 'Learn about our mission and coffee expertise'
  },
  {
    title: 'Contact',
    href: '/contact',
    icon: EnvelopeIcon,
    description: '
