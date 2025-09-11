// frontend/src/app/contact/page.tsx
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Coffee Logik',
  description: 'Get in touch with the Coffee Logik team. We love hearing from fellow coffee enthusiasts!',
  openGraph: {
    title: 'Contact Us - Coffee Logik',
    description: 'Get in touch with the Coffee Logik team.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <ContactForm />
    </div>
  );
}
