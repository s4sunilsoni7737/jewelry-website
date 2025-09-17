const MetalRate = require('../models/metalRate');

async function getLatestRates() {
  const goldDoc = await MetalRate.findOne({ metalType: 'gold' }).sort({ updatedAt: -1 });
  const silverDoc = await MetalRate.findOne({ metalType: 'silver' }).sort({ updatedAt: -1 });

  return {
    gold: goldDoc ? (goldDoc.ratePerGram || goldDoc.ratePerGramFinal || goldDoc.ratePerGramRaw || 0) : 0,
    silver: silverDoc ? (silverDoc.ratePerGram || silverDoc.ratePerGramFinal || silverDoc.ratePerGramRaw || 0) : 0,
  };
}

module.exports = getLatestRates;
