export const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

// Helper function to generate deal slugs for URLs
export const generateDealSlug = (deal) => {
  if (!deal || !deal.title) return deal?._id || '';
  return slugify(deal.title);
};
