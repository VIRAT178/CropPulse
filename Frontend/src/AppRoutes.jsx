import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import ProfilePage from './pages/ProfilePage';
import DashboardRedirect from './pages/DashboardRedirect';
import MarketTrendsPage from './pages/MarketTrendsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import CropAvailabilityPage from './pages/CropAvailabilityPage';
import AIChatPage from './pages/AIChatPage';
import HistoryPage from './pages/HistoryPage';
import HelpCenter from './pages/HelpCenter';
import Documentation from './pages/Documentation';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Dashboard redirect (role-aware) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardRedirect />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/farmer/dashboard"
            element={
              <PrivateRoute requiredRole="FARMER">
                <FarmerDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/buyer/dashboard"
            element={
              <PrivateRoute requiredRole="BUYER">
                <BuyerDashboard />
              </PrivateRoute>
            }
          />
          
          {/* Quick link pages */}
          <Route
            path="/market-trends"
            element={
              <PrivateRoute requiredRole="BUYER">
                <MarketTrendsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <PrivateRoute requiredRole="FARMER">
                <RecommendationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/crops"
            element={
              <PrivateRoute requiredRole="BUYER">
                <CropAvailabilityPage />
              </PrivateRoute>
            }
          />

          {/* AI Chat */}
          <Route
            path="/ai-chat"
            element={
              <PrivateRoute>
                <AIChatPage />
              </PrivateRoute>
            }
          />

          {/* History Page */}
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />

          {/* Support Pages */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
