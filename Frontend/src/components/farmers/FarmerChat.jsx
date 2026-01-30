import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import { socketService } from '../../services/socket';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
import MessageItem from './MessageItem';
import ConversationItem from './ConversationItem';
import BuyerItem from './BuyerItem';

const FarmerChat = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [allBuyers, setAllBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeTab, setActiveTab] = useState('conversations'); // 'conversations' or 'buyers'
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Fetch all buyers from backend
    fetchAllBuyers();
    
    // If user exists, connect immediately
    if (user?.id) {
      connectSocket();
    } else {
      // Set timeout to stop loading after 3 seconds even if user doesn't load
      const loadTimeout = setTimeout(() => {
        setLoading(false);
      }, 3000);
      
      return () => clearTimeout(loadTimeout);
    }
  }, [user]);

  const connectSocket = () => {
    // Connect to WebSocket
    if (user?.id) {
      try {
        socketService.connect(user.id, 'FARMER');
        
        // Listen for incoming messages
        socketService.onMessage((message) => {
          
          // Add message to current conversation if it matches
          if (selectedBuyer && (message.senderId === selectedBuyer.buyerId || message.recipientId === selectedBuyer.buyerId)) {
            const updatedMessages = [...messages, message];
            setMessages(updatedMessages);
            // Save to localStorage
            saveMessagesToLocal(selectedBuyer.buyerId, updatedMessages);
          }

          // Ensure conversation exists, then update last message
          const buyerId = message.senderType === 'BUYER' ? message.senderId : message.recipientId;
          setConversations(prev => {
            const exists = prev.find(c => c.buyerId === buyerId);
            if (exists) {
              return prev.map(c => c.buyerId === buyerId ? {
                ...c,
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
                unreadCount: c.buyerId === message.senderId ? (c.unreadCount || 0) + 1 : c.unreadCount,
              } : c);
            }

            const buyer = allBuyers.find(b => b.id === buyerId);
            if (!buyer) return prev;

            return [
              ...prev,
              {
                buyerId: buyer.id,
                buyerName: buyer.name,
                buyerEmail: buyer.email,
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
                unreadCount: 1,
                messages: [],
              },
            ];
          });
        });

        // Listen for typing indicator
        socketService.onTyping(({ senderId, isTyping }) => {
          if (selectedBuyer && senderId === selectedBuyer.buyerId) {
            setIsTyping(isTyping);
          }
        });

        // Listen for user online status
        socketService.onUserStatus(({ userId, status }) => {
          setOnlineUsers(prev => {
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
    } else {
    }
    
    // Always clear loading after short delay
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (selectedBuyer && user?.id) {
      // Join conversation room
      const conversationId = `farmer_${user.id}_buyer_${selectedBuyer.buyerId}`;
      socketService.joinConversation(conversationId);
      
      // Fetch messages from backend
      fetchMessagesFromBackend(selectedBuyer.buyerId);
      
      return () => {
        socketService.leaveConversation(conversationId);
      };
    }
  }, [selectedBuyer, user]);

  const fetchMessagesFromBackend = async (buyerId) => {
    try {
      const backendMessages = await api.getMessagesWithBuyer(buyerId);
      if (backendMessages && backendMessages.length > 0) {
        setMessages(backendMessages);
        saveMessagesToLocal(buyerId, backendMessages);
      } else {
        // Fallback to localStorage if no backend messages
        const savedMessages = loadMessagesFromLocal(buyerId);
        setMessages(savedMessages.length > 0 ? savedMessages : []);
      }
    } catch (err) {
      // Fallback to localStorage on error
      const savedMessages = loadMessagesFromLocal(buyerId);
      setMessages(savedMessages.length > 0 ? savedMessages : []);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveMessagesToLocal = (buyerId, msgs) => {
    try {
      localStorage.setItem(`messages_${user?.id}_${buyerId}`, JSON.stringify(msgs));
    } catch (err) {
    }
  };

  const loadMessagesFromLocal = (buyerId) => {
    try {
      const saved = localStorage.getItem(`messages_${user?.id}_${buyerId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      return [];
    }
  };

  const fetchAllBuyers = async () => {
    try {
      const buyers = await api.getBuyers();
      setAllBuyers(buyers || []);
    } catch (err) {
      setError('Failed to load buyers list. Please check your connection.');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedBuyer || !user) return;

    const conversationId = `farmer_${user.id}_buyer_${selectedBuyer.buyerId}`;
    
    const message = {
      conversationId,
      senderId: user.id,
      senderType: 'FARMER',
      recipientId: selectedBuyer.buyerId,
      recipientType: 'BUYER',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    // Send via WebSocket
    socketService.sendMessage(message);
    
    // Add message to local state immediately
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    // Save to localStorage for persistence
    saveMessagesToLocal(selectedBuyer.buyerId, updatedMessages);
    
    // Update conversation list
    updateConversationLastMessage(message);
    
    setMessageText('');
    setSending(false);
    
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    if (!selectedBuyer) return;
    
    const conversationId = `farmer_${user.id}_buyer_${selectedBuyer.buyerId}`;
    socketService.sendTyping(conversationId, true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTyping(conversationId, false);
    }, 1000);
  };

  const updateConversationLastMessage = (message) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.buyerId === message.recipientId
          ? {
              ...conv,
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
            }
          : conv
      )
    );
  };

  const handleSelectBuyer = useCallback((buyer) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.buyerId === buyer.id);
    
    if (existingConv) {
      setSelectedBuyer(existingConv);
    } else {
      // Create new conversation object
      const newConversation = {
        buyerId: buyer.id,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: 0,
        messages: []
      };
      setSelectedBuyer(newConversation);
      
      // Add to conversations list if not already there
      if (!conversations.find(c => c.buyerId === buyer.id)) {
        setConversations(prev => [...prev, newConversation]);
      }
    }
    
    // Switch to conversations tab
    setActiveTab('conversations');
  }, [conversations]);

  const handleConversationSelect = useCallback((conv) => {
    setSelectedBuyer(conv);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mb-4"></div>
          <span className="text-slate-600">Connecting to messaging service...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex-shrink-0 sticky top-0 z-20">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          💬 Direct Messages with Buyers
        </h2>
        <p className="text-emerald-100 text-xs mt-1">Connect and communicate directly with interested buyers</p>
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
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              💬 Chats ({conversations.length})
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'buyers'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              👥 All Buyers ({allBuyers.length})
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
                      <ConversationItem
                        key={conv.buyerId}
                        conv={conv}
                        selectedBuyer={selectedBuyer}
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
                {allBuyers.length === 0 ? (
                  <div className="text-center py-8 px-4 text-slate-500 text-sm">
                    <p>No buyers available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {allBuyers.map((buyer) => (
                      <BuyerItem
                        key={buyer.id}
                        buyer={buyer}
                        onlineUsers={onlineUsers}
                        onClick={() => handleSelectBuyer(buyer)}
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
          {selectedBuyer ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedBuyer(null)}
                    className="md:hidden text-slate-600 hover:text-slate-900"
                  >
                    ← Back
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {selectedBuyer.buyerName?.charAt(0)?.toUpperCase() || 'B'}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 truncate">{selectedBuyer.buyerName || 'Buyer'}</h2>
                    <p className="text-xs text-slate-500 truncate">{selectedBuyer.buyerEmail}</p>
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
                      <MessageItem 
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
                    className="flex-1 px-4 py-3 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex-shrink-0"
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
                <p className="text-slate-500 mb-6">Choose a buyer from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerChat;
