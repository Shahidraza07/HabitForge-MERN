const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 1 },
  totalXp: { type: Number, default: 0 }, // Baseline strict 0% for new users
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);