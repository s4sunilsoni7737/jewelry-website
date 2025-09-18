const mongoose = require('mongoose');
const Category = require('./backend/models/category');
require('dotenv').config();

async function addDefaultCategory() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if Uncategorized category exists
    const existingCategory = await Category.findOne({ name: 'uncategorized' });
    
    if (!existingCategory) {
      // Create the Uncategorized category
      await Category.create({
        name: 'uncategorized',
        description: 'Default category for uncategorized products'
      });
      console.log('✅ Added Uncategorized category to the database');
    } else {
      console.log('ℹ️ Uncategorized category already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding default category:', error);
    process.exit(1);
  }
}

addDefaultCategory();
