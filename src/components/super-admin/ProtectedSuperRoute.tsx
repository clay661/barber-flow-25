import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSuperAuth } from '@/hooks/useSuperAuth';

interface ProtectedSuperRouteProps {
  children: React.ReactNode;
}

export function ProtectedSuperRoute({ children }: ProtectedSuperRouteProps) {
  const { superAdmin, loading } = useSuperAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!superAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}