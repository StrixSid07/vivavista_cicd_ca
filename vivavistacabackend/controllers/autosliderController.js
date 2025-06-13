const Autoslider = require("../models/Autoslider");
const { uploadToS3, deleteFromS3 } = require("../middleware/imageUpload");
require("dotenv").config();

// Get all autosliders
exports.getAllAutosliders = async (req, res) => {
  try {
    const autosliders = await Autoslider.find().sort({ createdAt: -1 });
    res.status(200).json(autosliders);
  } catch (error) {
    console.error("Error fetching autosliders:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single autoslider by ID
exports.getAutosliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const autoslider = await Autoslider.findById(id);
    
    if (!autoslider) {
      return res.status(404).json({ message: "Autoslider not found" });
    }
    
    res.status(200).json(autoslider);
  } catch (error) {
    console.error("Error fetching autoslider:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create new autoslider
exports.createAutoslider = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    // Upload image to S3 or local storage
    const IMAGE_STORAGE = process.env.IMAGE_STORAGE || "local";
    let imageUrl = "";
    
    if (IMAGE_STORAGE === "s3") {
      imageUrl = await uploadToS3(req.file);
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Create new autoslider
    const autoslider = new Autoslider({
      title,
      description,
      image: imageUrl
    });
    
    await autoslider.save();
    res.status(201).json({ message: "Autoslider created successfully", autoslider });
  } catch (error) {
    console.error("Error creating autoslider:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update autoslider
exports.updateAutoslider = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const autoslider = await Autoslider.findById(id);
    
    if (!autoslider) {
      return res.status(404).json({ message: "Autoslider not found" });
    }
    
    // Update fields if provided
    if (title) autoslider.title = title;
    if (description) autoslider.description = description;
    
    // Handle image update if provided
    if (req.file) {
      const IMAGE_STORAGE = process.env.IMAGE_STORAGE || "local";
      let imageUrl = "";
      
      if (IMAGE_STORAGE === "s3") {
        // Delete old image from S3 if exists
        if (autoslider.image && autoslider.image.startsWith("http")) {
          await deleteFromS3(autoslider.image);
        }
        
        // Upload new image
        imageUrl = await uploadToS3(req.file);
      } else {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      
      autoslider.image = imageUrl;
    }
    
    await autoslider.save();
    res.status(200).json({ message: "Autoslider updated successfully", autoslider });
  } catch (error) {
    console.error("Error updating autoslider:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete autoslider
exports.deleteAutoslider = async (req, res) => {
  try {
    const { id } = req.params;
    const autoslider = await Autoslider.findById(id);
    
    if (!autoslider) {
      return res.status(404).json({ message: "Autoslider not found" });
    }
    
    // Delete image from S3 if exists
    if (autoslider.image && autoslider.image.startsWith("http")) {
      await deleteFromS3(autoslider.image);
    }
    
    await Autoslider.findByIdAndDelete(id);
    res.status(200).json({ message: "Autoslider deleted successfully" });
  } catch (error) {
    console.error("Error deleting autoslider:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete only the image from an autoslider
exports.deleteAutosliderImage = async (req, res) => {
  try {
    console.log("Delete image request received for ID:", req.params.id);
    const { id } = req.params;
    
    // First, find the autoslider to get its current image
    const autoslider = await Autoslider.findById(id);
    
    if (!autoslider) {
      console.log("Autoslider not found with ID:", id);
      return res.status(404).json({ message: "Autoslider not found" });
    }
    
    console.log("Current image URL:", autoslider.image);
    
    // Check if there's an image to delete from S3
    if (autoslider.image) {
      // If it's an S3 URL, delete from S3
      if (autoslider.image.startsWith("http")) {
        try {
          console.log("Attempting to delete from S3:", autoslider.image);
          await deleteFromS3(autoslider.image);
          console.log("Successfully deleted from S3");
        } catch (s3Error) {
          console.error("Error deleting from S3:", s3Error);
          // Continue even if S3 deletion fails
        }
      }
    } else {
      console.log("No image URL found, but continuing with database update");
    }
    
    // Use updateOne to directly update without triggering validation
    // This avoids issues with required fields
    try {
      console.log("Updating autoslider in database to remove image reference");
      const result = await Autoslider.updateOne(
        { _id: id },
        { $set: { image: null } }
      );
      
      console.log("Database update result:", result);
      
      // Consider the operation successful even if no modifications were made
      // (which could happen if image was already null)
      return res.status(200).json({ 
        message: "Image removed successfully",
        modified: result.modifiedCount > 0
      });
    } catch (dbError) {
      console.error("Database error during update:", dbError);
      return res.status(500).json({ 
        message: "Database error during update", 
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error("Error in deleteAutosliderImage:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
}; 