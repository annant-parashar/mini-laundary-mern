const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', orderRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Laundry Order Management API is running' });
});

// Start server (only when not in serverless)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
