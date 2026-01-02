import Chef from "../models/Chef.js";
import cloudinary from "../../config/cloudinary.js";


// GET all chefs
export const getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find().sort({ createdAt: -1 });
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// CREATE
export const createChef = async (req, res) => {
  try {
    const { name, qualification, experience, signature } = req.body;
    const imageUrl = req.file ? req.file.path : "";
    const publicId = req.file ? req.file.filename : ""; // <-- filename is Cloudinary public_id

    const chef = await Chef.create({
      name,
      qualification,
      experience,
      signature,
      imageUrl,
      publicId,
    });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE (if new file uploaded)
export const updateChef = async (req, res) => {
  try {
    const { name, qualification, experience, signature } = req.body;
    const updateData = { name, qualification, experience, signature };
    if (req.file) {
      updateData.imageUrl = req.file.path;
      updateData.publicId = req.file.filename;
    }
    const chef = await Chef.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// DELETE chef
export const deleteChef = async (req, res) => {
  try {
    const { id } = req.params;
    const chef = await Chef.findById(id);
    if (!chef) return res.status(404).json({ msg: "Chef not found" });

    // Remove the image from Cloudinary if it exists
    if (chef.publicId) {
      await cloudinary.uploader.destroy(chef.publicId);
    }

    await chef.deleteOne();
    res.json({ msg: "Chef deleted", id });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
};
