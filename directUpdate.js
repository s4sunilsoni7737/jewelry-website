const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jewellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import the User model
const User = require('./backend/models/user');

async function directUpdate() {
  try {
    // Update kesarchand
    const kesarchand = await User.findOne({ email: 'kesarchand123@gmail.com' });
    if (kesarchand) {
      kesarchand.contactInfo = {
        phone: '6350298805',
        website: 'www.jewels.com',
        city: 'jodhpur',
        state: 'rajasthan',
        country: 'india',
        pincode: '342027',
        address: 'dangiyawas, jodhpur'
      };
      await kesarchand.save();
      console.log('Kesarchand updated successfully');
    }

    // Update manish
    const manish = await User.findOne({ email: 'manish123@gmail.com' });
    if (manish) {
      manish.contactInfo = {
        phone: '0000000000',
        website: 'www.jewels.com',
        city: 'jodhpur',
        state: 'rajasthan',
        country: 'india',
        pincode: '342015',
        address: 'saran nagar c road, jodhpur'
      };
      await manish.save();
      console.log('Manish updated successfully');
    }

    // Verify updates
    const updatedKesarchand = await User.findOne({ email: 'kesarchand123@gmail.com' });
    const updatedManish = await User.findOne({ email: 'manish123@gmail.com' });

    console.log('\nVerification:');
    console.log('Kesarchand:', {
      phone: updatedKesarchand.contactInfo.phone,
      address: updatedKesarchand.contactInfo.address,
      city: updatedKesarchand.contactInfo.city,
      state: updatedKesarchand.contactInfo.state,
      pincode: updatedKesarchand.contactInfo.pincode
    });
    
    console.log('Manish:', {
      phone: updatedManish.contactInfo.phone,
      address: updatedManish.contactInfo.address,
      city: updatedManish.contactInfo.city,
      state: updatedManish.contactInfo.state,
      pincode: updatedManish.contactInfo.pincode
    });
    
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    mongoose.connection.close();
  }
}

directUpdate();
