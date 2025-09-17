const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jewellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import the User model
const User = require('./backend/models/user');

async function checkUserData() {
  try {
    // Find both users
    const kesarchand = await User.findOne({ email: 'kesarchand123@gmail.com' });
    const manish = await User.findOne({ email: 'manish123@gmail.com' });

    console.log('Raw User Data:');
    console.log('\nKesarchand:', JSON.stringify(kesarchand, null, 2));
    console.log('\nManish:', JSON.stringify(manish, null, 2));
    
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUserData();
