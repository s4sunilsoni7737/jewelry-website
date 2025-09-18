// middleware/auth.js

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    // Store the original URL for redirect after login
    req.session.returnTo = req.originalUrl;
    req.flash('error_msg', 'Please log in to access this page');
    return res.redirect("/products/login");
  }
  next();
}

module.exports = {
  requireLogin,
};
