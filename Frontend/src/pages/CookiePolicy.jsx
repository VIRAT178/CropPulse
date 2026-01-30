import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const CookiePolicy = () => {
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
            Cookie Policy
          </h1>
          <p className="text-slate-600 mt-2">Last updated: January 25, 2026</p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none space-y-8">
          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-slate-600 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit and can improve your browsing experience.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Types of Cookies We Use</h2>
            <div className="space-y-4 text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Essential Cookies:</h3>
                <p>
                  These cookies are necessary for the platform to function properly. They enable you to navigate the site and use essential features like authentication.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Analytics Cookies:</h3>
                <p>
                  We use these to understand how you use our platform, which pages you visit, and how long you stay. This helps us improve our services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Preference Cookies:</h3>
                <p>
                  These remember your preferences and choices (like language, theme, and login information) to enhance your experience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Marketing Cookies:</h3>
                <p>
                  We use these to deliver relevant advertisements and track the effectiveness of our marketing campaigns.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Third-Party Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              Some cookies may be placed by third-party services we use, including analytics providers and advertising partners. These third parties may use cookies to track your activity across different websites.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. How to Control Cookies</h2>
            <div className="space-y-4 text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Browser Settings:</h3>
                <p>
                  Most web browsers allow you to control cookies through their settings. You can choose to accept, reject, or delete cookies.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Opt-Out Options:</h3>
                <p>
                  You can opt out of specific cookies while still accessing our platform. Some functionality may be limited if you disable certain cookies.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Consent Management:</h3>
                <p>
                  When you first visit our platform, we ask for your consent to use non-essential cookies. You can manage your preferences at any time.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cookies Retention</h2>
            <p className="text-slate-600 leading-relaxed">
              Cookies may remain on your device for different periods. Essential and preference cookies may persist longer, while analytics and marketing cookies typically have shorter expiration periods.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Impact of Disabling Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you disable cookies, some features of our platform may not work properly. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>You may not be able to stay logged in</li>
              <li>Your preferences may not be saved</li>
              <li>Some interactive features may not function correctly</li>
              <li>Analytics data collection may be affected</li>
            </ul>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Updates to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us at:
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

export default CookiePolicy;
