import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../utils/navigation';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex items-center gap-3 text-slate-500">
      <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      <span className="text-sm font-medium">Loading session...</span>
    </div>
  </div>
);

const ProtectedRoute = ({ allowedRoles = [], guestOnly = false }) => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const role = String(user?.role || '').toUpperCase();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (guestOnly) {
    if (isAuthenticated) {
      return <Navigate to={getDashboardPath(role)} replace />;
    }

    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
