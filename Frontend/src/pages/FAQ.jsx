import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const FAQ = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqData = [
    {
      category: 'Account & Authentication',
      items: [
        {
          q: 'How do I create an account on CropPulse?',
          a: 'Click "Get Started" on our home page, select your role (Farmer or Buyer), enter your details, and verify your email address. Your account will be activated immediately.'
        },
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page, enter your email address, and follow the reset instructions sent to your inbox.'
        },
        {
          q: 'Can I change my role after registration?',
          a: 'Currently, roles are fixed at registration. Please contact support if you need to change your account type.'
        },
        {
          q: 'Is my personal data secure?',
          a: 'Yes, we use encryption and follow industry best practices to protect your data. See our Privacy Policy for more details.'
        }
      ]
    },
    {
      category: 'Farmer Features',
      items: [
        {
          q: 'How do AI crop recommendations work?',
          a: 'Our AI model analyzes your soil type, location, farm size, and current market data to suggest the most profitable and sustainable crop choices.'
        },
        {
          q: 'Can I modify my farm details after registration?',
          a: 'Yes, visit your Profile page and click "Edit Profile" to update your farm information. Changes help improve future recommendations.'
        },
        {
          q: 'What information do I need to provide for recommendations?',
          a: 'You need to provide your state, village, soil type, and land size. The more accurate this information, the better your recommendations.'
        },
        {
          q: 'How often should I generate new recommendations?',
          a: 'Generate recommendations seasonally or when market conditions change. Each recommendation is based on current data and trends.'
        }
      ]
    },
    {
      category: 'Buyer Features',
      items: [
        {
          q: 'How do I find farmers to connect with?',
          a: 'Browse the farmer directory on your dashboard, filter by crop type or location, and establish connections with farmers matching your needs.'
        },
        {
          q: 'Can I see real-time crop availability?',
          a: 'Yes, the Crop Availability section shows updated information about available crops from connected farmers.'
        },
        {
          q: 'How do I establish connections with farmers?',
          a: 'View a farmer profile and click "Connect" to send a connection request. Once accepted, you can communicate directly.'
        },
        {
          q: 'What are the market trends based on?',
          a: 'Market trends are calculated from historical price data, seasonal patterns, and current supply-demand dynamics.'
        }
      ]
    },
    {
      category: 'Pricing & Payment',
      items: [
        {
          q: 'Is CropPulse free to use?',
          a: 'CropPulse is free for basic features. Premium features and extended analytics may have associated costs.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept credit/debit cards, net banking, and digital wallets. All payments are encrypted and secure.'
        }
      ]
    },
    {
      category: 'Technical Support',
      items: [
        {
          q: 'What should I do if the app is not loading?',
          a: 'Clear your browser cache, refresh the page, and ensure you\'re using an updated browser. If issues persist, contact support.'
        },
        {
          q: 'Which browsers are supported?',
          a: 'CropPulse works on Chrome, Firefox, Safari, and Edge. We recommend using the latest version for optimal performance.'
        },
        {
          q: 'Can I access CropPulse on mobile?',
          a: 'Yes, our responsive design works on all mobile devices. We\'re also developing dedicated mobile apps.'
        }
      ]
    }
  ];

  const toggleExpanded = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

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
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 mt-2">Quick answers to common questions</p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {faqData.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded" />
                <h2 className="text-2xl font-bold text-slate-900">{section.category}</h2>
              </div>

              <div className="space-y-3">
                {section.items.map((item, itemIdx) => {
                  const globalIdx = `${sIdx}-${itemIdx}`;
                  const isExpanded = expandedIndex === globalIdx;

                  return (
                    <div
                      key={itemIdx}
                      className="glass-surface rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpanded(globalIdx)}
                        className="w-full px-6 py-4 flex items-start justify-between hover:bg-white/50 transition-colors duration-200"
                      >
                        <span className="text-left font-semibold text-slate-900">
                          {item.q}
                        </span>
                        <span
                          className={`text-2xl ml-4 transition-transform duration-300 flex-shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-4 border-t border-slate-200 bg-white/50">
                          <p className="text-slate-600 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Still need help */}
          <section className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-8 text-white mt-12">
            <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
            <p className="text-emerald-50 mb-6">
              Our support team is ready to help. Feel free to contact us anytime.
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

export default FAQ;
