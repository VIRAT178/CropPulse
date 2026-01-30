import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Enhanced Background with animated gradient orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50" />
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Header with enhanced glassmorphism */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'backdrop-blur-xl bg-white/80 shadow-lg shadow-emerald-100/50' : 'backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/60 group-hover:shadow-xl group-hover:shadow-emerald-300/80 transition-all duration-300">
                <span className="text-2xl animate-float">🌾</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">CropPulse</p>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">AgriTech Platform</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 rounded-lg text-emerald-700 border-2 border-emerald-500 hover:bg-emerald-50 hover:border-emerald-600 font-semibold text-sm sm:text-base transition-all duration-300 btn-hover-lift hidden sm:inline-block"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold text-sm sm:text-base transition-all duration-300 btn-hover-lift shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center mb-14 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-emerald-200/50 mb-6 animate-fade-in-down">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-emerald-700">AI-Powered Agriculture</span>
          </div>

          {/* Main heading with gradient */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 animate-fade-in-up stagger-1">
            <span className="block text-slate-900 mb-3">Intelligent Agriculture</span>
            <span className="block bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-text-gradient">for Smart Farmers</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
            AI-powered crop recommendations, market predictions, and risk analysis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
            <button
              onClick={() => navigate('/register?role=FARMER')}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold text-lg shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 btn-hover-lift flex items-center justify-center gap-2"
            >
              <span>🌱</span> Start as Farmer
            </button>
            <button
              onClick={() => navigate('/register?role=BUYER')}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 btn-hover-lift flex items-center justify-center gap-2"
            >
              <span>🏪</span> Join as Buyer
            </button>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-6 sm:gap-8 mt-14 animate-fade-in-up stagger-4">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">500+</div>
            <div className="text-sm sm:text-base text-slate-600 mt-2">Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">98%</div>
            <div className="text-sm sm:text-base text-slate-600 mt-2">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">50K+</div>
            <div className="text-sm sm:text-base text-slate-600 mt-2">Predictions</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
              Features Designed for You
            </h3>
            <p className="text-lg text-slate-600">Choose your role and unlock AI-driven insights</p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Farmer Card */}
            <div className="group relative glass-surface rounded-2xl p-8 sm:p-10 card-hover border-2 border-transparent hover:border-emerald-300/50 animate-fade-in-left stagger-1">
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Icon with animation */}
                <div className="text-6xl mb-5 inline-block group-hover:animate-float">👨‍🌾</div>

                <h4 className="text-3xl font-bold text-slate-900 mb-4">For Farmers</h4>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  AI recommendations for crop selection, pricing, and risk assessment.
                </p>

                {/* Features List with staggered animation */}
                <ul className="space-y-3 mb-8">
                  {[
                    'Smart crop recommendations',
                    'Real-time price predictions',
                    'Risk analysis & management',
                    'History tracking & insights'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 group-hover:text-emerald-700 transition-colors duration-300">
                      <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/register?role=FARMER')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 font-semibold text-base transition-all duration-300 btn-hover-lift shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                >
                  Register as Farmer
                </button>
              </div>
            </div>

            {/* Buyer Card */}
            <div className="group relative glass-surface rounded-2xl p-8 sm:p-10 card-hover border-2 border-transparent hover:border-cyan-300/50 animate-fade-in-right stagger-1">
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Icon with animation */}
                <div className="text-6xl mb-5 inline-block group-hover:animate-float">🏪</div>

                <h4 className="text-3xl font-bold text-slate-900 mb-4">For Buyers</h4>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Discover farmers, source crops, and access real-time market insights.
                </p>

                {/* Features List with staggered animation */}
                <ul className="space-y-3 mb-8">
                  {[
                    'Farmer directory & profiles',
                    'Real-time crop availability',
                    'Market trends & analytics',
                    'Direct farmer connections'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 group-hover:text-cyan-700 transition-colors duration-300">
                      <span className="text-cyan-500 font-bold text-xl mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/register?role=BUYER')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-semibold text-base transition-all duration-300 btn-hover-lift shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  Register as Buyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Add blob animation styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
