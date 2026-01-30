import React from 'react';
import Header from './Header';
import Footer from './Footer';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-emerald-200 blur-3xl" />
        <div className="absolute right-0 top-40 h-56 w-56 rounded-full bg-cyan-200 blur-3xl" />
        <div className="absolute left-1/2 bottom-40 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
      </div>

      <Header />

      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
