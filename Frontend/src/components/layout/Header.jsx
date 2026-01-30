import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <header className="relative z-40 backdrop-blur-sm bg-white/90 border-b border-emerald-100/50">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between px-2 py-3 sm:py-4">
          
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white group-hover:scale-105 transition-transform">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-emerald-600">CropPulse</p>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">AI Agriculture Command Center</h1>
            </div>
          </div>

          {/* Center Section - Live Insights */}
          <div className="hidden text-center sm:block">
            <p className="text-xs font-semibold text-emerald-600">LIVE INSIGHTS</p>
            <p className="text-sm font-medium text-slate-700">{formatTime(currentTime)}</p>
          </div>

          {/* Right Section - User Profile */}
          <div className="flex items-center space-x-3">
            {user && (
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500">Welcome</p>
                <p className="text-sm font-medium text-slate-800 truncate max-w-[150px]">{user.name || 'User'}</p>
              </div>
            )}
            
            {/* Notification Bell */}
            {user && <NotificationBell />}
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white hover:scale-105 transition-transform"
                title="Profile Menu"
              >
                👤
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-emerald-100 overflow-hidden animate-in fade-in-50 duration-200">
                  <div className="px-4 py-3 border-b border-emerald-100">
                    <p className="text-sm font-semibold text-slate-700">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500">{user?.email || 'user@email.com'}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/ai-chat');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 transition-colors"
                    >
                      🤖 AI Assistant
                    </button>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 transition-colors"
                    >
                      📋 Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate('/history');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 transition-colors"
                    >
                      📊 History
                    </button>
                    <button
                      onClick={() => {
                        navigate('/help');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 transition-colors"
                    >
                      ❓ Help
                    </button>
                  </div>
                  <div className="border-t border-emerald-100 py-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
