// const mongoose = require('mongoose');
// const Category = require('../models/category');

// mongoose.connect('mongodb://127.0.0.1:27017/jewellery');

// const categories = [
//   {
//     name: 'rings',
//     icon: '💍',
//     description: 'Engagement & Wedding Rings'
//   },
//   {
//     name: 'necklaces',
//     icon: '📿',
//     description: 'Elegant Necklaces & Pendants'
//   },
//   {
//     name: 'earrings',
//     icon: '💎',
//     description: 'Studs & Drop Earrings'
//   },
//   {
//     name: 'bracelets',
//     icon: '⛓️',
//     description: 'Charm & Chain Bracelets'
//   },
//   {
//     name: 'bangles',
//     icon: '🪙',
//     description: 'Traditional & Modern Bangles'
//   },
//   {
//     name: 'pendants',
//     icon: '🔗',
//     description: 'Minimal & Heavy Pendants'
//   },
//   {
//     name: 'anklets',
//     icon: '🦶',
//     description: 'Silver & Gold Anklets'
//   }
// ];

// async function seed() {
//   await Category.deleteMany(); // optional: clears existing data
//   await Category.insertMany(categories);
//   console.log('✅ Categories with emoji icons inserted!');
//   mongoose.disconnect();
// }

// seed();
