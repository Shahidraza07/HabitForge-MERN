const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  completedDate: { type: String, required: true } // Format: YYYY-MM-DD
}, { timestamps: true });

// Prevent duplicate logs for the same habit on the same day
LogSchema.index({ habitId: 1, completedDate: 1 }, { unique: true });

module.exports = mongoose.model('Log', LogSchema);