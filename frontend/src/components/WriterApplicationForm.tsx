'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PencilIcon, UserIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  phone: string;
  expertise: string;
  experience: string;
  bio: string;
  portfolio: string;
  writingSample: string;
  availability: string;
  socialMedia: string;
  additionalInfo: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  expertise: '',
  experience: '',
  bio: '',
  portfolio: '',
  writingSample: '',
  availability: '',
  socialMedia: '',
  additionalInfo: ''
};

export default function WriterApplicationForm() {
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
    if (!formData.expertise.trim()) newErrors.expertise = 'Coffee expertise is required';
    if (!formData.experience.trim()) newErrors.experience = 'Writing experience is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.writingSample.trim()) newErrors.writingSample = 'Writing sample is required';

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
      const subject = encodeURIComponent('Writer Application - Coffee Logik');
      const body = encodeURIComponent(`
New Writer Application

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Coffee Expertise: ${formData.expertise}

Writing Experience:
${formData.experience}

Bio:
${formData.bio}

Portfolio URL: ${formData.portfolio || 'Not provided'}

Writing Sample:
${formData.writingSample}

Availability: ${formData.availability || 'Not specified'}

Social Media: ${formData.socialMedia || 'Not provided'}

Additional Information:
${formData.additionalInfo || 'None provided'}

---
Application submitted from Coffee Logik website
Date: ${new Date().toLocaleDateString()}
      `);

      // Open email client
      window.location.href = `mailto:writer@coffeelogik.com?subject=${subject}&body=${body}`;
      
      // Show success message
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again or email us directly at writer@coffeelogik.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-6">
              Application Submitted!
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              Thank you for your interest in writing for Coffee Logik. Your email client should have opened with your application details.
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Send your email to complete the application</span>
                </div>
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">We&apos;ll review your application within 5-7 business days</span>
                </div>
                <div className="flex items-start">
                  <UserIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">If selected, we&apos;ll reach out via email</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/authors" className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                Meet Our Team
              </Link>
              <Link href="/blog" className="rounded-md border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">
                Read Our Articles
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              Have questions? Email us directly at{' '}
              <a href="mailto:writer@coffeelogik.com" className="font-medium text-emerald-600 hover:text-emerald-500">
                writer@coffeelogik.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23be185d%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <PencilIcon className="h-5 w-5 text-pink-600" />
                <span className="text-sm font-medium text-pink-700">
                  Join Our Writing Team
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl font-playfair mb-6">
              Apply to <span className="text-pink-600">Write</span>
            </h1>
            <p className="text-xl leading-8 text-gray-700 mb-8">
              Share your coffee expertise with our passionate community. Join our team of expert writers and help coffee enthusiasts discover new flavors, techniques, and experiences.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 pb-24">
        {/* Application Form */}
        <div className="-mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Writer Application Form</h2>
              <p className="text-gray-600">
                Tell us about yourself and your coffee expertise. All fields marked with * are required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-pink-500'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-pink-500'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media/Website
                    </label>
                    <input
                      type="url"
                      id="socialMedia"
                      name="socialMedia"
                      value={formData.socialMedia}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                </div>
              </div>

              {/* Coffee Expertise */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coffee Expertise</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                      Areas of Coffee Expertise *
                    </label>
                    <select
                      id="expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.expertise ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-pink-500'
                      }`}
                    >
                      <option value="" className="text-gray-900">Select your primary expertise</option>
                      <option value="Brewing Methods" className="text-gray-900">Brewing Methods</option>
                      <option value="Coffee Origins & Sourcing" className="text-gray-900">Coffee Origins & Sourcing</option>
                      <option value="Equipment & Gear" className="text-gray-900">Equipment & Gear</option>
                      <option value="Roasting" className="text-gray-900">Roasting</option>
                      <option value="Barista Skills" className="text-gray-900">Barista Skills</option>
                      <option value="Coffee Business" className="text-gray-900">Coffee Business</option>
                      <option value="Coffee Science" className="text-gray-900">Coffee Science</option>
                      <option value="Specialty Coffee" className="text-gray-900">Specialty Coffee</option>
                      <option value="Coffee Culture & History" className="text-gray-900">Coffee Culture & History</option>
                      <option value="Other" className="text-gray-900">Other</option>
                    </select>
                    {errors.expertise && <p className="mt-1 text-sm text-red-600">{errors.expertise}</p>}
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio *
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.bio ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-pink-500'
                      }`}
                      placeholder="Tell us about your coffee background, certifications, and what makes you passionate about coffee..."
                    />
                    {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                  </div>
                </div>
              </div>

              {/* Writing Experience */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing Experience</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Writing Experience *
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      rows={4}
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.experience ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-pink-500'
                      }`}
                      placeholder="Describe your writing experience, publications, blogs, or any content creation work..."
                    />
                    {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                  </div>
                  <div>
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio/Writing Samples URL
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="https://yourportfolio.com or Google Drive link"
                    />
                  </div>
                  <div>
                    <label htmlFor="writingSample" className="block text-sm font-medium text-gray-700 mb-2">
                      Writing Sample *
                    </label>
                    <textarea
                      id="writingSample"
                      name="writingSample"
                      rows={6}
                      value={formData.writingSample}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.writingSample ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-pink-500'
                      }`}
                      placeholder="Please provide a coffee-related writing sample (300-500 words). This could be about brewing techniques, coffee reviews, equipment guides, etc."
                    />
                    {errors.writingSample && <p className="mt-1 text-sm text-red-600">{errors.writingSample}</p>}
                  </div>
                </div>
              </div>

              {/* Availability & Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="" className="text-gray-900">Select your availability</option>
                      <option value="1-2 articles per month" className="text-gray-900">1-2 articles per month</option>
                      <option value="3-4 articles per month" className="text-gray-900">3-4 articles per month</option>
                      <option value="5+ articles per month" className="text-gray-900">5+ articles per month</option>
                      <option value="As needed/project basis" className="text-gray-900">As needed/project basis</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      rows={3}
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Anything else you'd like us to know about your interest in writing for Coffee Logik?"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
                <p className="mt-2 text-xs text-gray-600 text-center">
                  By submitting this form, your email client will open with your application details to send to writer@coffeelogik.com
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What We&apos;re Looking For</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Coffee Expertise</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Deep knowledge in your chosen coffee area</li>
                <li>• Hands-on experience with coffee equipment or techniques</li>
                <li>• Professional certifications or industry experience</li>
                <li>• Passion for sharing coffee knowledge</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Writing Skills</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clear, engaging writing style</li>
                <li>• Ability to explain complex topics simply</li>
                <li>• Experience with online content creation</li>
                <li>• Strong grammar and editing skills</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}