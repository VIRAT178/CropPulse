import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'FARMER';

  const [role, setRole] = useState(roleParam);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [state, setState] = useState('');
  const [landSize, setLandSize] = useState('');
  const [village, setVillage] = useState('');
  const [soilType, setSoilType] = useState('');
  const [company, setCompany] = useState('');
  const [interestedCrops, setInterestedCrops] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    const payload = {
      name,
      email,
      password,
      mobile,
      state,
      role,
      ...(role === 'FARMER' && { landSize: parseFloat(landSize) || null, village, soilType }),
      ...(role === 'BUYER' && { company, interestedCrops }),
    };

    try {
      const data = await api.registerUser(payload);
      login(data.email, data.role, data.token, data.name, data.id);
      navigate(`/${data.role.toLowerCase()}/dashboard`);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = name && email && password && confirmPassword && password === confirmPassword;
  const isStep2Valid = mobile && state && (role === 'FARMER' ? (landSize && village && soilType) : (company || interestedCrops));

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength];
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
            Join CropPulse
          </h1>
          <p className="text-slate-600 text-sm">Start your AI-powered agricultural journey</p>
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
                </div>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole('FARMER');
                  setCompany('');
                  setInterestedCrops('');
                }}
                className={`relative py-4 px-4 rounded-xl font-semibold text-sm transition-all duration-300 border-2 overflow-hidden group ${
                  role === 'FARMER'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-emerald-500 shadow-lg shadow-emerald-200/50'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <span className="text-2xl">👨‍🌾</span>
                  <span>Farmer</span>
                </div>
                {role === 'FARMER' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('BUYER');
                  setLandSize('');
                }}
                className={`relative py-4 px-4 rounded-xl font-semibold text-sm transition-all duration-300 border-2 overflow-hidden group ${
                  role === 'BUYER'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500 shadow-lg shadow-blue-200/50'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <span className="text-2xl">🏪</span>
                  <span>Buyer</span>
                </div>
                {role === 'BUYER' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">STEP {currentStep} OF 2</span>
              <div className="flex space-x-2">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      step <= currentStep ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1 - Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in-right">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-105' : ''}`}>
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'name' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      👤
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
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
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
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
                      className="w-full pl-12 pr-12 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
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
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-600">Strength:</span>
                        <span className={`text-xs font-bold ${
                          passwordStrength === 4 ? 'text-green-600' :
                          passwordStrength === 3 ? 'text-blue-600' :
                          passwordStrength === 2 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength + 1) * 25}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-105' : ''}`}>
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      ✓
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">❌ Passwords do not match</p>
                  )}
                  {password && confirmPassword && password === confirmPassword && (
                    <p className="text-xs text-green-500 mt-1">✓ Passwords match</p>
                  )}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStep1Valid}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center space-x-2 mt-6"
                >
                  <span>Next Step</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {/* Step 2 - Role-Specific Info */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in-right">
                {/* Mobile */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Mobile Number</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'mobile' ? 'scale-105' : ''}`}>
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'mobile' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      📱
                    </div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      onFocus={() => setFocusedField('mobile')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">State</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'state' ? 'scale-105' : ''}`}>
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'state' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      📍
                    </div>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      onFocus={() => setFocusedField('state')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                      placeholder="e.g., Maharashtra"
                      required
                    />
                  </div>
                </div>

                {/* Farmer Specific */}
                {role === 'FARMER' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Land Size (acres)</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'landSize' ? 'scale-105' : ''}`}>
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'landSize' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          🌾
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={landSize}
                          onChange={(e) => setLandSize(e.target.value)}
                          onFocus={() => setFocusedField('landSize')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                          placeholder="e.g., 5.5"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Village</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'village' ? 'scale-105' : ''}`}>
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'village' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          🏘️
                        </div>
                        <input
                          type="text"
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          onFocus={() => setFocusedField('village')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                          placeholder="e.g., Nashik"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Soil Type</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'soilType' ? 'scale-105' : ''}`}>
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'soilType' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          🪨
                        </div>
                        <select
                          value={soilType}
                          onChange={(e) => setSoilType(e.target.value)}
                          onFocus={() => setFocusedField('soilType')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                          required
                        >
                          <option value="">Select Soil Type</option>
                          <option value="black">Black</option>
                          <option value="red">Red</option>
                          <option value="alluvial">Alluvial</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Buyer Specific */}
                {role === 'BUYER' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Company / Mandi</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'company' ? 'scale-105' : ''}`}>
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'company' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          🏢
                        </div>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          onFocus={() => setFocusedField('company')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Interested Crops</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'crops' ? 'scale-105' : ''}`}>
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'crops' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          🥕
                        </div>
                        <input
                          type="text"
                          value={interestedCrops}
                          onChange={(e) => setInterestedCrops(e.target.value)}
                          onFocus={() => setFocusedField('crops')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-slate-900"
                          placeholder="e.g., Wheat, Rice, Corn"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isStep2Valid}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-600 text-sm mt-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors hover:underline"
            >
              Sign in here
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
            <span>⚡</span>
            <span>Fast</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <span>✅</span>
            <span>Easy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
