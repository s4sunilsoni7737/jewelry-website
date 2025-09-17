require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cron = require('node-cron');
const MetalRate = require('./models/metalRate.js');

const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categoryRoutes');
const isLoggedIn = require('./middleware/isLoggedIn');

const app = express();

// =================== Middleware ===================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'royalJewelsSecretKey123',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use(isLoggedIn);
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/api/metal-rates', require('./routes/api/metalRates'));

// Middleware to set rates to res.locals
app.use(async (req, res, next) => {
  try {
    const [goldRate, silverRate] = await Promise.all([
      MetalRate.findOne({ metalType: 'gold' }).sort({ updatedAt: -1 }),
      MetalRate.findOne({ metalType: 'silver' }).sort({ updatedAt: -1 })
    ]);

    res.locals.goldRateRaw = goldRate?.ratePerGramRaw || 0;
    res.locals.goldRateFinal = goldRate?.ratePerGramFinal || 0;

    res.locals.silverRateRaw = silverRate?.ratePerGramRaw || 0;
    res.locals.silverRateFinal = silverRate?.ratePerGramFinal || 0;

    next();
  } catch (err) {
    console.error('Error fetching metal rates:', err);
    res.locals.goldRateRaw = 0;
    res.locals.goldRateFinal = 0;
    res.locals.silverRateRaw = 0;
    res.locals.silverRateFinal = 0;
    next();
  }
});


app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// =================== View Engine ===================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// =================== Routes ===================
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

// =================== Database Connection ===================
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jewellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// =================== Background Job (Fetch Rates Every Hour) ===================
// cron.schedule('0 * * * *', async () => {
//   console.log('🔄 Fetching latest rates...');
//   const metals = ['gold', 'silver'];

//   for (const metal of metals) {
//     const rate = await fetchLiveMetalRate(metal);

//     const lastSaved = await MetalRate.findOne({ metalType: metal }).sort({ updatedAt: -1 });

//     if (!lastSaved || lastSaved.ratePerGram !== rate) {
//       await new MetalRate({
//         metalType: metal,
//         ratePerGram: rate,
//         source: 'cron-job'
//       }).save();
//       console.log(`✅ Saved ${metal} rate: ${rate}`);
//     } else {
//       console.log(`ℹ No change in ${metal} rate`);
//     }
//   }
// });



// =================== Server ===================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
