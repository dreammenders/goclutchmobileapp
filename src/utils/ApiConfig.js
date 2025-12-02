// API Configuration for GoClutch Mobile App

export const API_CONFIG = {
  // Mobile API endpoints
  MOBILE_API: {
    // Using production API for testing - change back to conditional for local development
    BASE_URL: 'https://mobileapi.goclutchservice.in/api/v1', // Production
    // BASE_URL: __DEV__ 
    //   ? 'http://192.168.1.42:3002/api/v1' // Development - Your computer's IP
    //   : 'https://mobileapi.goclutchservice.in/api/v1', // Production
    TIMEOUT: 30000, // 30 seconds (increased for production server)
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // Admin Portal API (if needed)
  ADMIN_API: {
    BASE_URL: __DEV__ 
      ? 'http://192.168.1.42:3000/api' // Development 
      : 'https://your-admin-api.com/api', // Production
    TIMEOUT: 15000,
  },
  
  // Common headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Development flags
  DEBUG: __DEV__,
  
  // Real-time only configuration
  FALLBACK_ENABLED: false,
  REAL_TIME_ONLY: true,
};

// Network configuration check
export const checkNetworkConfig = () => {
  // Configuration validated silently
};

export default API_CONFIG;