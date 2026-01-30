import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-blue-50">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => {
              if (user) {
                navigate('/dashboard', { replace: true });
              } else {
                navigate('/', { replace: true });
              }
            }}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-600 mt-2">Last updated: January 25, 2026</p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none space-y-8">
          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              CropPulse ("Company," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform, including any related applications, and any other media form, media channels, mobile website, or mobile application related or connected thereto (collectively, the "Platform").
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Farm details including location, soil type, and land size</li>
                  <li>Account credentials and authentication information</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Usage Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pages viewed and features accessed</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Recommendation history and interactions</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Provide personalized crop recommendations and market insights</li>
              <li>Improve and optimize our services</li>
              <li>Send promotional communications and updates</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement industry-standard security measures including encryption, secure authentication protocols, and regular security audits to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Sharing Your Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share limited information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Service providers assisting in platform operations</li>
              <li>Other users when you establish connections (limited information only)</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              We use cookies to enhance your experience, remember preferences, and analyze platform usage. You can control cookie settings through your browser.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="text-slate-600">
              <p>Email: privacy@croppulse.com</p>
              <p>Address: Agricultural Innovation Hub, Madhya Pradesh, India</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
