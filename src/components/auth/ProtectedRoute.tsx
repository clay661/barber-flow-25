import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  subAdminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false, subAdminOnly = false }: ProtectedRouteProps) {
  const { employee, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!employee) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && employee.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  if (subAdminOnly && employee.role !== 'SUBADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}