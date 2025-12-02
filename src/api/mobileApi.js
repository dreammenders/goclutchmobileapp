import axios from 'axios';

// Mobile API configuration - Production optimized
const MOBILE_API_BASE_URL = 'https://mobileapi.goclutchservice.in/api/v1';

// Create axios instance for mobile API
const mobileApiClient = axios.create({
  baseURL: MOBILE_API_BASE_URL,
  timeout: 15000, // 15 seconds timeout for faster response feedback
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Production optimized (no verbose logging)
mobileApiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Production optimized (no logging)
mobileApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Brand API functions - Real-time database data only
export const brandApi = {
  /**
   * Get all brands with optional search and pagination
   * Only uses real-time data from remote database
   */
  getBrands: async (params = {}) => {
    try {
      const { search, limit = 1000, offset = 0 } = params;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (search && search.trim()) {
        queryParams.append('search', search.trim());
      }
      
      const response = await mobileApiClient.get(`/brands?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load brands from server: ${error.message}`);
    }
  },

  /**
   * Get popular/featured brands from database
   * Only uses real-time data from remote database
   */
  getPopularBrands: async (limit = 1000) => {
    try {
      const response = await mobileApiClient.get(`/brands/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load popular brands from server: ${error.message}`);
    }
  },

  /**
   * Get specific brand by ID from database
   * Only uses real-time data from remote database
   */
  getBrandById: async (brandId) => {
    try {
      const response = await mobileApiClient.get(`/brands/${brandId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load brand from server: ${error.message}`);
    }
  },
};

// Model API functions - Real-time database data only
export const modelApi = {
  /**
   * Get all models for a specific brand with optional search and pagination
   * Only uses real-time data from remote database
   */
  getModelsByBrand: async (brandId, params = {}) => {
    try {
      const { search, limit = 1000, offset = 0 } = params;
      
      if (!brandId || brandId.toString().trim().length === 0) {
        throw new Error('Brand ID is required');
      }
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (search && search.trim()) {
        queryParams.append('search', search.trim());
      }
      
      const response = await mobileApiClient.get(`/models/brand/${brandId}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load models for this brand: ${error.message}`);
    }
  },

  /**
   * Get specific model by ID from database
   * Only uses real-time data from remote database
   */
  getModelById: async (modelId) => {
    try {
      const response = await mobileApiClient.get(`/models/${modelId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load model from server: ${error.message}`);
    }
  },
};

// Variant API functions - Real-time database data only
export const variantApi = {
  /**
   * Get all variants (fuel types) from database
   * Only uses real-time data from remote database
   */
  getVariants: async () => {
    try {
      const response = await mobileApiClient.get('/variants');
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load variants from server: ${error.message}`);
    }
  },
};

// Promotional Banners API functions - Real-time database data only
export const promotionalBannerApi = {
  /**
   * Get all active promotional banners ordered by display_order
   * Only uses real-time data from remote database
   */
  getPromotionalBanners: async () => {
    try {
      const response = await mobileApiClient.get('/promotional-banners');
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load promotional banners from server: ${error.message}`);
    }
  },
};

// Special Offers API functions - Real-time database data only
export const specialOfferApi = {
  /**
   * Get all active special offers ordered by display_order
   * Only uses real-time data from remote database
   */
  getSpecialOffers: async () => {
    try {
      const response = await mobileApiClient.get('/special-offers');
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load special offers from server: ${error.message}`);
    }
  },
};

// Service API functions - Real-time database data only
export const serviceApi = {
  /**
   * Get all services with optional search and pagination
   * Only uses real-time data from remote database
   */
  getServices: async (params = {}) => {
    try {
      const { search, limit = 100, offset = 0 } = params;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (search && search.trim()) {
        queryParams.append('search', search.trim());
      }
      
      const response = await mobileApiClient.get(`/services?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load services from server: ${error.message}`);
    }
  },

  /**
   * Get specific service by ID from database
   * Only uses real-time data from remote database
   */
  getServiceById: async (serviceId) => {
    try {
      const response = await mobileApiClient.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load service from server: ${error.message}`);
    }
  },
};

// Plan API functions - Real-time database data only
export const planApi = {
  /**
   * Get all plans from database
   * Only uses real-time data from remote database
   */
  getPlans: async (params = {}) => {
    try {
      const { limit = 100, offset = 0 } = params;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      const response = await mobileApiClient.get(`/plans?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load plans from server: ${error.message}`);
    }
  },

  /**
   * Get specific plan by ID from database
   * Only uses real-time data from remote database
   */
  getPlanById: async (planId) => {
    try {
      const response = await mobileApiClient.get(`/plans/${planId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load plan from server: ${error.message}`);
    }
  },

  /**
   * Get all plans for a specific service from database
   * CRITICAL: This is used when user clicks on a service to see available plans
   * Only uses real-time data from remote database
   */
  getPlansByService: async (serviceId, params = {}) => {
    try {
      if (!serviceId || serviceId.toString().trim().length === 0) {
        throw new Error('Service ID is required');
      }
      
      const { limit = 100, offset = 0 } = params;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      const response = await mobileApiClient.get(`/plans/service/${serviceId}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load plans for this service: ${error.message}`);
    }
  },
};

// Health check function
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${MOBILE_API_BASE_URL.replace('/api/v1', '')}/health`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export the configured client for custom requests
export { mobileApiClient };

// Default export
export default {
  brandApi,
  modelApi,
  variantApi,
  promotionalBannerApi,
  specialOfferApi,
  serviceApi,
  planApi,
  checkApiHealth,
  client: mobileApiClient,
  // Convenience methods
  getBrands: (...args) => brandApi.getBrands(...args),
  getPopularBrands: (...args) => brandApi.getPopularBrands(...args),
  getBrandById: (...args) => brandApi.getBrandById(...args),
  getModelsByBrand: (...args) => modelApi.getModelsByBrand(...args),
  getModelById: (...args) => modelApi.getModelById(...args),
  getVariants: (...args) => variantApi.getVariants(...args),
  getPromotionalBanners: (...args) => promotionalBannerApi.getPromotionalBanners(...args),
  getSpecialOffers: (...args) => specialOfferApi.getSpecialOffers(...args),
  getServices: (...args) => serviceApi.getServices(...args),
  getServiceById: (...args) => serviceApi.getServiceById(...args),
  getPlans: (...args) => planApi.getPlans(...args),
  getPlanById: (...args) => planApi.getPlanById(...args),
  getPlansByService: (...args) => planApi.getPlansByService(...args),
};