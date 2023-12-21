function sanitizeString(input: any): string {
    if (typeof input !== 'string') return '';
  
    // Remove HTML tags
    const strippedString = input.replace(/<[^>]*>/g, '');
  
    // Trim spaces
    return strippedString.trim();
  }

  export default sanitizeString
  