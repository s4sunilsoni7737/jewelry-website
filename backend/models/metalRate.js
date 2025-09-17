const mongoose = require('mongoose');

const MetalRateSchema = new mongoose.Schema({
  metalType: { type: String, required: true }, // 'gold' or 'silver'

  // Base INR price without GST/margin
  ratePerGramRaw: { type: Number, required: true },

  // Final INR price with GST/margin applied
  ratePerGramFinal: { type: Number, required: true },

  source: { type: String, required: true } // e.g. 'live-api', 'manual'
}, { timestamps: true });

module.exports = mongoose.model('MetalRate', MetalRateSchema);
