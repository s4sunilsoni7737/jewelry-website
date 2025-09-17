// getShopOwners.js
const mongoose = require("mongoose");
const User = require("./user");

mongoose.connect("mongodb://127.0.0.1:27017/jewellery", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const users = await User.find({ isSeller: true });
  users.forEach((u) => {
    console.log(`${u.name}: ${u._id}`);
  });
  mongoose.disconnect();
});
