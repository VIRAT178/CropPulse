import React from 'react';

const FarmerCard = ({ farmer, onViewRecommendation, isSelected }) => {
  return (
    <div 
      className={`glass-surface rounded-xl hover:-translate-y-1 transition-all duration-300 p-4 lg:p-5 border ${
        isSelected ? 'border-emerald-500/70 shadow-lg shadow-emerald-100/60' : 'border-white/80'
      }`}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-500/15 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl sm:text-2xl">👨‍🌾</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{farmer.name}</h3>
            <p className="text-xs sm:text-sm text-slate-500 truncate">{farmer.state}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-600">Land Size</span>
          <span className="font-semibold text-slate-900">{farmer.landSize} acres</span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-600">Soil Type</span>
          <span className="font-semibold text-slate-900 truncate ml-2">{farmer.soilType}</span>
        </div>
      </div>

      <button
        onClick={() => onViewRecommendation(farmer)}
        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md shadow-emerald-200/70"
      >
        View Recommendation
      </button>
    </div>
  );
};

export default FarmerCard;
