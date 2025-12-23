const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedAdmin() {
  const adminUsername = "admin";
  const adminPassword = "admin123"; // change later

  const exists = await User.findOne({ username: adminUsername });
  if (exists) return;

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.create({ username: adminUsername, passwordHash, role: "admin" });

  console.log("Admin created ✅  username=admin  password=admin123");
}

module.exports = seedAdmin;
