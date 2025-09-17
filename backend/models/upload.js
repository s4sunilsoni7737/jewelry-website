// const mongoose = require('mongoose');
// const Product = require('./Product');
// const { products } = require('./data'); // your existing products

// // Replace with your Mongo URI
// const mongoURI = 'mongodb://127.0.0.1:27017/jewellery'; // or your Atlas URI

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(async () => {
//   console.log('Connected to MongoDB');

//   // Clear old data (optional)
//   await Product.deleteMany({});

//   // Upload new products
//   await Product.insertMany(products);

//   console.log('Products uploaded successfully!');
//   mongoose.disconnect();
// }).catch((err) => {
//   console.error('MongoDB connection error:', err);
// });
