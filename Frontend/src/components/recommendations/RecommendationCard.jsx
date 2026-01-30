import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import { api } from '../../services/api';

const RecommendationCard = ({ recommendation, farmer }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendEmail = async () => {
    if (!recommendation?.id) {
      setErrorMessage('Recommendation ID not found');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.sendRecommendationEmail(recommendation.id);
      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setErrorMessage(response.message || 'Failed to send email');
      }
    } catch (error) {
      setErrorMessage('Error sending recommendation email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!recommendation) {
    return (
      <div className="glass-surface rounded-2xl p-7 sm:p-9 text-center animate-fade-in-up hover:shadow-lg transition-all duration-300">
        <div className="text-emerald-500 mb-5 animate-bounce-soft">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm sm:text-base">No recommendations available yet. Please check back later.</p>
      </div>
    );
  }

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="glass-surface rounded-2xl p-5 sm:p-7 lg:p-8 animate-fade-in-up hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 border-2 border-transparent hover:border-emerald-300/50 card-hover">
      <div className="mb-4 sm:mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-900 to-cyan-900 bg-clip-text text-transparent mb-1">
            ✨ AI Recommendation
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            {farmer ? `For ${farmer.name} · ${farmer.state}` : 'Latest Recommendation'}
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 border border-emerald-300 animate-pulse shadow-lg shadow-emerald-200/50">
          🔴 Live
        </span>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Recommended Crop Card */}
        <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-4 sm:p-5 hover:border-emerald-300 hover:from-emerald-500/25 transition-all duration-300 group">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/90 to-emerald-100/80 flex items-center justify-center text-2xl group-hover:animate-float">🌿</div>
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Recommended Crop</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent leading-snug">{recommendation.recommendedCrop}</p>
            </div>
          </div>
          <div className="soft-divider" />
          <p className="mt-3 text-sm text-emerald-800 font-medium">✓ Optimized for soil, region, and current market signals.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Expected Price Card */}
          <div className="rounded-xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 p-4 sm:p-5 hover:border-cyan-300 hover:from-cyan-500/25 transition-all duration-300 group">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg sm:text-xl group-hover:animate-float">💰</span>
              <h4 className="text-xs sm:text-sm font-bold text-cyan-800">Expected Price</h4>
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              ₹{recommendation.expectedPrice?.toFixed(2) || 'N/A'}
            </p>
            <p className="text-[10px] sm:text-xs text-cyan-800/80 mt-1 font-medium">per quintal</p>
          </div>

          {/* Risk Level Card */}
          <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white/80 to-slate-50/80 p-4 sm:p-5 hover:border-slate-300 transition-all duration-300 group">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg sm:text-xl group-hover:animate-float">⚠️</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-700">Risk Level</h4>
            </div>
            <div className="mt-2">
              <StatusBadge level={recommendation.riskLevel} />
            </div>
          </div>
        </div>

        {/* Confidence Score Card */}
        <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 p-4 sm:p-5 hover:border-emerald-300 hover:from-emerald-500/25 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl group-hover:animate-float">📊</span>
              <h4 className="text-xs sm:text-sm font-bold text-emerald-800">Confidence Score</h4>
            </div>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              {((recommendation.confidenceScore || 0) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden border border-emerald-200/50">
            <div 
              className="aqua-gradient h-3 rounded-full transition-all duration-700 ease-out shadow-lg shadow-emerald-500/50"
              style={{ width: `${(recommendation.confidenceScore || 0) * 100}%` }}
            />
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-medium">High confidence in this prediction</p>
        </div>

        {/* Success/Error Messages */}
        {showSuccess && (
          <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4 animate-fade-in-up">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-semibold text-emerald-700">Recommendation sent successfully! Check your email.</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border-2 border-rose-400 bg-rose-50 p-4 animate-fade-in-up">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">❌</span>
              <p className="text-sm font-semibold text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Send Email Button */}
        <button
          onClick={handleSendEmail}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>📧</span>
              <span>Send Recommendation via Email</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
