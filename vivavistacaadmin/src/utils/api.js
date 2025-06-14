export const Base_url = "http://localhost:5003/api";
// export const Base_url = "https://vivavista-backend.onrender.com/api";
// export const Base_url = "https://api.vivavistavacations.ca/api";

// The base server URL (without /api)
export const Server_url = "http://localhost:5003";
// export const Server_url = "https://vivavista-backend.onrender.com";
// export const Server_url = "https://api.vivavistavacations.ca";

// Format image URL correctly
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already an absolute URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative URL starting with /uploads, prepend the server URL
  if (imageUrl.startsWith('/uploads')) {
    return `${Server_url}${imageUrl}`;
  }
  
  // Otherwise, return as is
  return imageUrl;
};