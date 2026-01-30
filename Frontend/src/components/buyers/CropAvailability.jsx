import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const CropAvailability = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAvailableCrops();
  }, [filter]);

  const fetchAvailableCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAvailableCrops(filter);
      setCrops(data || []);
    } catch (err) {
      setError('Failed to load available crops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getQuantityColor = (quantity) => {
    if (quantity > 100) return 'text-green-600';
    if (quantity > 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (quality) => {
    const badgeClasses = 'px-3 py-1 rounded-full text-sm font-semibold';
    switch (quality?.toLowerCase()) {
      case 'premium':
        return `${badgeClasses} bg-green-100 text-green-800`;
      case 'standard':
        return `${badgeClasses} bg-blue-100 text-blue-800`;
      case 'economy':
        return `${badgeClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${badgeClasses} bg-gray-100 text-gray-800`;
    }
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
    <div className="glass-surface rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">🌾 Crop Availability</h2>
        <div className="flex gap-2">
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
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'high'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
            }`}
          >
            High Stock
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'low'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
            }`}
          >
            Limited
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {crops.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-slate-600">No crops available matching your filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(selectedCrop?.id === crop.id ? null : crop)}
              className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-4 cursor-pointer hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{crop.name}</h3>
                  <p className="text-sm text-slate-600">{crop.farmerName}</p>
                </div>
                <span className={getQualityBadge(crop.quality)}>
                  {crop.quality || 'Standard'}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Quantity:</span>
                  <span className={`font-bold ${getQuantityColor(crop.quantity)}`}>
                    {crop.quantity} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Price:</span>
                  <span className="font-bold text-slate-900">₹{crop.pricePerKg}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-semibold text-slate-800">{crop.village}, {crop.state}</span>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:shadow-md transition"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Connect with Farmer
              </button>

              {selectedCrop?.id === crop.id && (
                <div className="mt-4 pt-4 border-t border-emerald-300 text-sm text-slate-700">
                  <p><strong>Harvest Date:</strong> {crop.harvestDate}</p>
                  <p><strong>Certification:</strong> {crop.certification || 'Organic'}</p>
                  <p className="mt-2"><em>{crop.description}</em></p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropAvailability;
