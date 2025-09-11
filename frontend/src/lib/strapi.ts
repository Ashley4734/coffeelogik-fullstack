import axios from 'axios';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.coffeelogik.com';
const apiToken = process.env.STRAPI_API_TOKEN;

const strapi = axios.create({
  baseURL: `${strapiUrl}/api`,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
  },
});

// Add response interceptor for better error handling
strapi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Strapi API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
      });
    }
    
    // Improve error messages for better debugging
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - please check your internet connection';
    } else if (error.response?.status === 404) {
      error.message = 'Content not found';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error - please try again later';
    }
    
    return Promise.reject(error);
  }
);

export default strapi;
