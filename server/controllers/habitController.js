const Habit = require('../models/Habit');
const User = require('../models/User');
const Log = require('../models/Log'); // Ensure this model exists or records cleanly
const { updateStreakLogic, calculateLevelFromXp, evaluateEarnedBadges } = require('../utils/gamification');

exports.checkInHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { todayStr } = req.body; // Standardized client date sequence

    const habit = await Habit.findOne({ _id: habitId, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: "Habit matrix execution node not found" });

    // Validate completion state to prevent double increments within the same day cycle
    if (habit.isCompletedToday || habit.lastCompletedDate === todayStr) {
      return res.status(400).json({ message: "Pipeline execution node already complete for today" });
    }

    const { newStreak } = updateStreakLogic(habit.lastCompletedDate, todayStr, habit.currentStreak);

    habit.currentStreak = newStreak;
    habit.lastCompletedDate = todayStr;
    habit.isCompletedToday = true;
    await habit.save();

    // Persist logs for analytical chart processing arrays
    try {
      const LogSchemaInstance = require('../models/Log');
      await LogSchemaInstance.create({
        userId: req.user.id,
        habitId: habit._id,
        category: habit.category || "Studies",
        completedAt: new Date(todayStr)
      });
    } catch (e) {
      console.warn("Logs architecture collection unavailable, using embedded strategy context.");
    }

    // Award rewards directly calculated through structural scaling rules
    const user = await User.findById(req.user.id);
    let badgesEarnedNow = [];
    
    if (user) {
      user.totalXp = (user.totalXp || 0) + 50; // Grant 50 XP per check-in milestone
      user.level = calculateLevelFromXp(user.totalXp);

      // Evaluate and assign badges if conditions pass
      const habitsList = await Habit.find({ userId: req.user.id });
      const maxCurrentStreak = Math.max(...habitsList.map(h => h.currentStreak || 0), habit.currentStreak);
      
      const badgeTriggers = evaluateEarnedBadges({
        maxStreak: maxCurrentStreak,
        level: user.level,
        totalCompletions: habitsList.filter(h => h.isCompletedToday).length
      }, user.badges || []);

      if (badgeTriggers.length > 0) {
        user.badges = [...(user.badges || []), ...badgeTriggers];
        badgesEarnedNow = badgeTriggers;
      }

      await user.save();
    }

    res.status(200).json({
      message: "Habit tracking verified successfully",
      habit,
      totalXp: user ? user.totalXp : 0,
      level: user ? user.level : 1,
      badges: user ? user.badges : [],
      badgesEarnedNow
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { name, category, colorTag, icon } = req.body;
    
    // Premium limitation block validation
    const user = await User.findById(req.user.id);
    const existingHabitsCount = await Habit.countDocuments({ userId: req.user.id });
    
    if (!user?.isPremium && existingHabitsCount >= 4) {
      return res.status(403).json({ 
        message: "Free package limits reached (Max 4 active pipelines). Upgrade to unlock unlimited matrix configurations." 
      });
    }

    const newHabit = new Habit({
      userId: req.user.id,
      name,
      category: category || "Studies",
      colorTag: colorTag || "#3B82F6",
      icon: icon || "🎯",
      currentStreak: 0,
      isCompletedToday: false
    });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: "Habit structure discarded from environment pipeline" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};