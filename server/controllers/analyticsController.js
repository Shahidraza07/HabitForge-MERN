const Log = require('../models/Log');

exports.getHeatmapData = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Database se user ke saare logs nikalen
    const logs = await Log.find({ userId });

    // 2. Data ko aggregate (group) karein by date
    // Hum dekhna chahte hain ki ek din me kitne check-ins hue
    const counts = {};
    logs.forEach(log => {
      // log.completedDate format: "2026-05-22"
      counts[log.completedDate] = (counts[log.completedDate] || 0) + 1;
    });

    // 3. Data ko Heatmap ke format me convert karein
    // Format chahiye: [ { date: '2026-05-22', count: 3 } ]
    const heatmapData = Object.keys(counts).map(date => ({
      date: date,
      count: counts[date]
    }));

    res.status(200).json(heatmapData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};