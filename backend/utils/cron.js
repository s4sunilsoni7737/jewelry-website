// const cron = require('node-cron');
// const axios = require('axios');
// const MetalRate = require('./models/metalRate');

// // Fetch live rate from GoldAPI.io
// async function fetchLiveMetalRate(metalType) {
//   try {
//     const symbol = metalType === 'gold' ? 'XAU' : 'XAG';
//     const response = await axios.get(`${process.env.GOLDAPI_BASE}/${symbol}/USD`, {
//       headers: {
//         'x-access-token': process.env.GOLDAPI_KEY,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.data || !response.data.price) {
//       console.error(`⚠️ No price data for ${metalType}`);
//       return null;
//     }

//     const ratePerOunce = response.data.price;
//     const ratePerGram = ratePerOunce / 31.1035; // troy ounce → gram
//     return parseFloat(ratePerGram.toFixed(2));
//   } catch (err) {
//     console.error(`❌ Error fetching ${metalType} rate:`, err.message);
//     return null;
//   }
// }

// // Run every 1 hour on the hour
// cron.schedule('0 * * * *', async () => {
//   console.log('🔄 Auto-refreshing metal rates...');

//   const metals = ['gold', 'silver'];
//   for (const metal of metals) {
//     const rate = await fetchLiveMetalRate(metal);
//     if (!rate) continue;

//     await MetalRate.findOneAndUpdate(
//       { metalType: metal },
//       { ratePerGram: rate, source: 'cron-job' },
//       { new: true, upsert: true }
//     );

//     console.log(`✅ Updated ${metal} rate: ${rate}`);
//   }
// });
