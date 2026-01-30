import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    const target = user.role === 'BUYER' ? '/buyer/dashboard' : '/farmer/dashboard';
    navigate(target, { replace: true });
  }, [user, loading, navigate]);

  return null;
};

export default DashboardRedirect;
