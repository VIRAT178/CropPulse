export const routes = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  farmers: {
    list: '/farmers',
    byId: (id) => `/farmers/getByid/${id}`,
    me: '/farmers/me',
    recommendation: '/farmers/recommendation',
  },
  buyers: {
    list: '/buyers',
    me: '/buyers/me',
    crops: '/buyers/crops',
    trends: '/buyers/market-trends',
    connections: '/buyers/connections',
    connectFarmer: '/buyers/connect',
    messages: '/buyers/messages',
  },
  recommendations: {
    generate: '/recommendations/me',
    history: (farmerId) => `/recommendations/farmer/${farmerId}`,
    myHistory: '/recommendations/my-history',
    sendEmail: (recommendationId) => `/recommendations/${recommendationId}/send-email`,
  },
  analytics: {
    prices: '/analytics/prices',
    risk: '/analytics/risk-distribution',
    confidence: '/analytics/confidence-trend',
  },
  messages: {
    farmerConversations: '/messages/farmer/conversations',
    messagesWithBuyer: (buyerId) => `/messages/farmer/buyer/${buyerId}`,
    sendToBuyer: '/messages/farmer/send',
    buyerConversations: '/messages/buyer/conversations',
    messagesWithFarmer: (farmerId) => `/messages/buyer/farmer/${farmerId}`,
    sendToFarmer: '/messages/buyer/send',
  },
  aiChat: {
    message: '/api/ai-chat/message',
    health: '/api/ai-chat/health',
  },
};
