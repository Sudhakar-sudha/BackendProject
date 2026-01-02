import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const uploadDir = path.resolve("uploads");

export const addProduct = async (req, res) => {
  const { productname, description, price } = req.body;

  const product = await Product.create({
    productname,
    description,
    price,
    image: req.file?.path,
  });

  res.json(product);
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // ❗ Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.active = !product.active;
    await product.save();

    res.json({ message: "Product status updated", product });
  } catch (error) {
    console.error("toggleActive error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (req.file && product.image) {
    fs.unlink(path.join(uploadDir, product.image), () => {});
  }

  Object.assign(product, req.body);
  if (req.file) product.image = req.file.path;

  await product.save();
  res.json(product);
};

export const deleteProductPermanent = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product?.image) {
    fs.unlink(path.join(uploadDir, product.image), () => {});
  }

  await product.deleteOne();
  res.json({ message: "Deleted successfully" });
};
