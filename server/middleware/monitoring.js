// monitoring.js - Monitoring middleware and utilities
const fs = require('fs');
const path = require('path');

// Request metrics tracking
const requestMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageResponseTime: 0,
  requestTimes: [],
  errorCounts: {},
  lastReset: new Date()
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} - ${req.ip}`);
  
  // Override res.json to track response times
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Update metrics
    requestMetrics.totalRequests++;
    requestMetrics.requestTimes.push(responseTime);
    
    // Keep only last 100 response times for average calculation
    if (requestMetrics.requestTimes.length > 100) {
      requestMetrics.requestTimes.shift();
    }
    
    // Calculate average response time
    requestMetrics.averageResponseTime = 
      requestMetrics.requestTimes.reduce((a, b) => a + b, 0) / requestMetrics.requestTimes.length;
    
    // Track success/failure
    if (res.statusCode >= 200 && res.statusCode < 400) {
      requestMetrics.successfulRequests++;
    } else {
      requestMetrics.failedRequests++;
    }
    
    console.log(`${new Date().toISOString()} ${req.method} ${req.path} - ${res.statusCode} (${responseTime}ms)`);
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Error tracking middleware
const errorTracker = (err, req, res, next) => {
  const errorKey = `${err.name || 'UnknownError'}_${err.message || 'Unknown'}`;
  
  // Track error counts
  if (!requestMetrics.errorCounts[errorKey]) {
    requestMetrics.errorCounts[errorKey] = 0;
  }
  requestMetrics.errorCounts[errorKey]++;
  
  // Log error details
  console.error(`${new Date().toISOString()} ERROR: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error(`Request: ${req.method} ${req.path}`);
  console.error(`IP: ${req.ip}`);
  
  // Log to file in production
  if (process.env.NODE_ENV === 'production') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: err.message,
      stack: err.stack,
      request: {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    };
    
    const logPath = path.join(__dirname, '..', 'logs', 'errors.log');
    
    // Ensure logs directory exists
    const logsDir = path.dirname(logPath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  }
  
  next(err);
};

// Performance monitoring
const performanceMonitor = {
  // Memory usage tracking
  getMemoryUsage: () => {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
      external: Math.round(usage.external / 1024 / 1024 * 100) / 100
    };
  },
  
  // CPU usage tracking
  getCpuUsage: () => {
    const usage = process.cpuUsage();
    return {
      user: usage.user,
      system: usage.system
    };
  },
  
  // Get request metrics
  getRequestMetrics: () => {
    return {
      ...requestMetrics,
      successRate: requestMetrics.totalRequests > 0 
        ? (requestMetrics.successfulRequests / requestMetrics.totalRequests * 100).toFixed(2)
        : 0,
      errorRate: requestMetrics.totalRequests > 0 
        ? (requestMetrics.failedRequests / requestMetrics.totalRequests * 100).toFixed(2)
        : 0
    };
  },
  
  // Reset metrics
  resetMetrics: () => {
    requestMetrics.totalRequests = 0;
    requestMetrics.successfulRequests = 0;
    requestMetrics.failedRequests = 0;
    requestMetrics.averageResponseTime = 0;
    requestMetrics.requestTimes = [];
    requestMetrics.errorCounts = {};
    requestMetrics.lastReset = new Date();
  }
};

// Health check utilities
const healthChecks = {
  // Database connectivity check
  checkDatabase: async (mongoose) => {
    try {
      const dbStatus = mongoose.connection.readyState;
      return {
        connected: dbStatus === 1,
        status: ['disconnected', 'connected', 'connecting', 'disconnecting'][dbStatus]
      };
    } catch (error) {
      return {
        connected: false,
        status: 'error',
        error: error.message
      };
    }
  },
  
  // External service checks (if any)
  checkExternalServices: async () => {
    // Add checks for external services here
    return {
      // Example: email service, payment gateway, etc.
    };
  }
};

module.exports = {
  requestLogger,
  errorTracker,
  performanceMonitor,
  healthChecks
};
