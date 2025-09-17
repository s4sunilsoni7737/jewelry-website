const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jewellery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import the User model
const User = require('./backend/models/user');

async function printAllUsers() {
  try {
    console.log('Fetching all users...\n');
    
    // Find all users and exclude the password field
    const users = await User.find({}).select('-password');
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }
    
    console.log(`Found ${users.length} user(s):\n`);
    
    // Print each user's information
    users.forEach((user, index) => {
      console.log(`--- User ${index + 1} ---`);
      console.log('ID:', user._id);
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.isSeller ? 'Seller' : 'Customer');
      
      if (user.contactInfo) {
        console.log('\nContact Information:');
        if (user.contactInfo.phone) console.log('Phone:', user.contactInfo.phone);
        if (user.contactInfo.address) {
          console.log('Address:', user.contactInfo.address);
          const location = [
            user.contactInfo.city,
            user.contactInfo.state,
            user.contactInfo.pincode
          ].filter(Boolean).join(', ');
          
          if (location) {
            console.log('Location:', location);
          }
        }
      }
      
      console.log('Created At:', user.createdAt);
      console.log('\n' + '='.repeat(50) + '\n');
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the function
printAllUsers();
