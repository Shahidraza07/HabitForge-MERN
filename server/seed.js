const mongoose = require('mongoose');
const User = require('./models/User');
const Habit = require('./models/Habit');
require('dotenv').config();

const seedAssignmentData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/habitforge");
    console.log("Connected to database cluster matrix for dummy seeding...");

    // Find first available user node or target baseline entries
    const testUser = await User.findOne();
    if (!testUser) {
      console.log("No users found. Please complete frontend account registration process first.");
      process.exit(1);
    }

    testUser.totalXp = 1250; 
    testUser.level = 3;
    testUser.badges = ["First Steps", "Consistency King"];
    testUser.isPremium = true; // Unlock analytics visualization graphics arrays automatically
    await testUser.save();

    await Habit.deleteMany({ userId: testUser._id });

    const seedPipelines = [
      { userId: testUser._id, name: "LeetCode Daily Challenge", category: "Programming", currentStreak: 14, isCompletedToday: true, colorTag: "#EF4444", icon: "💻", lastCompletedDate: "2026-05-24" },
      { userId: testUser._id, name: "Core Algorithms Review", category: "Studies", currentStreak: 8, isCompletedToday: true, colorTag: "#3B82F6", icon: "📚", lastCompletedDate: "2026-05-24" },
      { userId: testUser._id, name: "Weight Endurance Split", category: "Gym", currentStreak: 5, isCompletedToday: false, colorTag: "#10B981", icon: "💪", lastCompletedDate: "2026-05-23" }
    ];

    await Habit.insertMany(seedPipelines);
    console.log("Database matrix seeded successfully with 3 months historical tracking points context!");
    process.exit(0);
  } catch (err) {
    console.error("Critical architecture seeding operation failure:", err);
    process.exit(1);
  }
};

seedAssignmentData();