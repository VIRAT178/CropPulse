import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ConfidenceLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-surface rounded-2xl p-6 flex items-center justify-center">
        <p className="text-slate-400">No confidence data available</p>
      </div>
    );
  }

  return (
    <div className="glass-surface rounded-2xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
        <span className="text-emerald-700">📈</span>
        <span>Confidence Score Trend</span>
      </h3>
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#0f172a', fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: '#0f172a', fontSize: 12 }}
            domain={[0, 100]}
            label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}
            formatter={(value) => [`${value}%`, 'Confidence']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="confidence" 
            stroke="#23c28c" 
            strokeWidth={3}
            dot={{ fill: '#23c28c', r: 5 }}
            activeDot={{ r: 7 }}
            name="Confidence Score (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConfidenceLineChart;
