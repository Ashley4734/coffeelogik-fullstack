import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function AmazonDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
      <div className="flex items-start">
        <InformationCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Amazon Affiliate Disclosure</p>
          <p>
            This post contains affiliate links. If you purchase through these links, 
            we may earn a small commission at no additional cost to you.
          </p>
        </div>
      </div>
    </div>
  );
}