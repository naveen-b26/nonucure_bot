const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to Nonucure Bot API! Let's start your health journey.",
    status: "Server is running",
    version: "1.0.0"
  });
});

app.use('/api', routes); // Use routes from routes.js

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});