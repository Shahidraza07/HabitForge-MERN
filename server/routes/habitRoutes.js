const express = require('express');
const router = express.Router();

// Runtime Memory Matrix Mock Storage (No DB needed, completely crash proof)
let habitsDatabaseMock = [
    {
        _id: "mock_id_101",
        userId: "65f1234567890abcdef12345",
        name: "Read Documentation",
        category: "Coding",
        colorTag: "#3b82f6",
        icon: "💻",
        currentStreak: 2,
        longestStreak: 5,
        isCompletedToday: false,
        lastCompletedDate: null
    }
];

/**
 * @route   POST /api/habits
 * @desc    Infect Quest into Runtime Memory
 */
router.post('/', (req, res) => {
    try {
        const { name, category, colorTag, icon } = req.body;
        console.log("--> Memory Stream hitting! Data:", req.body);

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Quest name can't be empty!" });
        }

        const newHabit = {
            _id: "mock_" + Math.random().toString(36).substr(2, 9), // Auto ID generation
            userId: "65f1234567890abcdef12345",
            name: name.trim(),
            category: category || 'Studies',
            colorTag: colorTag || '#3b82f6',
            icon: icon || '🎯',
            currentStreak: 0,
            longestStreak: 0,
            isCompletedToday: false,
            lastCompletedDate: null
        };

        habitsDatabaseMock.push(newHabit);
        console.log("✔ Saved to RAM Engine Array successfully!");
        return res.status(201).json(newHabit);

    } catch (err) {
        console.error("❌ Array Matrix Insertion Failed:", err);
        return res.status(500).json({ message: "Server Memory Crash", error: err.message });
    }
});

/**
 * @route   GET /api/habits
 */
router.get('/', (req, res) => {
    try {
        return res.status(200).json(habitsDatabaseMock);
    } catch (err) {
        return res.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * @route   PUT /api/habits/:id/checkin
 */
router.put('/:id/checkin', (req, res) => {
    try {
        const habitId = req.params.id;
        const habit = habitsDatabaseMock.find(h => h._id === habitId);

        if (!habit) return res.status(404).json({ message: "Quest blueprint identity mismatch" });
        if (habit.isCompletedToday) return res.status(400).json({ message: "Already executed logs today" });

        // Instant streak update
        habit.currentStreak += 1;
        if (habit.currentStreak > habit.longestStreak) {
            habit.longestStreak = habit.currentStreak;
        }
        habit.isCompletedToday = true;
        habit.lastCompletedDate = new Date();

        return res.status(200).json({
            message: "Habit Checked In Memory!",
            habit,
            gamification: {
                xpGained: 25,
                newTotalXP: 150,
                leveledUp: false,
                newLevel: 2
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Server log drop", error: err.message });
    }
});

module.exports = router;