const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");

// Ensure temp upload directory exists
const tempDir = path.join(process.cwd(), 'uploads', 'temp');
fs.ensureDirSync(tempDir);

// Local disk storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer upload configuration for both images and videos
const uploadMedia = multer({
  storage: localStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB, generous limit for videos
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images") {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPEG, PNG, and JPG formats are allowed for images"), false);
      }
    } else if (file.fieldname === "videos") {
      const allowedTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-matroska", "video/x-msvideo"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only MP4, MPEG, MOV, MKV, and AVI formats are allowed for videos"), false);
      }
    }
    cb(null, true);
  },
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 3 }
]);

module.exports = {
  uploadMedia,
}; 