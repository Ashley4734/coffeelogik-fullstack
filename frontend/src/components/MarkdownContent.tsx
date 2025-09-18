// components/MarkdownContent.tsx
import React from 'react';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) return null;

  // Simple markdown to HTML conversion
  const convertMarkdown = (text: string) => {
    // Handle headers
    let result = text
      // Convert ## headers to h2
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h2>')
      // Convert ### headers to h3
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h3>')
      // Convert #### headers to h4
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mt-5 mb-2 text-gray-900">$1</h4>');
    
    // Convert bold and italic
    result = result
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Convert bullet points
    result = result
      .replace(/^\s*\*\s(.*)$/gim, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>[\s\S]*?)+/g, '<ul class="list-disc my-4 space-y-2 pl-5">$&</ul>');
    
    // Wrap paragraphs
    result = result
      .split('\n\n')
      .map(paragraph => {
        // If paragraph is already wrapped in a tag, don't wrap it again
        if (paragraph.startsWith('<')) return paragraph;
        // If paragraph is empty, skip it
        if (paragraph.trim() === '') return '';
        // Otherwise wrap in paragraph tag
        return `<p class="mb-4 text-gray-700">${paragraph}</p>`;
      })
      .join('');

    return result;
  };

  const htmlContent = convertMarkdown(content);

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
}
