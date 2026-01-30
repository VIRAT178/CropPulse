import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import AIChatbot from '../components/common/AIChatbot';

const AIChatPage = () => {
  const { user } = useContext(AuthContext);
  const userRole = user?.role?.toLowerCase() === 'buyer' ? 'buyer' : 'farmer';

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              AI Farm Assistant
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Get instant answers to your farming questions from our AI-powered assistant
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-surface rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🌾</div>
              <h3 className="font-semibold text-slate-900 mb-1 text-base">Crop Advice</h3>
              <p className="text-xs text-slate-600">
                Get expert recommendations on crop selection and management
              </p>
            </div>
            <div className="glass-surface rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🐛</div>
              <h3 className="font-semibold text-slate-900 mb-1 text-base">Pest Control</h3>
              <p className="text-xs text-slate-600">
                Learn about pest management and disease prevention strategies
              </p>
            </div>
            <div className="glass-surface rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">💧</div>
              <h3 className="font-semibold text-slate-900 mb-1 text-base">Irrigation Tips</h3>
              <p className="text-xs text-slate-600">
                Get guidance on optimal watering schedules and techniques
              </p>
            </div>
          </div>

          {/* Chat Area - Full Width with Proper Height */}
          <div className="w-full mb-6">
            <div className="glass-surface rounded-2xl shadow-xl w-full overflow-hidden" style={{ height: '500px' }}>
              <AIChatbot userRole={userRole} />
            </div>
          </div>

          {/* Footer Tips */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <h3 className="font-semibold text-emerald-900 mb-2 text-base">💡 Tips for best results:</h3>
            <ul className="text-emerald-800 space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <span>Ask specific questions about your crops or situation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <span>Provide context like location, climate, and current crop status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <span>Ask follow-up questions if you need more details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <span>For urgent issues, also consult with local agricultural experts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIChatPage;
