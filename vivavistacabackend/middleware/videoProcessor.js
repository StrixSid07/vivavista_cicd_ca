const fs = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('ffprobe-static').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

require("dotenv").config();

// Get the server URL from environment or use default
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5003";

/**
 * Convert a video to WebM format
 * @param {string} filePath - Path to the original video file
 * @param {Object} options - Options for WebM conversion
 * @param {string} options.component - Component name for directory organization
 * @returns {Promise<string>} - Full URL path to the converted WebM file
 */
const convertToWebm = (filePath, options = { component: 'general' }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const component = options.component || 'general';
      const uploadDir = path.join(process.cwd(), 'uploads', component);
      await fs.ensureDir(uploadDir);

      const parsedPath = path.parse(filePath);
      const filename = `${parsedPath.name}.webm`;
      const webmPath = path.join(uploadDir, filename);

      ffmpeg(filePath)
        .outputOptions('-c:v libvpx-vp9')
        .outputOptions('-crf 35')
        .outputOptions('-b:v 0')
        .outputOptions('-c:a libopus')
        .output(webmPath)
        .on('end', async () => {
          await fs.unlink(filePath);
          console.log(`✅ Video converted to WebM: ${webmPath}`);
          resolve(`${SERVER_URL}/uploads/${component}/${filename}`);
        })
        .on('error', (err) => {
          console.error(`❌ Error converting video to WebM: ${err.message}`);
          fs.unlink(filePath).catch(e => console.error(`Failed to delete original file after error: ${e.message}`));
          // If conversion fails, reject the promise
          reject(err);
        })
        .run();
    } catch (error) {
      console.error(`❌ Error in convertToWebm setup: ${error.message}`);
      reject(error);
    }
  });
};

/**
 * Delete a video file from the local filesystem
 * @param {string} videoUrl - URL or path of the video to delete
 * @returns {Promise<boolean>} - True if deletion was successful
 */
const deleteLocalVideo = async (videoUrl) => {
  try {
    let filePath = videoUrl;
    if (videoUrl.startsWith(SERVER_URL)) {
      filePath = videoUrl.replace(SERVER_URL, '');
    }
    
    filePath = path.join(process.cwd(), filePath);
    
    if (fs.existsSync(filePath)) {
      await fs.unlink(filePath);
      console.log(`✅ Local video file deleted: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️ Local video file not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting local file: ${error.message}`);
    throw error;
  }
};

module.exports = {
  convertToWebm,
  deleteLocalVideo,
}; 