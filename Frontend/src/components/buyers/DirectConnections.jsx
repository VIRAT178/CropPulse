import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const DirectConnections = () => {
  const [connections, setConnections] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [filter, setFilter] = useState('active'); // active, pending, all
  const [messageModal, setMessageModal] = useState({ open: false, farmerId: null, message: '' });

  useEffect(() => {
    fetchConnections();
    fetchFarmers();
  }, [filter]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBuyerConnections(filter);
      setConnections(data || []);
    } catch (err) {
      setError('Failed to load connections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmers = async () => {
    try {
      const data = await api.getFarmers();
      setFarmers(data || []);
    } catch (err) {
    }
  };

  const handleConnectFarmer = async (farmerId) => {
    try {
      await api.connectWithFarmer(farmerId);
      setError(null);
      fetchConnections();
      // Show success message
    } catch (err) {
      setError('Failed to connect with farmer.');
    }
  };

  const handleSendMessage = async () => {
    if (!messageModal.message.trim()) return;
    try {
      await api.sendMessage(messageModal.farmerId, messageModal.message);
      setMessageModal({ open: false, farmerId: null, message: '' });
      // Show success message
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  const getStatusBadge = (status) => {
    const badgeClasses = 'px-3 py-1 rounded-full text-sm font-semibold';
    switch (status?.toLowerCase()) {
      case 'active':
        return `${badgeClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${badgeClasses} bg-yellow-100 text-yellow-800`;
      case 'disconnected':
        return `${badgeClasses} bg-red-100 text-red-800`;
      default:
        return `${badgeClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating || 0)) + (rating % 1 !== 0 ? '✨' : '');
  };

  if (loading) {
    return (
      <div className="glass-surface rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Farmers */}
      <div className="glass-surface rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">👥 Direct Connections</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'active'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
              }`}
            >
              Active ({connections.filter(c => c.status === 'ACTIVE').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
              }`}
            >
              Pending ({connections.filter(c => c.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {connections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🤝</div>
            <p className="text-slate-600 mb-4">No connections yet</p>
            <p className="text-slate-500 text-sm">Connect with farmers to start direct trading</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((connection) => (
              <div
                key={connection.id}
                onClick={() =>
                  setSelectedConnection(
                    selectedConnection?.id === connection.id ? null : connection
                  )
                }
                className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200 rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{connection.farmerName}</h3>
                    <p className="text-sm text-slate-600">{connection.village}, {connection.state}</p>
                  </div>
                  <span className={getStatusBadge(connection.status)}>
                    {connection.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rating:</span>
                    <span className="font-semibold">{getRatingStars(connection.rating)} {connection.rating?.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Transactions:</span>
                    <span className="font-bold text-slate-900">{connection.transactionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Specialty Crops:</span>
                    <span className="font-semibold">{connection.specialtyCrops?.join(', ') || 'Various'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Connected:</span>
                    <span className="text-sm text-slate-700">{connection.connectionDate}</span>
                  </div>
                </div>

                {connection.status === 'ACTIVE' && (
                  <div className="flex gap-2 mb-3">
                    <button
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMessageModal({ open: true, farmerId: connection.farmerId, message: '' });
                      }}
                    >
                      💬 Message
                    </button>
                    <button
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to order creation
                      }}
                    >
                      📦 Order
                    </button>
                  </div>
                )}

                {connection.status === 'PENDING' && (
                  <button
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Accept/Cancel connection
                    }}
                  >
                    Confirm Connection
                  </button>
                )}

                {selectedConnection?.id === connection.id && (
                  <div className="mt-4 pt-4 border-t border-blue-300">
                    <p className="text-sm text-slate-700 mb-2"><strong>Location:</strong> {connection.address}</p>
                    <p className="text-sm text-slate-700"><strong>Last Transaction:</strong> {connection.lastTransaction}</p>
                    {connection.reviews && connection.reviews.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-2">Recent Reviews:</p>
                        {connection.reviews.slice(0, 2).map((review, idx) => (
                          <p key={idx} className="text-xs text-slate-600 mb-1">
                            "{review.text}" - {review.author}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discover Farmers */}
      <div className="glass-surface rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">🔍 Discover New Farmers</h2>

        {farmers.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            No farmers available at the moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmers.map((farmer) => {
              const isConnected = connections.some(c => c.farmerId === farmer.id);
              return (
                <div
                  key={farmer.id}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{farmer.name}</h3>
                    <p className="text-sm text-slate-600">{farmer.village}, {farmer.state}</p>
                  </div>

                  <div className="space-y-1 text-sm text-slate-700 mb-3">
                    <p><strong>Land Size:</strong> {farmer.landSize} acres</p>
                    <p><strong>Soil Type:</strong> {farmer.soilType}</p>
                  </div>

                  {!isConnected && (
                    <button
                      className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:shadow-md transition"
                      onClick={() => handleConnectFarmer(farmer.id)}
                    >
                      Connect with Farmer
                    </button>
                  )}

                  {isConnected && (
                    <div className="text-center py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">
                      ✓ Connected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {messageModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-surface rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Send Message</h3>
            <textarea
              value={messageModal.message}
              onChange={(e) =>
                setMessageModal({ ...messageModal, message: e.target.value })
              }
              placeholder="Type your message..."
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setMessageModal({ open: false, farmerId: null, message: '' })}
                className="flex-1 px-4 py-2 bg-gray-300 text-slate-900 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectConnections;
