// app.js - Express app configuration (separated from server startup)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorTracker, performanceMonitor } = require('./middleware/monitoring');

// Import routes
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Request logging middleware (should be first)
app.use(requestLogger);

// Security middleware for production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
}

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Get database stats
    let dbStats = null;
    if (dbStatus === 1) {
      try {
        dbStats = await mongoose.connection.db.stats();
      } catch (err) {
        console.warn('Could not get database stats:', err.message);
      }
    }

    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatusText[dbStatus],
        connected: dbStatus === 1,
        ...(dbStats && {
          collections: dbStats.collections,
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize
        })
      },
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      }
    };

    res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: process.uptime()
    });
  }
});

// Metrics endpoint for monitoring
app.get('/api/metrics', async (req, res) => {
  try {
    const Post = require('./models/Post');
    const User = require('./models/User');
    const Category = require('./models/Category');

    // Get basic stats
    const [postCount, userCount, categoryCount] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
      Category.countDocuments()
    ]);

    // Get recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [recentPosts, recentUsers] = await Promise.all([
      Post.countDocuments({ createdAt: { $gte: yesterday } }),
      User.countDocuments({ createdAt: { $gte: yesterday } })
    ]);

    // System metrics
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    res.json({
      timestamp: new Date().toISOString(),
      application: {
        name: 'TechTalkZA',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
      },
      database: {
        posts: postCount,
        users: userCount,
        categories: categoryCount,
        recent_posts_24h: recentPosts,
        recent_users_24h: recentUsers
      },
      system: {
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        },
        platform: process.platform,
        nodeVersion: process.version
      },
      monitoring: {
        healthCheck: '/health',
        metrics: '/api/metrics',
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({
      error: 'Unable to fetch metrics',
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TechTalkZA Blog API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = app;
