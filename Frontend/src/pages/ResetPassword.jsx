import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('token') || '';
    setToken(t);
  }, [location.search]);

  useEffect(() => {
    if (status || error) {
      const t = setTimeout(() => { setStatus(''); setError(''); }, 5000);
      return () => clearTimeout(t);
    }
  }, [status, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(token, newPassword);
      setStatus('Password updated successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to reset password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Reset Password</h1>
          <p className="text-slate-600 text-sm">Enter a new password to secure your account</p>
        </div>

        <div className="bg-white/80 border border-white/60 rounded-3xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">❌</span>
                <p className="font-semibold text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {status && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">✅</span>
                <p className="font-semibold text-emerald-800 text-sm">{status}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">New Password</label>
              <div className={`relative transition-all ${focusedField === 'new' ? 'scale-105' : ''}`}>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${focusedField === 'new' ? 'text-emerald-500' : 'text-slate-400'}`}>🔐</div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => setFocusedField('new')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className={`relative transition-all ${focusedField === 'confirm' ? 'scale-105' : ''}`}>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${focusedField === 'confirm' ? 'text-emerald-500' : 'text-slate-400'}`}>🔒</div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <p className="text-center text-slate-600 text-sm mt-6">
            Return to{' '}
            <button onClick={() => navigate('/login')} className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
