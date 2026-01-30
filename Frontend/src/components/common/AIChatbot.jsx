import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';

const AIChatbot = ({ userRole = 'farmer' }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: userRole === 'farmer' 
        ? "Hello! I'm your AI agricultural assistant. I can help you with crop advice, pest management, irrigation tips, market prices, and farming best practices. What would you like to know?"
        : "Hello! I'm your AI business assistant. I can help you with crop sourcing, quality assessment, pricing, supplier relations, and market insights. How can I assist you?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/ai-chat/message', {
        message: inputMessage,
        userRole: userRole
      });

      if (response.data.success) {
        const aiMsg = {
          id: messages.length + 2,
          text: response.data.data.aiResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setError(response.data.message || 'Failed to get AI response');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with AI service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-lg flex-shrink-0">
        <h2 className="text-xl font-bold">AI Farm Assistant</h2>
        <p className="text-sm text-emerald-100">Powered by AI • Available 24/7</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg break-words ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start w-full">
            <div className="bg-slate-200 text-slate-800 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start w-full">
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-6 bg-slate-50 rounded-b-lg flex-shrink-0">
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about farming..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:bg-slate-100 text-slate-900 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition flex-shrink-0 font-medium"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChatbot;
