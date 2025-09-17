const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./user.js"); // Adjust the path if needed

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/jewellery", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
  return createUsers();
}).catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
});

// Delete old user and create two new ones
const createUsers = async () => {
  try {
    // Delete all users
    await User.deleteMany({});
    console.log("🗑️ All existing users deleted");

    // Create user 1
    const hashedPassword1 = await bcrypt.hash("kesar53", 10);
    const user1 = new User({
      name: "kesarchand",
      email: "kesarchand123@gmail.com",
      password: hashedPassword1,
      isSeller: true, // ✅ Make owner
      selectedShop: null, // You can assign Shop ID here if available
    });

    // Create user 2
    const hashedPassword2 = await bcrypt.hash("manish53", 10);
    const user2 = new User({
      name: "manish",
      email: "manish123@gmail.com",
      password: hashedPassword2,
      isSeller: true, // ✅ Make owner
      selectedShop: null, // You can assign Shop ID here if available
    });

    // Save both
    await user1.save();
    await user2.save();

    console.log("✅ Two users created: kesarchand & manish");
  } catch (err) {
    console.error("❌ Error handling users:", err);
  } finally {
    mongoose.disconnect();
  }
};
