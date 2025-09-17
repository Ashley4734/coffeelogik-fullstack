
'use client';

import { useState, useEffect } from 'react';
import { LinkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ShareButtonProps {
  productName: string;
  productSlug: string;
}

export default function ShareButton({ productName, productSlug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [productUrl, setProductUrl] = useState('');

  const shareText = `Check out this coffee product: ${productName}`;

  useEffect(() => {
    // Set the product URL only on the client side
    if (typeof window !== 'undefined') {
      setProductUrl(`${window.location.origin}/products/${productSlug}`);
    }
  }, [productSlug]);

  const copyToClipboard = async () => {
    if (!productUrl) return;
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOnTwitter = () => {
    if (!productUrl) return;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnFacebook = () => {
    if (!productUrl) return;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    if (!productUrl) return;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (!productUrl) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: productUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  // Don't render until we have the product URL
  if (!productUrl) {
    return (
      <div className="inline-flex items-center text-gray-400 text-sm font-medium">
        <LinkIcon className="mr-1 h-4 w-4" />
        Share Product
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center text-amber-600 hover:text-amber-500 text-sm font-medium"
      >
        {copied ? (
          <CheckIcon className="mr-1 h-4 w-4" />
        ) : (
          <LinkIcon className="mr-1 h-4 w-4" />
        )}
        {copied ? 'Copied!' : 'Share Product'}
      </button>

      {/* Custom share dropdown for browsers without native share */}
      {showDropdown && !navigator.share && (
        <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-48">
          <div className="space-y-2">
            <button
              onClick={copyToClipboard}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center"
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy Link
            </button>
            <button
              onClick={shareOnTwitter}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Share on Twitter
            </button>
            <button
              onClick={shareOnFacebook}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Share on Facebook
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Share on LinkedIn
            </button>
          </div>
          <button
            onClick={() => setShowDropdown(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
