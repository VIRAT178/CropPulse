import axios from 'axios';
import { routes } from './routes.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silent error handling - toast notifications will be shown at component level
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Unauthorized - redirect to login can be implemented here if needed
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Fetch all farmers (Buyer only)
  getFarmers: async () => {
    try {
      const response = await http.get(routes.farmers.list);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Fetch all buyers (Farmer can use to initiate chat)
  getBuyers: async () => {
    try {
      const response = await http.get(routes.buyers.list);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Fetch current logged-in farmer's data
  getCurrentFarmer: async () => {
    try {
      const response = await http.get(routes.farmers.me);
      return response.data.data || response.data || null;
    } catch (error) {
      throw error;
    }
  },

  // Update current farmer's profile
  updateCurrentFarmer: async (farmerData) => {
    try {
      const response = await http.put(routes.farmers.me, farmerData);
      
      return response.data.data || null;
    } catch (error) {
      throw error;
    }
  },

  // Generate recommendation using ad-hoc farmer details (does not persist profile)
  generateRecommendationWithDetails: async (farmerPayload) => {
    try {
      const response = await http.post(routes.farmers.recommendation, farmerPayload);
      return response.data || null;
    } catch (error) {
      throw error;
    }
  },

  // Generate recommendation for current farmer
  getRecommendation: async () => {
    try {
      const response = await http.post(routes.recommendations.generate);
      return response.data.data || null;
    } catch (error) {
      throw error;
    }
  },

  // Fetch current farmer's recommendation history
  getMyRecommendationHistory: async () => {
    try {
      const response = await http.get(routes.recommendations.myHistory);
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Fetch chart analytics data
  getPriceChartData: async (limit = 10) => {
    try {
      const response = await http.get(routes.analytics.prices, { params: { limit } });
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  getRiskDistribution: async () => {
    try {
      const response = await http.get(routes.analytics.risk);
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  getConfidenceTrend: async (months = 6) => {
    try {
      const response = await http.get(routes.analytics.confidence, { params: { months } });
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Fetch recommendation history for a specific farmer
  getFarmerHistory: async (farmerId) => {
    try {
      const response = await http.get(routes.recommendations.history(farmerId));
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Send recommendation via email
  sendRecommendationEmail: async (recommendationId) => {
    try {
      const response = await http.post(routes.recommendations.sendEmail(recommendationId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buyer-specific endpoints
  getCurrentBuyer: async () => {
    try {
      const response = await http.get(routes.buyers.me);
      return response.data.data || null;
    } catch (error) {
      throw error;
    }
  },

  updateCurrentBuyer: async (buyerData) => {
    try {
      const response = await http.put(routes.buyers.me, buyerData);
      return response.data.data || null;
    } catch (error) {
      throw error;
    }
  },

  getAvailableCrops: async (filter = 'all') => {
    try {
      const response = await http.get(routes.buyers.crops, { params: { filter } });
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  getMarketTrends: async (timeRange = '30') => {
    try {
      const response = await http.get(routes.buyers.trends, { params: { timeRange } });
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  getBuyerConnections: async (filter = 'all') => {
    try {
      const response = await http.get(routes.buyers.connections, { params: { filter } });
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  connectWithFarmer: async (farmerId) => {
    try {
      const response = await http.post(routes.buyers.connectFarmer, { farmerId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (farmerId, message) => {
    try {
      const response = await http.post(routes.buyers.messages, { farmerId, message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Auth endpoints
  registerUser: async (payload) => {
    try {
      const response = await http.post('/auth/register', payload, {
        timeout: 30000 // 30 seconds for registration (email sending can take time)
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  loginUser: async (payload) => {
    try {
      const response = await http.post(routes.auth.login, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Password reset flow
  forgotPassword: async (email) => {
    try {
      const response = await http.post(routes.auth.forgotPassword, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await http.post(routes.auth.resetPassword, { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Farmer messaging endpoints
  getFarmerConversations: async () => {
    try {
      const response = await http.get(routes.messages.farmerConversations);
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  getMessagesWithBuyer: async (buyerId) => {
    try {
      const response = await http.get(routes.messages.messagesWithBuyer(buyerId));
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  sendMessageToBuyer: async (buyerId, content) => {
    try {
      const response = await http.post(routes.messages.sendToBuyer, { buyerId, content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buyer messaging endpoints
  getBuyerConversations: async () => {
    try {
      const response = await http.get(routes.messages.buyerConversations);
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  getMessagesWithFarmer: async (farmerId) => {
    try {
      const response = await http.get(routes.messages.messagesWithFarmer(farmerId));
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  sendMessageToFarmer: async (farmerId, content) => {
    try {
      const response = await http.post(routes.messages.sendToFarmer, { farmerId, content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // AI Chat endpoints
  post: async (url, data) => {
    try {
      const response = await http.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};