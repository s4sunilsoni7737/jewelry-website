const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: { type: Number, default: 0 }, // Final price (manual or auto-calculated)
  isManualPrice: { type: Boolean, default: false }, // If true, use given price
  ratePerGram: { type: Number, default: 0 }, // Metal rate
  material: String,
  description: String,
  specifications: {
    weight: { type: String, default: "0",
      validate: {
        validator: v=> !isNaN(parseFloat(v)) && parseFloat(v) >= 0,
        message: props => `${props.value} is not a valid weight!`
      }
     }, // Example: "10" (grams)
    size: String,
    metalPurity: String,
    gemstone: String,
  },
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  image: {
    type: String,
    default: '/images/default.png',
    required: false
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// 🔹 Auto-calculate price if not manual
productSchema.pre("save", function (next) {
  if (!this.isManualPrice) {
    let weight = parseFloat(this.specifications?.weight);
    if (isNaN(weight)) weight = 0;

    let rate = Number(this.ratePerGram);
    if (isNaN(rate)) rate = 0;

    this.price = weight * rate;
  }

  // Ensure price is always a number
  if (isNaN(this.price)) {
    this.price = 0;
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
