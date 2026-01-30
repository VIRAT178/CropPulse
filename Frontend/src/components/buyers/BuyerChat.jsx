import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { socketService } from '../../services/socket';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
import BuyerMessageItem from './BuyerMessageItem';
import FarmerConversationItem from './FarmerConversationItem';
import FarmerItem from './FarmerItem';

const BuyerChat = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [allFarmers, setAllFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeTab, setActiveTab] = useState('conversations');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchAllFarmers();

    if (user?.id) {
      connectSocket();
    } else {
      const loadTimeout = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(loadTimeout);
    }
  }, [user]);

  const connectSocket = () => {
    if (user?.id) {
      try {
        socketService.connect(user.id, 'BUYER');

        socketService.onMessage((message) => {
          if (selectedFarmer && (message.senderId === selectedFarmer.farmerId || message.recipientId === selectedFarmer.farmerId)) {
            const updatedMessages = [...messages, message];
            setMessages(updatedMessages);
            saveMessagesToLocal(selectedFarmer.farmerId, updatedMessages);
          }

          const farmerId = message.senderType === 'FARMER' ? message.senderId : message.recipientId;
          setConversations((prev) => {
            const exists = prev.find((c) => c.farmerId === farmerId);
            if (exists) {
              return prev.map((c) => c.farmerId === farmerId ? {
                ...c,
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
                unreadCount: c.farmerId === message.senderId ? (c.unreadCount || 0) + 1 : c.unreadCount,
              } : c);
            }

            const farmer = allFarmers.find((f) => f.id === farmerId);
            if (!farmer) return prev;

            return [
              ...prev,
              {
                farmerId: farmer.id,
                farmerName: farmer.name,
                farmerEmail: farmer.email,
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
                unreadCount: 1,
                messages: [],
              },
            ];
          });
        });

        socketService.onTyping(({ senderId, isTyping }) => {
          if (selectedFarmer && senderId === selectedFarmer.farmerId) {
            setIsTyping(isTyping);
          }
        });

        socketService.onUserStatus(({ userId, status }) => {
          setOnlineUsers((prev) => {
            const newSet = new Set(prev);
            if (status === 'online') {
              newSet.add(userId);
            } else {
              newSet.delete(userId);
            }
            return newSet;
          });
        });
      } catch (err) {
        setError('Unable to connect to messaging service. Please check if the server is running.');
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (selectedFarmer && user?.id) {
      const conversationId = `farmer_${selectedFarmer.farmerId}_buyer_${user.id}`;
      socketService.joinConversation(conversationId);

      // Fetch messages from backend
      fetchMessagesFromBackend(selectedFarmer.farmerId);

      return () => {
        socketService.leaveConversation(conversationId);
      };
    }
  }, [selectedFarmer, user]);

  const fetchMessagesFromBackend = async (farmerId) => {
    try {
      const backendMessages = await api.getMessagesWithFarmer(farmerId);
      if (backendMessages && backendMessages.length > 0) {
        setMessages(backendMessages);
        saveMessagesToLocal(farmerId, backendMessages);
      } else {
        // Fallback to localStorage if no backend messages
        const savedMessages = loadMessagesFromLocal(farmerId);
        setMessages(savedMessages.length > 0 ? savedMessages : []);
      }
    } catch (err) {
      // Fallback to localStorage on error
      const savedMessages = loadMessagesFromLocal(farmerId);
      setMessages(savedMessages.length > 0 ? savedMessages : []);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveMessagesToLocal = (farmerId, msgs) => {
    try {
      localStorage.setItem(`messages_${user?.id}_farmer_${farmerId}`, JSON.stringify(msgs));
    } catch (err) {
    }
  };

  const loadMessagesFromLocal = (farmerId) => {
    try {
      const saved = localStorage.getItem(`messages_${user?.id}_farmer_${farmerId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      return [];
    }
  };

  const fetchAllFarmers = async () => {
    try {
      const farmers = await api.getFarmers();
      setAllFarmers(farmers || []);
    } catch (err) {
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedFarmer || !user) return;

    const conversationId = `farmer_${selectedFarmer.farmerId}_buyer_${user.id}`;

    const message = {
      conversationId,
      senderId: user.id,
      senderType: 'BUYER',
      recipientId: selectedFarmer.farmerId,
      recipientType: 'FARMER',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    socketService.sendMessage(message);

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveMessagesToLocal(selectedFarmer.farmerId, updatedMessages);

    updateConversationLastMessage(message);

    setMessageText('');
    setSending(false);
  };

  const updateConversationLastMessage = (message) => {
    setConversations((prev) =>
      prev.map((c) => c.farmerId === message.recipientId ? {
        ...c,
        lastMessage: message.content,
        lastMessageTime: message.timestamp,
        unreadCount: 0,
      } : c)
    );
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);

    if (!selectedFarmer) return;

    const conversationId = `farmer_${selectedFarmer.farmerId}_buyer_${user.id}`;
    socketService.sendTyping(conversationId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTyping(conversationId, false);
    }, 1000);
  };

  const handleSelectFarmer = useCallback((farmer) => {
    const existingConv = conversations.find((c) => c.farmerId === farmer.id);

    if (existingConv) {
      setSelectedFarmer(existingConv);
    } else {
      const newConversation = {
        farmerId: farmer.id,
        farmerName: farmer.name,
        farmerEmail: farmer.email,
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: 0,
        messages: []
      };
      setSelectedFarmer(newConversation);

      if (!conversations.find((c) => c.farmerId === farmer.id)) {
        setConversations((prev) => [...prev, newConversation]);
      }
    }

    setActiveTab('conversations');
  }, [conversations]);

  const handleConversationSelect = useCallback((conv) => {
    setSelectedFarmer(conv);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="glass-surface rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
          <span className="text-slate-600">Connecting to messaging service...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex-shrink-0 sticky top-0 z-20">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          💬 Direct Messages with Farmers
        </h2>
        <p className="text-blue-100 text-xs mt-1">Connect and communicate directly with farmers</p>
      </div>

      {error && (
        <div className="mx-4 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-xs">{error}</p>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Sidebar */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0 hidden md:flex">
          {/* Sidebar Header with Tabs */}
          <div className="p-2 bg-white border-b border-slate-200 flex gap-1 flex-shrink-0">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'conversations'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              💬 Chats ({conversations.length})
            </button>
            <button
              onClick={() => setActiveTab('farmers')}
              className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'farmers'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              👨‍🌾 All Farmers ({allFarmers.length})
            </button>
          </div>

          {/* Sidebar List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {activeTab === 'conversations' ? (
              <>
                {conversations.length === 0 ? (
                  <div className="text-center py-8 px-4 text-slate-500 text-sm">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {conversations.map((conv) => (
                      <FarmerConversationItem
                        key={conv.farmerId}
                        conv={conv}
                        selectedFarmer={selectedFarmer}
                        onlineUsers={onlineUsers}
                        formatTime={formatTime}
                        onClick={() => handleConversationSelect(conv)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {allFarmers.length === 0 ? (
                  <div className="text-center py-8 px-4 text-slate-500 text-sm">
                    <p>No farmers available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {allFarmers.map((farmer) => (
                      <FarmerItem
                        key={farmer.id}
                        farmer={farmer}
                        onlineUsers={onlineUsers}
                        onClick={() => handleSelectFarmer(farmer)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedFarmer ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedFarmer(null)}
                    className="md:hidden text-slate-600 hover:text-slate-900"
                  >
                    ← Back
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {selectedFarmer.farmerName?.charAt(0)?.toUpperCase() || 'F'}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 truncate">{selectedFarmer.farmerName || 'Farmer'}</h2>
                    <p className="text-xs text-slate-500 truncate">{selectedFarmer.farmerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth min-h-0 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-3">👋</div>
                      <p className="text-slate-500">No messages yet</p>
                      <p className="text-slate-400 text-sm mt-2">Start the conversation</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <BuyerMessageItem
                        key={`${msg.timestamp}-${index}`}
                        msg={msg}
                        formatTime={formatTime}
                        index={index}
                      />
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 px-3 py-2 rounded-lg">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-slate-200 bg-white flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={handleTyping}
                    placeholder="Aa"
                    className="flex-1 px-4 py-3 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex-shrink-0"
                  >
                    {sending ? '...' : '↑'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-semibold text-slate-700 mb-2">Select a Chat</h2>
                <p className="text-slate-500 mb-6">Choose a farmer from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerChat;
