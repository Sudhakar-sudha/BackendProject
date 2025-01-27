
const {Seller , Review , Product , Image , Category } = require('../models/addproductModel')

// Create a Seller
exports.createSeller = async (req, res) => {
  try {
    const seller = new Seller(req.body);
    await seller.save();
    res.status(201).json(seller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get All Sellers
exports.getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find(); // Retrieve all sellers from the database
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Seller by ID
exports.getSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id); // Retrieve seller by ID
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller').populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a Product
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Add a Review
exports.addReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Reviews for a Product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add Image
exports.addImage = async (req, res) => {
    try {
      const { product, image_url, alt_text } = req.body;
      const image = new Image({
        product,
        image_url,
        alt_text
      });
      await image.save();
      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Get Images for a Product
  exports.getProductImages = async (req, res) => {
    try {
      const images = await Image.find({ product: req.params.productId });
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  // Add a Category
exports.addCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Get All Categories
  exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  