import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import CropAvailability from '../components/buyers/CropAvailability';
import MarketTrends from '../components/buyers/MarketTrends';
import DirectConnections from '../components/buyers/DirectConnections';
import BuyerChat from '../components/buyers/BuyerChat';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ connections: 0, crops: 0, trend: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [connectionsData, cropsData, trendsData] = await Promise.all([
        api.getBuyerConnections('all'),
        api.getAvailableCrops('all'),
        api.getMarketTrends('30'),
      ]);
      
      setStats({
        connections: connectionsData?.length || 0,
        crops: cropsData?.length || 0,
        trend: trendsData?.[0]?.percentageChange || 0,
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-surface rounded-2xl p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-slate-900">Farmers Connected</h3>
            <p className="text-2xl font-bold text-blue-700 mt-2">{loading ? '...' : stats.connections}</p>
            <p className="text-xs text-slate-600 mt-1">Active connections</p>
          </div>
          <div className="glass-surface rounded-2xl p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-2">🌾</div>
            <h3 className="font-semibold text-slate-900">Crops Available</h3>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{loading ? '...' : stats.crops}</p>
            <p className="text-xs text-slate-600 mt-1">Available for purchase</p>
          </div>
          <div className="glass-surface rounded-2xl p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-semibold text-slate-900">Market Trend</h3>
            <p className={`text-2xl font-bold mt-2 ${stats.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? '...' : `${stats.trend >= 0 ? '+' : ''}${stats.trend.toFixed(1)}%`}
            </p>
            <p className="text-xs text-slate-600 mt-1">30-day trend</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-blue-500 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('crops')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'crops'
                ? 'bg-blue-500 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            🌾 Crop Availability
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'trends'
                ? 'bg-blue-500 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            📊 Market Trends
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'connections'
                ? 'bg-blue-500 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            👥 Direct Connections
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'messages'
                ? 'bg-blue-500 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            💬 Messages
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="glass-surface rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Welcome to CropPulse Buyer Platform</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-2">🔍 Find Crops</h3>
                  <p className="text-sm text-blue-800">Browse fresh crops directly from farmers with real-time availability</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-2">📈 Track Markets</h3>
                  <p className="text-sm text-emerald-800">Monitor price trends and market insights for smart procurement</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-2">🤝 Connect Directly</h3>
                  <p className="text-sm text-purple-800">Build direct relationships with trusted farmers</p>
                </div>
              </div>
            </div>

            <div className="glass-surface rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                </div>
                <div>
                  <p className="text-slate-600">Spent (This Month)</p>
                  <p className="text-2xl font-bold text-slate-900">₹0</p>
                </div>
                <div>
                  <p className="text-slate-600">Avg. Savings</p>
                  <p className="text-2xl font-bold text-green-600">12%</p>
                </div>
                <div>
                  <p className="text-slate-600">Farmers Trusted</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.connections}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crops' && <CropAvailability />}
        {activeTab === 'trends' && <MarketTrends />}
        {activeTab === 'connections' && <DirectConnections />}
        {activeTab === 'messages' && <BuyerChat />}
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
