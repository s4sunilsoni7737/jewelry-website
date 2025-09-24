const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cron = require('node-cron');
const MetalRate = require('./models/metalRate.js');

const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categoryRoutes');
const isLoggedIn = require('./middleware/isLoggedIn');
const { generalLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// =================== Middleware ===================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Request logging middleware (disabled for production)
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
//   next();
// });

// Trust proxy (important for Render/Heroku so secure cookies work)
app.set('trust proxy', 1);

// =================== SESSION MIDDLEWARE - MOVED UP ===================
app.use(session({
  secret: process.env.SESSION_SECRET || 'royalJewelsSecretKey123',
  resave: false,
  saveUninitialized: false,
  proxy: true,   // ✅ allow session cookies behind proxy
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    // only over HTTPS in prod
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day (you can adjust)
    sameSite: 'lax'
  },
  name: 'sessionId'
}));

app.use(flash());
app.use(generalLimiter); // Apply rate limiting to all routes
app.use(express.static(path.join(__dirname, '../frontend/public')));

// =================== BULK ROUTES - MOVED AFTER SESSION ===================
// Bulk operations middleware with proper error handling
app.use('/api/bulk', (req, res, next) => {
  // Check if session exists
  if (!req.session) {
    console.error('❌ No session object found');
    return res.status(401).json({ 
      success: false, 
      error: 'Session not found - please refresh and try again' 
    });
  }
  
  // Check if user is authenticated
  if (!req.session.userId) {
    console.error('❌ No userId in session');
    return res.status(401).json({ 
      success: false, 
      error: 'Not authenticated - please login again' 
    });
  }

  // Check if user is a seller (has permission to perform bulk operations)
  if (!req.session.isSeller) {
    console.error('❌ User is not a seller');
    return res.status(403).json({ 
      success: false, 
      error: 'Insufficient permissions - seller access required' 
    });
  }
  
  next();
});

const bulkRoutes = require('./routes/bulkRoutes');
app.use('/api/bulk', bulkRoutes);

// API routes (some may not require authentication)
app.use('/api/metal-rates', apiLimiter, require('./routes/api/metalRates'));

// Route registration logging disabled

// Apply authentication middleware to all routes that come after this point
app.use(isLoggedIn);

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

app.use((req, res, next) => {
  // Set default values for all views
  res.locals.isLoggedIn = !!req.session?.userId;
  res.locals.session = req.session || {};
  res.locals.currentUser = req.session?.userId || null;
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =================== View Engine ===================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// =================== Routes ===================
// Root route redirect to products
app.get('/', (req, res) => {
  res.redirect('/products');
});

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

// Log unhandled routes before 404
app.use((req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled route: ${req.method} ${req.originalUrl}`);
  next();
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// =================== Database Connection ===================
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Stop server if DB not connected
  }
}

connectDB();

// =================== Server ===================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});