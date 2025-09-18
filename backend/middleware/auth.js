const User = require('../models/user');

async function requireLogin(req, res, next) {
  if (!req.session.userId) {
    req.session.returnTo = req.originalUrl;
    req.flash('error_msg', 'Please log in to access this page');
    return res.redirect("/products/login");
  }

  try {
    // Fetch the user and attach to req.user
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect("/products/login");
    }
    req.user = user;  // ✅ Now req.user is defined
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    req.flash('error_msg', 'Server error. Please log in again.');
    res.redirect("/products/login");
  }
}

module.exports = {
  requireLogin,
};
