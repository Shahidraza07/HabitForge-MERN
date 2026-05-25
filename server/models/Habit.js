const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true // e.g., 'Health', 'Coding', 'Fitness'
    },
    colorTag: {
        type: String,
        default: '#3b82f6'
    },
    icon: {
        type: String,
        default: '🎯'
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    isCompletedToday: {
        type: Boolean,
        default: false
    },
    lastCompletedDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);