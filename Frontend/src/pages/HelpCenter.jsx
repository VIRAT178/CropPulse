import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';

const HelpCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const faqs = [
    {
      category: 'Getting Started',
      items: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Get Started" on the landing page, select your role (Farmer or Buyer), fill in your details, and complete the registration. You\'ll receive a confirmation email.'
        },
        {
          q: 'What is the difference between Farmer and Buyer accounts?',
          a: 'Farmers can get AI crop recommendations and market insights. Buyers can discover farmers, check crop availability, and analyze market trends.'
        },
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your email to reset your password.'
        }
      ]
    },
    {
      category: 'Farmer Features',
      items: [
        {
          q: 'How do AI recommendations work?',
          a: 'Our AI analyzes your soil type, location, land size, and current market trends to provide personalized crop recommendations with expected prices and risk assessment.'
        },
        {
          q: 'Can I adjust my profile information?',
          a: 'Yes, you can visit your Profile page from the dashboard to update your personal information, farm details, soil type, and land size.'
        },
        {
          q: 'What is the recommendation history?',
          a: 'Your recommendation history shows all previous AI recommendations you\'ve generated, allowing you to track trends and compare suggestions over time.'
        }
      ]
    },
    {
      category: 'Data & Privacy',
      items: [
        {
          q: 'Is my data secure?',
          a: 'Yes, we use industry-standard encryption and security protocols to protect your personal and farm data. See our Privacy Policy for details.'
        },
        {
          q: 'Who can see my farm information?',
          a: 'Your farm data is private. Buyers can only see your name and village if you establish a connection. Your email and full details remain confidential.'
        }
      ]
    }
  ];

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
            Help Center
          </h1>
          <p className="text-slate-600 mt-2">Find answers to your questions about CropPulse</p>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-12">
          {faqs.map((section, idx) => (
            <section key={idx} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded" />
                <h2 className="text-2xl font-bold text-slate-900">{section.category}</h2>
              </div>

              <div className="grid gap-4">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="glass-surface rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">❓ {item.q}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">Didn't find an answer?</h2>
            <p className="text-emerald-50 mb-6">
              Our support team is here to help. Contact us for personalized assistance.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Contact Support
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
