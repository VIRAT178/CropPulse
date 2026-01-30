import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PriceBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-surface rounded-2xl p-6 h-80 flex items-center justify-center">
        <p className="text-slate-400">No price data available</p>
      </div>
    );
  }

  return (
    <div className="glass-surface rounded-2xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
        <span className="text-emerald-700">📊</span>
        <span>Expected Prices by Crop</span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis 
            dataKey="crop" 
            tick={{ fill: '#0f172a', fontSize: 12 }}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fill: '#0f172a', fontSize: 12 }}
            label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}
            formatter={(value) => [`₹${value}`, 'Price']}
          />
          <Legend />
          <Bar 
            dataKey="price" 
            fill="#23c28c" 
            radius={[8, 8, 0, 0]}
            name="Expected Price (₹)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceBarChart;
