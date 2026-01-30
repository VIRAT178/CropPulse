import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const Documentation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const docs = [
    {
      title: 'Getting Started',
      icon: '🚀',
      sections: [
        {
          heading: 'Creating Your Account',
          content: 'Visit croppulse.com and click "Get Started". Choose your role (Farmer or Buyer), provide your details, and verify your email address to begin using CropPulse.'
        },
        {
          heading: 'Account Types',
          content: 'CropPulse supports two types of accounts: Farmer accounts for crop recommendations and insights, and Buyer accounts for discovering farmers and market trends.'
        }
      ]
    },
    {
      title: 'For Farmers',
      icon: '👨‍🌾',
      sections: [
        {
          heading: 'Setting Up Your Profile',
          content: 'Complete your profile with farm details including village, state, soil type, and land size. This information helps generate accurate crop recommendations.'
        },
        {
          heading: 'Getting Recommendations',
          content: 'Click "Get AI Recommendation" on your dashboard. The system analyzes your farm data and market conditions to provide personalized crop suggestions with price predictions and risk assessment.'
        },
        {
          heading: 'Understanding Charts',
          content: 'Your dashboard displays price trends, risk distribution, and confidence scores. Use these insights to make informed decisions about crop selection and timing.'
        }
      ]
    },
    {
      title: 'For Buyers',
      icon: '🏪',
      sections: [
        {
          heading: 'Finding Farmers',
          content: 'Browse the farmer directory to discover available farmers in your region. View their profiles, farm details, and crop specialties.'
        },
        {
          heading: 'Market Analysis',
          content: 'Access real-time market trends, crop availability data, and price analytics. Use this information to make strategic sourcing decisions.'
        },
        {
          heading: 'Connecting with Farmers',
          content: 'Establish connections with farmers to discuss crop availability, pricing, and direct supply arrangements.'
        }
      ]
    },
    {
      title: 'API & Integration',
      icon: '⚙️',
      sections: [
        {
          heading: 'REST API',
          content: 'CropPulse provides RESTful APIs for integration. All endpoints require authentication via JWT tokens. Documentation is available at /api/docs.'
        },
        {
          heading: 'Authentication',
          content: 'Use your credentials to obtain a JWT token. Include this token in the Authorization header for all API requests.'
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
            Documentation
          </h1>
          <p className="text-slate-600 mt-2">Complete guide to using CropPulse</p>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8">
          {docs.map((doc, idx) => (
            <section key={idx} className="glass-surface rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{doc.icon}</span>
                <h2 className="text-3xl font-bold text-slate-900">{doc.title}</h2>
              </div>

              <div className="space-y-6 pl-16">
                {doc.sections.map((section, sIdx) => (
                  <div key={sIdx}>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {section.heading}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Need Help */}
          <section className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">Need Additional Help?</h2>
            <p className="text-emerald-50 mb-6">
              Check our FAQ or contact our support team for detailed guidance.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/faq')}
                className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                View FAQ
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
