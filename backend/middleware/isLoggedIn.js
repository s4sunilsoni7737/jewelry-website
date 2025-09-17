// middleware/isLoggedIn.js
const User = require('../models/user');

module.exports = async (req, res, next) => {
  res.locals.isLoggedIn = !!req.session.userId;
  res.locals.userRole = req.session.role || null;
  
  // If user is logged in, fetch their contact info
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('contactInfo');
      if (user) {
        res.locals.user = user.toObject();
      }
    } catch (err) {
      console.error('Error fetching user contact info:', err);
    }
  }
  
  next();
};
