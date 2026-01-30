import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (status) {
      const t = setTimeout(() => setStatus(''), 5000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setStatus('If an account exists, an email has been sent.');
    } catch (err) {
      setStatus('If an account exists, an email has been sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Forgot Password</h1>
          <p className="text-slate-600 text-sm">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white/80 border border-white/60 rounded-3xl shadow-xl p-8">
          {status && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">✉️</span>
                <p className="font-semibold text-emerald-800 text-sm">{status}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className={`relative transition-all ${focusedField === 'email' ? 'scale-105' : ''}`}>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}>📧</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900 placeholder-slate-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-slate-600 text-sm mt-6">
            Remembered your password?{' '}
            <button onClick={() => navigate('/login')} className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
