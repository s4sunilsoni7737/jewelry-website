
const MetalRate = require('../models/metalRate');

async function getLatestRates() {
  try {
    const goldDoc = await MetalRate.findOne({ metalType: 'gold' }).sort({ updatedAt: -1 });
    const silverDoc = await MetalRate.findOne({ metalType: 'silver' }).sort({ updatedAt: -1 });

    return {
      gold: goldDoc ? (goldDoc.ratePerGramFinal || goldDoc.ratePerGram || 0) : 0,
      silver: silverDoc ? (silverDoc.ratePerGramFinal || silverDoc.ratePerGram || 0) : 0,
    };
  } catch (error) {
    console.error('Error fetching rates:', error);
    return { gold: 0, silver: 0 };
  }
}

module.exports = getLatestRates;
