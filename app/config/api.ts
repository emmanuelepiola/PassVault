// Environment variable will be injected at build time
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};

// Simple API configuration
const API_BASE_URL = (() => {
  // If we're in the browser and not on localhost, we're in production
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production detection
    if (hostname.includes('onrender.com')) {
      // Extract the unique part from frontend URL and construct backend URL
      const parts = hostname.split('.');
      if (parts[0].includes('frontend')) {
        const backendUrl = hostname.replace('frontend', 'backend');
        return `https://${backendUrl}`;
      }
      // If frontend URL doesn't follow the pattern, try common backend naming
      const backendUrl = hostname.replace(/^[^-]*/, 'backend');
      return `https://${backendUrl}`;
    }
  }
  
  // Development fallback
  return 'http://localhost:8000';
})();

console.log('API_BASE_URL:', API_BASE_URL);

export { API_BASE_URL }; 