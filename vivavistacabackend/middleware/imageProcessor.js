const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
require("dotenv").config();

// Get the server URL from environment or use default
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5003";

/**
 * Convert an image to WebP format
 * @param {string} filePath - Path to the original image file
 * @param {Object} options - Options for WebP conversion
 * @param {number} options.quality - WebP quality (1-100)
 * @param {string} options.component - Component name for directory organization
 * @returns {Promise<string>} - Full URL path to the converted WebP file
 */
const convertToWebP = async (filePath, options = { quality: 80, component: 'general' }) => {
  try {
    // Create component directory if it doesn't exist
    const component = options.component || 'general';
    const uploadDir = path.join(process.cwd(), 'uploads', component);
    await fs.ensureDir(uploadDir);
    
    // Create WebP output path by changing the extension and moving to component directory
    const parsedPath = path.parse(filePath);
    const filename = `${parsedPath.name}.webp`;
    const webpPath = path.join(uploadDir, filename);
    
    // Convert to WebP using sharp
    await sharp(filePath)
      .webp({ quality: options.quality })
      .toFile(webpPath);
    
    // Delete the original file if WebP conversion was successful
    await fs.unlink(filePath);
    
    console.log(`✅ Image converted to WebP: ${webpPath}`);
    
    // Return the full server URL path for database storage
    return `${SERVER_URL}/uploads/${component}/${filename}`;
  } catch (error) {
    console.error(`❌ Error converting image to WebP: ${error.message}`);
    // If conversion fails, return the original path with server URL
    const relativePath = filePath.replace(process.cwd(), '');
    return `${SERVER_URL}${relativePath}`;
  }
};

/**
 * Delete an image file from the local filesystem
 * @param {string} imageUrl - URL or path of the image to delete
 * @returns {Promise<boolean>} - True if deletion was successful
 */
const deleteLocalImage = async (imageUrl) => {
  try {
    // Extract the file path from the URL by removing the server URL part
    let filePath = imageUrl;
    if (imageUrl.startsWith(SERVER_URL)) {
      filePath = imageUrl.replace(SERVER_URL, '');
    }
    
    // Join with current working directory
    filePath = path.join(process.cwd(), filePath);
    
    // Check if the file exists before attempting to delete
    if (fs.existsSync(filePath)) {
      await fs.unlink(filePath);
      console.log(`✅ Local image file deleted: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️ Local image file not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting local file: ${error.message}`);
    throw error;
  }
};

/**
 * Ensure component upload directories exist
 * @returns {Promise<void>}
 */
const ensureUploadDirectories = async () => {
  const components = [
    'hotel',
    'deal',
    'carousel',
    'autoslider',
    'destination',
    'blog',
    'general'
  ];
  
  for (const component of components) {
    const dir = path.join(process.cwd(), 'uploads', component);
    await fs.ensureDir(dir);
    console.log(`✅ Ensured directory exists: ${dir}`);
  }
};

module.exports = {
  convertToWebP,
  deleteLocalImage,
  ensureUploadDirectories
}; 