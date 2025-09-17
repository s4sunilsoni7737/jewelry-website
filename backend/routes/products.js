const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/user');
const Rate = require('../models/metalRate');
const Categories = require('../models/category');
const bcrypt = require('bcrypt');
const { requireLogin } = require('../middleware/auth');
const getLatestRates = require('../controllers/getLatestRates');

// =================== AUTH ===================

// GET login form
router.get('/login', (req, res) => {
  res.render('pages/login');
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', '❌ User not found');
      return res.redirect('/products/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', '❌ Invalid password');
      return res.redirect('/products/login');
    }

    req.session.userId = user._id;
    req.session.isSeller = user.isSeller;
    req.flash('success_msg', '✅ Logged in successfully!');
    res.redirect('/products');
  } catch (error) {
    console.error('Login Error:', error);
    req.flash('error_msg', '❌ Server error during login');
    res.redirect('/products/login');
  }
});


// GET logout
router.get('/logout', (req, res, next) => {
  req.flash('success_msg', '✅ Logged out successfully!');
  
  req.session.destroy(err => {
    if (err) return next(err);
    res.redirect('/products/login');
  });
});



// =================== SHOP SELECTION ===================

router.post('/select-shop', async (req, res) => {
  const { shopId } = req.body;
  try {
    const shop = await User.findById(shopId);
    if (!shop || !shop.isSeller) return res.status(400).send('Invalid shop');

    req.session.selectedShop = shop._id;
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error selecting shop');
  }
});

router.post('/reset-shop', (req, res) => {
  req.session.selectedShop = null;
  res.redirect('/products');
});

// =================== PRODUCT ROUTES ===================

