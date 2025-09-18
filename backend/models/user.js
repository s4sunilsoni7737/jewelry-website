const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  // 🔹 Is this user a seller/shop owner?
  isSeller: {
    type: Boolean,
    default: false
  },

  // 🔹 If customer, stores selected shop (seller id)
  selectedShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // 📱 Contact Information (no strict regex, just basic strings)
  contactInfo: {
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true }
  },

  // 📍 Location Information
  location: {
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },
    pincode: { type: String, trim: true }
  },

  // 🕒 Business Hours
  businessHours: {
    weekdays: { type: String, default: 'Mon - Sat: 10:00 AM - 8:00 PM' },
    sunday: { type: String, default: 'Sunday: 11:00 AM - 6:00 PM' }
  }

}, {
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);
