const mongoose = require('mongoose');
const Category = require('../models/category');
require('dotenv').config({ path: '../.env' }); // Make sure your .env has MONGO_URI

const MONGO_URI = 'mongodb+srv://s4sunilsoni7737_db_user:P8R8PV4Aenk32jsV@cluster0.uxuhwp7.mongodb.net/jewelryDB?retryWrites=true&w=majority&appName=Cluster0';

const admins = [
  { _id: '688308407d30574f52400dcc', name: 'Kesarchand1' },
  { _id: '688308407d30574f52400dcd', name: 'Manish' }
];

const categoriesTemplate = [
  { name: 'rings', nameHindi: 'अंगूठियां', icon: '💍', description: 'Engagement & Wedding Rings' },
  { name: 'necklaces', nameHindi: 'हार', icon: '📿', description: 'Elegant Necklaces & Pendants' },
  { name: 'earrings', nameHindi: 'कानों की बालियां', icon: '💎', description: 'Studs & Drop Earrings' },
  { name: 'bracelets', nameHindi: 'कंगन', icon: '⛓️', description: 'Charm & Chain Bracelets' },
  { name: 'bangles', nameHindi: 'चूड़ियाँ', icon: '🪙', description: 'Traditional & Modern Bangles' },
  { name: 'pendants', nameHindi: 'पेंडेंट', icon: '🔗', description: 'Minimal & Heavy Pendants' },
  { name: 'uncategorised', nameHindi: 'अनवर्गीकृत', icon: '📦', description: 'Items without a specific category' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    for (const admin of admins) {
      for (const cat of categoriesTemplate) {
        // Upsert: insert if not exists, otherwise ignore
        await Category.updateOne(
          { name: cat.name, owner: admin._id }, // query
          { $setOnInsert: { ...cat, owner: admin._id, createdAt: new Date() } }, // data
          { upsert: true }
        );
      }
    }

    console.log('✅ Categories seeded for all admins!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 MongoDB disconnected');
  }
}

seed();
