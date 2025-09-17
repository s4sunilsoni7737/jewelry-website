// middleware/auth.js

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/products/login");
  }
  next();
}

module.exports = {
  requireLogin,
};
