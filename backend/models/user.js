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
    lowercase: true
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

  // 🔹 If customer, this field stores which shop (owner) they follow or selected
  selectedShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to a seller in the same User model
    default: null
  },

  // 📱 Contact Information
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^[+]?[\d\s\-\(\)]{10,15}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true
    }
  },

  // 📍 Location Information
  location: {
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    },
    pincode: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^\d{6}$/.test(v);
        },
        message: 'Please enter a valid 6-digit pincode'
      }
    }
  },

  // 🕒 Business Hours
  businessHours: {
    weekdays: {
      type: String,
      default: 'Mon - Sat: 10:00 AM - 8:00 PM'
    },
    sunday: {
      type: String,
      default: 'Sunday: 11:00 AM - 6:00 PM'
    }
  }

}, {
  versionKey: false // optional: to remove __v field
});

module.exports = mongoose.model('User', userSchema);
