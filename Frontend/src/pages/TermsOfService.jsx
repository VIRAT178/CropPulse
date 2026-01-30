import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-slate-600 mt-2">Last updated: January 25, 2026</p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none space-y-8">
          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing and using CropPulse, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on CropPulse for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Disclaimer</h2>
            <p className="text-slate-600 leading-relaxed">
              The materials on CropPulse are provided on an 'as is' basis. CropPulse makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitations</h2>
            <p className="text-slate-600 leading-relaxed">
              In no event shall CropPulse or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CropPulse, even if CropPulse or a CropPulse authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Accuracy of Materials</h2>
            <p className="text-slate-600 leading-relaxed">
              The materials appearing on CropPulse could include technical, typographical, or photographic errors. CropPulse does not warrant that any of the materials on its platform are accurate, complete, or current. CropPulse may make changes to the materials contained on its platform at any time without notice.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Links</h2>
            <p className="text-slate-600 leading-relaxed">
              CropPulse has not reviewed all of the sites linked to its platform and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CropPulse of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Modifications</h2>
            <p className="text-slate-600 leading-relaxed">
              CropPulse may revise these terms of service for its platform at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. User Responsibilities</h2>
            <p className="text-slate-600 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the platform only for lawful purposes</li>
              <li>Not engage in harassment, abuse, or unlawful conduct</li>
              <li>Not transmit viruses or malicious code</li>
            </ul>
          </section>

          <section className="glass-surface rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="text-slate-600">
              <p>Email: legal@croppulse.com</p>
              <p>Address: Agricultural Innovation Hub, Madhya Pradesh, India</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
