export function hasAmazonLinks(content: string): boolean {
  // Common Amazon domains and link patterns
  const amazonPatterns = [
    /amazon\.com/i,
    /amazon\.co\.uk/i,
    /amazon\.ca/i,
    /amazon\.de/i,
    /amazon\.fr/i,
    /amazon\.it/i,
    /amazon\.es/i,
    /amazon\.com\.au/i,
    /amazon\.co\.jp/i,
    /amzn\.to/i,
    /a\.co/i
  ];

  return amazonPatterns.some(pattern => pattern.test(content));
}