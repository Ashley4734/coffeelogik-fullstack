// frontend/src/components/ContactForm.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  type: 'general'
};

const contactTypes = [
  { value: 'general', label: 'General Inquiry', icon: ChatBubbleLeftRightIcon },
  { value: 'writing', label: 'Writing Opportunity', icon: EnvelopeIcon },
  { value: 'feedback', label: 'Feedback', icon: QuestionMarkCircleIcon },
  { value: 'business', label: 'Business/Partnership', icon: EnvelopeIcon },
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Inquiry: ${formData.subject}`);
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Type: ${contactTypes.find(t => t.value === formData.type)?.label}

Message:
${formData.message}

---
Sent from Coffee Logik contact form
Date: ${new Date().toLocaleDateString()}
      `);

      // Open email client
      window.location.href = `mailto:hello@coffeelogik.com?subject=${subject}&body=${body}`;
      
      // Show success message
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('There was an error submitting your message. Please try again or email us directly at hello@coffeelogik.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
              Message Sent!
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              Thank you for reaching out. Your email client should have opened with your message details.
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Send your email to complete your message</span>
                </div>
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">We typically respond within 24-48 hours</span>
                </div>
                <div className="flex items-start">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Check your email for our response</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                Back to Home
              </Link>
              <Link href="/blog" className="rounded-md border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  We&apos;d Love to Hear From You
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl font-playfair mb-6">
              Get in <span className="text-blue-600">Touch</span>
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              Have questions about coffee? Want to collaborate? Or just want to say hello? We&apos;re always excited to connect with fellow coffee enthusiasts.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        {/* Contact Info Cards */}
        <div className="-mt-12 relative z-10 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm mb-3">Drop us a line anytime</p>
              <a href="mailto:hello@coffeelogik.com" className="text-blue-600 hover:text-blue-700 font-medium">
                hello@coffeelogik.com
              </a>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600 text-sm mb-3">We&apos;re pretty quick</p>
              <span className="text-green-600 font-medium">24-48 hours</span>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600 text-sm mb-3">Based in</p>
              <span className="text-amber-600 font-medium">Springfield, GA</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Send us a Message</h2>
              <p className="text-gray-600">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What&apos;s this about?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {contactTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.type === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-2" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subject ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="What&apos;s this about?"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Tell us more about your inquiry..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
                <p className="mt-2 text-xs text-gray-600 text-center">
                  Your email client will open with your message details to send to hello@coffeelogik.com
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How quickly do you respond?</h4>
                <p className="text-gray-600 text-sm">
                  We typically respond to all inquiries within 24-48 hours during business days.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you accept guest posts?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! We&apos;re always looking for quality coffee content. Please use our writer application form.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can you review my product?</h4>
                <p className="text-gray-600 text-sm">
                  We consider product reviews on a case-by-case basis. Please contact us with details about your product.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer coffee consulting?</h4>
                <p className="text-gray-600 text-sm">
                  We offer limited consulting services. Contact us to discuss your specific needs and timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