// Home - Show shop selector or products
router.get('/', async (req, res) => {
  try {
    const categories = await Categories.find();
    // Get admin user for contact info
    const adminUser = await User.findOne({ isAdmin: true });

    if (!req.session.selectedShop && !req.session.isSeller) {
      const shops = await User.find({ isSeller: true });
      return res.render('pages/index', {
        title: 'Choose Shop',
        products: [],
        categories,
        shops,
        session: req.session,
        currentShop: null,
        admin: adminUser, // Pass admin user to the view
      });
    }

    const shopId = req.session.isSeller ? req.session.userId : req.session.selectedShop;
    const products = await Product.find({ owner: shopId });
    const currentShop = await User.findById(shopId);
    const rates = await getLatestRates();
    
    res.render('pages/index', {
      title: 'Home',
      products,
      shops: [],
      categories,
      session: req.session,
      currentShop,
      goldRate: rates.gold,
      silverRate: rates.silver,
      admin: adminUser, // Pass admin user to the view
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// =================== PRODUCT SEARCH ===================

// Updated search-results route handler
router.get('/search-results', async (req, res) => {
  try {
    const { search, category, material, price } = req.query;
    const filter = {};

    // Get shop ID
    const shopId = req.session.isSeller ? req.session.userId : req.session.selectedShop;
    if (!shopId) {
      return res.status(400).render('pages/error', { 
        title: 'Error',
        message: 'No shop selected.',
        currentShop: null
      });
    }
    filter.owner = shopId;

    // Only show products that are in stock
    filter.inStock = true;

    // Search by product name (case-insensitive)
    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by category (assuming category is ObjectId)
    if (category && category.trim()) {
      // If category is passed as name, find the category ObjectId
      try {
        const categoryDoc = await Category.findOne({ 
          name: { $regex: category.trim(), $options: 'i' } 
        });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          // If it's already an ObjectId
          if (mongoose.Types.ObjectId.isValid(category)) {
            filter.category = category;
          }
        }
      } catch (err) {
        console.warn('Category filter error:', err);
      }
    }

    // Filter by material
    if (material && material.trim()) {
      filter.material = { $regex: material.trim(), $options: 'i' };
    }

    // Filter by price range
    if (price && price.trim()) {
      const priceStr = price.trim();
      
      if (priceStr.includes('-')) {
        // Range like "100-500"
        const [min, max] = priceStr.split('-').map(num => parseFloat(num.trim()));
        if (!isNaN(min) && !isNaN(max)) {
          filter.price = { $gte: min, $lte: max };
        }
      } else if (priceStr.endsWith('+')) {
        // Range like "1000+"
        const min = parseFloat(priceStr.replace('+', '').trim());
        if (!isNaN(min)) {
          filter.price = { $gte: min };
        }
      } else if (priceStr.startsWith('<')) {
        // Range like "<500"
        const max = parseFloat(priceStr.replace('<', '').trim());
        if (!isNaN(max)) {
          filter.price = { $lte: max };
        }
      } else {
        // Exact price or single number
        const exactPrice = parseFloat(priceStr);
        if (!isNaN(exactPrice)) {
          // Allow some tolerance for exact price matching
          filter.price = { $gte: exactPrice - 1, $lte: exactPrice + 1 };
        }
      }
    }

    console.log('Search filter:', JSON.stringify(filter, null, 2));

    // Execute search with population
    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('owner', 'shopName businessName')
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    // Get current shop info
    const currentShop = await User.findById(shopId).lean();

    // Format products for display
    const formattedProducts = products.map(product => ({
      ...product,
      categoryName: product.category?.name || 'Uncategorized',
      price: product.isManualPrice ? product.price : 0, // Will be calculated by frontend
    }));

    res.render('pages/search-results', {
      title: `Search Results${search ? ` for "${search}"` : ''}`,
      products: formattedProducts,
      filters: {
        search: search || '',
        category: category || '',
        material: material || '',
        price: price || ''
      },
      currentShop,
      searchQuery: search || '',
      totalResults: products.length
    });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).render('pages/error', {
      title: 'Search Error',
      message: 'An error occurred while searching. Please try again.',
      currentShop: null
    });
  }
});

// Additional helper route for advanced search
router.get('/advanced-search', async (req, res) => {
  try {
    const shopId = req.session.isSeller ? req.session.userId : req.session.selectedShop;
    if (!shopId) {
      return res.redirect('/products');
    }

    // Get all categories and materials for filter options
    const [categories, materials] = await Promise.all([
      Category.find({}).sort({ name: 1 }).lean(),
      Product.distinct('material', { owner: shopId, inStock: true })
    ]);

    const currentShop = await User.findById(shopId).lean();

    res.render('pages/advanced-search', {
      title: 'Advanced Search',
      categories,
      materials: materials.filter(m => m && m.trim()), // Remove empty materials
      currentShop
    });

  } catch (err) {
    console.error('Advanced search page error:', err);
    res.redirect('/products');
  }
});

// API endpoint for search suggestions (for autocomplete)
router.get('/api/search-suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    const shopId = req.session.isSeller ? req.session.userId : req.session.selectedShop;
    
    if (!q || !shopId) {
      return res.json([]);
    }

    const suggestions = await Product.find({
      owner: shopId,
      inStock: true,
      name: { $regex: q, $options: 'i' }
    })
    .select('name')
    .limit(5)
    .lean();

    res.json(suggestions.map(p => p.name));

  } catch (err) {
    console.error('Search suggestions error:', err);
    res.json([]);
  }
});

// =================== ADD PRODUCT ===================

router.get('/add', requireLogin, async (req, res) => {
  if (!req.session.isSeller) return res.status(403).send('Unauthorized');

  const currentShop = await User.findById(req.session.userId);
  const categories = await Categories.find();
  res.render('pages/add-product', {
    session: req.session,
    currentShop,
    categories,
    product:{}
  });
});

router.post('/add', requireLogin, upload.single('image'), async (req, res) => {
  if (!req.session.isSeller) {
    req.flash('error_msg', '❌ Unauthorized');
    return res.redirect('/products');
  }

  try {
    const {
      name,
      category,
      priceType,
      manualPrice,
      material, // "gold" or "silver"
      description,
      specifications = {},
      featured,
      inStock,
    } = req.body;

    // ✅ Validate category
    const categoryDoc = await Categories.findById(category);
    if (!categoryDoc) {
      req.flash('error_msg', '❌ Invalid category');
      return res.redirect('/products/add');
    }

    // ✅ Parse weight safely
    const weight = parseFloat(specifications.weight) || 1;

    // ✅ Get latest metal rates
    const rates = await getLatestRates();

  // ✅ Calculate price
let finalPrice = 0;
let ratePerGram = 0;

if (priceType === 'manual') {
  finalPrice = parseFloat(manualPrice) || 0;
} else {
  if (material?.toLowerCase() === 'gold') {
    ratePerGram = Number(rates.gold) || 0;
  } else if (material?.toLowerCase() === 'silver') {
    ratePerGram = Number(rates.silver) || 0;
  }
  finalPrice = ratePerGram * weight;
}

// Prevent NaN
if (isNaN(finalPrice)) finalPrice = 0;
if (isNaN(ratePerGram)) ratePerGram = 0;


    // ✅ Create product
    const newProduct = new Product({
      name,
      category: categoryDoc._id,
      price: finalPrice,
      isManualPrice: priceType === 'manual',
      ratePerGram,
      material: material.toLowerCase(),
      description,
      specifications,
      featured: !!featured,
      inStock: !!inStock,
image: req.file?.path || req.file?.secure_url || '/images/default.png',
      owner: req.session.userId,
    });

    await newProduct.save();
    req.flash('success_msg', '✅ Product added successfully!');
    res.redirect('/products');
  } catch (err) {
    console.error('Error adding product:', err.message);
    req.flash('error_msg', '❌ Server error while adding product');
    res.redirect('/products/add');
  }
});



// =================== EDIT PRODUCT ===================

router.get('/:id/edit', requireLogin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Categories.find();

    if (!product) {
      req.flash('error_msg', '❌ Product not found');
      return res.redirect('/products');
    }

    if (!product.owner.equals(req.session.userId)) {
      req.flash('error_msg', '❌ Unauthorized access to edit this product');
      return res.redirect('/products');
    }

    res.render('pages/update', { product, categories });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '❌ Server error loading edit page');
    res.redirect('/products');
  }
});


