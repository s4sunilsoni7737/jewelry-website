// // updateCat.js

// const mongoose = require('mongoose');
// const Product = require('./product');
// const Category = require('./category');

// async function fixCategories() {
//   await mongoose.connect('mongodb://localhost:27017/jewellery');

//   const categories = await Category.find({});

//   for (const cat of categories) {
//     const res = await Product.collection.updateMany(
//       { category: cat.name }, // match string category
//       { $set: { category: cat._id } } // convert to ObjectId
//     );
//     console.log(`✔ Updated ${res.modifiedCount} products with category '${cat.name}'`);
//   }

//   await mongoose.disconnect();
// }

// fixCategories().catch(console.error);
