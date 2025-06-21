'use client';

import { useState, useEffect } from 'react';

export default function ApiDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<{
    strapiUrl: string;
    apiResponse: string;
    error: string | null;
    timestamp: string;
  }>({
    strapiUrl: '',
    apiResponse: '',
    error: null,
    timestamp: '',
  });

  const testApiConnection = async () => {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.coffeelogik.com';
    
    try {
      setDiagnostics(prev => ({
        ...prev,
        strapiUrl,
        timestamp: new Date().toISOString(),
        error: null,
        apiResponse: 'Testing...'
      }));

      const response = await fetch(`${strapiUrl}/api/blog-posts?pagination[limit]=1`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setDiagnostics(prev => ({
        ...prev,
        apiResponse: `Success! Found ${data.data?.length || 0} blog posts. Meta: ${JSON.stringify(data.meta)}`,
        error: null,
      }));
      
    } catch (error) {
      console.error('API Test Error:', error);
      setDiagnostics(prev => ({
        ...prev,
        apiResponse: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 m-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">API Connection Diagnostic</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <strong>Strapi URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{diagnostics.strapiUrl}</code>
        </div>
        
        <div>
          <strong>Test Time:</strong> {diagnostics.timestamp}
        </div>
        
        {diagnostics.error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <strong className="text-red-800">Error:</strong>
            <pre className="text-red-700 mt-1 whitespace-pre-wrap">{diagnostics.error}</pre>
          </div>
        )}
        
        {diagnostics.apiResponse && !diagnostics.error && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <strong className="text-green-800">Success:</strong>
            <pre className="text-green-700 mt-1 whitespace-pre-wrap">{diagnostics.apiResponse}</pre>
          </div>
        )}
        
        <button 
          onClick={testApiConnection}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Test Again
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="font-semibold text-gray-800 mb-2">Environment Variables:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><code>NEXT_PUBLIC_STRAPI_URL</code>: {process.env.NEXT_PUBLIC_STRAPI_URL || 'Not set (using default)'}</li>
          <li><code>NEXT_PUBLIC_SITE_URL</code>: {process.env.NEXT_PUBLIC_SITE_URL || 'Not set (using default)'}</li>
        </ul>
      </div>
    </div>
  );
}