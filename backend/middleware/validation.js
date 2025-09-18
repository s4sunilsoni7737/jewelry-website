// middleware/validation.js
// Input validation and sanitization middleware

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (at least 6 characters)
const passwordRegex = /^.{6,}$/;

// Sanitize string input
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  // Trim whitespace and remove potentially dangerous characters
  return str.trim().replace(/[<>\"']/g, ''); // Basic XSS prevention
}

// Validate email format
function validateEmail(email) {
  return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
  return passwordRegex.test(password);
}

// Login validation middleware
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  
  // Sanitize inputs
  req.body.email = sanitizeString(email);
  req.body.password = password; // Don't sanitize password, just validate
  
  // Validate email
  if (!email || !validateEmail(req.body.email)) {
    req.flash('error_msg', '❌ Please enter a valid email address');
    return res.redirect('/products/login');
  }
  
  // Validate password
  if (!password || !validatePassword(password)) {
    req.flash('error_msg', '❌ Password must be at least 6 characters long');
    return res.redirect('/products/login');
  }
  
  next();
}

// Product validation middleware
function validateProduct(req, res, next) {
  const { name, description, category, material, priceType, manualPrice, specifications } = req.body;
  
  // More robust validation
  const productName = name ? String(name).trim() : '';
  
  if (!productName || productName.length < 2) {
    req.flash('error_msg', '❌ Product name must be at least 2 characters long');
    return res.redirect('/products/add');
  }
  
  // Sanitize inputs after validation
  req.body.name = sanitizeString(name);
  req.body.description = sanitizeString(description || '');
  req.body.material = sanitizeString(material || '');
  
  if (!category) {
    req.flash('error_msg', '❌ Please select a category');
    return res.redirect('/products/add');
  }
  
  if (!material) {
    req.flash('error_msg', '❌ Please select a material');
    return res.redirect('/products/add');
  }
  
  // Validate material type
  const validMaterials = ['gold', 'silver', 'platinum'];
  if (!validMaterials.includes(material.toLowerCase())) {
    req.flash('error_msg', '❌ Please select a valid material');
    return res.redirect('/products/add');
  }
  
  // Validate weight
  if (!specifications || !specifications.weight || parseFloat(specifications.weight) <= 0) {
    req.flash('error_msg', '❌ Please enter a valid weight greater than 0');
    return res.redirect('/products/add');
  }
  
  // Validate pricing
  if (priceType === 'manual') {
    if (!manualPrice || parseFloat(manualPrice) <= 0) {
      req.flash('error_msg', '❌ Please enter a valid manual price greater than 0');
      return res.redirect('/products/add');
    }
  }
  
  next();
}

// Search validation middleware
function validateSearch(req, res, next) {
  const { search, category, material, price } = req.query;
  
  // Sanitize search inputs
  if (search) req.query.search = sanitizeString(search);
  if (category) req.query.category = sanitizeString(category);
  if (material) req.query.material = sanitizeString(material);
  if (price) req.query.price = sanitizeString(price);
  
  next();
}

// Profile validation middleware
function validateProfile(req, res, next) {
  const { name, email, phone, address, city, state, country, pincode } = req.body;
  
  // Sanitize inputs
  req.body.name = sanitizeString(name);
  req.body.email = sanitizeString(email);
  req.body.phone = sanitizeString(phone);
  req.body.address = sanitizeString(address);
  req.body.city = sanitizeString(city);
  req.body.state = sanitizeString(state);
  req.body.country = sanitizeString(country);
  req.body.pincode = sanitizeString(pincode);
  
  // Validate email if provided
  if (email && !validateEmail(req.body.email)) {
    req.flash('error_msg', '❌ Please enter a valid email address');
    return res.redirect('back');
  }
  
  next();
}

module.exports = {
  validateLogin,
  validateProduct,
  validateSearch,
  validateProfile,
  sanitizeString,
  validateEmail,
  validatePassword
};
