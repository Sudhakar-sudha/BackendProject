// controllers/menuController.js
import MenuItem from "../models/MenuItem.js";
import cloudinary from "../../config/cloudinary.js";



// Create
export const createMenuItem = async (req, res) => {
  try {
    const { category, name, price } = req.body;
    if (!category || !name || price === undefined) {
      return res.status(400).json({ message: "category, name and price are required" });
    }

    const item = await MenuItem.create({
      category,
      name,
      price,
      imageUrl: req.file ? req.file.path : "",
      imagePublicId: req.file ? req.file.filename : "",
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, price } = req.body;

    const updateData = { category, name, price };
    if (req.file) {
      updateData.imageUrl = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const item = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    // Optional: delete from Cloudinary if an image exists
    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    res.json({ message: "Deleted", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ all
export const getMenuItems = async (_req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// READ one
export const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
