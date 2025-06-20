import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure & FTC Compliance | CoffeeLogik',
  description: 'CoffeeLogik affiliate disclosure and FTC compliance information. Learn about our affiliate relationships and how we earn commissions.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-playfair mb-8">
            Affiliate Disclosure & FTC Compliance
          </h1>
          
          <div className="prose prose-lg prose-amber max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              <strong>Last Updated:</strong> 6/19/2025
            </p>

            <h2>Amazon Associates Program Disclosure</h2>
            <p>
              This website is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and other Amazon marketplaces worldwide.
            </p>
            <p>
              As an Amazon Associate, we earn from qualifying purchases made through affiliate links on this website. This means that when you click on certain links on this site and make a purchase, we may receive a small commission at no additional cost to you.
            </p>

            <h2>FTC Disclosure Statement</h2>
            <p>
              In accordance with the Federal Trade Commission&apos;s (FTC) guidelines concerning the use of endorsements and testimonials in advertising, we are required to inform you of the following:
            </p>

            <h3>Material Connection Disclosure</h3>
            <p>
              We maintain affiliate relationships with various companies whose products and services we may recommend, review, or link to on this website. When you click on these affiliate links and make a purchase, we may receive compensation in the form of commissions, referral fees, or other forms of remuneration.
            </p>

            <h3>Transparency Promise</h3>
            <ul>
              <li><strong>Honest Recommendations:</strong> All product recommendations and reviews on this site represent our honest opinions based on our research and experience</li>
              <li><strong>Editorial Independence:</strong> Our editorial content is not influenced by compensation received from affiliate partnerships</li>
              <li><strong>Clear Identification:</strong> Affiliate links are clearly marked with terms such as &quot;affiliate link,&quot; &quot;sponsored,&quot; or similar disclosure language</li>
            </ul>

            <h2>Types of Affiliate Relationships</h2>
            <p>This website may contain the following types of affiliate content:</p>

            <h3>Product Reviews & Recommendations</h3>
            <p>When we review or recommend products, some links may be affiliate links. Our reviews are based on:</p>
            <ul>
              <li>Personal experience with the product</li>
              <li>Extensive research and testing</li>
              <li>Comparison with similar products</li>
              <li>Genuine assessment of value to our readers</li>
            </ul>

            <h3>Sponsored Content</h3>
            <p>Occasionally, we may publish sponsored content. All sponsored posts will be clearly labeled as:</p>
            <ul>
              <li>&quot;Sponsored Post&quot;</li>
              <li>&quot;Paid Partnership&quot;</li>
              <li>&quot;Advertisement&quot;</li>
              <li>Similar clear disclosure language</li>
            </ul>

            <h3>Display Advertisements</h3>
            <p>This site may display third-party advertisements, including:</p>
            <ul>
              <li>Amazon affiliate banner ads</li>
              <li>Google AdSense advertisements</li>
              <li>Other affiliate network advertisements</li>
            </ul>

            <h2>Cookie and Tracking Disclosure</h2>

            <h3>Amazon Associates Cookies</h3>
            <p>As part of the Amazon Associates Program, Amazon places cookies on your device when you click our affiliate links. These cookies:</p>
            <ul>
              <li>Track purchases for commission purposes</li>
              <li>Remain active for 24 hours (or until you make a purchase)</li>
              <li>Do not collect personally identifiable information about you</li>
              <li>Help us earn commissions on eligible purchases</li>
            </ul>

            <h3>Analytics and Tracking</h3>
            <p>We use various analytics tools to understand how visitors interact with our site:</p>
            <ul>
              <li>Google Analytics for website traffic analysis</li>
              <li>Social media tracking pixels</li>
              <li>Email marketing tracking for subscribers</li>
            </ul>

            <h2>Earnings Disclaimer</h2>

            <h3>Income Disclosure</h3>
            <p>Any earnings or income statements made on this website are estimates only. Individual results will vary based on:</p>
            <ul>
              <li>Personal effort and commitment</li>
              <li>Market conditions</li>
              <li>Individual circumstances</li>
              <li>Product or service quality</li>
            </ul>

            <h3>No Guarantee of Results</h3>
            <p>
              We make no guarantee that you will achieve similar results or any results at all from using any products, services, or strategies recommended on this site. Your success depends on many factors including your dedication, market conditions, and business acumen.
            </p>

            <h2>Product Pricing and Availability</h2>

            <h3>Price Accuracy</h3>
            <p>Product prices and availability displayed on this site are accurate as of the time of publication but may change without notice. We are not responsible for:</p>
            <ul>
              <li>Price changes after publication</li>
              <li>Product availability issues</li>
              <li>Shipping costs or policies</li>
              <li>Return or refund policies</li>
            </ul>

            <h3>Purchase Terms</h3>
            <p>When you make a purchase through our affiliate links, you are purchasing directly from the merchant, not from us. All terms of sale, including:</p>
            <ul>
              <li>Return policies</li>
              <li>Warranty information</li>
              <li>Customer service</li>
              <li>Payment processing</li>
            </ul>
            <p>...are governed by the merchant&apos;s terms and conditions.</p>

            <h2>Contact Information</h2>
            <p>If you have any questions about our affiliate relationships or this disclosure, please contact us:</p>
            <p>
              <strong>Email:</strong> affiliate@coffeelogik.com<br />
              <strong>Website:</strong> CoffeeLogik.com<br />
              <strong>Mailing Address:</strong> PO Box 436 Springfield Ga 31329
            </p>

            <h2>Legal Compliance</h2>
            <p>This disclosure is made in accordance with:</p>
            <ul>
              <li>FTC Guidelines (16 CFR Part 255)</li>
              <li>Amazon Associates Program Operating Agreement</li>
              <li>California Consumer Privacy Act (CCPA)</li>
              <li>General Data Protection Regulation (GDPR) where applicable</li>
            </ul>

            <h2>Updates to This Disclosure</h2>
            <p>
              We reserve the right to update this disclosure at any time. Material changes will be posted with a new &quot;Last Updated&quot; date. Your continued use of this website after any changes constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}