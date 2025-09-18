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
  
  // Check for required fields
  if (!email || !password) {
    req.flash('error_msg', '❌ Email and password are required');
    return res.redirect('/products/login');
  }
  
  // Sanitize inputs
  req.body.email = sanitizeString(email).toLowerCase();
  req.body.password = password; // Don't sanitize password, just validate
  
  // Validate email format
  if (!validateEmail(req.body.email)) {
    req.flash('error_msg', '❌ Please enter a valid email address');
    return res.redirect('/products/login');
  }
  
  // Validate email length
  if (req.body.email.length > 254) {
    req.flash('error_msg', '❌ Email address is too long');
    return res.redirect('/products/login');
  }
  
  // Validate password
  if (!validatePassword(password)) {
    req.flash('error_msg', '❌ Password must be at least 6 characters long');
    return res.redirect('/products/login');
  }
  
  // Validate password length (prevent DoS)
  if (password.length > 128) {
    req.flash('error_msg', '❌ Password is too long');
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
    return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
  }
  
  if (productName.length > 100) {
    req.flash('error_msg', '❌ Product name must be less than 100 characters');
    return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
  }
  
  // Sanitize inputs after validation
  req.body.name = sanitizeString(name);
  req.body.description = sanitizeString(description || '');
  req.body.material = sanitizeString(material || '');
  
  if (!category) {
    req.flash('error_msg', '❌ Please select a category');
    return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
  }
  
  if (!material) {
    req.flash('error_msg', '❌ Please select a material');
    return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
  }
  
  // Validate material type
  const validMaterials = ['gold', 'silver', 'platinum'];
  if (!validMaterials.includes(material.toLowerCase())) {
    req.flash('error_msg', '❌ Please select a valid material');
    return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
  }
  
  // Validate weight
  if (!specifications || !specifications.weight || parseFloat(specifications.weight) <= 0) {
    req.flash('error_msg', '❌ Please enter a valid weight greater than 0');
    return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
  }
  
  const weight = parseFloat(specifications.weight);
  if (weight > 10000) { // 10kg limit
    req.flash('error_msg', '❌ Weight cannot exceed 10,000 grams');
    return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
  }
  
  // Validate metal purity
  if (specifications.metalPurity) {
    const purity = parseFloat(specifications.metalPurity);
    if (material.toLowerCase() === 'gold' && (purity < 10 || purity > 24)) {
      req.flash('error_msg', '❌ Gold purity must be between 10 and 24 karats');
      return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
    }
    if (material.toLowerCase() === 'silver' && (purity < 800 || purity > 999)) {
      req.flash('error_msg', '❌ Silver purity must be between 800 and 999');
      return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
    }
  }
  
  // Validate pricing
  if (priceType === 'manual') {
    if (!manualPrice || parseFloat(manualPrice) <= 0) {
      req.flash('error_msg', '❌ Please enter a valid manual price greater than 0');
      return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
    }
    
    const price = parseFloat(manualPrice);
    if (price > 10000000) { // 1 crore limit
      req.flash('error_msg', '❌ Price cannot exceed ₹1,00,00,000');
      return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
    }
  }
  
  // Validate description length
  if (description && description.length > 1000) {
    req.flash('error_msg', '❌ Description must be less than 1000 characters');
    return res.redirect(req.originalUrl.includes('edit') ? 'back' : '/products/add');
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
