import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.loginUser({ email, password });
      login(data.email, data.role, data.token, data.name, data.id);
      navigate(`/${data.role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setEmail(role === 'farmer' ? 'farmer@example.com' : 'buyer@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-16">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center space-x-3 group cursor-pointer mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 text-white shadow-xl shadow-emerald-200/50 group-hover:shadow-2xl group-hover:shadow-emerald-300/70 transition-all duration-300 group-hover:scale-110">
              <span className="text-3xl">🌱</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">CropPulse</p>
              <p className="text-sm font-semibold text-slate-600">AI Agriculture</p>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-sm">Sign in to access your agricultural insights</p>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl shadow-2xl shadow-emerald-100/50 p-8 animate-fade-in-up">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in shake duration-300">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-semibold text-red-900 text-sm">{error}</p>
                  <p className="text-xs text-red-700 mt-1">Please check your credentials and try again</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  📧
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900 placeholder-slate-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  🔐
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 cursor-pointer" />
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center space-x-2 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-slate-500 font-semibold">Demo Logins</span>
            </div>
          </div>

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('farmer')}
              className="py-2.5 px-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-700 font-semibold hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:scale-105 text-sm"
            >
              👨‍🌾 Farmer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('buyer')}
              className="py-2.5 px-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-700 font-semibold hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-105 text-sm"
            >
              🏪 Buyer
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-600 text-sm mt-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            New to CropPulse?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex justify-center space-x-4 text-xs text-slate-500 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center space-x-1">
            <span>🔒</span>
            <span>Secure</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <span>✅</span>
            <span>Verified</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <span>⚡</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
