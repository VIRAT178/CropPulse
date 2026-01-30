import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import PriceBarChart from '../charts/PriceBarChart';

const MarketTrends = () => {
  const [trends, setTrends] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchMarketTrends();
  }, [timeRange]);

  const fetchMarketTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const [trendsData, pricesData] = await Promise.all([
        api.getMarketTrends(timeRange),
        api.getPriceChartData(10),
      ]);
      setTrends(trendsData || []);
      setPriceHistory(pricesData || []);
    } catch (err) {
      setError('Failed to load market trends. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIndicator = (trend) => {
    if (trend > 0) return { icon: '📈', color: 'text-green-600', text: `+${trend}%` };
    if (trend < 0) return { icon: '📉', color: 'text-red-600', text: `${trend}%` };
    return { icon: '➡️', color: 'text-gray-600', text: 'Stable' };
  };

  const getPriceLevel = (price, avgPrice) => {
    const diff = ((price - avgPrice) / avgPrice) * 100;
    if (diff > 10) return { label: 'High', color: 'bg-red-100 text-red-800' };
    if (diff < -10) return { label: 'Low', color: 'bg-green-100 text-green-800' };
    return { label: 'Average', color: 'bg-blue-100 text-blue-800' };
  };

  if (loading) {
    return (
      <div className="glass-surface rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trends Overview */}
      <div className="glass-surface rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">📊 Market Trends</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('7')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeRange === '7'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange('30')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeRange === '30'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
              }`}
            >
              30d
            </button>
            <button
              onClick={() => setTimeRange('90')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeRange === '90'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
              }`}
            >
              90d
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {trends.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            No trend data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.map((trend) => {
              const indicator = getTrendIndicator(trend.percentageChange);
              return (
                <div
                  key={trend.cropId}
                  className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{trend.cropName}</h3>
                      <p className="text-sm text-slate-600">Market Analysis</p>
                    </div>
                    <span className={`text-2xl ${indicator.color}`}>{indicator.icon}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Current Avg Price:</span>
                      <span className="font-bold text-slate-900">₹{trend.currentPrice}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Trend (30d):</span>
                      <span className={`font-bold ${indicator.color}`}>{indicator.text}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Supply:</span>
                      <span className="font-semibold text-slate-800">{trend.supplyStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Demand:</span>
                      <span className="font-semibold text-slate-800">{trend.demandStatus}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCrop(trend)}
                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Price History Chart */}
      {priceHistory.length > 0 && (
        <div className="glass-surface rounded-2xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Price History</h3>
          <PriceBarChart data={priceHistory} />
        </div>
      )}

      {/* Detailed Trend Modal */}
      {selectedCrop && (
        <div className="glass-surface rounded-2xl p-6 border-2 border-blue-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900">{selectedCrop.cropName} - Detailed Insights</h3>
            <button
              onClick={() => setSelectedCrop(null)}
              className="text-2xl text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">Price Range</p>
              <p className="text-lg font-bold text-emerald-600">
                ₹{selectedCrop.minPrice} - ₹{selectedCrop.maxPrice}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">Avg Volume</p>
              <p className="text-lg font-bold text-blue-600">{selectedCrop.avgVolume} tons</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">Volatility</p>
              <p className="text-lg font-bold text-purple-600">{selectedCrop.volatility}%</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">Market Sentiment</p>
              <p className="text-lg font-bold text-orange-600">{selectedCrop.sentiment}</p>
            </div>
          </div>

          <div className="text-slate-700 text-sm">
            <p><strong>Analysis:</strong> {selectedCrop.analysis || 'Market conditions are favorable for procurement.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketTrends;
