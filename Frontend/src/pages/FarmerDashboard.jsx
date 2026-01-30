import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import RecommendationHistory from '../components/recommendations/RecommendationHistory';
import PriceBarChart from '../components/charts/PriceBarChart';
import RiskPieChart from '../components/charts/RiskPieChart';
import ConfidenceLineChart from '../components/charts/ConfidenceLineChart';
import EditProfileModal from '../components/common/EditProfileModal';
import FarmerChat from '../components/farmers/FarmerChat';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const [farmerData, setFarmerData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [history, setHistory] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [riskData, setRiskData] = useState({});
  const [confidenceData, setConfidenceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [profileEditLoading, setProfileEditLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [historyFilters, setHistoryFilters] = useState({
    dateFrom: null,
    dateTo: null,
    crop: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch farmer's initial data (without generating recommendation)
      const [farmer, hist, prices, risk, confidence] = await Promise.all([
        api.getCurrentFarmer(),
        api.getMyRecommendationHistory(),
        api.getPriceChartData(),
        api.getRiskDistribution(),
        api.getConfidenceTrend()
      ]);

      if (!farmer) {
        setError('Unable to load farmer profile. Please ensure you are logged in as a farmer.');
        setLoading(false);
        return;
      }

      setFarmerData(farmer);
      setHistory(hist || []);
      setPriceData(prices || []);
      setRiskData(risk || {});
      setConfidenceData(confidence || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load dashboard data. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendation = async () => {
    try {
      setRecommendationLoading(true);
      setError(null);

      // Generate new recommendation
      const rec = await api.getRecommendation();
      setRecommendation(rec);

      // Refresh history and charts after generating recommendation
      const [hist, prices, risk, confidence] = await Promise.all([
        api.getMyRecommendationHistory(),
        api.getPriceChartData(),
        api.getRiskDistribution(),
        api.getConfidenceTrend()
      ]);

      setHistory(hist || []);
      setPriceData(prices || []);
      setRiskData(risk || {});
      setConfidenceData(confidence || []);
    } catch (err) {
      setError('Failed to generate recommendation. Please try again.');
    } finally {
      setRecommendationLoading(false);
    }
  };

  const handleAdjustRecommendation = async (updatedData) => {
    try {
      setProfileEditLoading(true);
      setError(null);

      // Step 1: Temporarily update farmer profile
      const updatedFarmer = await api.updateCurrentFarmer({
        email: farmerData?.email,
        name: updatedData.name,
        village: updatedData.village,
        state: updatedData.state,
        soilType: updatedData.soilType,
        landSize: Number(updatedData.landSize),
      });
      
      if (!updatedFarmer) {
        throw new Error('Failed to update farmer profile: No data returned from server');
      }
      
      setFarmerData(updatedFarmer);

      // Step 2: Generate recommendation (saves to DB with new profile)
      const rec = await api.getRecommendation();
      setRecommendation(rec);

      // Step 3: Refresh history and charts with new data
      const [hist, prices, risk, confidence] = await Promise.all([
        api.getMyRecommendationHistory(),
        api.getPriceChartData(),
        api.getRiskDistribution(),
        api.getConfidenceTrend()
      ]);

      setHistory(hist || []);
      setPriceData(prices || []);
      setRiskData(risk || {});
      setConfidenceData(confidence || []);

      setSuccessMessage('Recommendation generated and saved to history with your updated inputs.');

      // Close modal
      setIsEditModalOpen(false);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to generate recommendation with the provided details. Please try again.';
      setError(errorMsg);
    } finally {
      setProfileEditLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !farmerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="glass-surface rounded-2xl p-8 max-w-md">
          <div className="text-red-600 mb-4 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="font-semibold">{error}</p>
          </div>
          <button
            onClick={fetchInitialData}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-700 flex items-center gap-2">
            <span>✓</span>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-surface rounded-2xl p-6">
            <div className="text-3xl mb-2">🌱</div>
            <h3 className="font-semibold text-slate-900">Total Recommendations</h3>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{history.length}</p>
          </div>
          <div className="glass-surface rounded-2xl p-6">
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-semibold text-slate-900">Farm Details</h3>
            <p className="text-lg text-slate-700 mt-2">
              {farmerData?.landSize || 'N/A'} acres
            </p>
          </div>
          <div className="glass-surface rounded-2xl p-6">
            <div className="text-3xl mb-2">🌾</div>
            <h3 className="font-semibold text-slate-900">Soil Type</h3>
            <p className="text-lg text-slate-700 mt-2 capitalize">
              {farmerData?.soilType || 'N/A'}
            </p>
          </div>
        </div>

        {/* Get Recommendation Button */}
        <div className="mb-8">
          <button
            onClick={handleGenerateRecommendation}
            disabled={recommendationLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {recommendationLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Calculating Recommendation...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Get AI Recommendation</span>
              </>
            )}
          </button>
        </div>

        {/* AI Chatbot Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/ai-chat')}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>🤖</span>
            <span>Chat with AI Assistant</span>
          </button>
        </div>

        {/* Current Recommendation */}
        {recommendation && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Current Recommendation
            </h2>
            <RecommendationCard recommendation={recommendation} farmer={farmerData} />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PriceBarChart data={priceData} />
          <RiskPieChart data={riskData} />
        </div>

        <div className="mb-8">
          <ConfidenceLineChart data={confidenceData} />
        </div>

        {/* Direct Chat with Buyers */}
        <div className="mb-8">
          <FarmerChat />
        </div>

        {/* Recommendation History */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            My Recommendation History
          </h2>
          <RecommendationHistory 
            history={history} 
            filters={historyFilters}
            onFilterChange={setHistoryFilters}
          />
        </div>
      </div>

      <EditProfileModal
        farmer={farmerData}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleAdjustRecommendation}
        loading={profileEditLoading}
      />
    </DashboardLayout>
  );
};

export default FarmerDashboard;
