import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';

const CropAvailabilityPage = () => {
  const [filter, setFilter] = useState('all');
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getAvailableCrops(filter);
      setCrops(data || []);
    } catch (err) {
      setError('Failed to load crop availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">Crop Availability</h1>
            <p className="text-slate-600">Latest availability from farmers</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
            >
              <option value="all">All</option>
              <option value="organic">Organic</option>
              <option value="high-demand">High Demand</option>
              <option value="low-risk">Low Risk</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-600">Loading crop availability...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">{error}</div>
        ) : crops.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-slate-600">No crops available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crops.map((crop, idx) => (
              <div key={idx} className="glass-surface rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">{crop.cropName || crop.name || 'Crop'}</h3>
                  <span className="text-xs uppercase tracking-wide text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {crop.category || 'Available'}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">Farmer: {crop.farmerName || 'N/A'}</p>
                <p className="text-slate-600 text-sm">Location: {crop.location || crop.state || 'N/A'}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Quantity</p>
                    <p className="font-semibold text-slate-900">{crop.quantity || crop.availableQuantity || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Price</p>
                    <p className="font-semibold text-slate-900">{crop.price || crop.expectedPrice || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Soil</p>
                    <p className="font-semibold text-slate-900">{crop.soilType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Land Size</p>
                    <p className="font-semibold text-slate-900">{crop.landSize || 'N/A'} acres</p>
                  </div>
                </div>
                {crop.notes && <p className="text-slate-500 text-sm">Notes: {crop.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CropAvailabilityPage;
