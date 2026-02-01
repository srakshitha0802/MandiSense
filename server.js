const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MandiSense Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Market data endpoints
app.get('/api/market/prices', (req, res) => {
  // Mock market data - in production, this would come from a database
  const marketData = [
    { commodity: 'tomatoes', price: 45, trend: 'up', change: 2.5 },
    { commodity: 'onions', price: 38, trend: 'down', change: -1.2 },
    { commodity: 'potatoes', price: 28, trend: 'stable', change: 0.0 },
    { commodity: 'rice', price: 52, trend: 'up', change: 1.8 },
  ];
  
  res.json({
    success: true,
    data: marketData,
    timestamp: new Date().toISOString()
  });
});

// Speech recognition endpoint (mock)
app.post('/api/speech/recognize', (req, res) => {
  const { audio, language } = req.body;
  
  // Mock speech recognition - in production, integrate with actual speech API
  setTimeout(() => {
    res.json({
      success: true,
      transcript: "Mock speech recognition result",
      confidence: 0.95,
      language: language || 'en-IN'
    });
  }, 1000);
});

// Translation endpoint
app.post('/api/translate', (req, res) => {
  const { text, from, to } = req.body;
  
  // Mock translation - in production, integrate with translation API
  res.json({
    success: true,
    originalText: text,
    translatedText: `[Translated from ${from} to ${to}]: ${text}`,
    confidence: 0.92
  });
});

// Negotiation analysis endpoint
app.post('/api/negotiation/analyze', (req, res) => {
  const { vendorText, buyerText, commodity } = req.body;
  
  // Mock negotiation analysis
  res.json({
    success: true,
    analysis: {
      sentiment: 'neutral',
      suggestedPrice: 42,
      marketPrice: 45,
      confidence: 0.85,
      recommendation: 'Market conditions suggest a slight discount may be possible'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MandiSense Backend Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend served at http://localhost:${PORT}`);
});

module.exports = app;
