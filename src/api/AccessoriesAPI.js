/**
 * Accessories API Service
 * Handles all API calls for the Accessories page
 * Ready to connect to backend endpoints
 */

import axios from 'axios';
import { API_CONFIG } from '../utils/ApiConfig';

const API_BASE_URL = API_CONFIG.MOBILE_API.BASE_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.MOBILE_API.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

/**
 * Retry logic for failed requests
 */
const retryRequest = async (config, retries = 0) => {
  try {
    return await apiClient(config);
  } catch (error) {
    if (
      retries < API_CONFIG.MOBILE_API.RETRY_ATTEMPTS &&
      error.response?.status >= 500
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, API_CONFIG.MOBILE_API.RETRY_DELAY)
      );
      return retryRequest(config, retries + 1);
    }
    throw error;
  }
};

// ============================================
// CATEGORIES API
// ============================================

/**
 * Fetch all accessory categories
 * GET /accessories/categories
 */
export const fetchCategories = async () => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: '/accessories/categories',
    });

    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

// ============================================
// BRANDS API
// ============================================

/**
 * Fetch all genuine product brands
 * GET /accessories/brands
 */
export const fetchBrands = async () => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: '/accessories/brands',
    });

    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch products by brand
 * GET /accessories/brands/:brandId/products
 */
export const fetchProductsByBrand = async (brandId) => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: `/accessories/brands/${brandId}/products`,
    });

    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

// ============================================
// PRODUCTS API
// ============================================

/**
 * Fetch recommended/trending accessories
 * GET /accessories/recommended
 */
export const fetchRecommendedProducts = async (limit = 20) => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: '/accessories/recommended',
      params: { limit },
    });

    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch featured/promotional products
 * GET /accessories/featured
 */
export const fetchFeaturedProducts = async () => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: '/accessories/featured',
    });

    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch products by category
 * GET /accessories/categories/:categoryId/products
 */
export const fetchProductsByCategory = async (categoryId, page = 1) => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: `/accessories/categories/${categoryId}/products`,
      params: { page, limit: 20 },
    });

    return {
      products: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Search accessories
 * GET /accessories/search?q=query
 */
export const searchAccessories = async (query) => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const response = await retryRequest({
      method: 'GET',
      url: '/accessories/search',
      params: { q: query, limit: 20 },
    });

    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch single product details
 * GET /accessories/products/:productId
 */
export const fetchProductDetails = async (productId) => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: `/accessories/products/${productId}`,
    });

    return response.data.data || null;
  } catch (error) {
    throw error;
  }
};

// ============================================
// BANNERS/PROMOTIONS API
// ============================================

/**
 * Fetch promotional banners
 * GET /accessories/banners
 */
export const fetchPromotionalBanners = async () => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: '/accessories/banners',
    });

    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

// ============================================
// FILTERS API
// ============================================

/**
 * Fetch available filters for products
 * GET /accessories/filters
 */
export const fetchAvailableFilters = async (categoryId = null) => {
  try {
    const response = await retryRequest({
      method: 'GET',
      url: '/accessories/filters',
      params: categoryId ? { categoryId } : {},
    });

    return response.data.data || {};
  } catch (error) {
    throw error;
  }
};

/**
 * Apply filters to products
 * POST /accessories/filter
 */
export const applyFilters = async (filters) => {
  try {
    const response = await retryRequest({
      method: 'POST',
      url: '/accessories/filter',
      data: filters,
    });

    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Handle API errors and return user-friendly messages
 */
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || 'Unknown error occurred';

    switch (status) {
      case 400:
        return { success: false, message: `Bad request: ${message}` };
      case 401:
        return { success: false, message: 'Please log in to continue' };
      case 403:
        return { success: false, message: 'Access denied' };
      case 404:
        return { success: false, message: 'Resource not found' };
      case 500:
        return { success: false, message: 'Server error. Please try again later' };
      default:
        return { success: false, message };
    }
  } else if (error.request) {
    // Request made but no response received
    return {
      success: false,
      message: 'No response from server. Check your internet connection.',
    };
  } else {
    // Error setting up request
    return {
      success: false,
      message: error.message || 'An error occurred',
    };
  }
};

export default {
  // Categories
  fetchCategories,
  
  // Brands
  fetchBrands,
  fetchProductsByBrand,
  
  // Products
  fetchRecommendedProducts,
  fetchFeaturedProducts,
  fetchProductsByCategory,
  fetchProductDetails,
  searchAccessories,
  
  // Promotions
  fetchPromotionalBanners,
  
  // Filters
  fetchAvailableFilters,
  applyFilters,
  
  // Error handling
  handleAPIError,
};