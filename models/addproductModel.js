const mongoose = require('mongoose');

// Seller Schema
const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  brand: { type: String },
  model: { type: String },
  dimensions: { type: String },
  weight: { type: Number },
  material: { type: String },
  color: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  authenticity: { type: Boolean, default: true },
  warranty_details: { type: String },
  return_policy: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });

// Image Schema
const imageSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  image_url: { type: String, required: true },
  alt_text: { type: String },
}, { timestamps: true });

// Review Schema
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customer_name: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review_text: { type: String },
}, { timestamps: true });

// Export Models
const Seller = mongoose.model('Seller', sellerSchema);
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Image = mongoose.model('Image', imageSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Seller, Category, Product, Image, Review };
