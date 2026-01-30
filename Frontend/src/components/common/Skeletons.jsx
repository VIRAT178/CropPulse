import React from 'react';

export const SkeletonFarmerCard = () => (
  <div className="glass-surface rounded-xl p-4 lg:p-5 border border-white/80">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-full skeleton" />
      <div className="flex-1">
        <div className="skeleton skeleton-text w-2/3 mb-2" />
        <div className="skeleton skeleton-text w-1/3" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="skeleton skeleton-text w-full" />
      <div className="skeleton skeleton-text w-5/6" />
    </div>
    <div className="skeleton h-9 rounded-lg mt-4" />
  </div>
);

export const SkeletonRecommendationCard = () => (
  <div className="glass-surface rounded-2xl p-5 sm:p-7 lg:p-8">
    <div className="skeleton h-6 w-48 mb-4 rounded" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="skeleton h-24 rounded-xl" />
      <div className="skeleton h-24 rounded-xl" />
    </div>
    <div className="skeleton h-20 rounded-xl mt-4" />
  </div>
);
