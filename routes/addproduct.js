const express = require('express');
const router = express.Router();
const { createSeller ,getSellers , getSellerById, getAllProducts  , addProduct , addReview , getProductReviews ,  addImage, getProductImages , addCategory , getCategories } = require("../controllers/addproductControllers");

// routes/sellerRoutes.js
router.post('/seller',createSeller);
router.get('/getseller',getSellers);
router.get('/getsellerid/:id',getSellerById);
// routes/productRoutes.js
router.get('/products', getAllProducts);
router.post('/products', addProduct);
// routes/reviewRoutes.js
router.post('/addreview', addReview);
router.get('/:id/reviews', getProductReviews);
// Add a new image for a product
router.post('/images', addImage);
// Get all images for a specific product
router.get('/products/:productId/images', getProductImages);
// Add a new category
router.post('/categories', addCategory);
// Get all categories
router.get('/categories', getCategories);


module.exports = router;