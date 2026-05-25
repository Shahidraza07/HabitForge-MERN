const express = require('express');
const cors = require('cors');
const habitRoutes = require('./routes/habitRoutes');

const app = express();
const PORT = 5000;

// CORS setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Main Core Routing API
app.use('/api/habits', habitRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "Matrix Active" });
});

// Direct Up without hanging connection buffer
app.listen(PORT, () => {
    console.log("========================================");
    console.log(`🚀 IN-MEMORY STORAGE SERVER: Listening on PORT: ${PORT}`);
    console.log("========================================");
});