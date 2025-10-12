// src/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React from 'react'; // for React.ReactNode

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // if you also want the return type: : JSX.Element
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

