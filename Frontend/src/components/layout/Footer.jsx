import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscribeMessage('Please enter your email');
      return;
    }

    setSubscribeLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribeMessage('✓ Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setSubscribeMessage(''), 3000);
    } catch (error) {
      setSubscribeMessage('Failed to subscribe. Please try again.');
    } finally {
      setSubscribeLoading(false);
    }
  };

  const quickLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Market Trends', path: '/market-trends' },
    { label: 'Recommendations', path: '/recommendations' },
    { label: 'Crop Availability', path: '/crops' },
  ];

  const supportLinks = [
    { label: 'Help Center', path: '/help' },
    { label: 'Documentation', path: '/docs' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', url: '#' },
    { name: 'Facebook', icon: 'f', url: '#' },
    { name: 'LinkedIn', icon: 'in', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-300 border-t border-slate-700/50 mt-8">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -left-32 top-0 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            
            {/* Brand Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
                  <span className="text-base">🌱</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">CropPulse</p>
                  <p className="text-xs text-slate-400">AI Agricultural</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering farmers with AI-driven insights for better crop management and market decisions.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-2 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    title={social.name}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/50 text-slate-300 hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-200"
                  >
                    <span className="text-xs font-semibold">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-1">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleNavigate(link.path)}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      → {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Support</h3>
              <ul className="space-y-1">
                {supportLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleNavigate(link.path)}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      → {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Legal</h3>
              <ul className="space-y-1">
                {legalLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleNavigate(link.path)}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      → {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Subscribe */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Newsletter</h3>
              <p className="text-xs text-slate-400">
                Get the latest insights and updates delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 border border-slate-600/50 focus:border-emerald-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={subscribeLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50"
                >
                  {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {subscribeMessage && (
                <p className={`text-xs ${subscribeMessage.includes('Thank') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {subscribeMessage}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-slate-700/50" />

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-slate-400">
              © {currentYear} CropPulse. All rights reserved.
            </p>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-4 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Status: Operational</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <button 
                onClick={() => navigate('/status')}
                className="hover:text-emerald-400 transition-colors"
              >
                View Status Page →
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
