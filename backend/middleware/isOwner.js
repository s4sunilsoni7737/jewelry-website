const Product = require('../models/Product');
const { Types } = require('mongoose');

// Middleware to check if the current user is the owner of a product
const isOwner = async (req, res, next) => {
  try {
    const productId = req.params.id || req.body.id || req.query.id;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the current user is the owner
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Unauthorized - You do not have permission to perform this action' 
      });
    }

    // Attach the product to the request object for use in the route handler
    req.product = product;
    next();
  } catch (error) {
    console.error('Error in isOwner middleware:', error);
    res.status(500).json({ error: 'Server error while verifying ownership' });
  }
};

module.exports = isOwner;
