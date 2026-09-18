import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, Role } from '../../store/authStore';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = useAuthStore(state => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
