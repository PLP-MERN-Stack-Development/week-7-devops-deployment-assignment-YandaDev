// config/environment.js
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  environment: import.meta.env.VITE_NODE_ENV || 'development',
  appName: import.meta.env.VITE_APP_NAME || 'TechTalkZA',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  
  // API endpoints
  api: {
    posts: '/posts',
    categories: '/categories',
    auth: '/auth',
    uploads: '/uploads'
  }
};

// Development vs Production settings
export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';

// Logging utility
export const logger = {
  info: (message, data = null) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message, error = null) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // In production, you could send to error tracking service
      console.error(message);
    }
  },
  warn: (message, data = null) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
  }
};

export default config;
