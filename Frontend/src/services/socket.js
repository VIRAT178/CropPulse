import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const RAW_SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';
const SOCKET_URL = (() => {
  if (typeof window !== 'undefined' && window.location?.protocol === 'https:') {
    return RAW_SOCKET_URL.replace(/^http:\/\//i, 'https://');
  }
  return RAW_SOCKET_URL;
})();
const WS_ENDPOINT = `${SOCKET_URL}/ws`;

class SocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.pendingSubscriptions = [];
    this.messageCallback = null;
    this.typingCallback = null;
    this.statusCallback = null;
    this.userId = null;
    this.userType = null;
  }

  connect(userId, userType) {
    if (this.client && this.connected) {
      return this.client;
    }

    this.userId = userId;
    this.userType = userType;

    const token = localStorage.getItem('authToken');

    try {
      this.client = new Client({
        webSocketFactory: () => new SockJS(WS_ENDPOINT),
        connectHeaders: {
          Authorization: token ? `Bearer ${token}` : '',
          userId: String(userId || ''),
          userType: userType || '',
        },
        reconnectDelay: 1000,
        onConnect: () => {
          this.connected = true;
          this.flushPendingSubscriptions();
        },
        onDisconnect: () => {
          this.connected = false;
        },
        onStompError: () => {
          this.connected = false;
        },
        onWebSocketError: () => {
          this.connected = false;
        },
      });

      this.client.activate();

      return this.client;
    } catch (error) {
      this.connected = false;
      return null;
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.subscriptions.clear();
      this.pendingSubscriptions = [];
    }
  }

  // Join a conversation room
  joinConversation(conversationId) {
    const subscribeAction = () => {
      const messageTopic = `/topic/conversation/${conversationId}`;
      const typingTopic = `/topic/conversation/${conversationId}/typing`;

      if (!this.subscriptions.has(messageTopic)) {
        const sub = this.client.subscribe(messageTopic, (payload) => {
          const body = payload?.body ? JSON.parse(payload.body) : null;
          if (body && this.messageCallback) {
            this.messageCallback(body);
          }
        });
        this.subscriptions.set(messageTopic, sub);
      }

      if (!this.subscriptions.has(typingTopic)) {
        const sub = this.client.subscribe(typingTopic, (payload) => {
          const body = payload?.body ? JSON.parse(payload.body) : null;
          if (body && this.typingCallback) {
            this.typingCallback(body);
          }
        });
        this.subscriptions.set(typingTopic, sub);
      }
    };

    if (this.connected && this.client) {
      subscribeAction();
    } else {
      this.pendingSubscriptions.push(subscribeAction);
    }
  }

  // Leave a conversation room
  leaveConversation(conversationId) {
    const messageTopic = `/topic/conversation/${conversationId}`;
    const typingTopic = `/topic/conversation/${conversationId}/typing`;
    this.unsubscribe(messageTopic);
    this.unsubscribe(typingTopic);
  }

  // Send message
  sendMessage(message) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(message),
      });
    }
  }

  // Listen for incoming messages
  onMessage(callback) {
    this.messageCallback = callback;
  }

  // Listen for typing indicator
  onTyping(callback) {
    this.typingCallback = callback;
  }

  // Send typing indicator
  sendTyping(conversationId, isTyping) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          conversationId,
          senderId: this.userId,
          isTyping,
        }),
      });
    }
  }

  // Listen for online status (reserved for future use)
  onUserStatus(callback) {
    this.statusCallback = callback;
  }

  // Remove all listeners
  removeAllListeners() {
    this.messageCallback = null;
    this.typingCallback = null;
    this.statusCallback = null;
  }

  // Get socket instance
  getSocket() {
    return this.client;
  }

  isConnected() {
    return this.connected;
  }

  flushPendingSubscriptions() {
    const pending = [...this.pendingSubscriptions];
    this.pendingSubscriptions = [];
    pending.forEach((fn) => fn());
  }

  unsubscribe(topic) {
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
      this.subscriptions.delete(topic);
    }
  }
}

export const socketService = new SocketService();
