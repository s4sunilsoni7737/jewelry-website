const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./user.js"); // Make sure path is correct

const MONGO_URI = "mongodb+srv://s4sunilsoni7737_db_user:P8R8PV4Aenk32jsV@cluster0.uxuhwp7.mongodb.net/jewelryDB?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    return createUsers();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

const createUsers = async () => {
  try {
    // Delete old users with these emails to avoid duplicate key error
    await User.deleteMany({ email: { $in: ["kesarchand123@gmail.com", "manish123@gmail.com"] } });

    const hashedPassword1 = await bcrypt.hash("kesar53", 10);
    const user1 = new User({
      _id: new mongoose.Types.ObjectId("688308407d30574f52400dcc"), // same ID as before
      name: "Kesarchand",
      email: "kesarchand123@gmail.com",
      password: hashedPassword1,
      isSeller: true,
      selectedShop: new mongoose.Types.ObjectId("688308407d30574f52400dcc"),
      contactInfo: { phone: "6350298805", website: "www.jewels.com" },
      location: {
        address: "dangiyawas, jodhpur",
        city: "jodhpur",
        state: "rajasthan",
        country: "india",
        pincode: "342027"
      },
      businessHours: {
        weekdays: "Mon - Sat: 10:00 AM - 8:00 PM",
        sunday: "Sunday: 11:00 AM - 6:00 PM"
      },
      createdAt: new Date()
    });

    const hashedPassword2 = await bcrypt.hash("manish53", 10);
    const user2 = new User({
      _id: new mongoose.Types.ObjectId("688308407d30574f52400dcd"), // same ID as before
      name: "Manish",
      email: "manish123@gmail.com",
      password: hashedPassword2,
      isSeller: true,
      selectedShop: new mongoose.Types.ObjectId("688308407d30574f52400dcd"),
      contactInfo: { phone: "0000000000", website: "www.jewels.com" },
      location: {
        address: "saran nagar c road, jodhpur",
        city: "jodhpur",
        state: "rajasthan",
        country: "india",
        pincode: "342015"
      },
      businessHours: {
        weekdays: "Mon - Sat: 10:00 AM - 8:00 PM",
        sunday: "Sunday: 11:00 AM - 6:00 PM"
      },
      createdAt: new Date()
    });

    await user1.save();
    await user2.save();

    console.log("✅ Two users uploaded to MongoDB Atlas: Kesarchand & Manish");
  } catch (err) {
    console.error("❌ Error creating users:", err);
  } finally {
    mongoose.disconnect();
  }
};
