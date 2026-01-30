import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';

const MarketTrendsPage = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getMarketTrends(timeRange);
        setTrends(data || []);
      } catch (err) {
        setError('Failed to load market trends. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [timeRange]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">Market Trends</h1>
            <p className="text-slate-600">Real-time trends and pricing insights</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-600">Loading trends...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">{error}</div>
        ) : trends.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-slate-600">No trend data available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trends.map((item, idx) => {
              const name = item.cropName || item.crop || item.name || 'Unknown Crop';
              const price = item.averagePrice || item.price || item.currentPrice || 'N/A';
              const change = item.change || item.priceChange || item.delta || null;
              const demand = item.demand || item.demandIndex || item.volume || null;
              return (
                <div key={idx} className="glass-surface rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                    <span className="text-sm text-slate-500">{item.region || item.state || 'Market'}</span>
                  </div>
                  <p className="text-sm text-slate-500">Time range: last {timeRange} days</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Avg Price</p>
                      <p className="text-lg font-semibold text-emerald-700">{price}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Change</p>
                      <p className={`text-lg font-semibold ${change && change > 0 ? 'text-emerald-700' : change && change < 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {change !== null && change !== undefined ? `${change}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Demand</p>
                      <p className="text-lg font-semibold text-slate-800">{demand ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Trend</p>
                      <p className="text-lg font-semibold text-slate-800">{item.trend || item.signal || 'Stable'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketTrendsPage;
