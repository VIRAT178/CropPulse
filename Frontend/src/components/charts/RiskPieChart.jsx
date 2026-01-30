import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  Low: '#22c55e',
  Medium: '#eab308',
  High: '#ef4444'
};

const RiskPieChart = ({ data = [] }) => {
  // Data is already in array format from backend, filter out zero values
  const chartData = Array.isArray(data) ? data.filter(item => item.value > 0) : [];

  if (!chartData || chartData.length === 0) {
    return (
      <div className="glass-surface rounded-2xl p-6 h-80 flex items-center justify-center">
        <p className="text-slate-400">No risk data available</p>
      </div>
    );
  }

  return (
    <div className="glass-surface rounded-2xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
        <span className="text-emerald-700">🎯</span>
        <span>Risk Distribution</span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} recommendations`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


export default RiskPieChart;
