import React, { useState, useEffect, useMemo } from 'react';

const STATE_SOIL_OPTIONS = {
  MP: ['Black', 'Red'],
  UP: ['Alluvial', 'Red'],
  Punjab: ['Alluvial'],
  MH: ['Black'],
};

const EditProfileModal = ({ farmer, isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    village: '',
    soilType: '',
    landSize: ''
  });

  const stateOptions = useMemo(() => Object.keys(STATE_SOIL_OPTIONS), []);
  const soilOptions = useMemo(
    () => (formData.state ? STATE_SOIL_OPTIONS[formData.state] || [] : []),
    [formData.state]
  );

  useEffect(() => {
    if (farmer && isOpen) {
      setFormData({
        name: farmer.name || '',
        state: farmer.state || '',
        village: farmer.village || '',
        soilType: farmer.soilType || '',
        landSize: farmer.landSize || ''
      });
    }
  }, [farmer, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'state') {
      const nextSoils = STATE_SOIL_OPTIONS[value] || [];
      setFormData(prev => ({
        ...prev,
        state: value,
        soilType: nextSoils.includes(prev.soilType) ? prev.soilType : ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'landSize' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-surface rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-white/40">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Adjust Inputs</h2>
            <p className="text-sm text-slate-600 mt-1">Update these details to generate a new recommendation. Changes will be saved to your profile.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-xl leading-none"
            aria-label="Close"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4 text-xs text-slate-600">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-2 rounded-lg border border-emerald-100">
            <span>✓ Saves to history • Updates charts • Profile updated</span>
          </div>
          <div className="inline-flex flex-wrap gap-2 text-slate-700">
            <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">MP → Black / Red</span>
            <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">UP → Alluvial / Red</span>
            <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">Punjab → Alluvial</span>
            <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">MH → Black</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg border border-white/70 glass-surface focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
                placeholder="Farmer name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Village</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg border border-white/70 glass-surface focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
                placeholder="Village"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg border border-white/70 glass-surface focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
                required
              >
                <option value="" disabled>Select state</option>
                {stateOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Soil types adjust based on selected state.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Soil Type</label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                disabled={loading || !formData.state}
                className="w-full px-4 py-2.5 rounded-lg border border-white/70 glass-surface focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
                required
              >
                <option value="" disabled>{formData.state ? 'Select soil type' : 'Pick a state first'}</option>
                {soilOptions.map((soil) => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Options follow your dataset mapping.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Land Size (acres)</label>
            <input
              type="number"
              name="landSize"
              value={formData.landSize}
              onChange={handleChange}
              disabled={loading}
              step="0.1"
              min="0"
              className="w-full px-4 py-2.5 rounded-lg border border-white/70 glass-surface focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-50"
              placeholder="e.g., 3.5"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Use acres; decimals supported.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Getting...</span>
                </>
              ) : (
                <span>Get Recommendation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
