// export const Base_Url = "https://vivavista-backend.onrender.com/api";
export const Base_Url = "http://localhost:5003/api";
// export const Base_Url = "https://vivavista-backend.onrender.com/api";
// export const Base_Url = "https://api.vivavistavacations.co.uk/api";
// export const Base_Url = import.meta.env.VITE_API_BASE;

// The base server URL (without /api)
export const Server_Url = "http://localhost:5003";
// export const Server_Url = "https://vivavista-backend.onrender.com";
// export const Server_Url = "https://api.vivavistavacations.co.uk";

// Format image URL correctly
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already an absolute URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative URL starting with /uploads, prepend the server URL
  if (imageUrl.startsWith('/uploads')) {
    return `${Server_Url}${imageUrl}`;
  }
  
  // Otherwise, return as is
  return imageUrl;
};