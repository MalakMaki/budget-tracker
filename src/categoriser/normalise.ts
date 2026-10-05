export function normalise(description: string): string {
  return description
    .toLowerCase()
    .replace(/[)(*]+/g, ' ')                   // contactless marks and brackets
    .replace(/\b(vis|mc|cd|dr|dd)\b/g, ' ')    // card-network and direct-debit tags
    .replace(/\b(sq|sumup)\b/g, ' ')           // card-reader prefixes hide the real merchant
    .replace(/\b\d+\b/g, ' ')                  // store and reference numbers
    .replace(/\s+/g, ' ')
    .trim();
}