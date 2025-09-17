const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jewellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import the User model
const User = require('./backend/models/user');

async function finalUpdate() {
  try {
    // Update kesarchand
    const kesarchand = await User.findOne({ email: 'kesarchand123@gmail.com' });
    if (kesarchand) {
      kesarchand.contactInfo = {
        phone: '6350298805',
        website: 'www.jewels.com'
      };
      kesarchand.location = {
        address: 'dangiyawas, jodhpur',
        city: 'jodhpur',
        state: 'rajasthan',
        country: 'india',
        pincode: '342027'
      };
      await kesarchand.save();
    }

    // Update manish
    const manish = await User.findOne({ email: 'manish123@gmail.com' });
    if (manish) {
      manish.contactInfo = {
        phone: '0000000000',
        website: 'www.jewels.com'
      };
      manish.location = {
        address: 'saran nagar c road, jodhpur',
        city: 'jodhpur',
        state: 'rajasthan',
        country: 'india',
        pincode: '342015'
      };
      await manish.save();
    }

    // Verify updates
    const updatedKesarchand = await User.findOne({ email: 'kesarchand123@gmail.com' });
    const updatedManish = await User.findOne({ email: 'manish123@gmail.com' });

    console.log('\nVerification:');
    console.log('Kesarchand:', {
      phone: updatedKesarchand.contactInfo.phone,
      website: updatedKesarchand.contactInfo.website,
      location: updatedKesarchand.location
    });
    
    console.log('Manish:', {
      phone: updatedManish.contactInfo.phone,
      website: updatedManish.contactInfo.website,
      location: updatedManish.location
    });
    
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    mongoose.connection.close();
  }
}

finalUpdate();
