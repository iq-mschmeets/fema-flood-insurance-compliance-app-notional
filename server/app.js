const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/policies', require('./routes/policyRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/risk', require('./routes/riskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