router.put('/:id', requireLogin, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      category,
      priceType,        // ✅ Add this
      manualPrice,      // ✅ Add this  
      autoPrice,        // ✅ Add this
      material,
      description,
      specifications = {},
      featured,
      inStock,
    } = req.body;

    // Validate category
    let categoryDoc = null;
    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryDoc = await Categories.findById(category);
    }
    if (!categoryDoc) {
      categoryDoc = await Categories.findOne({ name: category.toLowerCase() });
    }
    if (!categoryDoc) {
      req.flash('error_msg', '❌ Invalid category');
      return res.redirect(`/products/${req.params.id}/edit`);
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error_msg', '❌ Product not found');
      return res.redirect('/products');
    }

    if (!product.owner.equals(req.session.userId)) {
      req.flash('error_msg', '❌ Unauthorized to update this product');
      return res.redirect('/products');
    }

    // ✅ Calculate price based on priceType
    let finalPrice = 0;
let ratePerGram = 0;

if (priceType === 'manual') {
  finalPrice = parseFloat(manualPrice) || 0;
} else {
  const weight = parseFloat(specifications.weight) || 1;
  const rates = await getLatestRates();

  if (material?.toLowerCase() === 'gold') {
    ratePerGram = Number(rates.gold) || 0;
  } else if (material?.toLowerCase() === 'silver') {
    ratePerGram = Number(rates.silver) || 0;
  }
  finalPrice = ratePerGram * weight;
}

// Prevent NaN
if (isNaN(finalPrice)) finalPrice = 0;
if (isNaN(ratePerGram)) ratePerGram = 0;


    const updatedProduct = {
      name,
      category: categoryDoc._id,
      price: finalPrice,                              // ✅ Use calculated price
      isManualPrice: priceType === 'manual',         // ✅ Add this field
      ratePerGram,                                   // ✅ Add this field
      material: material.toLowerCase(),              // ✅ Store lowercase like add route
      description,
      specifications: {
        weight: specifications.weight || '',
        size: specifications.size || '',
        metalPurity: specifications.metalPurity || '',
        gemstone: specifications.gemstone || '',
      },
      featured: featured === 'on',
      inStock: inStock === 'on',
    };

    if (req.file) {
      updatedProduct.image = req.file.path;
    }

    await Product.findByIdAndUpdate(req.params.id, updatedProduct);
    req.flash('success_msg', '✅ Product updated successfully!');
    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '❌ Error updating product');
    res.redirect(`/products/${req.params.id}/edit`);
  }
});


// =================== DELETE PRODUCT ===================

router.get('/:id/delete', requireLogin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    if (!product.owner.equals(req.session.userId)) return res.status(403).send('Unauthorized');
    res.render('pages/delete-product', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/delete', requireLogin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error_msg', '❌ Product not found');
      return res.redirect('/products');
    }
    if (!product.owner.equals(req.session.userId)) {
      req.flash('error_msg', '❌ Unauthorized');
      return res.redirect('/products');
    }
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success_msg', '🗑️ Product deleted successfully!');
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', '❌ Server error while deleting product');
    res.redirect('/products');
  }
});


// =================== VIEW BY CATEGORY ===================

router.get('/category/:name', async (req, res) => {
  try {
    const categoryName = req.params.name.toLowerCase();
    const category = await Categories.findOne({ name: categoryName });

    if (!category) return res.status(404).render('404', { message: 'Category not found' });

    const products = await Product.find({ category: category._id }).populate('category');

    res.render('pages/show-product-by-category', {
      title: `${category.name} Collection`,
      category,
      products,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).render('500', { message: 'Server error' });
  }
});

// =================== VIEW SINGLE PRODUCT ===================

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner')
      .populate('category');

    if (!product) return res.status(404).send('Product not found');

    res.render('pages/show', { product, session: req.session, category: product.category });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
