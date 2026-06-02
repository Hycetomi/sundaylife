import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';

interface Props {
  children: React.ReactNode;
  requiredRole?: Role;
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bitter-liquorice flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-waxy-corn border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && profile) {
    const hierarchy: Role[] = ['Volunteer', 'Lead', 'Admin'];
    const userLevel = hierarchy.indexOf(profile.role);
    const requiredLevel = hierarchy.indexOf(requiredRole);
    if (userLevel < requiredLevel) return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
