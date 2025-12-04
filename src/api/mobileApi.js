import axios from 'axios';
import { Platform } from 'react-native';

// Mobile API configuration - Auto-detect environment
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development: Detect platform and use appropriate localhost
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to reach host machine
      return 'http://10.0.2.2:3002/api/v1';
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      return 'http://192.168.1.36:3002/api/v1';
    } else {
      // Web or other platforms
      return 'http://localhost:3002/api/v1';
    }
  } else {
    // Production
    return 'https://mobileapi.goclutchservice.in/api/v1';
  }
};

const MOBILE_API_BASE_URL = getApiBaseUrl();

// Log API URL in development
if (__DEV__) {
  console.log('🔌 Mobile API Base URL:', MOBILE_API_BASE_URL);
  console.log('📱 Platform:', Platform.OS);
}

// Create axios instance for mobile API
const mobileApiClient = axios.create({
  baseURL: MOBILE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Log requests in development
mobileApiClient.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Log responses in development
mobileApiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('📥 API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      if (!error.response) {
        console.error('❌ Network Error - Cannot reach:', error.config?.url);
        console.error('   Base URL:', MOBILE_API_BASE_URL);
        console.error('   Platform:', Platform.OS);
        console.error('   Error:', error.message);
      } else {
        console.error('❌ API Error:', error.response?.status, error.config?.url, error.message);
      }
    }
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

  /**
   * Get service plans with model and variant-specific pricing
   * Used when user selects a specific car model and fuel variant
   * Returns pricing tailored to the selected car configuration
   */
  getPlansByModelAndVariant: async (modelId, variantId, params = {}) => {
    try {
      if (!modelId || modelId.toString().trim().length === 0) {
        throw new Error('Model ID is required');
      }
      if (!variantId || variantId.toString().trim().length === 0) {
        throw new Error('Variant ID is required');
      }
      
      const { serviceId, limit = 100, offset = 0 } = params;
      
      let url = `/plans/model/${modelId}/variant/${variantId}?limit=${limit}&offset=${offset}`;
      if (serviceId) {
        url += `&serviceId=${serviceId}`;
      }
      
      const response = await mobileApiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load plans for this car: ${error.message}`);
    }
  },
};

// Service Offers API functions - Real-time database data only
export const serviceOfferApi = {
  /**
   * Get all service offers from database
   */
  getOffers: async (params = {}) => {
    try {
      const { limit = 100, offset = 0 } = params;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      const response = await mobileApiClient.get(`/service-offers?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load service offers from server: ${error.message}`);
    }
  },

  /**
   * Get offers for a specific service from database
   */
  getOffersByService: async (serviceId) => {
    try {
      if (!serviceId || serviceId.toString().trim().length === 0) {
        throw new Error('Service ID is required');
      }
      
      const response = await mobileApiClient.get(`/service-offers/service/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load offers for this service: ${error.message}`);
    }
  },
};

// Service Banners API functions - Real-time database data only
export const serviceBannerApi = {
  /**
   * Get all service banners from database
   */
  getBanners: async (params = {}) => {
    try {
      const { limit = 100, offset = 0 } = params;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      const response = await mobileApiClient.get(`/service-banners?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load service banners from server: ${error.message}`);
    }
  },

  /**
   * Get banners for a specific service from database
   */
  getBannersByService: async (serviceId) => {
    try {
      if (!serviceId || serviceId.toString().trim().length === 0) {
        throw new Error('Service ID is required');
      }
      
      const response = await mobileApiClient.get(`/service-banners/service/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load banners for this service: ${error.message}`);
    }
  },
};

// Related Services API functions - Real-time database data only
export const relatedServiceApi = {
  /**
   * Get related/upsell services for a specific service
   */
  getRelatedServices: async (serviceId, type = null) => {
    try {
      if (!serviceId || serviceId.toString().trim().length === 0) {
        throw new Error('Service ID is required');
      }
      
      let url = `/related-services/service/${serviceId}`;
      if (type) {
        url += `?type=${type}`;
      }
      
      const response = await mobileApiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Unable to load related services: ${error.message}`);
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
  serviceOfferApi,
  serviceBannerApi,
  relatedServiceApi,
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
  getPlansByModelAndVariant: (...args) => planApi.getPlansByModelAndVariant(...args),
  getServiceOffers: (...args) => serviceOfferApi.getOffers(...args),
  getServiceOffersByService: (...args) => serviceOfferApi.getOffersByService(...args),
  getServiceBanners: (...args) => serviceBannerApi.getBanners(...args),
  getServiceBannersByService: (...args) => serviceBannerApi.getBannersByService(...args),
  getRelatedServices: (...args) => relatedServiceApi.getRelatedServices(...args),
};