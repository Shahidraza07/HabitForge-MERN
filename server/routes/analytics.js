const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');
const Habit = require('../models/Habit');

router.get('/dashboard-metrics', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User registry entry not verified" });

    const habits = await Habit.find({ userId: req.user.id });
    
    // Dynamic structural analytics baseline mapping calculations
    const breakdownData = {
      Studies: 0, Programming: 0, Gym: 0, Health: 0, Lifestyle: 0, Finance: 0
    };

    habits.forEach(h => {
      if (breakdownData[h.category] !== undefined) {
        breakdownData[h.category] += h.currentStreak || 0;
      }
    });

    // Premium Gate Configuration matching Monetization Blueprint constraints
    if (!user.isPremium) {
      return res.status(200).json({
        isLockedTier: true,
        breakdown: { Studies: 2, Programming: 1, Gym: 0, Health: 0, Lifestyle: 0, Finance: 0 },
        message: "Advanced telemetry and tracking logs locked behind Premium tier access controls."
      });
    }

    res.status(200).json({
      isLockedTier: false,
      breakdown: breakdownData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;