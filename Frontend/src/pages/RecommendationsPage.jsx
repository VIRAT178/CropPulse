import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import RecommendationHistory from '../components/recommendations/RecommendationHistory';
import { api } from '../services/api';

const RecommendationsPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getMyRecommendationHistory();
      setHistory(data || []);
    } catch (err) {
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">Recommendations</h1>
            <p className="text-slate-600">Your AI crop recommendations and history</p>
          </div>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-600">Loading recommendations...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">{error}</div>
        ) : history.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-slate-600">No recommendations yet.</div>
        ) : (
          <RecommendationHistory history={history} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;
