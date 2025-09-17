const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jewellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import the User model
const User = require('./backend/models/user');

async function updateUsers() {
  try {
    // First, ensure the contactInfo object exists for both users
    await User.updateMany(
      { email: { $in: ['kesarchand123@gmail.com', 'manish123@gmail.com'] } },
      { $setOnInsert: { contactInfo: {} } },
      { upsert: false }
    );

    // Update kesarchand
    const kesarchand = await User.findOneAndUpdate(
      { email: 'kesarchand123@gmail.com' },
      {
        $set: {
          'contactInfo.phone': '6350298805',
          'contactInfo.website': 'www.jewels.com',
          'contactInfo.city': 'jodhpur',
          'contactInfo.state': 'rajasthan',
          'contactInfo.country': 'india',
          'contactInfo.pincode': '342027',
          'contactInfo.address': 'dangiyawas, jodhpur'
        }
      },
      { new: true, runValidators: true }
    );

    // Update manish
    const manish = await User.findOneAndUpdate(
      { email: 'manish123@gmail.com' },
      {
        $set: {
          'contactInfo.phone': '0000000000',
          'contactInfo.website': 'www.jewels.com',
          'contactInfo.city': 'jodhpur',
          'contactInfo.state': 'rajasthan',
          'contactInfo.country': 'india',
          'contactInfo.pincode': '342015',
          'contactInfo.address': 'saran nagar c road, jodhpur'
        }
      },
      { new: true, runValidators: true }
    );

    console.log('Users updated successfully!\n');
    
    // Print updated users
    console.log('Updated Users:');
    console.log('1. kesarchand:', {
      phone: kesarchand.contactInfo.phone,
      address: kesarchand.contactInfo.address,
      city: kesarchand.contactInfo.city,
      state: kesarchand.contactInfo.state,
      pincode: kesarchand.contactInfo.pincode
    });
    
    console.log('2. manish:', {
      phone: manish.contactInfo.phone,
      address: manish.contactInfo.address,
      city: manish.contactInfo.city,
      state: manish.contactInfo.state,
      pincode: manish.contactInfo.pincode
    });
    
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the update function
updateUsers();
