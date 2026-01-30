import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './components/layout/DashboardLayout';
import FarmerCard from './components/farmers/FarmerCard';
import RecommendationCard from './components/recommendations/RecommendationCard';
import PriceBarChart from './components/charts/PriceBarChart';
import RiskPieChart from './components/charts/RiskPieChart';
import ConfidenceLineChart from './components/charts/ConfidenceLineChart';
import { api } from './services/api';
import { SkeletonFarmerCard, SkeletonRecommendationCard } from './components/common/Skeletons';
import RecommendationHistory from './components/recommendations/RecommendationHistory';
import ExplainabilityCard from './components/recommendations/ExplainabilityCard';

function App() {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current'); // 'current' | 'history'
    const [historyFilters, setHistoryFilters] = useState({ dateFrom: null, dateTo: null, crop: '' });
  const [priceChartData, setPriceChartData] = useState([]);
  const [riskChartData, setRiskChartData] = useState([]);
  const [confidenceChartData, setConfidenceChartData] = useState([]);

  // Fetch farmers on component mount
  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const data = await api.getFarmers();
      setFarmers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch farmers. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecommendation = async (farmer) => {
    try {
      setSelectedFarmer(farmer);
      setRecommendationLoading(true);
      const data = await api.getRecommendation(farmer.id);
      setRecommendation(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recommendation. Please try again.');
      setRecommendation(null);
    } finally {
      setRecommendationLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedFarmer?.id) {
        setHistory([]);
        return;
      }
      try {
        setHistoryLoading(true);
        const data = await api.getFarmerHistory(selectedFarmer.id);
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [selectedFarmer]);

  // Fetch chart data from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [prices, risk, confidence] = await Promise.all([
          api.getPriceChartData(10),
          api.getRiskDistribution(),
          api.getConfidenceTrend(6)
        ]);
        setPriceChartData(prices || []);
        setRiskChartData(risk || []);
        setConfidenceChartData(confidence || []);
      } catch (err) {
        // Non-blocking: keep UI usable even if analytics fail
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <DashboardLayout>
      {error && (
        <div className="glass-surface border border-red-200/70 text-red-700 px-4 py-3 rounded-xl mb-6">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="glass-surface rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                  <span>👥</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Farmers</h2>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">Live</span>
            </div>

            {loading ? (
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonFarmerCard key={i} />
                ))}
              </div>
            ) : farmers.length === 0 ? (
              <div className="text-center py-10 text-slate-500">No farmers found</div>
            ) : (
              <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[520px] lg:max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
                {farmers.map(farmer => (
                  <FarmerCard
                    key={farmer.id}
                    farmer={farmer}
                    onViewRecommendation={handleViewRecommendation}
                    isSelected={selectedFarmer?.id === farmer.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-surface rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${activeTab === 'current' ? 'bg-emerald-500 text-white' : 'bg-white/70 text-slate-800'}`}
                onClick={() => setActiveTab('current')}
              >Current Recommendation</button>
              <button
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${activeTab === 'history' ? 'bg-emerald-500 text-white' : 'bg-white/70 text-slate-800'}`}
                onClick={() => setActiveTab('history')}
              >Recommendation History</button>
            </div>
          </div>

          {activeTab === 'current' ? (
            recommendationLoading ? (
              <SkeletonRecommendationCard />
            ) : (
              <RecommendationCard 
                recommendation={recommendation} 
                farmer={selectedFarmer}
              />
            )
          ) : (
            <RecommendationHistory 
              history={history}
              loading={historyLoading}
              filters={historyFilters}
              onFilterChange={setHistoryFilters}
            />
          )}

          {activeTab === 'current' && recommendation && selectedFarmer && (
            <ExplainabilityCard 
              farmer={selectedFarmer}
              recommendation={recommendation}
              history={history}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <PriceBarChart data={priceChartData} />
            </div>
            <div className="w-full">
              <RiskPieChart data={riskChartData} />
            </div>
            <div className="w-full">
              <ConfidenceLineChart data={confidenceChartData} />
            </div>
          </div>
        </div>
      </div>
      </DashboardLayout>
    </>
  );
}

export default App;
