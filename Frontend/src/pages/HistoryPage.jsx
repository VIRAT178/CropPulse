import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import RecommendationHistory from '../components/recommendations/RecommendationHistory';
import { api } from '../services/api';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    crop: ''
  });
  
  const isBuyer = user?.role === 'BUYER';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isBuyer) {
        // Fetch buyer connections history
        const connectionsData = await api.getBuyerConnections('all');
        setConnections(connectionsData || []);
      } else {
        // Fetch farmer recommendation history
        const data = await api.getMyRecommendationHistory();
        setHistory(data || []);
      }
    } catch (err) {
      setError(`Failed to load ${isBuyer ? 'connection' : 'recommendation'} history. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-4 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg">
              <span className="text-3xl">📊</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                {isBuyer ? 'Purchase History' : 'Recommendation History'}
              </h1>
              <p className="text-slate-600 mt-1">
                {isBuyer 
                  ? 'View your farmer connections and purchase transactions'
                  : 'View and analyze all your past AI crop recommendations'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchHistory}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        {isBuyer ? (
          // Buyer Statistics
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-surface rounded-2xl p-6">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold text-slate-900">Total Connections</h3>
              <p className="text-3xl font-bold text-emerald-700 mt-2">{connections.length}</p>
            </div>
            <div className="glass-surface rounded-2xl p-6">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-slate-900">Active Connections</h3>
              <p className="text-3xl font-bold text-cyan-700 mt-2">
                {connections.filter(c => c.status === 'ACTIVE').length}
              </p>
            </div>
            <div className="glass-surface rounded-2xl p-6">
              <div className="text-3xl mb-2">🛒</div>
              <h3 className="font-semibold text-slate-900">Total Transactions</h3>
              <p className="text-3xl font-bold text-blue-700 mt-2">
                {connections.reduce((sum, c) => sum + (c.transactionCount || 0), 0)}
              </p>
            </div>
          </div>
        ) : (
          // Farmer Statistics
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-surface rounded-2xl p-6">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold text-slate-900">Total Recommendations</h3>
              <p className="text-3xl font-bold text-emerald-700 mt-2">{history.length}</p>
            </div>
            <div className="glass-surface rounded-2xl p-6">
              <div className="text-3xl mb-2">🌾</div>
              <h3 className="font-semibold text-slate-900">Unique Crops</h3>
              <p className="text-3xl font-bold text-cyan-700 mt-2">
                {new Set(history.map(h => h.recommendedCrop)).size}
              </p>
            </div>
            <div className="glass-surface rounded-2xl p-6">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold text-slate-900">Avg. Confidence</h3>
              <p className="text-3xl font-bold text-blue-700 mt-2">
                {history.length > 0 
                  ? Math.round((history.reduce((sum, h) => sum + (h.confidenceScore || 0), 0) / history.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        )}

        {/* History Table */}
        {isBuyer ? (
          // Buyer Connections Table
          <div className="glass-surface rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Farmer Connections & Transactions</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                <p className="mt-4 text-slate-600">Loading connections...</p>
              </div>
            ) : connections.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Farmer Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Transactions</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Connected Since</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Last Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {connections.map((connection) => (
                      <tr key={connection.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{connection.farmerName}</div>
                          <div className="text-xs text-slate-500">{connection.specialtyCrops?.join(', ')}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700">
                          {connection.village}, {connection.state}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            connection.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {connection.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-lg font-bold text-slate-900">{connection.transactionCount || 0}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold text-slate-900">{connection.rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{connection.connectionDate}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{connection.lastTransaction || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <div className="text-5xl mb-4">👥</div>
                <p>No connections found</p>
              </div>
            )}
          </div>
        ) : (
          // Farmer Recommendation History
          <RecommendationHistory
            history={history}
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
        )}

        {/* Help Text */}
        {!loading && (isBuyer ? connections.length > 0 : history.length > 0) && (
          <div className="mt-6 glass-surface rounded-xl p-4 bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> {isBuyer 
                ? 'Track your relationships with farmers and monitor transaction history to build long-term partnerships.'
                : 'Use the filters above to narrow down your search by date range or crop name. This helps you analyze trends and make better farming decisions over time.'
              }
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && (isBuyer ? connections.length === 0 : history.length === 0) && !error && (
          <div className="glass-surface rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">{isBuyer ? '👥' : '📊'}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {isBuyer ? 'No Connections Yet' : 'No Recommendations Yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {isBuyer 
                ? 'Start connecting with farmers to build your purchase history'
                : 'Generate your first AI recommendation to start building your history'
              }
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
