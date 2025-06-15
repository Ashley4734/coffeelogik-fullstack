import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        <div className="prose prose-amber prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> December 2024
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p>
              When you visit Coffee Logik, we may collect certain information about you, including:
            </p>
            <ul>
              <li>Personal information you provide voluntarily (such as email addresses for newsletter subscriptions)</li>
              <li>Usage data and analytics about how you interact with our website</li>
              <li>Technical information such as your IP address, browser type, and device information</li>
              <li>Cookies and similar tracking technologies to enhance your browsing experience</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and improve our content and services</li>
              <li>Send you newsletters and updates (if you've subscribed)</li>
              <li>Analyze website usage to improve user experience</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul>
              <li>With service providers who assist us in operating our website</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or merger</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small files stored on your device that help us:
            </p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content</li>
              <li>Improve website functionality</li>
            </ul>
            <p>
              You can control cookie settings through your browser preferences. However, disabling cookies may affect some website functionality.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites, including affiliate links to coffee products. 
              We are not responsible for the privacy practices of these external sites. We encourage you to read 
              the privacy policies of any linked websites.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized 
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet 
              is 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to delete your personal data</li>
              <li>The right to object to processing</li>
              <li>The right to data portability</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Newsletter Subscriptions</h2>
            <p>
              If you subscribe to our newsletter, we will use your email address to send you coffee tips, 
              recipes, and product updates. You can unsubscribe at any time by clicking the unsubscribe 
              link in our emails or contacting us directly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on this page 
              with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us 
              through our website or email us at privacy@coffeelogik.com.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}