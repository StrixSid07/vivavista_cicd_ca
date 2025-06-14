const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const { convertToWebP, deleteLocalImage, ensureUploadDirectories } = require("./imageProcessor");
require("dotenv").config();

// Ensure upload directories exist on server start
ensureUploadDirectories().catch(err => {
  console.error("Error creating upload directories:", err);
});

// ✅ Local disk storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use a temporary directory for initial upload
    const uploadPath = path.join(process.cwd(), 'uploads', 'temp');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ Multer upload configuration
const upload = multer({
  storage: localStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPEG, PNG, and JPG formats are allowed"),
        false
      );
    }
    cb(null, true);
  },
});

/**
 * Process uploaded file and convert to WebP
 * @param {Object} file - Multer file object
 * @param {string} component - Component name for directory organization
 * @returns {Promise<string>} - URL of the processed image
 */
const processUploadedFile = async (file, component = 'general') => {
  try {
    // Get the full path of the uploaded file
    const filePath = path.join(process.cwd(), 'uploads', 'temp', file.filename);
    
    // Convert the image to WebP format and move to component directory
    const webpPath = await convertToWebP(filePath, { 
      quality: 80,
      component: component
    });
    
    console.log(`✅ Image processed successfully: ${webpPath}`);
    return webpPath;
  } catch (error) {
    console.error(`❌ Error processing uploaded file: ${error.message}`);
    // If processing fails, return the original path
    return `/uploads/temp/${file.filename}`;
  }
};

/**
 * Delete image from local storage
 * @param {string} imageUrl - URL of the image to delete
 * @returns {Promise<boolean>} - True if deletion was successful
 */
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      console.log("⚠️ No image URL provided for deletion");
      return false;
    }
    
    // Delete from local storage
    const result = await deleteLocalImage(imageUrl);
    return result;
  } catch (error) {
    console.error(`❌ Failed to delete image: ${error.message}`);
    throw error;
  }
};

module.exports = {
  upload,
  processUploadedFile,
  deleteImage
};
