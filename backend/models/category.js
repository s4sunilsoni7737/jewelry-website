const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  nameHindi: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for unique categories per owner
categorySchema.index({ name: 1, owner: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;