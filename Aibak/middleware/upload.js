const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Take name from body and append timestamp
    const chefName = req.body.name ? req.body.name.replace(/\s+/g, "_") : "chef";
    const timestamp = Date.now();
    return {
      folder: "college_projects",
      format: "jpg",
      public_id: `${chefName}_${timestamp}`, // e.g. John_Doe_1694601100000
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto:low" },
        { fetch_format: "auto" },
      ],
    };
  },
});

const upload = multer({ storage });
module.exports = upload;
