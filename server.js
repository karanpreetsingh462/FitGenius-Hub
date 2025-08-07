const express = require('express');
const path = require('path');
const cors = require('cors');
const chatbotRouter = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'frontend/public')));

// API Routes
app.use('/api/chatbot', chatbotRouter);

// Serve the main HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/chatbot.html'));
});

app.get('/vegan-diet-plan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/vegan-diet-plan.html'));
});

app.get('/non-vegan-diet-plan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/non-vegan-diet-plan.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'FitSphere API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 FitSphere server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🤖 Chatbot: http://localhost:${PORT}/chatbot`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
});

module.exports = app; 