// routes/api/metalRates.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const MetalRate = require('../../models/metalRate');

/**
 * Fetch live rate from GoldAPI.io, convert to INR, apply charges
 * @param {string} metalType - 'gold' or 'silver'
 * @returns {object|null} { raw, final }
 */
async function fetchLiveMetalRate(metalType) {
  try {
    const symbol = metalType === 'gold' ? 'XAU' : 'XAG';

    // 1. Fetch USD price per ounce
    const response = await axios.get(`${process.env.GOLDAPI_BASE}/${symbol}/USD`, {
      headers: {
        'x-access-token': process.env.GOLDAPI_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data || !response.data.price) {
      console.error(`⚠️ No price data returned for ${metalType}`);
      return null;
    }

    const usdPerOunce = response.data.price;
    const usdPerGram = usdPerOunce / 31.1035;

    // 2. Fetch USD→INR exchange rate
    const fxRes = await axios.get(`https://api.exchangerate.host/latest?base=USD&symbols=INR`);
    const usdToInr = fxRes.data?.rates?.INR || 83; // fallback if API fails

    const inrPerGramRaw = usdPerGram * usdToInr;

    // 3. Apply total charges (import duty + GST + margin)
    let totalPercent = 0;
    if (metalType === 'gold') totalPercent = 0.175; // 17.5%
    if (metalType === 'silver') totalPercent = 0.135; // 13.5%

    const inrPerGramFinal = inrPerGramRaw + (inrPerGramRaw * totalPercent);

    return {
      raw: parseFloat(inrPerGramRaw.toFixed(2)),
      final: parseFloat(inrPerGramFinal.toFixed(2))
    };
  } catch (error) {
    console.error(`❌ Failed to fetch ${metalType} rate:`, error.response?.data || error.message);
    return null;
  }
}

// GET latest rate for a metal
router.get('/:metalType', async (req, res) => {
  try {
    const { metalType } = req.params;
    const latestRate = await MetalRate.findOne({ metalType });

    if (!latestRate) {
      return res.status(404).json({ success: false, message: 'No rate found' });
    }

    res.json({ success: true, rate: latestRate });
  } catch (err) {
    console.error('❌ Error fetching rate:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST manually add/update rate
router.post('/', async (req, res) => {
  try {
    const { metalType, ratePerGramRaw, ratePerGramFinal, source } = req.body;

    if (!metalType || !ratePerGramRaw || !ratePerGramFinal || !source) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const updated = await MetalRate.findOneAndUpdate(
      { metalType },
      { ratePerGramRaw, ratePerGramFinal, source },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Rate saved', rate: updated });
  } catch (error) {
    console.error('❌ Error saving rate:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST refresh rates from GoldAPI.io
router.post('/refresh', async (req, res) => {
  try {
    const metals = ['gold', 'silver'];
    const updatedRates = [];

    for (const metal of metals) {
      const rates = await fetchLiveMetalRate(metal);
      if (!rates) continue;

      const updated = await MetalRate.findOneAndUpdate(
        { metalType: metal },
        {
          ratePerGramRaw: rates.raw,
          ratePerGramFinal: rates.final,
          source: 'live-api'
        },
        { new: true, upsert: true }
      );

      updatedRates.push(updated);
    }

    res.json({ success: true, message: 'Rates refreshed', rates: updatedRates });
  } catch (err) {
    console.error('❌ Error refreshing rates:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
