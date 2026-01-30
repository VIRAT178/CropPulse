import React, { useMemo } from 'react';
import StatusBadge from '../common/StatusBadge';

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString();
};

const RecommendationHistory = ({ 
  history = [], 
  filters = { dateFrom: null, dateTo: null, crop: '' }, 
  onFilterChange = () => {}, 
  loading = false 
}) => {
  const filtered = useMemo(() => {
    return history.filter((h) => {
      const dt = h.createdAt ? new Date(h.createdAt) : null;
      const inDate = (() => {
        if (!dt || isNaN(dt.getTime())) return true;
        const fromOk = !filters.dateFrom || dt >= new Date(filters.dateFrom);
        const toOk = !filters.dateTo || dt <= new Date(filters.dateTo);
        return fromOk && toOk;
      })();
      const inCrop = !filters.crop || (h.recommendedCrop || '').toLowerCase().includes(filters.crop.toLowerCase());
      return inDate && inCrop;
    });
  }, [history, filters]);

  return (
    <div className="glass-surface rounded-2xl p-5 sm:p-6">
      <div className="mb-4 sm:mb-5 flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Recommendation History</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <input
          type="date"
          className="glass-surface border border-white/70 rounded-lg px-3 py-2 text-sm"
          value={filters.dateFrom || ''}
          onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value || null })}
          placeholder="From"
        />
        <input
          type="date"
          className="glass-surface border border-white/70 rounded-lg px-3 py-2 text-sm"
          value={filters.dateTo || ''}
          onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value || null })}
          placeholder="To"
        />
        <input
          type="text"
          className="glass-surface border border-white/70 rounded-lg px-3 py-2 text-sm"
          value={filters.crop || ''}
          onChange={(e) => onFilterChange({ ...filters, crop: e.target.value })}
          placeholder="Filter by crop (e.g., Wheat)"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading history…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-500">No history found for selected filters</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Crop</th>
                <th className="py-2 pr-4">Price (₹)</th>
                <th className="py-2 pr-4">Risk</th>
                <th className="py-2 pr-4">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.id} className="border-t border-white/60">
                  <td className="py-2 pr-4 text-slate-900">{formatDate(h.createdAt)}</td>
                  <td className="py-2 pr-4 font-semibold text-slate-900">{h.recommendedCrop}</td>
                  <td className="py-2 pr-4 text-slate-900">{(h.expectedPrice ?? 0).toFixed(2)}</td>
                  <td className="py-2 pr-4"><StatusBadge level={h.riskLevel} /></td>
                  <td className="py-2 pr-4 text-slate-900">{Math.round((h.confidenceScore ?? 0) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecommendationHistory;
