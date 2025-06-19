export const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

// Function to create a URL-friendly slug from a deal name
export const createDealSlug = (dealName) => {
  if (!dealName) return '';
  return dealName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
};
