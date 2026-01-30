import axios from 'axios';

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

// Add response interceptor to handle 401 errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired, clear auth and reload
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export const notificationService = {
  // Get all notifications
  async getNotifications(unreadOnly = false) {
    try {
      const response = await http.get(`/api/notifications?unreadOnly=${unreadOnly}`);
      return response.data.data || [];
    } catch (error) {
      return [];
    }
  },

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await http.get('/api/notifications/count');
      return response.data.data || 0;
    } catch (error) {
      return 0;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      await http.put(`/api/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Mark all as read
  async markAllAsRead() {
    try {
      await http.put('/api/notifications/read-all');
      return true;
    } catch (error) {
      return false;
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await http.delete(`/api/notifications/${notificationId}`);
      return true;
    } catch (error) {
      return false;
    }
  }
};
