/**
 * Convert arbitrary text into a URL-friendly slug used for DOM IDs.
 * Lowercases, replaces non-alphanumerics with hyphens, trims leading/trailing hyphens.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
