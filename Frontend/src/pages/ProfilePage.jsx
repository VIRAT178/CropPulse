import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    state: '',
    // Farmer-specific
    village: '',
    soilType: '',
    landSize: '',
    // Buyer-specific
    company: '',
    interestedCrops: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const isBuyer = user?.role === 'BUYER';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = isBuyer ? await api.getCurrentBuyer() : await api.getCurrentFarmer();
      setUserData(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        mobile: data.mobile || '',
        state: data.state || '',
        village: data.village || '',
        soilType: data.soilType || '',
        landSize: data.landSize || '',
        company: data.company || '',
        interestedCrops: data.interestedCrops || ''
      });
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      let payload;
      
      if (isBuyer) {
        payload = {
          email: formData.email,
          name: formData.name,
          mobile: formData.mobile,
          state: formData.state,
          company: formData.company,
          interestedCrops: formData.interestedCrops
        };
      } else {
        payload = {
          email: formData.email,
          name: formData.name,
          mobile: formData.mobile,
          village: formData.village,
          state: formData.state,
          soilType: formData.soilType,
          landSize: parseFloat(formData.landSize)
        };
      }

      const updatedUser = isBuyer 
        ? await api.updateCurrentBuyer(payload)
        : await api.updateCurrentFarmer(payload);
      
      setUserData(updatedUser);
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        mobile: updatedUser.mobile || '',
        state: updatedUser.state || '',
        village: updatedUser.village || '',
        soilType: updatedUser.soilType || '',
        landSize: updatedUser.landSize || '',
        company: updatedUser.company || '',
        interestedCrops: updatedUser.interestedCrops || ''
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 to-cyan-900 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-600">Manage your personal information and preferences</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in-up">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-semibold text-emerald-700">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl animate-fade-in-up">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">❌</span>
              <p className="text-sm font-semibold text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="glass-surface rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select State</option>
                <option value="MP">Madhya Pradesh (MP)</option>
                <option value="UP">Uttar Pradesh (UP)</option>
                <option value="MH">Maharashtra (MH)</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>

            {/* Conditional Fields - Farmer */}
            {!isBuyer && (
              <>
                {/* Village */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Village</label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {/* Soil Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Soil Type</label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select Soil Type</option>
                    <option value="black">Black</option>
                    <option value="red">Red</option>
                    <option value="alluvial">Alluvial</option>
                  </select>
                </div>

                {/* Land Size */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Land Size (acres)</label>
                  <input
                    type="number"
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleChange}
                    disabled={!isEditing}
                    step="0.1"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </>
            )}

            {/* Conditional Fields - Buyer */}
            {isBuyer && (
              <>
                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company/Business Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Interested Crops */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Interested Crops</label>
                  <input
                    type="text"
                    name="interestedCrops"
                    value={formData.interestedCrops}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., Wheat, Rice, Corn"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Comma-separated list of crops you're interested in purchasing</p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {saving ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>💾 Save Changes</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: userData.name || '',
                      email: userData.email || '',
                      mobile: userData.mobile || '',
                      state: userData.state || '',
                      village: userData.village || '',
                      soilType: userData.soilType || '',
                      landSize: userData.landSize || '',
                      company: userData.company || '',
                      interestedCrops: userData.interestedCrops || ''
                    });
                  }}
                  disabled={saving}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300"
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Account Actions */}
        <div className="mt-6 glass-surface rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Account Actions</h3>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-6 py-3 bg-rose-100 text-rose-700 rounded-xl font-semibold hover:bg-rose-200 transition-all duration-300"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
