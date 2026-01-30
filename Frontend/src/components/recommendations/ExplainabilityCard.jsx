import React, { useMemo } from 'react';

const ExplainabilityCard = ({ farmer, recommendation, history = [] }) => {
  const reasons = useMemo(() => {
    if (!farmer || !recommendation) return [];
    const items = [];

    const crop = recommendation.recommendedCrop || '';
    const soil = farmer.soilType || '';
    const price = recommendation.expectedPrice ?? 0;
    const risk = (recommendation.riskLevel || '').toLowerCase();
    const conf = Math.round(((recommendation.confidenceScore || 0) * 100));

    items.push(`Soil type ${soil} aligns well with ${crop}.`);

    if (price >= 5000) {
      items.push('Favorable market price expected this season.');
    } else if (price > 0) {
      items.push('Moderate price outlook; optimize input costs.');
    }

    if (risk === 'low') {
      items.push('Low market volatility signals a safer decision.');
    } else if (risk === 'medium') {
      items.push('Some variability observed; proceed with caution.');
    } else if (risk === 'high') {
      items.push('High volatility detected; consider hedging strategies.');
    }

    if (conf >= 80) {
      items.push('High model confidence supports this choice.');
    } else if (conf >= 60) {
      items.push('Moderate confidence; validate with local conditions.');
    }

    const recentSameCrop = history
      .filter(h => (h.recommendedCrop || '') === crop && typeof h.expectedPrice === 'number')
      .slice(-3);
    if (recentSameCrop.length >= 2) {
      const vals = recentSameCrop.map(h => h.expectedPrice);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
      const std = Math.sqrt(variance);
      if (std <= 500) {
        items.push('Historical prices stable in last 3 recommendations.');
      } else {
        items.push('Recent price variation observed; monitor market closely.');
      }
    }

    return items;
  }, [farmer, recommendation, history]);

  if (!farmer || !recommendation) {
    return null;
  }

  return (
    <div className="glass-surface rounded-2xl p-5 sm:p-6">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-emerald-700">🧠</span>
        <h3 className="text-lg font-semibold text-slate-900">Why this recommendation?</h3>
      </div>
      <ul className="space-y-2">
        {reasons.map((r, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span className="text-sm text-slate-800">{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExplainabilityCard;
